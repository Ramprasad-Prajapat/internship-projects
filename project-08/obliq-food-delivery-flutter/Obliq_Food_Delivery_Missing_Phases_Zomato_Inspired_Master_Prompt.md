# Obliq Food Delivery — Missing Phase Completion + Zomato-Inspired Production Master Prompt

## Purpose

This master prompt is for **Antigravity**.

It is based on the current uploaded `app-release.apk` and the implementation status previously reported for:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

The goal is to:

1. Audit the CURRENT APK/project before changing anything.
2. Identify every Phase 1–8 item that is missing, incomplete, superficial, or not production-quality.
3. Complete all missing implementation.
4. Upgrade the complete application to a **Zomato-inspired food-delivery UX standard** across discovery, search, restaurant browsing, offers, ordering, tracking, favorites, and profile.
5. Preserve Obliq's own branding and identity.
6. Produce a final Android release APK.

> **Important:** Do not copy Zomato's proprietary source code, private implementation, copyrighted assets, logo, exact branding, or protected visual artwork. Recreate the *functional UX patterns, information architecture, interaction patterns, and level of polish* using original Obliq UI, assets, text, icons, and code.

---

# 1. NON-NEGOTIABLE RULES

## Existing Project

Work ONLY inside:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

Do NOT create a second Flutter project.

Do NOT rebuild the application from a blank template.

Do NOT delete working screens or providers.

Do NOT change the package ID:

`com.obliq.fooddelivery`

Do NOT break:

`MainActivity`

Do NOT introduce a backend.

The application remains a frontend/local-data prototype unless a later task explicitly requests a backend.

---

# 2. CURRENT APK IS THE BASELINE

The uploaded/current APK is the baseline.

Before implementation:

- inspect the project source
- inspect `pubspec.yaml`
- inspect all `lib/` files
- inspect Android configuration
- inspect navigation
- inspect providers
- inspect models
- inspect mock data
- inspect current theme
- inspect all screens and reusable widgets

Do not assume that a previously generated report means a feature is actually complete.

A feature is considered complete ONLY when:

- it exists in the source
- it is reachable from the UI
- the interaction works
- the state updates correctly
- it looks production-quality
- it works in both light and dark mode where applicable
- it does not cause layout overflow

---

# 3. CURRENT IMPLEMENTATION — TREAT AS PARTIAL

Previously reported implementation includes:

- Home
- Search
- Categories
- Restaurant details
- Food details
- Cart
- Coupons
- Checkout
- Order tracking
- Orders
- Favorites
- Offers
- Profile
- Dark/light mode
- Provider-based state management
- INR pricing
- Review dialog
- Five-tab navigation

However, these should NOT be treated as fully completed merely because the files exist.

Antigravity must perform a feature-by-feature gap audit and improve every weak implementation.

---

# 4. PHASE 1 — COMPLETE PROJECT AUDIT & ARCHITECTURE

## Goal

Perform a real audit before UI changes.

### Inspect

`lib/main.dart`

`lib/theme/`

`lib/models/`

`lib/mock_data/`

`lib/providers/`

`lib/screens/`

`lib/widgets/`

`android/`

`pubspec.yaml`

### Verify

- package ID
- MainActivity package
- AndroidManifest
- Provider setup
- navigation
- theme
- mock data
- cart calculations
- favorites state
- order state
- offers state
- screen accessibility

### Fix

- duplicate implementations
- unused files
- broken imports
- inconsistent naming
- dead widgets
- duplicated navigation
- unnecessary rebuilds
- incorrect state handling

### Deliverable

A clean architecture where:

- models = data
- providers = state
- screens = page-level UI
- widgets = reusable components
- mock data = local data only
- theme = centralized design system

---

# 5. PHASE 2 — PRODUCTION DESIGN SYSTEM

The current design must be upgraded from "working Flutter UI" to a polished food-delivery application.

## Obliq Brand

Primary:

`#FF5722`

Secondary:

`#E64A19`

Accent:

`#FFC107`

Light:

`#F8F9FA`

Dark:

`#121212`

Dark surface:

`#1E1E2C`

Use these consistently.

## Typography

Create a clear hierarchy:

- Display
- Large heading
- Section heading
- Body
- Caption
- Price
- Button

Avoid random font sizes.

## Components

Create reusable:

- App bar
- Search bar
- Restaurant card
- Food card
- Offer card
- Category tile
- Filter chip
- Rating badge
- Price row
- Quantity selector
- Coupon card
- Primary CTA
- Secondary CTA
- Bottom sheet
- Empty state
- Loading skeleton
- Error state
- Confirmation dialog

## Spacing

Use a consistent spacing system.

Avoid arbitrary padding values.

## Cards

Use:

- controlled radius
- subtle elevation
- consistent internal spacing
- strong image hierarchy
- readable text

---

# 6. PHASE 3 — ZOMATO-INSPIRED HOME & DISCOVERY

This is one of the biggest missing areas.

The Home screen should feel like a modern food-delivery discovery platform.

## Header

Include:

- current delivery location
- change location
- notification
- profile
- optional location status

Example:

"Delivering to Home"

## Search

Search should be visually prominent.

Support:

- restaurant search
- food search
- cuisine search
- category search
- recent searches
- suggestions
- clear button
- no-result state

## Discovery Sections

Create:

### Food Categories

- Biryani
- Pizza
- Burger
- Chinese
- North Indian
- South Indian
- Momos
- Desserts
- Beverages
- Thali

### Quick Filters

- Fast Delivery
- Rating 4+
- Offers
- Pure Veg
- ₹300–₹600
- Newly Added

### Restaurant Sections

- Top restaurants near you
- Recommended for you
- Best rated
- Fast delivery
- Great offers
- Popular this week
- Budget friendly

Each section should support horizontal scrolling where appropriate.

---

# 7. PHASE 4 — ADVANCED SEARCH & FILTER EXPERIENCE

Create a dedicated search/discovery experience.

## Search Results

Each result should support:

- restaurant
- food
- cuisine

## Filters

Implement functional local filters:

### Rating

- 4.5+
- 4.0+
- 3.5+

### Delivery Time

- Under 30 min
- Under 45 min

### Price

- Under ₹200
- ₹200–₹400
- ₹400–₹700
- ₹700+

### Offers

- Discount
- Free Delivery

### Dietary

- Pure Veg
- Vegetarian

### Cuisine

- Indian
- Chinese
- Italian
- Fast Food
- South Indian
- Desserts

## Sorting

- Recommended
- Rating
- Delivery time
- Price low to high
- Price high to low

Filters must actually change displayed results.

---

# 8. PHASE 5 — RESTAURANT EXPERIENCE

Restaurant pages must be substantially upgraded.

## Hero

Include:

- restaurant image
- restaurant name
- rating
- review count
- cuisine
- price for two
- delivery time
- distance
- favorite
- share

## Restaurant Status

Show:

- Open
- Closed
- Opens at...
- Delivery available

## Offer Section

Show multiple offers.

Example:

"20% OFF up to ₹100"

"FREE DELIVERY"

"₹125 OFF above ₹499"

## Menu

Implement:

- category tabs
- sticky category navigation
- menu search
- bestseller labels
- veg/non-veg indicators
- food ratings
- descriptions
- prices
- add buttons

## Add Button

The Add button should have a strong hierarchy.

After adding:

- button becomes quantity selector
- cart badge updates
- subtle animation occurs

---

# 9. PHASE 6 — FOOD DETAIL & CUSTOMIZATION

Food details must become a premium bottom-sheet/page experience.

Include:

- large image
- name
- rating
- bestseller
- price
- description
- calories if useful
- dietary indicator

## Customization

Examples:

### Size

Regular
Large

### Spice

Mild
Medium
Spicy

### Add-ons

Extra cheese
Extra paneer
Extra sauce
Extra vegetables

### Instructions

"Add special instructions"

## Quantity

Large +/- control.

## Price

Total must update immediately.

## CTA

Sticky:

`Add item • ₹XXX`

This CTA must reflect the exact current selection.

---

# 10. PHASE 7 — CART EXPERIENCE

The cart must feel like a real production checkout basket.

## Restaurant Header

Show:

- restaurant name
- delivery estimate
- restaurant status

## Cart Items

Show:

- image
- name
- customization
- price
- quantity
- remove

## Suggestions

Add:

- "You may also like"
- add-on recommendations

## Coupon

Create:

- Apply Coupon
- Available Coupons
- Applied Coupon
- Remove Coupon

## Bill

Show:

- Item total
- Restaurant charges if applicable
- Delivery fee
- GST
- Discount
- Grand total

Use INR.

Example:

`₹249`

Never use `$`.

## Bottom CTA

Sticky:

`Proceed to Checkout`

Include cart total.

---

# 11. PHASE 8 — OFFERS & COUPONS

Make Offers a full discovery system.

## Offers Home

Cards should include:

- offer title
- discount
- minimum order
- expiry
- applicable restaurants
- terms
- copy code
- apply now

## Coupons

Example local mock coupons:

`OBLIQ10`

`FOOD20`

`WELCOME`

`FREEDELIVERY`

Coupon logic must actually work.

Invalid coupons must show a proper error.

Applied coupon must visibly change the bill.

---

# 12. CHECKOUT — PRODUCTION UX

Checkout should be a clean multi-section experience.

## Address

Support:

- Home
- Work
- Add new address
- Edit address
- Delete address
- selected address indicator

## Delivery Instructions

Options:

- Leave at door
- Call on arrival
- Avoid ringing bell

Plus custom note.

## Payment

Support:

- Card
- Cash on Delivery
- Obliq Wallet

Show selected state clearly.

## Order Summary

Display:

- items
- quantity
- subtotal
- delivery
- tax
- discount
- total

## Place Order

Sticky CTA.

Show:

- loading
- success
- failure state

Do not allow duplicate order taps during processing.

---

# 13. ORDER CONFIRMATION & TRACKING

Create a polished order tracking screen.

## Confirmation

Show:

"Order placed successfully"

Include:

- order ID
- restaurant
- total
- ETA

## Timeline

1. Order Placed
2. Restaurant Confirmed
3. Preparing
4. Out for Delivery
5. Delivered

## Tracking

Show:

- progress indicator
- ETA
- restaurant
- delivery address
- driver
- contact button

For local demo mode, preserve the simulator.

The simulator must update the UI correctly.

---

# 14. ORDER HISTORY

Create professional order history.

Tabs:

`Active`

`Past`

Cards:

- restaurant
- order date
- order number
- items
- total
- status
- reorder
- view details
- rate order

## Reorder

Tapping Reorder should:

- restore items
- restore quantities
- update cart badge
- open cart or show confirmation

---

# 15. REVIEWS & RATINGS

Upgrade the current simple review dialog.

Support:

- 1–5 stars
- optional written review
- food rating
- delivery rating
- restaurant rating

Show submitted state.

Use local mock state.

---

# 16. FAVORITES

Favorites should support:

### Restaurants

### Food

Each card should have:

- remove
- rating
- price
- delivery time
- restaurant name

Empty state:

"Your favorites will appear here"

CTA:

"Explore restaurants"

---

# 17. PROFILE & ACCOUNT

Create a production-style profile.

## Header

- avatar
- name
- email/phone
- edit profile

## Account

- Personal Information
- Addresses
- Payment Methods

## Activity

- Orders
- Favorites
- Reviews

## Preferences

- Notifications
- Dark Mode
- Language

## Support

- Help Center
- FAQs
- Contact Support

## About

- Terms
- Privacy
- App Version

All options should have meaningful UI interactions.

Do not create dead menu items.

---

# 18. NOTIFICATIONS

Add a local notification center UI.

Include:

- order updates
- offer notifications
- promotional notifications

Categories:

All
Orders
Offers

Unread indicator should work locally.

---

# 19. LOCATION EXPERIENCE

Create a proper location selector.

Support local mock locations:

- Home
- Work
- Current location
- Search location

Do not require a backend.

The selected location must update the Home header.

---

# 20. ZOMATO-STYLE UX PATTERNS TO RECREATE

Use these functional patterns:

- search-first discovery
- personalized restaurant feed
- horizontal category carousels
- quick filters
- filter/sort bottom sheets
- prominent restaurant ratings
- delivery ETA
- offer badges
- menu categories
- sticky CTAs
- quantity controls
- coupon application
- order timeline
- reorder
- favorites
- review flow
- profile/account management
- empty/loading/error states

Do NOT copy Zomato branding or proprietary assets.

Use original Obliq implementation.

---

# 21. ANIMATIONS

Add subtle animations:

- search focus
- category selection
- favorite heart
- add-to-cart
- cart badge
- page transitions
- bottom sheets
- filter selection
- order tracking progress
- coupon application

Do not over-animate.

---

# 22. DARK MODE

Every screen must work in dark mode.

Verify:

- text contrast
- cards
- dialogs
- bottom sheets
- navigation
- images
- input fields
- selected states
- buttons

No white-background artifacts.

---

# 23. EMPTY STATES

Create polished empty states for:

- cart
- favorites
- orders
- search
- offers
- notifications

Each must have:

- icon
- heading
- explanation
- CTA

---

# 24. LOADING STATES

Use skeleton/loading states for:

- Home
- Restaurant
- Search
- Orders

Even though data is local, make the UI feel realistic.

---

# 25. ACCESSIBILITY & RESPONSIVENESS

Test layouts on:

- small Android phone
- standard Android phone
- large Android phone

Fix:

- RenderFlex overflow
- clipped text
- keyboard overlap
- unsafe areas
- tiny touch targets
- unreadable text

Minimum practical touch target:

44–48 logical pixels.

---

# 26. PERFORMANCE

Avoid:

- unnecessary rebuilds
- huge widget trees where avoidable
- excessive animations
- unnecessary Provider notifications
- repeated list calculations

Use efficient:

- ListView
- ListView.builder
- GridView
- const widgets
- reusable components

---

# 27. DATA MODEL IMPROVEMENT

Expand local mock data.

Create realistic datasets for:

- 15+ restaurants
- 50+ food items
- 10+ cuisines/categories
- 10+ offers
- 5+ orders
- 10+ reviews
- 5+ notifications

Restaurant data should include:

- name
- image URL
- rating
- review count
- cuisine
- price range
- delivery time
- distance
- offers
- menu

---

# 28. INR & INDIAN MARKET

The app should consistently use Indian conventions.

Currency:

`₹`

Examples:

`₹149`

`₹299`

`₹499`

Tax:

`GST`

Use realistic Indian restaurant names, foods, and addresses.

Avoid American-only examples.

---

# 29. NAVIGATION

Bottom navigation:

1. Home
2. Offers
3. Orders
4. Favorites
5. Profile

Global cart access must remain available.

Ensure:

- correct selected tab
- correct back behavior
- preserved state
- no duplicate screens
- no navigation loops

---

# 30. NO BACKEND

Do NOT add:

- Firebase
- Supabase
- REST API
- Spring Boot
- Node backend
- MySQL
- authentication server

unless explicitly requested later.

Everything remains local/mock for this phase.

---

# 31. CODE CLEANUP

After implementation:

Remove:

- unused imports
- unused variables
- dead widgets
- duplicated widgets
- broken references
- temporary files

Do NOT create Markdown documentation inside the Flutter project.

Do NOT create test artifacts inside the project unless explicitly required.

Keep the project Android-focused.

Do not recreate:

`ios/`

`macos/`

`linux/`

`windows/`

`web/`

---

# 32. BUILD & QA

Run:

```powershell
C:\src\flutter\bin\flutter.bat clean
```

Then:

```powershell
C:\src\flutter\bin\flutter.bat pub get
```

Then:

```powershell
C:\src\flutter\bin\flutter.bat analyze
```

Fix ALL analyzer errors.

Then:

```powershell
C:\src\flutter\bin\flutter.bat build apk --release
```

Verify:

`build\app\outputs\flutter-apk\app-release.apk`

---

# 33. DEVICE TESTING RULE

Never claim physical-device testing unless:

```powershell
adb devices
```

actually shows a device.

If no device exists, report:

"No physical Android device/emulator was connected; runtime device testing was not performed."

---

# 34. FINAL FEATURE ACCEPTANCE CHECKLIST

## Discovery

- [ ] Location
- [ ] Search
- [ ] Recent search
- [ ] Suggestions
- [ ] Categories
- [ ] Filters
- [ ] Sorting
- [ ] Restaurant discovery
- [ ] Personalized sections

## Restaurant

- [ ] Hero
- [ ] Rating
- [ ] Reviews
- [ ] ETA
- [ ] Offers
- [ ] Menu
- [ ] Categories
- [ ] Menu search
- [ ] Add buttons

## Food

- [ ] Details
- [ ] Customization
- [ ] Add-ons
- [ ] Instructions
- [ ] Quantity
- [ ] Dynamic price
- [ ] Add to cart

## Cart

- [ ] Items
- [ ] Quantity
- [ ] Delete
- [ ] Coupon
- [ ] Delivery
- [ ] GST
- [ ] Discount
- [ ] Total
- [ ] Checkout

## Checkout

- [ ] Address
- [ ] Add address
- [ ] Instructions
- [ ] Payment
- [ ] Order summary
- [ ] Place order
- [ ] Loading
- [ ] Success

## Orders

- [ ] Confirmation
- [ ] Tracking
- [ ] Timeline
- [ ] ETA
- [ ] Driver
- [ ] History
- [ ] Reorder
- [ ] Review

## Engagement

- [ ] Favorites
- [ ] Offers
- [ ] Coupons
- [ ] Notifications

## Profile

- [ ] Profile
- [ ] Addresses
- [ ] Payment methods
- [ ] Settings
- [ ] Notifications
- [ ] Support
- [ ] Terms
- [ ] Privacy
- [ ] Dark mode

## Quality

- [ ] Responsive
- [ ] No overflow
- [ ] No broken navigation
- [ ] No dead buttons
- [ ] Empty states
- [ ] Loading states
- [ ] Error states
- [ ] Dark mode
- [ ] Analyze passes
- [ ] Release APK builds

---

# 35. FINAL DELIVERABLE

Generate:

`app-release.apk`

at:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter\build\app\outputs\flutter-apk\app-release.apk`

Final package ID:

`com.obliq.fooddelivery`

---

# 36. FINAL REPORT

At completion report:

### Project Audit
- What was already implemented
- What was missing
- What was incomplete

### Phase Completion
- Phase 1 status
- Phase 2 status
- Phase 3 status
- Phase 4 status
- Phase 5 status
- Phase 6 status
- Phase 7 status
- Phase 8 status

### UI/UX Improvements
List the major production improvements.

### Zomato-Inspired UX
List the recreated functional UX patterns.

### QA
- flutter analyze
- build result
- APK size
- APK path

### Device Testing
Only report device testing if an actual device/emulator was connected.

---

# FINAL INSTRUCTION

DO NOT SIMPLY SAY THAT THE PHASES ARE COMPLETE.

ACTUALLY INSPECT THE CURRENT IMPLEMENTATION.

IDENTIFY THE GAPS.

IMPLEMENT THE GAPS.

THEN POLISH THE ENTIRE APP.

The target is:

**Obliq Food Delivery = production-level Indian food-delivery UX with the discovery, search, restaurant, offer, ordering, tracking, favorite, review, and account experience expected from a leading food-delivery application, while maintaining original Obliq branding and implementation.**

Preserve what already works.

Improve what is weak.

Implement what is missing.

Do not perform a destructive rewrite.

Do not change the package ID.

Do not claim tests that were not actually run.
