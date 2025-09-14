;;; SiHiRi Marketplace Contract
;;; This contract manages listings, sales, and auctions for creative assets

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-listing-not-found (err u103))
(define-constant err-auction-not-found (err u104))
(define-constant err-bid-too-low (err u105))
(define-constant err-auction-ended (err u106))
(define-constant err-auction-not-ended (err u107))
(define-constant err-unauthorized (err u108))
(define-constant err-payment-failed (err u109))

;; Import NFT ownership contract functions
(use-trait nft-trait .nft-ownership)
(use-trait royalty-trait .royalty)

;; Data maps and variables

;; Fixed price listings
(define-map listings
  { listing-id: uint }
  {
    token-id: uint,
    nft-contract: principal,
    seller: principal,
    price: uint,
    expiry: uint,
    active: bool,
    creation-time: uint
  }
)

;; Auctions
(define-map auctions
  { auction-id: uint }
  {
    token-id: uint,
    nft-contract: principal,
    seller: principal,
    start-price: uint,
    reserve-price: uint,
    end-block: uint,
    highest-bid: uint,
    highest-bidder: (optional principal),
    active: bool,
    creation-time: uint
  }
)

;; Track bids for each auction
(define-map auction-bids
  { auction-id: uint, bidder: principal }
  { amount: uint, block-height: uint }
)

;; Track the last listing and auction IDs
(define-data-var last-listing-id uint u0)
(define-data-var last-auction-id uint u0)

;; Marketplace fee percentage (e.g., 2.5% = 250 basis points)
(define-data-var marketplace-fee-bps uint u250)

;; Read-only functions

;; Get the last listing ID
(define-read-only (get-last-listing-id)
  (var-get last-listing-id)
)

;; Get the last auction ID
(define-read-only (get-last-auction-id)
  (var-get last-auction-id)
)

;; Get listing details
(define-read-only (get-listing (listing-id uint))
  (map-get? listings { listing-id: listing-id })
)

;; Get auction details
(define-read-only (get-auction (auction-id uint))
  (map-get? auctions { auction-id: auction-id })
)

;; Get bid details
(define-read-only (get-bid (auction-id uint) (bidder principal))
  (map-get? auction-bids { auction-id: auction-id, bidder: bidder })
)

;; Get marketplace fee
(define-read-only (get-marketplace-fee-bps)
  (var-get marketplace-fee-bps)
)

;; Public functions

;; Create a fixed price listing
(define-public (create-listing 
  (nft-contract <nft-trait>) 
  (token-id uint) 
  (price uint) 
  (expiry uint)
)
  (let
    (
      (caller tx-sender)
      (listing-id (+ (var-get last-listing-id) u1))
      (token-owner (contract-call? nft-contract get-token-owner token-id))
    )
    ;; Verify caller is token owner
    (asserts! (is-eq (unwrap! token-owner (err err-token-not-found)) caller) (err err-not-token-owner))
    
    ;; Create the listing
    (map-set listings
      { listing-id: listing-id }
      {
        token-id: token-id,
        nft-contract: (contract-of nft-contract),
        seller: caller,
        price: price,
        expiry: expiry,
        active: true,
        creation-time: block-height
      }
    )
    
    ;; Update last listing ID
    (var-set last-listing-id listing-id)
    
    (ok listing-id)
  )
)

;; Cancel a listing
(define-public (cancel-listing (listing-id uint))
  (let
    (
      (caller tx-sender)
      (listing (unwrap! (get-listing listing-id) (err err-listing-not-found)))
    )
    ;; Verify caller is the seller
    (asserts! (is-eq (get seller listing) caller) (err err-unauthorized))
    
    ;; Update listing to inactive
    (map-set listings
      { listing-id: listing-id }
      (merge listing { active: false })
    )
    
    (ok true)
  )
)

;; Buy a listed item
(define-public (buy-listing 
  (listing-id uint) 
  (nft-contract <nft-trait>) 
  (royalty-contract <royalty-trait>)
)
  (let
    (
      (caller tx-sender)
      (listing (unwrap! (get-listing listing-id) (err err-listing-not-found)))
      (price (get price listing))
      (seller (get seller listing))
      (token-id (get token-id listing))
      (contract-principal (get nft-contract listing))
    )
    ;; Verify listing is active
    (asserts! (get active listing) (err u110))
    
    ;; Verify listing hasn't expired
    (asserts! (< block-height (get expiry listing)) (err u111))
    
    ;; Verify correct NFT contract
    (asserts! (is-eq contract-principal (contract-of nft-contract)) (err u112))
    
    ;; Calculate marketplace fee
    (let
      (
        (fee-bps (var-get marketplace-fee-bps))
        (marketplace-fee (/ (* price fee-bps) u10000))
        (seller-amount (- price marketplace-fee))
      )
      ;; Transfer payment to seller
      (try! (stx-transfer? seller-amount caller seller))
      
      ;; Transfer marketplace fee to contract owner
      (try! (stx-transfer? marketplace-fee caller contract-owner))
      
      ;; Transfer NFT to buyer
      (try! (contract-call? nft-contract transfer token-id caller))
      
      ;; Pay royalties
      (try! (contract-call? royalty-contract pay-royalty nft-contract token-id "marketplace-sale" (concat "listing-" (to-ascii listing-id))))
      
      ;; Update listing to inactive
      (map-set listings
        { listing-id: listing-id }
        (merge listing { active: false })
      )
      
      (ok true)
    )
  )
)

;; Create an auction
(define-public (create-auction 
  (nft-contract <nft-trait>) 
  (token-id uint) 
  (start-price uint) 
  (reserve-price uint) 
  (duration uint)
)
  (let
    (
      (caller tx-sender)
      (auction-id (+ (var-get last-auction-id) u1))
      (token-owner (contract-call? nft-contract get-token-owner token-id))
      (end-block (+ block-height duration))
    )
    ;; Verify caller is token owner
    (asserts! (is-eq (unwrap! token-owner (err err-token-not-found)) caller) (err err-not-token-owner))
    
    ;; Create the auction
    (map-set auctions
      { auction-id: auction-id }
      {
        token-id: token-id,
        nft-contract: (contract-of nft-contract),
        seller: caller,
        start-price: start-price,
        reserve-price: reserve-price,
        end-block: end-block,
        highest-bid: u0,
        highest-bidder: none,
        active: true,
        creation-time: block-height
      }
    )
    
    ;; Update last auction ID
    (var-set last-auction-id auction-id)
    
    (ok auction-id)
  )
)

;; Place a bid on an auction
(define-public (place-bid (auction-id uint) (bid-amount uint))
  (let
    (
      (caller tx-sender)
      (auction (unwrap! (get-auction auction-id) (err err-auction-not-found)))
      (highest-bid (get highest-bid auction))
      (start-price (get start-price auction))
    )
    ;; Verify auction is active
    (asserts! (get active auction) (err u113))
    
    ;; Verify auction hasn't ended
    (asserts! (< block-height (get end-block auction)) (err err-auction-ended))
    
    ;; Verify bid is higher than current highest bid and start price
    (asserts! (and (> bid-amount highest-bid) (>= bid-amount start-price)) (err err-bid-too-low))
    
    ;; If there's a previous highest bidder, refund them
    (match (get highest-bidder auction)
      prev-bidder (try! (stx-transfer? highest-bid tx-sender prev-bidder))
      true
    )
    
    ;; Transfer bid amount to contract (held in escrow)
    (try! (stx-transfer? bid-amount caller (as-contract tx-sender)))
    
    ;; Update auction with new highest bid
    (map-set auctions
      { auction-id: auction-id }
      (merge auction {
        highest-bid: bid-amount,
        highest-bidder: (some caller)
      })
    )
    
    ;; Record the bid
    (map-set auction-bids
      { auction-id: auction-id, bidder: caller }
      { amount: bid-amount, block-height: block-height }
    )
    
    (ok true)
  )
)

;; Finalize an auction after it ends
(define-public (finalize-auction 
  (auction-id uint) 
  (nft-contract <nft-trait>) 
  (royalty-contract <royalty-trait>)
)
  (let
    (
      (auction (unwrap! (get-auction auction-id) (err err-auction-not-found)))
      (seller (get seller auction))
      (token-id (get token-id auction))
      (highest-bid (get highest-bid auction))
      (reserve-price (get reserve-price auction))
      (contract-principal (get nft-contract auction))
    )
    ;; Verify auction is active
    (asserts! (get active auction) (err u113))
    
    ;; Verify auction has ended
    (asserts! (>= block-height (get end-block auction)) (err err-auction-not-ended))
    
    ;; Verify correct NFT contract
    (asserts! (is-eq contract-principal (contract-of nft-contract)) (err u112))
    
    ;; Check if reserve price was met
    (if (and (> highest-bid u0) (>= highest-bid reserve-price))
      ;; Successful auction
      (let
        (
          (highest-bidder (unwrap! (get highest-bidder auction) (err u114)))
          (fee-bps (var-get marketplace-fee-bps))
          (marketplace-fee (/ (* highest-bid fee-bps) u10000))
          (seller-amount (- highest-bid marketplace-fee))
        )
        ;; Transfer payment to seller
        (as-contract (try! (stx-transfer? seller-amount tx-sender seller)))
        
        ;; Transfer marketplace fee to contract owner
        (as-contract (try! (stx-transfer? marketplace-fee tx-sender contract-owner)))
        
        ;; Transfer NFT to highest bidder
        (try! (contract-call? nft-contract transfer token-id highest-bidder))
        
        ;; Pay royalties
        (try! (contract-call? royalty-contract pay-royalty nft-contract token-id "auction-sale" (concat "auction-" (to-ascii auction-id))))
      )
      ;; Failed auction - no bids or reserve not met
      (begin
        ;; If there was a bid but reserve not met, refund the bidder
        (match (get highest-bidder auction)
          bidder (as-contract (try! (stx-transfer? highest-bid tx-sender bidder)))
          true
        )
      )
    )
    
    ;; Update auction to inactive
    (map-set auctions
      { auction-id: auction-id }
      (merge auction { active: false })
    )
    
    (ok true)
  )
)

;; Cancel an auction (only if no bids placed)
(define-public (cancel-auction (auction-id uint))
  (let
    (
      (caller tx-sender)
      (auction (unwrap! (get-auction auction-id) (err err-auction-not-found)))
    )
    ;; Verify caller is the seller
    (asserts! (is-eq (get seller auction) caller) (err err-unauthorized))
    
    ;; Verify no bids have been placed
    (asserts! (is-eq (get highest-bid auction) u0) (err u115))
    
    ;; Update auction to inactive
    (map-set auctions
      { auction-id: auction-id }
      (merge auction { active: false })
    )
    
    (ok true)
  )
)

;; Update marketplace fee (admin only)
(define-public (set-marketplace-fee (new-fee-bps uint))
  (begin
    ;; Only contract owner can update fee
    (asserts! (is-eq tx-sender contract-owner) (err err-owner-only))
    
    ;; Ensure fee is reasonable (max 10%)
    (asserts! (<= new-fee-bps u1000) (err u116))
    
    ;; Update fee
    (var-set marketplace-fee-bps new-fee-bps)
    
    (ok true)
  )
)