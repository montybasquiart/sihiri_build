;;; SiHiRi NFT Ownership Contract
;;; This contract implements the core NFT functionality with ownership and royalty tracking

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-royalty-too-high (err u103))

;; Data maps and variables
(define-data-var last-token-id uint u0)

;; NFT data structure
(define-map tokens
  { token-id: uint }
  {
    owner: principal,
    creator: principal,
    metadata-url: (string-utf8 256),
    royalty-percent: uint,
    is-transferable: bool,
    creation-time: uint
  }
)

;; Ownership tracking
(define-map token-owners
  { token-id: uint }
  { owner: principal }
)

;; Royalty recipients
(define-map royalty-recipients
  { token-id: uint }
  {
    primary-recipient: principal,
    secondary-recipients: (list 5 {
      recipient: principal,
      share-percent: uint
    })
  }
)

;; Read-only functions

(define-read-only (get-last-token-id)
  (var-get last-token-id)
)

(define-read-only (get-token-owner (token-id uint))
  (match (map-get? token-owners { token-id: token-id })
    owner-data (ok (get owner owner-data))
    (err err-token-not-found)
  )
)

(define-read-only (get-token-info (token-id uint))
  (match (map-get? tokens { token-id: token-id })
    token-data (ok token-data)
    (err err-token-not-found)
  )
)

(define-read-only (get-royalty-info (token-id uint))
  (match (map-get? royalty-recipients { token-id: token-id })
    royalty-data (ok royalty-data)
    (err err-token-not-found)
  )
)

;; Public functions

;; Mint a new NFT
(define-public (mint (metadata-url (string-utf8 256)) (royalty-percent uint) (is-transferable bool))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
      (creator tx-sender)
    )
    ;; Validate royalty percentage (max 50%)
    (asserts! (<= royalty-percent u50) (err err-royalty-too-high))
    
    ;; Update token ID counter
    (var-set last-token-id token-id)
    
    ;; Create token record
    (map-set tokens
      { token-id: token-id }
      {
        owner: creator,
        creator: creator,
        metadata-url: metadata-url,
        royalty-percent: royalty-percent,
        is-transferable: is-transferable,
        creation-time: block-height
      }
    )
    
    ;; Set token ownership
    (map-set token-owners
      { token-id: token-id }
      { owner: creator }
    )
    
    ;; Set royalty recipient (initially just the creator)
    (map-set royalty-recipients
      { token-id: token-id }
      {
        primary-recipient: creator,
        secondary-recipients: (list)
      }
    )
    
    ;; Return the new token ID
    (ok token-id)
  )
)

;; Transfer an NFT to a new owner
(define-public (transfer (token-id uint) (recipient principal))
  (let
    (
      (current-owner (unwrap! (get-token-owner token-id) (err err-token-not-found)))
      (token-data (unwrap! (get-token-info token-id) (err err-token-not-found)))
    )
    ;; Verify sender is the token owner
    (asserts! (is-eq tx-sender current-owner) (err err-not-token-owner))
    
    ;; Verify token is transferable
    (asserts! (get is-transferable token-data) (err u104))
    
    ;; Update ownership
    (map-set token-owners
      { token-id: token-id }
      { owner: recipient }
    )
    
    ;; Update token record
    (map-set tokens
      { token-id: token-id }
      (merge token-data { owner: recipient })
    )
    
    (ok true)
  )
)

;; Update royalty recipients for a token
(define-public (set-royalty-recipients 
  (token-id uint) 
  (primary-recipient principal) 
  (secondary-recipients (list 5 {
    recipient: principal,
    share-percent: uint
  }))
)
  (let
    (
      (token-data (unwrap! (get-token-info token-id) (err err-token-not-found)))
      (creator (get creator token-data))
    )
    ;; Only the creator can update royalty recipients
    (asserts! (is-eq tx-sender creator) (err err-owner-only))
    
    ;; Update royalty recipients
    (map-set royalty-recipients
      { token-id: token-id }
      {
        primary-recipient: primary-recipient,
        secondary-recipients: secondary-recipients
      }
    )
    
    (ok true)
  )
)

;; Update token metadata
(define-public (update-metadata (token-id uint) (new-metadata-url (string-utf8 256)))
  (let
    (
      (token-data (unwrap! (get-token-info token-id) (err err-token-not-found)))
      (creator (get creator token-data))
    )
    ;; Only the creator can update metadata
    (asserts! (is-eq tx-sender creator) (err err-owner-only))
    
    ;; Update token record with new metadata
    (map-set tokens
      { token-id: token-id }
      (merge token-data { metadata-url: new-metadata-url })
    )
    
    (ok true)
  )
)

;; Toggle transferability of a token
(define-public (toggle-transferability (token-id uint))
  (let
    (
      (token-data (unwrap! (get-token-info token-id) (err err-token-not-found)))
      (creator (get creator token-data))
      (current-transferable (get is-transferable token-data))
    )
    ;; Only the creator can toggle transferability
    (asserts! (is-eq tx-sender creator) (err err-owner-only))
    
    ;; Update token record with toggled transferability
    (map-set tokens
      { token-id: token-id }
      (merge token-data { is-transferable: (not current-transferable) })
    )
    
    (ok (not current-transferable))
  )
)