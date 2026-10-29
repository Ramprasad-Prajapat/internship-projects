# Obliq Food Delivery — Complete All-Phases Master Implementation Prompt

## Antigravity Execution Contract

You are the senior Flutter architect, product designer, UI/UX engineer, QA engineer, and release engineer responsible for upgrading the existing **Obliq Food Delivery** application.

Your task is to implement **ALL phases in this document in one continuous execution workflow**.

Do not stop after one phase. Do not only create a plan. Inspect the existing project, preserve working functionality, implement every missing feature, integrate every screen into navigation, test the complete user journey, fix every issue discovered, and generate the final production APK.

---

# 0. NON-NEGOTIABLE PROJECT RULES

Project:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

Package ID:

`com.obliq.fooddelivery`

Rules:

1. Do NOT change the application/package ID.
2. Do NOT delete working features.
3. Do NOT replace the project with an unrelated template.
4. Reuse existing models/providers/widgets wherever practical.
5. Preserve cart, favorites, orders, checkout, profile, notifications, search, coupons and tracking.
6. Keep INR `₹` pricing and Indian/Jodhpur-oriented demo data.
7. Keep Android release configuration working.
8. Do not introduce a backend unless necessary for an existing feature.
9. This remains primarily a polished frontend/local-state prototype.
10. No placeholder buttons that do nothing.
11. Every visible interactive element must have a meaningful action.
12. Do not claim a feature is implemented unless it is actually connected to UI and state.
13. Fix errors instead of bypassing them.
14. Never disable analyzer/test checks to hide problems.

---

# 1. REFERENCE UI/UX DIRECTION

Use the supplied reference screenshots as the visual direction.

Target characteristics:

- Search-first discovery
- Strong location context
- Large promotional hero banners
- Food-category discovery
- Filter chips
- Restaurant cards
- Offer badges
- Fast-delivery indicators
- Sticky/floating cart
- Premium checkout
- Order tracking
- Membership/offer surfaces
- Clean bottom navigation
- Smooth animations
- Excellent spacing and typography
- Responsive layouts

IMPORTANT: Do not copy proprietary logos, trademarks, exact text, exact branding, or copyrighted assets from another application. Reproduce the interaction patterns, information architecture, hierarchy, density, usability, and general visual language while maintaining OBLIQ branding.

Brand: `OBLIQ`

Primary: `#FF5722`
Accent: `#FFC107`
Light background: `#F8F9FA`
Dark background: `#121212`
Dark surface: `#1E1E1E`

Use Material 3.

---

# 2. PHASE 1 — COMPLETE PROJECT AUDIT

Inspect the entire `lib/` directory and all existing:

- models
- providers
- screens
- widgets
- theme
- mock data
- navigation
- `pubspec.yaml`
- `AndroidManifest.xml`
- `build.gradle.kts`
- `MainActivity.kt`

Identify duplicate files, dead screens, unused providers, broken navigation, missing imports, state inconsistencies, UI overflow risks, and missing loading/error/empty states.

Create an internal checklist and execute it. Do not stop at the audit.

---

# 3. PHASE 2 — ARCHITECTURE & STATE MANAGEMENT

Maintain:

```text
lib/
  models/
  providers/
  screens/
  widgets/
  theme/
  mock_data/
```

Use Provider.

Required state areas:

- Cart
- Favorites
- Orders
- Search
- Location
- Notifications
- Theme
- Coupons/offers
- User/profile
- Restaurant/menu state where required

Avoid duplicated business logic and ensure global cart badge updates correctly.

---

# 4. PHASE 3 — GLOBAL DESIGN SYSTEM

Standardize:

- color tokens
- typography hierarchy
- spacing
- radii
- shadows
- buttons
- cards
- chips
- inputs
- dialogs
- bottom sheets
- navigation

Create/reuse components:

- RestaurantCard
- FoodCard
- CategoryChip
- FilterChip
- PromoBanner
- OfferCard
- RatingBadge
- DeliveryTime
- CartBar
- PrimaryButton
- SecondaryButton
- EmptyState
- LoadingSkeleton
- ErrorState
- SectionHeader
- SearchBar

---

# 5. PHASE 4 — HOME SCREEN

Build a premium discovery homepage.

Header:

```text
Roop Nagar ▼
Rawat Nagar, Jodhpur, Rajasthan
```

Include:

- location dropdown
- avatar
- notification icon
- unread badge
- membership/offer icon

Search bar:

```text
Search "pizza"
Search "biryani"
Search "chaat"
Search "burger"
```

Include search icon, microphone icon, tap-to-open SearchScreen, and recent suggestions.

Add a functional Veg Mode toggle.

---

# 6. PHASE 5 — HERO/PROMOTIONAL BANNER

Create an auto-playing carousel for:

- Welcome Offer
- Free Delivery
- Weekend Sale
- Festival Offer
- Obliq Premium
- Restaurant Discounts

Support image/background, title, subtitle, CTA, indicator dots, and tap action.

Use bundled/mock assets or safe network images with fallbacks.

---

# 7. PHASE 6 — FOOD CATEGORY DISCOVERY

Horizontal categories:

- All
- Pizza
- Burger
- Biryani
- Rolls
- Sandwich
- Sweets
- Thali
- Paneer
- North Indian
- South Indian
- Chinese
- Desserts
- Beverages

Each category has image, title, active state, and tap filtering.

---

# 8. PHASE 7 — QUICK FILTERS

Implement:

- Filters
- Near & Fast
- Pure Veg
- Rating 4.0+
- Rating 4.5+
- Under ₹200
- Under ₹300
- Offers
- Premium
- Open Now

Create a filter bottom sheet with cuisine, rating, price, delivery time, veg, offers, sorting, reset, and apply.

Filters must actually change visible results.

---

# 9. PHASE 8 — DISCOVERY SECTIONS

Home sections:

- Recommended For You
- Top Restaurants
- Popular Near You
- Best Offers
- Fast Delivery
- Budget Meals
- Popular Dishes

Use `See All` where appropriate.

---

# 10. PHASE 9 — RESTAURANT CARDS

Support:

- cover image
- discount badge
- restaurant name
- rating
- review count
- cuisine
- price for one
- delivery time
- fast-delivery indicator
- favorite bookmark
- offer text
- veg indicator

Tap → Restaurant Details.

Favorite → FavoritesProvider.

---

# 11. PHASE 10 — SEARCH EXPERIENCE

Create a complete SearchScreen.

Search:

- restaurants
- dishes
- cuisines
- categories

Recent searches:

- reuse
- delete
- clear all

Trending searches:

- Biryani
- Pizza
- Paneer
- Burger
- Thali
- Chaat

Results:

- restaurant
- food
- category

Sort:

- Relevance
- Rating
- Delivery Time
- Price Low → High
- Price High → Low

Include useful empty state.

---

# 12. PHASE 11 — RESTAURANT DETAILS

Premium page with:

- hero image
- back
- share
- favorite
- name
- rating
- reviews
- cuisine
- price for one
- delivery ETA
- delivery fee
- offers

Sections:

- Menu
- Reviews
- Photos
- About

Menu categories:

- Recommended
- Starters
- Main Course
- Breads
- Rice
- Desserts
- Beverages

Menu search must work.

---

# 13. PHASE 12 — FOOD DETAILS

Support:

- large image
- name
- rating
- description
- price
- veg/non-veg
- customization
- add-ons
- quantity
- special instructions
- final calculated price
- Add to Cart

CTA must update CartProvider.

---

# 14. PHASE 13 — CART

Cart must include:

- restaurant information
- items
- quantity controls
- delete
- save for later where practical
- add more items
- coupon section
- bill summary

Formula:

```text
Grand Total =
Subtotal
+ Delivery Fee
+ Taxes
- Discount
```

Baseline:

- Delivery fee ₹30
- GST 5%

Prevent negative totals.

---

# 15. PHASE 14 — OFFERS & COUPONS

Coupons:

```text
OBLIQ10
FOOD20
WELCOME
FREEDELIVERY
```

Offer cards must contain:

- title
- discount
- minimum order
- expiry
- terms
- copy
- apply

Applied coupon updates cart.

Invalid coupon gives clear feedback.

Remove restores totals.

---

# 16. PHASE 15 — CHECKOUT

Address:

- Home
- Work
- Other
- Add New Address

Delivery:

- instructions
- contact preference
- landmark

Payment:

- UPI
- Credit/Debit Card
- Net Banking
- Wallet
- Cash on Delivery
- Obliq Pay

No real-money processing. Use simulated successful payment.

Validate cart, address and payment before placing order.

---

# 17. PHASE 16 — ORDER CONFIRMATION

Show:

- order ID
- restaurant
- amount
- address
- estimated delivery
- payment method
- View Order
- Track Order
- Continue Shopping

---

# 18. PHASE 17 — LIVE ORDER TRACKING

Stages:

```text
Placed
Confirmed
Preparing
Picked Up
Out for Delivery
Delivered
```

Show:

- progress
- ETA
- restaurant
- delivery partner
- phone action
- support action
- order items
- total

Use simulated local tracking. Do not claim real GPS.

---

# 19. PHASE 18 — ORDER HISTORY

Tabs:

- Active
- Past

Each order:

- restaurant
- items
- date
- amount
- status
- reorder
- rate meal
- details

Reorder must populate cart.

---

# 20. PHASE 19 — REVIEWS & RATINGS

Implement:

- 5-star selector
- review text
- quick tags
- submit

Restaurant rating breakdown:

```text
5 ★
4 ★
3 ★
2 ★
1 ★
```

Allow past orders to be rated.

---

# 21. PHASE 20 — FAVORITES

Tabs:

- Restaurants
- Foods

Support:

- favorite toggle
- remove
- open restaurant
- add food to cart
- empty state

---

# 22. PHASE 21 — NOTIFICATIONS

Categories:

- All
- Orders
- Offers
- Payments
- System

Features:

- unread count
- mark read
- mark all read
- delete
- empty state

---

# 23. PHASE 22 — PROFILE

Include:

- avatar
- name
- phone/email mock data
- orders
- favorites
- saved addresses
- payment methods
- offers
- notifications
- support
- settings
- privacy
- terms
- about
- logout

No dead buttons.

---

# 24. PHASE 23 — LOCATION

Selector:

- Home
- Work
- Current Location
- saved addresses

Default:

`Jodhpur, Rajasthan`

Examples:

- Ratanada
- Shastri Nagar
- Paota
- Roop Nagar

Selection updates header and discovery context.

If GPS is not implemented, use a clear local/simulated selector.

---

# 25. PHASE 24 — VEG MODE

When enabled:

- hide non-veg restaurants/items
- update categories/results
- persist during session

Display clear active state.

---

# 26. PHASE 25 — OBLIQ PREMIUM UI

Create an Obliq Premium/Gold-style experience without copying third-party branding.

Include:

- membership banner
- benefits
- discount highlights
- free delivery concept
- exclusive offers

No real billing.

---

# 27. PHASE 26 — MAIN NAVIGATION

Use:

```text
Home
Offers
Orders
Favorites
Profile
```

Keep global cart access visible.

Badge shows live item count.

---

# 28. PHASE 27 — FLOATING CART BAR

Example:

```text
3 items
₹486
View Cart →
```

Only show when cart has items.

Animate when items are added.

---

# 29. PHASE 28 — LOADING / EMPTY / ERROR STATES

Every major screen needs:

- skeleton loading
- useful empty state
- retryable error state

Avoid blank screens.

---

# 30. PHASE 29 — MICRO-INTERACTIONS

Add subtle:

- fade
- slide
- scale
- card entrance
- button feedback
- favorite animation
- cart badge animation
- page transitions
- pull to refresh
- haptic feedback where appropriate

Do not over-animate.

---

# 31. PHASE 30 — DARK MODE

Dark theme must work across every screen, dialog, sheet, card, input and navigation component.

No hardcoded light backgrounds that break dark mode.

---

# 32. PHASE 31 — ACCESSIBILITY & RESPONSIVENESS

Ensure:

- large touch targets
- no text overflow
- long names wrap
- prices fit
- buttons work on small screens
- SafeArea
- keyboard-safe inputs
- bottom-sheet height safety

---

# 33. PHASE 32 — INDIAN MOCK DATA

Restaurants:

- The Curry House
- Royal Biryani
- Punjabi Rasoi
- Pizza Palace
- Burger Junction
- South Indian Express
- The Dessert Lab
- Thali 360
- Roll Junction
- Great & Meet

Foods:

- Butter Chicken
- Paneer Tikka
- Chicken Biryani
- Veg Biryani
- Masala Dosa
- Paneer Butter Masala
- Pizza
- Burger
- Rolls
- Gulab Jamun
- Lassi

All prices in ₹.

---

# 34. PHASE 33 — IMAGE HANDLING

Images must:

- load correctly
- have placeholders
- handle failures
- avoid layout jumps

Do not depend on a single unavailable network URL.

Do not use copyrighted third-party logos/assets as OBLIQ branding.

---

# 35. PHASE 34 — NAVIGATION QA

Verify:

```text
Home → Search
Home → Restaurant
Restaurant → Food
Food → Cart
Cart → Checkout
Checkout → Confirmation
Confirmation → Tracking
Tracking → Orders
Orders → Reorder
Home → Offers
Home → Favorites
Home → Notifications
Profile → Settings
Profile → Addresses
Profile → Payments
```

Back navigation must work without duplicate stacks.

---

# 36. PHASE 35 — BUSINESS LOGIC QA

Verify:

Cart:
- add
- remove
- increase
- decrease
- clear

Coupons:
- apply
- invalid
- remove

Favorites:
- add
- remove

Search:
- query
- clear
- recent

Filters:
- apply
- reset

Orders:
- create
- status update
- reorder

Reviews:
- submit

Notifications:
- unread
- read
- clear

---

# 37. PHASE 36 — UNIT TESTS

Create meaningful tests for:

1. Cart add
2. Cart remove
3. Quantity update
4. Subtotal
5. GST
6. Delivery fee
7. Coupon discount
8. Invalid coupon
9. Order creation
10. Order status progression
11. Search filtering
12. Favorites toggle
13. Veg filtering
14. Location selection

Run:

```powershell
flutter test
```

All tests must pass.

---

# 38. PHASE 37 — STATIC ANALYSIS

Run:

```powershell
flutter analyze
```

Target:

```text
No errors
No warnings introduced
```

Fix root causes.

---

# 39. PHASE 38 — UI QA

Inspect all screens for:

- overflow
- clipped text
- bad spacing
- inconsistent radius
- inconsistent typography
- icon alignment
- inaccessible buttons
- dark-mode issues
- broken images
- empty states
- keyboard issues

Fix every discovered issue.

---

# 40. PHASE 39 — PERFORMANCE QA

Check:

- unnecessary rebuilds
- heavy list rendering
- nested widgets
- image sizes
- animation performance
- Provider updates

Use ListView.builder and const widgets where appropriate.

---

# 41. PHASE 40 — ANDROID CONFIGURATION QA

Verify `MainActivity.kt`:

```kotlin
package com.obliq.fooddelivery

import io.flutter.embedding.android.FlutterActivity

class MainActivity : FlutterActivity()
```

Verify:

```text
applicationId = com.obliq.fooddelivery
```

Do not change package ID.

---

# 42. PHASE 41 — FINAL BUILD

Execute:

```powershell
flutter clean
flutter pub get
flutter analyze
flutter test
flutter build apk --release
```

If anything fails:

1. identify root cause
2. fix
3. rerun
4. continue

---

# 43. PHASE 42 — APK VERIFICATION

Verify:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Check:

- exists
- non-zero size
- release build
- correct package
- generated after final code changes

Never report an old APK as final.

---

# 44. PHASE 43 — ADB DEVICE TESTING

If device/emulator available:

```powershell
adb devices
```

Then:

```powershell
adb install -r "build\app\outputs\flutter-apk\app-release.apk"
adb shell monkey -p com.obliq.fooddelivery 1
```

Test:

- launch
- home
- search
- restaurant
- food
- cart
- checkout
- order
- tracking
- profile
- back navigation

If unavailable, explicitly report:

`Physical device testing not performed — no ADB device detected.`

Never claim physical testing passed without a detected device.

---

# 45. PHASE 44 — CRASH LOGGING

If a crash occurs:

```powershell
adb logcat -d -t 1500
```

Filter:

```text
AndroidRuntime
FATAL EXCEPTION
Flutter
E/flutter
com.obliq.fooddelivery
```

Fix the actual root cause, rebuild and retest.

---

# 46. PHASE 45 — FINAL REGRESSION

Execute the full user journey:

```text
Launch
↓
Select Location
↓
Search
↓
Filter
↓
Open Restaurant
↓
Open Food
↓
Customize
↓
Add to Cart
↓
Apply Coupon
↓
Checkout
↓
Select Address
↓
Select Payment
↓
Place Order
↓
Confirmation
↓
Track Order
↓
Orders
↓
Rate Meal
↓
Reorder
```

Verify every state transition.

---

# 47. FINAL ACCEPTANCE CHECKLIST

- [ ] All phases completed
- [ ] Existing features preserved
- [ ] Home redesigned
- [ ] Search implemented
- [ ] Filters implemented
- [ ] Restaurant experience implemented
- [ ] Food customization implemented
- [ ] Cart implemented
- [ ] Coupons implemented
- [ ] Checkout implemented
- [ ] Order confirmation implemented
- [ ] Tracking implemented
- [ ] Order history implemented
- [ ] Reorder implemented
- [ ] Reviews implemented
- [ ] Favorites implemented
- [ ] Offers implemented
- [ ] Notifications implemented
- [ ] Profile implemented
- [ ] Location implemented
- [ ] Veg Mode implemented
- [ ] Premium UI implemented
- [ ] Dark mode implemented
- [ ] Loading states implemented
- [ ] Empty states implemented
- [ ] Error states implemented
- [ ] Responsive UI verified
- [ ] Navigation verified
- [ ] Business logic verified
- [ ] Unit tests pass
- [ ] flutter analyze passes
- [ ] Release APK builds
- [ ] APK exists at required path
- [ ] Physical testing performed if device is available

---

# 48. FINAL REPORT REQUIRED FROM ANTIGRAVITY

Report:

## Project Status

PASS / FAIL

## Phase Status

Phase 1–45 with completion status.

## Features

Total implemented features.

## Bugs Found

Important bugs discovered.

## Bugs Fixed

Exact fixes.

## Files Created

All created files.

## Files Modified

All modified files.

## Files Removed

Only actually removed files.

## Tests

```text
flutter analyze:
flutter test:
flutter build apk --release:
```

## APK

```text
Path:
Size:
Package ID:
Version:
```

## Physical Device

```text
Detected:
Installed:
Launched:
Core journey:
Crash:
```

If no device:

`NOT TESTED — no Android device/emulator detected.`

---

# 49. MOST IMPORTANT EXECUTION INSTRUCTION

Do not stop after creating files.

Do not stop after implementing Home.

Do not stop after `flutter analyze`.

Do not stop after `flutter test`.

Do not stop after building the APK.

Continue until:

1. all phases are implemented
2. all features are integrated
3. navigation is connected
4. state management works
5. tests pass
6. analyzer passes
7. release APK is generated
8. final verification is performed

If a feature already exists, audit and improve it rather than duplicating it.

If a file exists, modify it carefully rather than creating conflicting duplicates.

If a feature cannot be truly connected because the project is frontend/local-state only, implement a realistic local simulation and document the limitation.

The final application must feel like a polished, modern Indian food-delivery product under the OBLIQ brand, using modern food-delivery discovery and ordering patterns without copying proprietary branding or assets.

---

# FINAL COMMAND SEQUENCE

```powershell
cd "R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter"

flutter clean

flutter pub get

flutter analyze

flutter test

flutter build apk --release

Get-ChildItem ".\build\app\outputs\flutter-apk\app-release.apk" |
Select-Object FullName,
@{Name="SizeMB";Expression={[math]::Round($_.Length/1MB,2)}}
```

# FINAL APK

Expected:

```text
R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter\build\app\outputs\flutter-apk\app-release.apk
```

**END OF MASTER PROMPT**
