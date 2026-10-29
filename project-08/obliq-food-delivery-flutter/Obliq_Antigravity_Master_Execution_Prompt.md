# ANTIGRAVITY MASTER EXECUTION PROMPT
## Obliq Food Delivery — Complete All-Phases Implementation

You are Antigravity acting as a senior Flutter engineer, UI/UX designer, product engineer, QA engineer, and Android release engineer.

Your job is to take the existing Obliq Food Delivery Flutter project and execute the complete implementation described in:

`Obliq_Food_Delivery_All_Phases_Master_Implementation_Prompt.md`

Do NOT merely analyze it or give me instructions. YOU MUST IMPLEMENT IT IN THE EXISTING PROJECT.

---

## 1. PROJECT

Project path:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

Application:

**Obliq Food Delivery**

Package ID:

`com.obliq.fooddelivery`

Expected final APK:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter\build\app\outputs\flutter-apk\app-release.apk`

---

# 2. PRIMARY OBJECTIVE

Read the complete Markdown specification first.

Then:

1. Inspect the existing application.
2. Compare the current implementation against EVERY phase and requirement in the Markdown.
3. Identify what already exists.
4. Identify what is missing.
5. Improve incomplete implementations.
6. Implement all missing functionality.
7. Integrate every feature into the existing navigation/state architecture.
8. Preserve working features.
9. Fix regressions.
10. Run tests.
11. Run analyzer.
12. Build the final release APK.
13. Verify the APK.
14. Perform ADB testing if a device/emulator is available.
15. Provide a truthful final implementation report.

DO NOT stop after auditing.

DO NOT stop after creating files.

DO NOT stop after implementing the Home screen.

DO NOT stop after `flutter analyze`.

DO NOT stop after `flutter test`.

DO NOT stop after building the APK.

Continue until the complete specification has been implemented and verified.

---

# 3. IMPORTANT — EXISTING PROJECT FIRST

Before modifying anything, inspect:

- `lib/`
- `lib/models/`
- `lib/providers/`
- `lib/screens/`
- `lib/widgets/`
- `lib/theme/`
- `lib/mock_data/`
- `test/`
- `pubspec.yaml`
- `android/app/build.gradle.kts`
- `android/app/src/main/AndroidManifest.xml`
- `MainActivity.kt`
- current navigation
- current providers
- current APK/build configuration

Do not create duplicate implementations when an existing implementation can be safely extended.

If a file already contains a working feature, preserve it and improve it.

---

# 4. REFERENCE DESIGN

The supplied reference screenshots represent the desired food-delivery experience.

Recreate the same TYPE of:

- information hierarchy
- discovery flow
- search-first experience
- restaurant discovery
- promotional sections
- category browsing
- filters
- restaurant cards
- offer badges
- fast delivery indicators
- sticky cart
- checkout flow
- tracking experience
- bottom navigation
- spacing
- card density
- visual polish
- interaction patterns

IMPORTANT:

Do NOT copy proprietary logos, exact branding, copyrighted assets, or third-party trademark identity.

The resulting product must remain clearly branded as:

**OBLIQ**

Use the reference as UI/UX inspiration, not as a literal copyrighted clone.

---

# 5. DESIGN SYSTEM

Maintain the existing Obliq brand.

Primary:

`#FF5722`

Accent:

`#FFC107`

Light:

`#F8F9FA`

Dark:

`#121212`

Dark Surface:

`#1E1E1E`

Use Material 3.

Standardize:

- typography
- spacing
- cards
- buttons
- chips
- icons
- radius
- shadows
- bottom sheets
- dialogs
- navigation
- loading states
- empty states
- error states

---

# 6. REQUIRED FEATURE IMPLEMENTATION

The complete Markdown specification contains all phases.

Every phase must be implemented.

At minimum verify and implement:

### Home
- Location header
- Notification badge
- Profile/avatar
- Search
- Voice icon
- Veg Mode
- Hero carousel
- Food categories
- Offers
- Recommended restaurants
- Popular food
- Fast delivery
- Budget sections
- Premium/Gold-style Obliq membership section

### Search
- Search restaurants
- Search dishes
- Search cuisines
- Recent searches
- Trending searches
- Clear history
- Filters
- Sorting
- Empty states

### Filters
- Near & Fast
- Pure Veg
- Rating
- Price
- Delivery time
- Offers
- Open Now
- Reset
- Apply

Filters MUST actually change results.

### Restaurant
- Hero
- Favorite
- Share
- Rating
- Reviews
- Cuisine
- Price
- ETA
- Offers
- Menu categories
- Menu search
- Reviews
- About

### Food
- Image
- Description
- Price
- Veg/non-veg
- Add-ons
- Customization
- Quantity
- Instructions
- Dynamic total
- Add to Cart

### Cart
- Items
- Quantity
- Remove
- Restaurant
- Coupon
- Bill calculation
- Delivery fee
- GST
- Discount
- Grand total
- Checkout

### Offers
- Offer cards
- Coupon codes
- Apply
- Copy
- Remove
- Validation
- Terms

### Checkout
- Address
- Add address
- Delivery instructions
- UPI
- Card
- Wallet
- COD
- Obliq Pay
- Validation
- Place order

### Orders
- Confirmation
- Order history
- Active orders
- Past orders
- Reorder
- Rate meal

### Tracking
- Placed
- Confirmed
- Preparing
- Picked Up
- Out for Delivery
- Delivered
- ETA
- Delivery partner
- Support
- Simulated status progression

Do not claim real GPS tracking.

### Favorites
- Restaurants
- Foods
- Add/remove
- Empty states

### Notifications
- All
- Orders
- Offers
- Payments
- System
- Unread count
- Mark read
- Mark all read
- Delete

### Profile
- User details
- Orders
- Favorites
- Addresses
- Payments
- Offers
- Notifications
- Support
- Settings
- Privacy
- Terms
- About
- Logout

### Location
Default:

`Jodhpur, Rajasthan`

Support:

- Home
- Work
- Current location/simulated location
- Saved locations

Example localities:

- Ratanada
- Shastri Nagar
- Paota
- Roop Nagar

### Veg Mode
When enabled, hide non-veg content from discovery and results.

### Dark Mode
Must work throughout the application.

---

# 7. STATE MANAGEMENT

Continue using Provider unless the existing architecture requires a safe improvement.

Verify:

- CartProvider
- FavoritesProvider
- OrderProvider
- SearchProvider
- LocationProvider
- NotificationProvider
- Theme state
- Coupon state

Avoid duplicated business logic.

Global cart count and total must update immediately.

---

# 8. LOCAL DATA

Use realistic Indian mock data.

Restaurants can include:

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

Foods can include:

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

All pricing must use:

`₹`

---

# 9. NO DEAD UI

Every button, card, icon, chip and navigation item that appears interactive must work.

Examples:

- Search → SearchScreen
- Restaurant → RestaurantDetails
- Food → FoodDetails
- Add → Cart
- Cart → Checkout
- Checkout → Order
- Order → Tracking
- Reorder → Cart
- Favorite → Favorites
- Notification → Notifications
- Offers → Offers
- Profile items → functional screens/dialogs

If a real backend is unavailable, use a realistic local simulation.

---

# 10. UI QUALITY

The application must look production-level.

Check:

- no overflow
- no clipped text
- no broken layouts
- no tiny touch targets
- no inconsistent padding
- no inconsistent typography
- no broken dark mode
- no blank pages
- no broken images
- no dead actions
- no navigation stack problems

Use:

- SafeArea
- responsive constraints
- ListView.builder
- const widgets where useful
- proper keyboard handling
- proper bottom-sheet sizing

---

# 11. TESTING

Create/fix meaningful unit tests.

Test at minimum:

1. Cart add
2. Cart remove
3. Quantity
4. Subtotal
5. GST
6. Delivery fee
7. Coupon valid
8. Coupon invalid
9. Order creation
10. Order status
11. Search
12. Favorites
13. Veg filtering
14. Location

Run:

```powershell
flutter test
```

All tests must pass.

Then:

```powershell
flutter analyze
```

Target:

```text
0 errors
0 newly introduced warnings
```

---

# 12. BUILD

After all implementation and fixes:

```powershell
flutter clean
flutter pub get
flutter analyze
flutter test
flutter build apk --release
```

If a command fails:

1. read the actual error
2. identify root cause
3. fix it
4. rerun the failed command
5. continue

Never hide errors.

Never bypass tests.

Never report success when a command failed.

---

# 13. APK VERIFICATION

Verify:

```text
R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter\build\app\outputs\flutter-apk\app-release.apk
```

Check:

- file exists
- file size
- release build
- correct package ID
- generated after final modifications

---

# 14. ADB DEVICE TEST

Run:

```powershell
adb devices
```

If a physical device/emulator appears:

```powershell
adb install -r "R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter\build\app\outputs\flutter-apk\app-release.apk"
adb shell monkey -p com.obliq.fooddelivery 1
```

Then test:

```text
Launch
Home
Location
Search
Filter
Restaurant
Food
Add to Cart
Coupon
Checkout
Order
Tracking
Orders
Reorder
Favorites
Offers
Notifications
Profile
Dark Mode
Back Navigation
```

If there is no device, DO NOT claim device testing passed.

Report:

`Physical device testing not performed — no ADB device detected.`

---

# 15. CRASH DEBUGGING

If the app crashes on Android:

```powershell
adb logcat -d -t 1500
```

Look for:

```text
FATAL EXCEPTION
AndroidRuntime
Flutter
E/flutter
com.obliq.fooddelivery
```

Fix the root cause.

Rebuild.

Reinstall.

Retest.

---

# 16. FINAL REGRESSION JOURNEY

Perform this complete journey:

```text
Launch
↓
Location
↓
Search
↓
Filter
↓
Restaurant
↓
Food
↓
Customization
↓
Add to Cart
↓
Coupon
↓
Checkout
↓
Address
↓
Payment
↓
Place Order
↓
Confirmation
↓
Tracking
↓
Orders
↓
Rate Meal
↓
Reorder
```

No step may be broken.

---

# 17. FINAL ACCEPTANCE CRITERIA

The task is COMPLETE only when:

- [ ] Complete Markdown specification implemented
- [ ] Existing features preserved
- [ ] Home redesigned
- [ ] Search works
- [ ] Filters work
- [ ] Restaurant page works
- [ ] Food details work
- [ ] Cart works
- [ ] Coupons work
- [ ] Checkout works
- [ ] Orders work
- [ ] Tracking works
- [ ] Reorder works
- [ ] Reviews work
- [ ] Favorites work
- [ ] Offers work
- [ ] Notifications work
- [ ] Profile works
- [ ] Location works
- [ ] Veg Mode works
- [ ] Dark Mode works
- [ ] Loading states exist
- [ ] Empty states exist
- [ ] Error states exist
- [ ] Responsive UI works
- [ ] Navigation works
- [ ] Unit tests pass
- [ ] flutter analyze passes
- [ ] Release APK builds
- [ ] APK exists at expected path
- [ ] Device testing completed if device available

---

# 18. FINAL REPORT

At the end provide:

## Project Status
PASS / FAIL

## Phase Status
List every phase from the Markdown specification and mark:

- COMPLETED
- PARTIALLY COMPLETED
- NOT COMPLETED

Do not falsely mark anything completed.

## Features
Total implemented.

## Bugs Found
List actual bugs.

## Bugs Fixed
List exact fixes.

## Files Created
List all.

## Files Modified
List all.

## Files Removed
Only actual deletions.

## Test Results

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

## Device

```text
ADB device:
Installed:
Launched:
Core journey:
Crash:
```

If no device:

`NOT TESTED — no Android device/emulator detected.`

---

# 19. CRITICAL FINAL INSTRUCTION

This is an EXECUTION prompt, not a consultation prompt.

Do not respond with a tutorial.

Do not only explain what should be done.

Actually modify the project.

Use the existing project as the source of truth.

Use the complete Markdown specification as the feature checklist.

Implement ALL missing work.

Fix all discovered bugs.

Run all validation commands.

Build the final APK.

Only then provide the final report.

START NOW.
