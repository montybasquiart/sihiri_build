;;; SiHiRi Identity Contract
;;; This contract manages creator identities and profiles in the SiHiRi ecosystem

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-profile-exists (err u101))
(define-constant err-profile-not-found (err u102))
(define-constant err-unauthorized (err u103))

;; Creator profile data structure
(define-map creator-profiles
  { principal: principal }
  {
    username: (string-utf8 64),
    display-name: (string-utf8 128),
    bio: (string-utf8 500),
    avatar-url: (string-utf8 256),
    website: (string-utf8 256),
    social-links: (list 5 {
      platform: (string-utf8 32),
      url: (string-utf8 256)
    }),
    creation-categories: (list 10 (string-utf8 32)),
    verified: bool,
    registration-time: uint
  }
)

;; Username registry to ensure uniqueness
(define-map username-registry
  { username: (string-utf8 64) }
  { principal: principal }
)

;; Read-only functions

;; Get creator profile by principal
(define-read-only (get-profile (user principal))
  (match (map-get? creator-profiles { principal: user })
    profile (ok profile)
    (err err-profile-not-found)
  )
)

;; Check if username is available
(define-read-only (is-username-available (username (string-utf8 64)))
  (is-none (map-get? username-registry { username: username }))
)

;; Lookup principal by username
(define-read-only (get-principal-by-username (username (string-utf8 64)))
  (match (map-get? username-registry { username: username })
    entry (ok (get principal entry))
    (err err-profile-not-found)
  )
)

;; Public functions

;; Register a new creator profile
(define-public (register-profile 
  (username (string-utf8 64))
  (display-name (string-utf8 128))
  (bio (string-utf8 500))
  (avatar-url (string-utf8 256))
  (website (string-utf8 256))
  (social-links (list 5 {
    platform: (string-utf8 32),
    url: (string-utf8 256)
  }))
  (creation-categories (list 10 (string-utf8 32)))
)
  (let
    (
      (caller tx-sender)
    )
    ;; Check if profile already exists
    (asserts! (is-none (map-get? creator-profiles { principal: caller })) (err err-profile-exists))
    
    ;; Check if username is available
    (asserts! (is-username-available username) (err u104))
    
    ;; Register the username
    (map-set username-registry
      { username: username }
      { principal: caller }
    )
    
    ;; Create the profile
    (map-set creator-profiles
      { principal: caller }
      {
        username: username,
        display-name: display-name,
        bio: bio,
        avatar-url: avatar-url,
        website: website,
        social-links: social-links,
        creation-categories: creation-categories,
        verified: false,
        registration-time: block-height
      }
    )
    
    (ok true)
  )
)

;; Update an existing profile
(define-public (update-profile 
  (display-name (string-utf8 128))
  (bio (string-utf8 500))
  (avatar-url (string-utf8 256))
  (website (string-utf8 256))
  (social-links (list 5 {
    platform: (string-utf8 32),
    url: (string-utf8 256)
  }))
  (creation-categories (list 10 (string-utf8 32)))
)
  (let
    (
      (caller tx-sender)
      (existing-profile (unwrap! (get-profile caller) (err err-profile-not-found)))
    )
    ;; Update the profile with new information
    (map-set creator-profiles
      { principal: caller }
      (merge existing-profile {
        display-name: display-name,
        bio: bio,
        avatar-url: avatar-url,
        website: website,
        social-links: social-links,
        creation-categories: creation-categories
      })
    )
    
    (ok true)
  )
)

;; Change username (if available)
(define-public (change-username (new-username (string-utf8 64)))
  (let
    (
      (caller tx-sender)
      (existing-profile (unwrap! (get-profile caller) (err err-profile-not-found)))
      (old-username (get username existing-profile))
    )
    ;; Check if new username is available
    (asserts! (is-username-available new-username) (err u104))
    
    ;; Delete old username mapping
    (map-delete username-registry { username: old-username })
    
    ;; Register new username
    (map-set username-registry
      { username: new-username }
      { principal: caller }
    )
    
    ;; Update profile with new username
    (map-set creator-profiles
      { principal: caller }
      (merge existing-profile { username: new-username })
    )
    
    (ok true)
  )
)

;; Verify a creator (admin only)
(define-public (verify-creator (user principal))
  (begin
    ;; Only contract owner can verify creators
    (asserts! (is-eq tx-sender contract-owner) (err err-owner-only))
    
    ;; Check if profile exists
    (match (map-get? creator-profiles { principal: user })
      profile (begin
        ;; Update profile with verified status
        (map-set creator-profiles
          { principal: user }
          (merge profile { verified: true })
        )
        (ok true)
      )
      (err err-profile-not-found)
    )
  )
)

;; Remove verification from a creator (admin only)
(define-public (remove-verification (user principal))
  (begin
    ;; Only contract owner can remove verification
    (asserts! (is-eq tx-sender contract-owner) (err err-owner-only))
    
    ;; Check if profile exists
    (match (map-get? creator-profiles { principal: user })
      profile (begin
        ;; Update profile with unverified status
        (map-set creator-profiles
          { principal: user }
          (merge profile { verified: false })
        )
        (ok true)
      )
      (err err-profile-not-found)
    )
  )
)

;; Delete a profile (can only be done by the profile owner)
(define-public (delete-profile)
  (let
    (
      (caller tx-sender)
      (existing-profile (unwrap! (get-profile caller) (err err-profile-not-found)))
      (username (get username existing-profile))
    )
    ;; Delete username mapping
    (map-delete username-registry { username: username })
    
    ;; Delete profile
    (map-delete creator-profiles { principal: caller })
    
    (ok true)
  )
)