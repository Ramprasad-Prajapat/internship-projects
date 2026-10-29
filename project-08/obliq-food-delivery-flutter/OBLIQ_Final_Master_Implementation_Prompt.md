# OBLIQ FOOD DELIVERY — FINAL MASTER IMPLEMENTATION PROMPT

## Single Source of Truth for Antigravity / Gemini

You are a Senior Flutter Engineer, Product Engineer, UI/UX Engineer, and QA Engineer. Work directly on the existing project:

`R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter`

The supplied reference images are the visual source of truth for the Home/Discovery experience. Build a polished OBLIQ food-delivery app using the same modern interaction principles, information hierarchy, density, rounded cards, search-first discovery, horizontal rails, filters, restaurant cards, and bottom navigation seen in the references.

Do NOT copy Zomato trademarks, logo, proprietary text, copyrighted artwork, or exact proprietary assets. Recreate the UX pattern with original OBLIQ branding and assets.

---

## 1. NON-NEGOTIABLE RULES

1. Audit the entire existing project before changing code.
2. Preserve working features and existing Provider architecture.
3. Do not create duplicate screens/providers when an existing implementation can be improved.
4. Every visible button, card, chip, icon, tab, banner CTA, and navigation item must work.
5. No blank screens.
6. No TODO, FIXME, Coming Soon, Lorem ipsum, fake buttons, or unfinished sections.
7. Every empty state must have useful content and an actionable CTA.
8. Every navigation route must work and Android back navigation must behave correctly.
9. All prices must use Indian Rupees (`₹`).
10. Use local/mock data; do not introduce a backend/API requirement.
11. Preserve package ID: `com.obliq.fooddelivery`.
12. Keep the release APK around/below 55 MB.
13. Do not claim physical-device testing unless an ADB device is actually detected.
14. Do not stop after creating files: integrate, test, fix, rebuild, and verify.

---

# 2. FULL PROJECT AUDIT

Inspect all of:

- `lib/`
- `lib/models/`
- `lib/providers/`
- `lib/screens/`
- `lib/widgets/`
- `lib/theme/`
- `lib/mock_data/`
- `test/`
- `android/`
- `pubspec.yaml`
- `main.dart`
- navigation
- routes
- providers
- models
- themes
- assets

Search the codebase for:

`TODO`, `FIXME`, `Coming Soon`, `Lorem ipsum`, `$`, `USD`, `onPressed`, `onTap`, `Navigator`, `IconButton`, `TextButton`, `ElevatedButton`, `GestureDetector`, `InkWell`.

Build an internal checklist and complete every missing item.

---

# 3. HOME PAGE — HIGHEST PRIORITY

Rebuild the Home/Discovery screen to closely match the supplied reference layout.

It must feel like a premium Indian food-delivery discovery app.

## Header

Show:

- location pin
- current location
- dropdown
- profile/avatar
- notification icon
- unread badge
- VEG MODE toggle

Example:

`📍 Ratanada, Jodhpur`

Location selector bottom sheet:

- Home
- Work
- Ratanada
- Shastri Nagar
- Paota
- Current location

Selecting an option immediately updates the header.

## Search

Large rounded search bar:

`Search for restaurants, dishes or cuisines`

Include:

- search icon
- microphone icon
- clear action
- navigation to SearchScreen

Search must work across restaurant names, dishes, cuisines, categories, and tags.

## Discovery shortcuts

Create a horizontal rail containing functional cards:

- Offers
- Top Rated
- Collections
- Under ₹250
- Near & Fast
- Recommended
- Pure Veg
- Healthy
- Family Meals
- New Restaurants

Every card opens a meaningful filtered/list screen.

## Promotional carousel

Create a polished carousel using:

- FOOD20
- OBLIQ10
- WELCOME
- FREEDELIVERY

Each banner has title, subtitle, coupon code, CTA, and page indicator. CTA must open Offers or apply the coupon.

## Filter chips

Create:

- All
- Near & Fast
- Under ₹250
- Rating 4+
- Pure Veg
- Offers
- Best Seller
- Healthy

Selected filters must update content immediately.

## Categories

At minimum:

- All
- Biryani
- Thali
- Pizza
- Burger
- North Indian
- South Indian
- Chinese
- Rolls
- Sandwich
- Sweets
- Cake
- Desserts
- Beverages

Category taps must filter results.

## Restaurant feed

Use rich cards containing:

- image
- restaurant name
- rating
- reviews
- cuisine
- ETA
- distance
- price for two
- offer badge
- veg indicator
- bookmark
- delivery badge

Use at least 20 realistic Indian/Jodhpur restaurants.

---

# 4. SEARCH

Create a complete SearchScreen:

- live query
- recent searches
- clear history
- trending searches
- restaurant results
- dish results
- cuisine results
- sort
- filters
- empty result state

Sorting:

- Relevance
- Rating high to low
- Fastest delivery
- Cost low to high
- Cost high to low

Filters:

- Pure Veg
- Rating 4+
- Offers
- Fast Delivery
- Under ₹250

---

# 5. RESTAURANT DETAIL

Build a complete storefront:

- hero image
- restaurant name
- rating
- review count
- cuisine
- address
- delivery ETA
- distance
- delivery fee
- offers
- bookmark
- share
- menu category tabs

Sections:

- Recommended
- Bestsellers
- Starters
- Main Course
- Biryani
- Pizza
- Burgers
- Desserts
- Beverages

Every food item must have a functional ADD button.

---

# 6. FOOD DETAIL / CUSTOMIZATION

Show:

- image
- name
- rating
- description
- price
- veg/non-veg
- quantity
- add-ons
- special instructions
- dynamic total

Example add-ons:

- Extra Cheese +₹30
- Extra Paneer +₹40
- Extra Sauce +₹20
- Extra Chicken +₹60

ADD TO CART must work and update the global cart state.

---

# 7. GLOBAL CART BAR

When cart has items, show a sticky bottom bar:

`2 items   ₹438   View Cart`

It must update live and open CartScreen.

---

# 8. CART

Support:

- quantity +/-
- remove
- clear cart
- item customization summary
- coupon input
- coupon removal
- bill breakdown

Formula:

`Grand Total = Subtotal + Delivery Fee + GST - Discount`

Default delivery fee: `₹30`.

Coupons:

- `OBLIQ10` = 10% off
- `FOOD20` = 20% off
- `WELCOME` = ₹100 off
- `FREEDELIVERY` = ₹0 delivery

Never allow negative totals.

---

# 9. OFFERS

Create complete coupon cards with:

- code
- discount
- minimum order
- expiry-style metadata
- Copy
- Apply

Application must update CouponProvider and Cart totals.

---

# 10. CHECKOUT

Include:

### Address

- Home
- Work
- Other
- Add Address

### Delivery instructions

- Leave at door
- Call on arrival
- Avoid calling
- Custom note

### Payment

- UPI
- Card
- Obliq Wallet
- Cash on Delivery

Selection must visibly update.

Place Order must:

1. validate cart
2. show loading
3. create an order
4. update OrderProvider
5. clear cart appropriately
6. navigate to tracking/confirmation

---

# 11. ORDER TRACKING

Stages:

- Order Placed
- Confirmed
- Preparing
- Out for Delivery
- Delivered

Show:

- order ID
- restaurant
- items
- total
- ETA
- driver card
- contact actions
- map-style local placeholder
- progress indicator

Provide a working mock `Advance Status` control.

---

# 12. ORDERS / REORDER / REVIEW

Show active and past orders.

Actions:

- View Details
- Reorder
- Rate Meal

Reorder must repopulate the cart.

Review dialog:

- 1–5 stars
- review tags
- text review
- submit
- success feedback

---

# 13. FAVORITES

Support:

- favorite restaurants
- favorite food
- bookmark toggle
- empty state
- discovery CTA

Use FavoritesProvider.

---

# 14. NOTIFICATIONS

Create Notification Center with:

- All
- Orders
- Offers
- Updates

Support:

- unread badge
- open/read
- mark all read

---

# 15. PROFILE

Implement functional:

- profile information
- My Orders
- Favorites
- Saved Addresses
- Payment Methods
- Offers
- Notifications
- Help & Support
- Terms
- Privacy
- About
- Dark Mode
- Logout

No dead rows.

---

# 16. DARK MODE

Light and dark themes must work across:

- Home
- Search
- Restaurant
- Food
- Cart
- Checkout
- Tracking
- Orders
- Offers
- Favorites
- Notifications
- Profile
- Dining
- Market
- dialogs
- bottom sheets
- navigation

No unreadable text or contrast problems.

---

# 17. DINING

If present, complete it fully.

Flow:

`Dining → Restaurant → Date → Time → Guests → Confirm → Success`

Show:

- dining places
- cuisine
- ratings
- distance
- offers
- table availability
- booking confirmation

---

# 18. QUICK MARKET

Complete the existing market feature.

Categories:

- Milk
- Bread
- Eggs
- Fruits
- Snacks
- Beverages
- Personal Care
- Household

Every item needs:

- image/placeholder
- price
- quantity
- ETA
- ADD

No blank market screen.

---

# 19. UNIQUE OBLIQ FEATURES

Add these where compatible:

### Smart Recommendations

`Recommended for You`

### Healthy Mode

Prioritize:

- salads
- protein meals
- lower-calorie food
- less-oil food
- healthy beverages

### Budget Mode

`Best Meals Under ₹250`

### Group Order Mock

- Start Group Order
- Generate local code
- Join Group
- Shared local cart

### Meal Bundles

- Student Combo
- Office Lunch
- Family Combo
- 2 People Combo

Every unique feature must have a functional local flow.

---

# 20. BOTTOM NAVIGATION

Use five primary tabs:

- Home / Delivery
- Under ₹250 / Offers
- Dining
- Quick Market
- Profile

Orders, Favorites, Notifications, etc. must remain easily accessible from Home/Profile.

Navigation must preserve state and avoid duplicate stacks.

---

# 21. VISUAL SYSTEM

Use the reference images as visual direction.

Characteristics:

- search-first layout
- rounded search field
- horizontal discovery rails
- rounded restaurant cards
- clear ratings
- strong section hierarchy
- compact metadata
- horizontal filter chips
- polished sticky cart
- modern bottom navigation
- subtle shadows
- 8/12/16/20/24 spacing rhythm

OBLIQ branding:

Primary:

`#0B8F55`

Optional accent:

`#FF5722`

Do not copy Zomato logo or proprietary branding.

---

# 22. IMAGE SAFETY / RELIABILITY

Do not allow broken network images.

If remote images are unavailable, use:

- bundled assets
- local placeholders
- gradients
- food/category illustrations

Every card must remain visually complete.

---

# 23. DATA REQUIREMENTS

Provide enough data so no page feels empty.

Minimum:

- 20 restaurants
- 60 food items
- 14 categories
- 10 offers
- 10 notifications
- 5 sample orders
- 5 dining places
- 20 market products

Use Indian/Jodhpur-oriented content and realistic ₹ prices.

---

# 24. PROVIDERS

Reuse and complete:

- CartProvider
- CouponProvider
- FavoritesProvider
- LocationProvider
- NotificationProvider
- OrderProvider
- SearchProvider
- DiningProvider
- HealthyModeProvider
- MembershipProvider

Avoid duplicate state sources.

---

# 25. BLANK SCREEN AUDIT

Every screen must have:

- content
- loading state where needed
- empty state
- error/fallback state where relevant
- actionable CTA

Examples:

`Your cart is empty → Explore Restaurants`

Never show an empty white/black page.

---

# 26. DEAD BUTTON AUDIT

Test every:

- button
- icon
- chip
- card
- tab
- banner
- bookmark
- share
- filter
- payment option
- location option
- navigation action

Every action must either navigate, mutate state, open a dialog/sheet, or show meaningful feedback.

---

# 27. RESPONSIVE / OVERFLOW QA

Prevent:

- RenderFlex overflow
- clipped text
- keyboard overlap
- bottom navigation overlap
- oversized controls
- unsafe-area problems

Use SafeArea, Flexible, Expanded, ListView, SingleChildScrollView, and LayoutBuilder appropriately.

---

# 28. ANDROID BACK

Verify:

- detail → back → previous
- modal → back → close
- search → back → previous
- checkout → back → cart
- tracking → back → orders

No accidental app exit.

---

# 29. ERROR HANDLING

Handle:

- empty cart
- invalid coupon
- no search result
- missing address
- missing payment
- invalid quantity
- repeated Place Order
- duplicate taps

Use SnackBar/Dialog feedback.

---

# 30. TESTS

Maintain/create tests for:

### Cart
- add
- remove
- quantity
- subtotal
- GST
- delivery
- coupon
- grand total

### Favorites
- toggle

### Search
- query
- recent search
- filters

### Orders
- create
- status progression
- reorder

### Notifications
- unread
- mark read
- mark all read

### Location
- select location

### Coupons
- valid
- invalid
- remove

---

# 31. FINAL CODE AUDIT

Search for:

`TODO`
`FIXME`
`Coming Soon`
`Lorem ipsum`
`USD`
`$15`
`$5.00`
broken placeholder strings

Remove or replace all inappropriate occurrences.

---

# 32. REQUIRED COMMANDS

Run from the project:

```powershell
cd R:\Inernship\WebDevelopment\Project\obliq_food_delivery_flutter

C:\srclutterinlutter.bat clean

C:\srclutterinlutter.bat pub get

C:\srclutterinlutter.bat analyze

C:\srclutterinlutter.bat test

C:\srclutterinlutter.bat build apk --release
```

Verify:

`buildpp\outputslutter-apkpp-release.apk`

---

# 33. ADB QA

Run the available platform-tools:

```powershell
adb devices
```

If a device exists:

- install APK
- launch
- test startup
- Home
- Search
- Restaurant
- Food Detail
- Cart
- Checkout
- Tracking
- Orders
- Favorites
- Offers
- Notifications
- Profile
- Dark Mode
- Dining
- Market

If no device exists, report exactly:

`PHYSICAL DEVICE TESTING NOT AVAILABLE`

Do not fabricate runtime results.

---

# 34. REQUIRED END-TO-END JOURNEY

This must work:

`Launch → Home → Location → Search → Result → Restaurant → Food → Customize → Add to Cart → Cart → Coupon → Checkout → Address → Payment → Place Order → Tracking → Advance Status → Delivered → Rate Meal → Orders → Reorder`

Also verify:

`Home → Offers`

`Home → Dining`

`Home → Quick Market`

`Home → Favorites`

`Home → Notifications`

`Home → Profile`

---

# 35. ACCEPTANCE CHECKLIST

The implementation is complete only when all are true:

- [ ] Reference-inspired Home UI implemented
- [ ] Search works
- [ ] Location works
- [ ] Discovery cards work
- [ ] Promo banners work
- [ ] Filters work
- [ ] Categories work
- [ ] Restaurant cards work
- [ ] Restaurant detail works
- [ ] Food detail works
- [ ] Customization works
- [ ] Cart works
- [ ] Coupons work
- [ ] Checkout works
- [ ] Payment selection works
- [ ] Order creation works
- [ ] Tracking works
- [ ] Reorder works
- [ ] Reviews work
- [ ] Favorites work
- [ ] Notifications work
- [ ] Profile works
- [ ] Dark mode works
- [ ] Dining works
- [ ] Quick Market works
- [ ] Unique OBLIQ features work
- [ ] No blank screens
- [ ] No dead buttons
- [ ] No placeholder content
- [ ] No unwanted USD
- [ ] ₹ used consistently
- [ ] flutter analyze passes
- [ ] flutter test passes
- [ ] release APK builds successfully

---

# 36. FINAL EXECUTION INSTRUCTION

Do NOT merely describe what should be done.

Actually:

1. Inspect the existing project.
2. Compare the current implementation against this prompt and the supplied reference images.
3. Identify missing/incomplete features.
4. Implement them.
5. Integrate all providers and navigation.
6. Fix UI/UX inconsistencies.
7. Remove blank/dead states.
8. Run tests.
9. Fix every error.
10. Build the release APK.
11. Verify APK output.
12. Run ADB verification if a device is available.
13. Produce a truthful final report.

The final result must be a complete, polished, functional OBLIQ food-delivery application with a high-fidelity modern Indian delivery-app UX inspired by the supplied reference images.

**No blank pages. No dead buttons. No fake features. No unfinished screens. Every important feature must work end-to-end.**
