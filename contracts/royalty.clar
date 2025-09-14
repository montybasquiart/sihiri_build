;;; SiHiRi Royalty Contract
;;; This contract manages royalty payments and distributions for creative works

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-token-not-found (err u101))
(define-constant err-unauthorized (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-payment-failed (err u104))

;; Import NFT ownership contract functions
(use-trait nft-trait .nft-ownership)

;; Data maps and variables

;; Royalty payment history
(define-map royalty-payments
  { payment-id: uint }
  {
    token-id: uint,
    amount: uint,
    payer: principal,
    timestamp: uint,
    payment-type: (string-utf8 32),
    context: (string-utf8 256)
  }
)

;; Track the last payment ID
(define-data-var last-payment-id uint u0)

;; Track total royalties paid to each creator
(define-map creator-earnings
  { creator: principal }
  { total-earned: uint }
)

;; Read-only functions

;; Get the last payment ID
(define-read-only (get-last-payment-id)
  (var-get last-payment-id)
)

;; Get payment details
(define-read-only (get-payment-details (payment-id uint))
  (map-get? royalty-payments { payment-id: payment-id })
)

;; Get creator's total earnings
(define-read-only (get-creator-earnings (creator principal))
  (default-to { total-earned: u0 } (map-get? creator-earnings { creator: creator }))
)

;; Public functions

;; Pay royalty for a token
(define-public (pay-royalty 
  (nft-contract <nft-trait>) 
  (token-id uint) 
  (payment-type (string-utf8 32)) 
  (context (string-utf8 256))
)
  (let
    (
      (caller tx-sender)
      (payment-id (+ (var-get last-payment-id) u1))
      (token-info (contract-call? nft-contract get-token-info token-id))
      (royalty-info (contract-call? nft-contract get-royalty-info token-id))
    )
    ;; Unwrap token info and royalty info
    (match token-info
      success-token
        (let
          (
            (token-data (unwrap! success-token (err err-token-not-found)))
            (royalty-percent (get royalty-percent token-data))
            (creator (get creator token-data))
          )
          ;; Calculate royalty amount (in micro-STX)
          (let
            (
              (amount (* (/ (* tx-amount royalty-percent) u100)))
            )
            ;; Ensure amount is valid
            (asserts! (> amount u0) (err err-invalid-amount))
            
            ;; Process royalty distribution
            (match royalty-info
              success-royalty
                (let
                  (
                    (royalty-data (unwrap! success-royalty (err err-token-not-found)))
                    (primary-recipient (get primary-recipient royalty-data))
                    (secondary-recipients (get secondary-recipients royalty-data))
                  )
                  ;; Distribute to secondary recipients first
                  (if (> (len secondary-recipients) u0)
                    (begin
                      ;; Process each secondary recipient
                      (map distribute-to-recipient secondary-recipients)
                      ;; Send remaining amount to primary recipient
                      (let
                        (
                          (secondary-total (fold calculate-secondary-total secondary-recipients u0))
                          (primary-amount (- amount secondary-total))
                        )
                        ;; Send to primary recipient
                        (if (> primary-amount u0)
                          (begin
                            (try! (stx-transfer? primary-amount caller primary-recipient))
                            ;; Update primary recipient earnings
                            (update-earnings primary-recipient primary-amount)
                          )
                          true
                        )
                      )
                    )
                    ;; No secondary recipients, send all to primary
                    (begin
                      (try! (stx-transfer? amount caller primary-recipient))
                      ;; Update primary recipient earnings
                      (update-earnings primary-recipient amount)
                    )
                  )
                  
                  ;; Record the payment
                  (map-set royalty-payments
                    { payment-id: payment-id }
                    {
                      token-id: token-id,
                      amount: amount,
                      payer: caller,
                      timestamp: block-height,
                      payment-type: payment-type,
                      context: context
                    }
                  )
                  
                  ;; Update last payment ID
                  (var-set last-payment-id payment-id)
                  
                  (ok payment-id)
                )
              error (err err-token-not-found)
            )
          )
        )
      error (err err-token-not-found)
    )
  )
)

;; Helper function to distribute to a secondary recipient
(define-private (distribute-to-recipient (recipient { recipient: principal, share-percent: uint }))
  (let
    (
      (recipient-principal (get recipient recipient))
      (share-percent (get share-percent recipient))
      (amount (* (/ (* tx-amount share-percent) u100)))
    )
    (if (> amount u0)
      (begin
        (try! (stx-transfer? amount tx-sender recipient-principal))
        ;; Update recipient earnings
        (update-earnings recipient-principal amount)
        true
      )
      true
    )
  )
)

;; Helper function to calculate total secondary distribution
(define-private (calculate-secondary-total 
  (recipient { recipient: principal, share-percent: uint }) 
  (running-total uint)
)
  (+ running-total (* (/ (* tx-amount (get share-percent recipient)) u100)))
)

;; Helper function to update creator earnings
(define-private (update-earnings (creator principal) (amount uint))
  (let
    (
      (current-earnings (get-creator-earnings creator))
      (new-total (+ (get total-earned current-earnings) amount))
    )
    (map-set creator-earnings
      { creator: creator }
      { total-earned: new-total }
    )
  )
)

;; Direct payment to a creator (e.g., for commissions, tips)
(define-public (direct-payment 
  (recipient principal) 
  (amount uint) 
  (payment-type (string-utf8 32)) 
  (context (string-utf8 256))
)
  (let
    (
      (caller tx-sender)
      (payment-id (+ (var-get last-payment-id) u1))
    )
    ;; Ensure amount is valid
    (asserts! (> amount u0) (err err-invalid-amount))
    
    ;; Transfer STX to recipient
    (try! (stx-transfer? amount caller recipient))
    
    ;; Update recipient earnings
    (update-earnings recipient amount)
    
    ;; Record the payment
    (map-set royalty-payments
      { payment-id: payment-id }
      {
        token-id: u0, ;; Not associated with a specific token
        amount: amount,
        payer: caller,
        timestamp: block-height,
        payment-type: payment-type,
        context: context
      }
    )
    
    ;; Update last payment ID
    (var-set last-payment-id payment-id)
    
    (ok payment-id)
  )
)