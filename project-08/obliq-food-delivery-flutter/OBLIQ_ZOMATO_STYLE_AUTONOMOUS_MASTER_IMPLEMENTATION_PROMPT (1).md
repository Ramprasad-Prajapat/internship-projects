# OBLIQ FOOD DELIVERY --- AUTONOMOUS ZOMATO-STYLE MASTER IMPLEMENTATION PROMPT

## Antigravity / Autonomous Coding Agent --- ONE-SHOT EXECUTION SPECIFICATION

> **IMPORTANT:** This is an execution prompt, NOT a request for a plan.
> Start implementation immediately. Do not stop to ask questions,
> request confirmation, or wait for approval. Make reasonable
> engineering decisions automatically and continue until the entire
> specification is implemented, tested, audited, and a new Android
> release APK is generated.

------------------------------------------------------------------------

# 0. EXECUTION MODE --- MANDATORY

You are the autonomous implementation agent for the existing Flutter
project:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

Your job is to transform the current app into a **complete, polished,
production-quality food-delivery application strongly inspired by the
core UX patterns of Zomato**, while retaining the **OBLIQ** identity.

## NEVER ASK ME QUESTIONS

Do NOT ask about: - design choices - colors - spacing - navigation -
mock data - restaurant names - payment simulation - location behavior -
dark mode - order status - architecture - package names - test
strategy - which files to modify - whether to continue - whether to fix
warnings - whether to rebuild - whether to create a report

If something is unspecified, choose the most sensible production-quality
option and continue.

## ONE-SHOT RULE

Work through the entire pipeline in one continuous execution:

1.  Read this prompt completely.
2.  Inspect the existing project.
3.  Audit the existing implementation.
4.  Preserve useful existing functionality.
5.  Remove/replace incomplete or poor implementations where necessary.
6.  Implement ALL missing features.
7.  Connect every feature to real local/mock state.
8.  Polish every screen.
9.  Run analyzer and tests.
10. Fix all issues automatically.
11. Build a fresh release APK.
12. Verify the APK.
13. Generate the final implementation/QA report.
14. Stop only after the complete pipeline succeeds.

If a command fails: - diagnose the cause, - fix it, - rerun it, -
continue automatically.

Do not merely report a failure when it is reasonably fixable.

------------------------------------------------------------------------

# 1. PRODUCT GOAL

Build **OBLIQ Food Delivery** as a modern Indian food-delivery super-app
experience.

The UX should feel familiar to users of leading food-delivery
applications, especially the information architecture and interaction
patterns seen in Zomato:

-   search-first discovery
-   food/category discovery
-   nearby restaurants
-   filters and sorting
-   restaurant storefronts
-   menu browsing
-   food customization
-   cart
-   coupons
-   checkout
-   delivery address management
-   payment selection
-   order tracking
-   order history
-   reorder
-   favorites
-   offers
-   dining/reservations
-   quick-commerce/market
-   notifications
-   profile/settings

Do NOT make a shallow collection of screens.

Every important screen must be connected to working state and
navigation.

------------------------------------------------------------------------

# 2. DESIGN REFERENCE

Use the user's supplied Zomato-style screenshots as the visual/UX
reference.

The reference should guide: - information hierarchy - card density -
horizontal carousels - search placement - category chips - restaurant
cards - offer cards - typography hierarchy - rounded cards - filter
controls - discovery sections - bottom navigation - interaction patterns

Do NOT copy Zomato logos, trademarks, copyrighted assets, or proprietary
source code.

Create an original OBLIQ implementation with similar usability and
familiar food-delivery conventions.

Primary brand: - OBLIQ - green-forward brand identity - clean
white/light surfaces - subtle shadows - modern rounded cards - strong
food imagery - Indian Rupee (`₹`) - responsive mobile-first UI

------------------------------------------------------------------------

# 3. EXISTING PROJECT RULE

First inspect the current codebase.

Do NOT blindly rewrite everything.

Preserve and improve: - existing working providers - existing models -
existing mock data - existing navigation - existing cart logic -
existing order logic - existing location implementation - existing
Flutter configuration

However, if an existing implementation is visibly incomplete,
duplicated, broken, placeholder-based, or inconsistent with this
specification, replace/refactor it.

Do not create duplicate providers, duplicate widgets, duplicate screens,
or duplicate navigation systems.

Maintain one clean architecture.

------------------------------------------------------------------------

# 4. REQUIRED TECH STACK

Use the existing Flutter project.

Preferred architecture:

-   Flutter
-   Dart
-   Material 3
-   Provider for state management
-   local/mock data for standalone operation
-   `shared_preferences` or equivalent local persistence where useful
-   `geolocator` for device location
-   `geocoding` for reverse geocoding when supported
-   no localhost dependency
-   no development server dependency
-   no backend required for the demo/release build

The release APK must run independently after installation.

The phone must NOT need: - Flutter installed - VS Code - Android
Studio - a development server - USB connection to the PC - localhost -
`10.0.2.2`

------------------------------------------------------------------------

# 5. HOME SCREEN --- HIGH PRIORITY

Rebuild the Home screen to closely match the supplied Zomato-style
reference.

Required hierarchy:

## Header

-   current delivery location
-   location icon
-   tap location → location/address sheet
-   profile/avatar entry
-   notification icon/badge where appropriate
-   optional greeting

## Search

Large rounded search bar near the top.

Include: - search icon - placeholder: `Restaurant name or a dish...` -
microphone/voice-search UI - tap → full Search screen - live search
behavior

## VEG MODE

Visible toggle: - `VEG MODE` - ON/OFF state - provider-backed state -
immediately filters non-veg restaurants/foods where applicable

## Food Categories

Horizontal image carousel: - Sandwich - Sweets - Thali - Paneer - North
Indian - South Indian - Pizza - Burger - Chinese - Biryani - Desserts -
Beverages - etc.

Each category must be clickable and filter results.

## Filter Chips

Horizontal chip row: - Filters - Near & Fast - Under ₹200 - Rating
4.0+ - Pure Veg - Offers - Delivery - etc.

Filters must actually affect displayed results.

## Restaurant Discovery

Create horizontally scrollable and vertically listed restaurant
sections: - Near You - Top Rated - Popular Near You - Fast Delivery -
Best Offers - Budget Friendly - New on OBLIQ

Restaurant cards must contain: - image - rating - restaurant name -
cuisine - delivery time - distance - price for two - offer - veg
indicator where applicable - favorite/bookmark - sponsored/ad label
where applicable

## Explore More

Create discovery cards such as: - Offers - Top 10 - Food on Train -
Collections - Healthy - Best of OBLIQ - Budget Meals

## Deals

Create a large `TRY NEW DEALS` / equivalent promotional section: - large
restaurant cards - food image - rating - restaurant name - delivery
time - offer badge - discount - CTA

## Floating Cart

When cart contains items: - floating bottom cart bar - item count -
total - `View Cart` - animated appearance/disappearance

------------------------------------------------------------------------

# 6. SEARCH --- COMPLETE

Search must be functional.

Implement: - live query - restaurant search - dish search -
cuisine/category search - recent searches - clear history - trending
searches - suggestions - result counts - filters - sorting

Filters: - Pure Veg - Rating - Delivery time - Price - Offers -
Distance - Cuisine

Sorting: - Relevance - Rating high to low - Fastest delivery - Cost low
to high - Cost high to low

Search results must update from actual local mock data.

No fake dead search screen.

------------------------------------------------------------------------

# 7. RESTAURANT DETAIL

Every restaurant card must open a proper restaurant storefront.

Include: - hero image - back button - favorite - share - restaurant
name - rating - review count - cuisine - price for two - delivery time -
distance - offer banner - restaurant information - delivery details

Menu: - category tabs - recommended - bestsellers - starters - main
course - breads - rice - beverages - desserts - etc.

Food cards: - food image - name - description - veg/non-veg indicator -
rating where useful - price - add button - quantity stepper after
adding - bestseller badge

------------------------------------------------------------------------

# 8. FOOD DETAIL & CUSTOMIZATION

Food item tap must open a detailed customization screen/bottom sheet.

Support: - variants - size - quantity - add-ons - extras - cooking
instructions - spice preference - remove ingredients where appropriate -
live price calculation - `Add to Cart`

Example: - Regular - Large - Extra cheese - Extra paneer - Extra sauce -
No onion - Less spicy

The final amount must update immediately.

------------------------------------------------------------------------

# 9. CART

Cart must be fully functional.

Include: - restaurant grouping - food items - images - quantity +/-
controls - remove item - customization summary - add more food - special
instructions - coupon input - applied coupon - remove coupon

Bill: - Item total - Discount - Delivery fee - Taxes/GST - Platform fee
if used - Packaging fee if used - Grand total

Use realistic Indian pricing and `₹`.

Do not hardcode fake totals that ignore cart state.

------------------------------------------------------------------------

# 10. COUPONS

Implement provider-backed coupon logic.

Include examples: - `OBLIQ10` - `FOOD20` - `WELCOME` - `FREEDELIVERY`

Each coupon should have: - code - discount type - discount value -
minimum order - maximum discount - validity - applicable conditions

Show: - valid - invalid - minimum-order error - already applied -
discount amount

------------------------------------------------------------------------

# 11. CHECKOUT

Checkout must be a complete flow.

## Address

Support: - Home - Work - Other - add new address - edit - delete -
select default

Address fields: - name - phone - house/building - street/area -
landmark - city - state - pincode

## Payment

Provide realistic simulated choices: - UPI - Card - Cash on Delivery -
OBLIQ Wallet

Payment selection is simulated/offline; never connect to real payment
services unless already configured.

## Order Summary

Show: - restaurant - items - quantities - subtotal - discounts - fees -
taxes - final amount - selected address - selected payment method

CTA: `Place Order`

------------------------------------------------------------------------

# 12. ORDER TRACKING

After placing an order, navigate to tracking.

Timeline: 1. Order Placed 2. Restaurant Confirmed 3. Preparing 4. Ready
5. Out for Delivery 6. Delivered

Include: - order ID - estimated delivery time - restaurant - ordered
items - total - delivery address - delivery partner card - call/chat
simulation - map-style visual area - status timeline

Use a realistic local simulator.

Status should be able to progress automatically or through normal user
interaction without exposing developer/debug controls in the normal UI.

------------------------------------------------------------------------

# 13. ORDERS

Create: - Active Orders - Past Orders

Each order: - restaurant - date - items - amount - status - order ID

Actions: - Track Order - View Details - Reorder - Rate Order

Reorder must actually repopulate the cart.

------------------------------------------------------------------------

# 14. RATINGS & REVIEWS

After delivery: - 1--5 star rating - food rating - delivery rating -
optional review text - submit - success state

Store locally for the session/persistence where practical.

------------------------------------------------------------------------

# 15. FAVORITES

Support: - favorite restaurant - favorite food - remove favorite - empty
state - direct navigation back to restaurant/food

Favorite icon must work everywhere it appears.

------------------------------------------------------------------------

# 16. OFFERS

Offers screen: - promotional banners - coupon cards - restaurant
offers - percentage discounts - flat discounts - free delivery - copy
coupon - apply coupon

Do not create dead offer cards.

------------------------------------------------------------------------

# 17. DINING

Create a Dining section inspired by modern food-app dining experiences.

Include: - restaurant discovery - cuisine filters - rating - distance -
price - ambience/category - table booking

Booking flow: 1. select restaurant 2. select date 3. select time 4.
guests 5. seating preference 6. confirm booking 7. booking confirmation

Bookings should appear in a booking/history area.

------------------------------------------------------------------------

# 18. QUICK MARKET

Create a separate quick-commerce experience.

Include: - categories - groceries - beverages - snacks - dairy -
household - personal care - fruits/vegetables - essentials

Product card: - image - name - quantity - price - discount - add
button - quantity controls

Market cart must be separate and functional.

Checkout should support: - address - payment selection - order
placement - order status

------------------------------------------------------------------------

# 19. PROFILE

Profile screen must contain:

-   user profile
-   Orders
-   Favorites
-   Addresses
-   Payment Methods
-   Coupons
-   Notifications
-   Dining Bookings
-   Help & Support
-   About OBLIQ
-   Terms
-   Privacy
-   Dark Mode
-   Veg Mode
-   Logout

Every tile must navigate or perform an actual action.

No dead tiles.

------------------------------------------------------------------------

# 20. NOTIFICATIONS

Implement: - notification list - unread count - mark as read - mark all
read - clear notifications - order notifications - offer notifications -
dining notifications

Badge must update dynamically.

------------------------------------------------------------------------

# 21. LOCATION --- MUST BE REALISTIC

Location is a core feature.

Implement:

1.  Request device location permission.
2.  Detect GPS/service disabled.
3.  Handle permission denied.
4.  Handle permanently denied.
5.  Open settings when necessary.
6.  Obtain current coordinates.
7.  Reverse-geocode where available.
8.  Display readable address/city.
9.  Allow manual location selection.
10. Allow saved addresses.
11. Allow changing delivery location.
12. Persist selected address locally where practical.
13. Never crash when location is unavailable.

Fallback behavior: - If GPS/geocoding cannot work, use a sensible demo
city/address and clearly keep the app usable. - Do not pretend a fake
GPS coordinate is the real user location.

Android: - location permissions configured correctly.

iOS: - `NSLocationWhenInUseUsageDescription` configured correctly.

------------------------------------------------------------------------

# 22. BOTTOM NAVIGATION

Use a clean primary navigation structure.

Recommended: 1. Home / Delivery 2. Under ₹250 / Offers 3. Dining 4.
Quick Market 5. Profile

If the existing architecture uses another valid structure, preserve it
only if it delivers the same functionality.

Each tab must: - open correctly - preserve state where appropriate -
never show a blank screen - never contain a dead button

------------------------------------------------------------------------

# 23. DARK MODE

Implement a complete theme system.

Requirements: - light mode - dark mode - consistent colors - readable
text - correct card/background contrast - icons remain visible -
dialogs/sheets adapt - bottom navigation adapts - forms adapt

Persist user choice.

------------------------------------------------------------------------

# 24. VEG MODE

Veg Mode must be global.

When enabled: - hide non-veg dishes from restaurant menus - hide non-veg
results from search - hide/filter non-veg restaurant content where
appropriate - update UI instantly

When disabled: - restore all applicable content.

Do not merely toggle the visual switch.

------------------------------------------------------------------------

# 25. DATA MODEL

Ensure typed models exist for at least:

-   Restaurant
-   FoodItem
-   FoodCategory
-   CartItem
-   Address
-   Order
-   OrderItem
-   Coupon
-   Notification
-   DiningPlace
-   DiningBooking
-   MarketItem
-   MarketCartItem
-   PaymentMethod
-   Review

Avoid excessive use of `Map<String, dynamic>` when typed models are
practical.

------------------------------------------------------------------------

# 26. PROVIDERS / STATE

Maintain one clean provider architecture.

Expected providers where needed:

-   CartProvider
-   FavoritesProvider
-   OrderProvider
-   LocationProvider
-   SearchProvider
-   CouponProvider
-   DiningProvider
-   MarketProvider
-   NotificationProvider
-   VegModeProvider
-   ThemeProvider
-   PaymentProvider
-   MembershipProvider if the current app already uses it

Do not create duplicate providers.

------------------------------------------------------------------------

# 27. MOCK DATA QUALITY

The app must feel populated.

Create enough realistic data for: - 20+ restaurants - 100+ food items -
multiple cuisines - multiple categories - multiple offers - multiple
dining places - 30+ market products - notifications - orders - coupons

Use realistic Indian: - restaurant names - dishes - prices - cuisine -
delivery times - addresses - ratings

Prefer Jodhpur/Rajasthan-friendly demo data because OBLIQ is an Indian
application.

Never use: - Lorem ipsum - TODO - FIXME - Coming Soon - Dummy text -
`$15` - `$5` - USD prices

All user-facing prices must use `₹`.

------------------------------------------------------------------------

# 28. IMAGE / ASSET HANDLING

Use high-quality food imagery already present in the project where
available.

Do not break existing asset paths.

If a required image is missing: - use an appropriate local asset already
available, - or create a clean local fallback, - never leave a broken
image icon.

All image widgets need sensible error handling.

------------------------------------------------------------------------

# 29. UI QUALITY BAR

The result must NOT look like a basic student CRUD application.

Target: - polished commercial food app - consistent spacing - responsive
cards - clean typography - subtle shadows - rounded corners - smooth
scrolling - clear CTA hierarchy - high-quality empty states - proper
loading states - error states - responsive bottom sheets - no overflow -
no clipped text where avoidable

Respect: - SafeArea - system status bar - navigation bar - different
Android screen sizes - small phones - tall phones

------------------------------------------------------------------------

# 30. ACCESSIBILITY

Add: - semantic labels where useful - adequate touch targets - readable
contrast - meaningful button labels - accessible icons - no interaction
that depends only on color

------------------------------------------------------------------------

# 31. ANIMATION & MICRO-INTERACTIONS

Add restrained, professional animations: - card press - favorite
toggle - cart addition - bottom-sheet transitions - tab transitions -
order status progression - loading states

Do not over-animate.

------------------------------------------------------------------------

# 32. ERROR / EMPTY / LOADING STATES

Every data-driven area must have: - loading state where appropriate -
empty state - error/retry state where applicable

Examples: - empty cart - no favorites - no orders - no search results -
no notifications - no bookings - no market cart

Every empty state needs a useful CTA.

------------------------------------------------------------------------

# 33. NAVIGATION AUDIT

Test the complete journey:

Home → Search → Search Result → Restaurant → Food → Customize → Add to
Cart → Cart → Coupon → Checkout → Address → Payment → Place Order →
Tracking → Delivered → Rating → Orders → Reorder → Cart

Also test:

Home → Dining → Restaurant → Booking → Confirmation

Home → Quick Market → Product → Market Cart → Checkout → Order

Home → Profile → Orders/Favorites/Addresses/Payments/Settings

No broken back navigation.

------------------------------------------------------------------------

# 34. DEAD-BUTTON AUDIT

Search the entire codebase for: - `onPressed: null` - empty callbacks -
placeholder callbacks - TODO actions - fake buttons - non-functional
cards - navigation to missing routes

Fix every occurrence that represents a user-facing dead control.

Do not remove a feature merely to hide a dead button.

Implement the actual behavior.

------------------------------------------------------------------------

# 35. PLACEHOLDER AUDIT

Search entire project for:

-   TODO
-   FIXME
-   Coming Soon
-   Lorem ipsum
-   dummy
-   placeholder
-   `$`
-   USD
-   test-only visible UI
-   developer-only UI

Remove or replace all user-facing occurrences.

------------------------------------------------------------------------

# 36. NO GITHUB / NO CLOUD DEPENDENCY

Do NOT: - initialize Git - create `.git` - create `.github` - create
GitHub Actions - configure GitHub - push code - require GitHub to build
the APK

The release must be a **direct local APK** generated from Flutter.

Do not add GitHub workflow files.

------------------------------------------------------------------------

# 37. APK REQUIREMENT

The primary deliverable is:

`build/app/outputs/flutter-apk/app-release.apk`

Build with:

``` bash
flutter clean
flutter pub get
flutter analyze
flutter test
flutter build apk --release
```

The APK must be standalone.

Verify: - file exists - size - package ID - version - release build
success

Do not provide only instructions.

Actually generate the APK.

------------------------------------------------------------------------

# 38. ANDROID REQUIREMENTS

Ensure: - correct application ID - correct launcher activity - correct
permissions - correct compileSdk - correct targetSdk - AndroidX
compatibility - no Gradle mismatch - no broken manifest - no missing
resources

Use the installed compatible SDK version.

If compile SDK 36 is required by dependencies and installed, use 36.

If a dependency forces a higher compatible SDK, adapt automatically
rather than stopping.

------------------------------------------------------------------------

# 39. iOS REQUIREMENTS

The same Flutter codebase must remain iOS-compatible.

Verify: - iOS folder exists - Runner configuration is valid - Info.plist
has location usage description - assets are compatible - no Android-only
Dart assumptions - no Windows-only runtime assumptions -
platform-specific plugins are configured correctly

On Windows, do NOT claim an IPA was generated.

The iOS project should be ready for a macOS/Xcode build.

------------------------------------------------------------------------

# 40. IMPORTANT PLATFORM RULE

The user wants the installed app to run independently.

Therefore:

## Android

Generate a real release APK.

## iOS

Keep the project iOS-ready, but do not attempt an impossible iOS build
on Windows.

Never tell the user to run Flutter on their phone.

The phone only receives the APK.

------------------------------------------------------------------------

# 41. TESTING

Run:

``` bash
flutter analyze
flutter test
```

Fix every error and warning that can be fixed.

Add tests for: - cart quantity - cart removal - cart totals - coupon
validation - veg filtering - favorites - order creation - reorder -
location state - theme state where practical - market cart - dining
booking

Do not delete existing tests just to make the suite pass.

Target: - 0 analyzer issues - 100% passing test suite

------------------------------------------------------------------------

# 42. RELEASE VERIFICATION

After building:

Verify:

``` text
build/app/outputs/flutter-apk/app-release.apk
```

Check: - existence - file size - package/application ID - version name -
version code

If APK size is reasonably below 55 MB, accept it.

Do not artificially remove important features just to reduce size.

------------------------------------------------------------------------

# 43. FINAL AUTOMATED QA

Perform these searches:

``` text
TODO
FIXME
Coming Soon
Lorem ipsum
dummy
placeholder
onPressed: null
onTap: null
$
USD
localhost
10.0.2.2
```

Review results and distinguish legitimate source-code symbols from
user-facing defects.

There must be no user-facing placeholder or dead functionality.

------------------------------------------------------------------------

# 44. FINAL REPORT

Create:

`FINAL_OBLIQ_ZOMATO_STYLE_IMPLEMENTATION_REPORT.md`

Include:

1.  Executive summary
2.  Files changed
3.  Architecture
4.  Home implementation
5.  Search
6.  Categories
7.  Restaurant details
8.  Food customization
9.  Cart
10. Coupons
11. Checkout
12. Payments
13. Location
14. Orders
15. Tracking
16. Favorites
17. Offers
18. Dining
19. Quick Market
20. Notifications
21. Profile
22. Dark mode
23. Veg mode
24. Mock data
25. Navigation audit
26. Dead-button audit
27. Placeholder audit
28. Accessibility
29. Responsive UI
30. Flutter analyze result
31. Flutter test result
32. APK build result
33. APK path
34. APK size
35. Package ID
36. Version
37. iOS readiness
38. Known limitations
39. Final status

Do not claim physical-device testing unless an actual device was
connected and tested.

------------------------------------------------------------------------

# 45. CONTINUOUS EXECUTION RULE

This section is critical.

After starting implementation:

**DO NOT STOP AFTER:** - creating a plan - creating a report - finding
missing features - fixing one screen - fixing one warning - building
once - generating a partial APK

Continue until:

`AUDIT → IMPLEMENT → CONNECT → POLISH → TEST → FIX → BUILD → VERIFY → REPORT`

is complete.

If a build fails:

`READ ERROR → FIX → CLEAN IF NEEDED → REBUILD`

If analyzer fails:

`READ WARNING/ERROR → FIX → ANALYZE AGAIN`

If tests fail:

`READ FAILURE → FIX IMPLEMENTATION → TEST AGAIN`

Never ask the user whether you should continue.

------------------------------------------------------------------------

# 46. NO-ASK POLICY --- FINAL

For this entire task, the user has already authorized the full
implementation.

Therefore:

-   Do not ask for confirmation.
-   Do not ask open questions.
-   Do not ask which feature to implement first.
-   Do not ask whether to modify existing files.
-   Do not ask whether to rebuild.
-   Do not pause after creating a plan.
-   Do not return a checklist instead of implementation.
-   Do not say "let me know".
-   Do not say "please approve".
-   Do not wait for user input.

Make decisions yourself.

------------------------------------------------------------------------

# 47. FINAL SUCCESS CONDITION

The task is successful only when ALL of the following are true:

-   [ ] Zomato-style core food-delivery UX implemented
-   [ ] OBLIQ branding retained
-   [ ] Home redesigned
-   [ ] Search fully functional
-   [ ] Categories functional
-   [ ] Filters functional
-   [ ] Restaurant storefront functional
-   [ ] Food customization functional
-   [ ] Cart functional
-   [ ] Coupons functional
-   [ ] Checkout functional
-   [ ] Address management functional
-   [ ] Payment selection functional
-   [ ] Order placement functional
-   [ ] Order tracking functional
-   [ ] Orders functional
-   [ ] Reorder functional
-   [ ] Favorites functional
-   [ ] Offers functional
-   [ ] Dining functional
-   [ ] Quick Market functional
-   [ ] Notifications functional
-   [ ] Profile functional
-   [ ] Dark mode functional
-   [ ] Veg mode functional
-   [ ] Location permission flow functional
-   [ ] Manual address fallback functional
-   [ ] Offline/mock mode functional
-   [ ] No localhost dependency
-   [ ] No GitHub dependency
-   [ ] No user-facing placeholders
-   [ ] No dead buttons
-   [ ] No USD pricing
-   [ ] Responsive UI
-   [ ] Accessibility basics implemented
-   [ ] `flutter analyze` clean
-   [ ] `flutter test` passes
-   [ ] release APK generated
-   [ ] APK verified
-   [ ] final QA report generated

------------------------------------------------------------------------

# 48. START NOW

Immediately execute the following sequence:

``` text
1. Inspect project.
2. Read and internalize this entire specification.
3. Audit every existing screen/provider/model.
4. Compare current implementation against every requirement above.
5. Implement all missing features.
6. Refactor duplicate/broken implementations.
7. Connect all UI to real local state.
8. Polish the complete UI.
9. Run analyzer.
10. Fix every issue.
11. Run tests.
12. Fix every failure.
13. Build release APK.
14. Verify APK.
15. Run final audits.
16. Generate FINAL_OBLIQ_ZOMATO_STYLE_IMPLEMENTATION_REPORT.md.
17. Return a concise completion summary with the APK path.
```

## DO NOT ASK ANYTHING.

## DO NOT WAIT.

## IMPLEMENT EVERYTHING IN ONE CONTINUOUS EXECUTION.
