# OBLIQ FOOD DELIVERY — ZOMATO-STYLE COMPLETE MASTER IMPLEMENTATION PROMPT

## Production UI/UX + Core Feature Parity Specification for Flutter

> **Purpose:** Use this document as the single source of truth for rebuilding the existing OBLIQ Food Delivery Flutter app into a polished, production-style food discovery and ordering application with the **core interaction model, information architecture, density, navigation patterns, and feature depth of a modern Zomato-style app**.
>
> **Reference rule:** Use Zomato only as a functional/UI reference. Keep the product branded as **OBLIQ**. Do not copy Zomato logos, trademarks, proprietary artwork, exact copyrighted text, or scraped images. Match the quality and interaction patterns with original assets and OBLIQ branding.

---

# 1. NON-NEGOTIABLE EXECUTION RULES

You are working on an **existing Flutter project**.

Before changing anything:

1. Inspect the complete project.
2. Read `pubspec.yaml`.
3. Read `lib/main.dart`.
4. Inspect every file under `lib/`.
5. Inspect Android configuration.
6. Identify all currently implemented features.
7. Preserve working functionality unless it conflicts with this specification.
8. Do **not** replace the whole project with a simplified demo.
9. Do **not** create mock buttons that do nothing.
10. Do **not** create `Coming Soon`, `TODO`, `Lorem ipsum`, empty placeholder cards, or dead navigation.
11. Do **not** remove functionality merely because it is difficult to connect.
12. Use realistic local/mock data where no backend exists, but make the complete user flow functional.
13. Every major screen needs populated, empty, loading, and appropriate error states.
14. Every interactive UI element must perform a visible action.
15. All prices must use Indian Rupees (`₹`).
16. Keep the OBLIQ brand.
17. The app must work as a standalone release Android APK without Flutter installed on the phone.
18. Do not introduce localhost, `10.0.2.2`, a PC IP, or a development server as a core dependency.
19. Do not add Git/GitHub requirements.
20. Do not use `flutter run` for the final release workflow.
21. Final deliverable is a release APK generated from the Flutter project.
22. Every future source-code change must be included in a newly generated release APK.

---

# 2. VISUAL REFERENCE — PROVIDED SCREENSHOT

Use the supplied screenshot as the primary visual reference for the Home/Delivery experience.

The screenshot establishes these characteristics:

- White/light background.
- Search-first top section.
- Large rounded search field.
- Green search icon.
- Search placeholder similar in purpose to `Restaurant name or a dish...`.
- Microphone action on the right.
- Separate VEG MODE control.
- Horizontal food-category carousel with large food images.
- Categories such as Sandwich, Sweets, Thali, Paneer and North Indian.
- Horizontal filter chip row.
- Chips such as Filters, Near & Fast, Under ₹200 and Sort.
- Horizontally scrollable restaurant cards.
- Green rating pills.
- Restaurant name, cuisine, delivery time and offer information.
- Large rounded food images.
- `EXPLORE MORE` section.
- Discovery cards such as Offers, Top 10, Food on Train and Collections.
- Promotional section with `TRY NEW DEALS` and `Explore more, save more`.
- Horizontal deal/restaurant cards.
- Discount badges.
- High information density without looking cluttered.
- Rounded cards and strong typography hierarchy.
- Green accent for positive actions, ratings and veg mode.
- Horizontal carousels rather than forcing everything into one vertical list.

**Do not merely make the existing Home screen superficially similar. Rebuild its information hierarchy and interactions.**

---

# 3. PRODUCT GOAL

OBLIQ must feel like a complete modern food-discovery and food-ordering application.

Primary journey:

```text
Launch
  ↓
Location
  ↓
Home / Delivery
  ↓
Search or Browse Category
  ↓
Restaurant Discovery
  ↓
Restaurant Storefront
  ↓
Food Item
  ↓
Customization
  ↓
Add to Cart
  ↓
Cart
  ↓
Coupon
  ↓
Checkout
  ↓
Address
  ↓
Payment
  ↓
Order Placed
  ↓
Live Order Tracking
  ↓
Delivered
  ↓
Rating / Review
  ↓
Order History
  ↓
Reorder
```

Secondary journeys:

```text
Home → Dining → Restaurant → Table Booking
Home → Offers → Deal → Restaurant → Cart
Home → Search → Dish → Restaurant → Cart
Home → Collections → Collection → Restaurant
Home → Top 10 → Restaurant
Home → Favorites → Restaurant
Profile → Orders → Reorder
Profile → Addresses
Profile → Payments
Profile → Notifications
Profile → Help
```

Every journey must be usable end-to-end.

---

# 4. INFORMATION ARCHITECTURE

Implement a modern bottom navigation structure.

Recommended primary navigation:

1. **Delivery**
2. **Dining**
3. **Offers / Under ₹250**
4. **Quick Market**
5. **Profile**

If the existing project has another working structure, preserve it only if it can support all required sections. Do not create duplicate navigation stacks.

The selected tab must:

- show active icon state,
- preserve state where appropriate,
- not reset the user's session unnecessarily,
- never display a blank screen.

---

# 5. HOME / DELIVERY — COMPLETE REBUILD

The Home screen is the most important screen.

## 5.1 Location Header

Create a compact location header with:

- location pin,
- current delivery location,
- area/locality,
- dropdown/chevron,
- profile/avatar,
- notification icon,
- unread notification badge.

Example:

```text
📍 Ratanada, Jodhpur          🔔  👤
     Home
```

Tapping location opens a bottom sheet containing:

- Current location / GPS
- Home
- Work
- Saved addresses
- Add new address
- Change location

GPS behavior must:

- request location permission correctly,
- handle denied permission,
- handle permanently denied permission,
- handle unavailable GPS,
- show useful recovery messages,
- never crash,
- update the selected location.

Do not fake GPS success when permission/service is unavailable.

---

# 6. SEARCH EXPERIENCE

Search must be a major product feature.

## Search bar

Use:

- rounded white container,
- subtle border/shadow,
- green search icon,
- search text,
- microphone icon,
- clear icon when text exists.

Placeholder:

```text
Restaurant name or a dish...
```

## Search screen

### Recent Searches

Examples:

- Biryani
- Pizza
- Thali
- Burger
- Paneer

Support:

- tap to search,
- remove individual history item,
- clear all.

### Trending Searches

Examples:

- Biryani
- Pizza
- Momos
- North Indian
- Cake
- Burger

### Search Results

Search across:

- restaurant names,
- dish names,
- cuisines,
- categories,
- collections.

Example:

```text
Search: paneer

Restaurants
--------------------------------
The Curry House
Punjabi • North Indian
⭐ 4.3 • 30–35 mins

Dishes
--------------------------------
Paneer Butter Masala
₹220
```

Use meaningful result ranking.

---

# 7. FOOD CATEGORY CAROUSEL

Create a horizontally scrollable category rail below the search/header.

Each category contains:

- food image,
- category title,
- tap action.

Minimum categories:

- Sandwich
- Sweets
- Thali
- Paneer
- North Indian
- Biryani
- Pizza
- Burger
- South Indian
- Chinese
- Rolls
- Desserts
- Healthy
- Beverages

Tapping a category opens filtered results. Categories must never be decorative only.

---

# 8. FILTER SYSTEM

Create a horizontal filter chip row.

Required chips:

- Filters
- Near & Fast
- Under ₹200
- Under ₹250
- Rating 4+
- Pure Veg
- Offers
- Fast Delivery
- Sort

`Filters` opens a proper modal/bottom sheet.

Filter groups:

### Delivery
- Fastest
- Under 30 mins
- Under 45 mins

### Rating
- 4.0+
- 4.5+

### Price
- Under ₹150
- Under ₹200
- Under ₹250
- ₹250–₹500
- ₹500+

### Food
- Pure Veg
- Vegetarian options
- Non-veg

### Offers
- Discount
- Free delivery

### Cuisine
- North Indian
- South Indian
- Chinese
- Italian
- Fast Food
- Bakery
- Desserts

### Sort
- Recommended
- Rating
- Delivery time
- Cost: Low to High
- Cost: High to Low

Support apply, reset, multiple selections and visible selected state.

---

# 9. RESTAURANT DISCOVERY FEED

Restaurant cards must contain:

- hero food/restaurant image,
- rating badge,
- restaurant name,
- cuisine,
- price for two,
- delivery time,
- distance,
- offer,
- veg indicator where relevant,
- favorite/bookmark,
- promoted/ad indicator if applicable.

Example:

```text
┌───────────────────────────────┐
│            IMAGE              │
│ ⭐ 4.3                 ♡      │
└───────────────────────────────┘
The Curry House
North Indian • Punjabi
₹350 for two
⏱ 30–35 mins • 2.1 km
⚡ 40% OFF selected items
```

Cards must open restaurant detail.

---

# 10. EXPLORE MORE

Heading:

```text
EXPLORE MORE
```

Cards:

1. Offers
2. Top 10
3. Food on Train
4. Collections
5. Best Rated
6. New Restaurants
7. Healthy Choices
8. Budget Meals

Every card must navigate to a real screen/list.

---

# 11. OFFERS / DEALS

Create a rich promotional feed.

Heading:

```text
TRY NEW DEALS
Explore more, save more
```

Deal cards include:

- restaurant image,
- deal label,
- restaurant name,
- rating,
- delivery time,
- discount,
- pricing context,
- CTA.

Example:

```text
Try new deals

Pizza Palace
⭐ 4.1
30–35 mins
50% OFF select items
```

Tapping a card opens the restaurant/deal detail.

---

# 12. TOP 10

Create a dedicated Top 10 experience.

Possible sections:

- Top restaurants
- Top dishes
- Top biryani
- Top pizza
- Top cafes
- Top budget meals

Ranking cards show rank, image, restaurant, rating, delivery time, cuisine and price.

---

# 13. COLLECTIONS

Create collections such as:

- Best Biryani in Jodhpur
- Romantic Dinner
- Best Cafes
- Late Night Food
- Family Restaurants
- Budget Friendly
- Pure Veg
- Street Food
- Desserts
- Healthy Food

Collection page includes hero/banner, title, description, restaurant list and sorting/filtering.

---

# 14. RESTAURANT DETAIL / STOREFRONT

Top section:

- large hero image,
- restaurant image/logo,
- restaurant name,
- rating,
- review count,
- delivery time,
- cost for two,
- cuisine,
- address,
- distance,
- favorite,
- share.

Actions:

- Order Online
- View Menu
- Reviews
- Directions
- Call
- Share

Menu tabs:

```text
Recommended
Bestsellers
Starters
Main Course
Biryani
Breads
Desserts
Beverages
```

Food menu cards:

- image,
- name,
- veg/non-veg marker,
- description,
- rating where available,
- price,
- ADD button,
- customization indicator.

---

# 15. FOOD DETAIL / CUSTOMIZATION

For customizable items use a bottom sheet/detail page.

Support quantity:

```text
−   1   +
```

Add-ons:

```text
Extra Cheese        +₹40
Extra Paneer        +₹60
Extra Sauce         +₹20
```

Variants:

```text
Regular
Medium
Large
```

Instructions:

```text
Add cooking instructions
```

Calculate live:

```text
Base item
+ Add-ons
× Quantity
----------------
Total
```

CTA:

```text
Add item • ₹XXX
```

---

# 16. VEG MODE

VEG MODE must be a real global filter.

When ON:

- hide non-veg dishes,
- hide non-veg-only options where applicable,
- update menus,
- update search results,
- update category results.

When OFF, restore eligible results.

Persist session state and make ON/OFF visually obvious.

---

# 17. FAVORITES

Support:

- favorite restaurants,
- favorite dishes,
- add/remove,
- favorites screen,
- empty state,
- open restaurant.

Empty state:

```text
No favorites yet
Save restaurants and dishes you love.
[Explore restaurants]
```

---

# 18. CART

Cart must be production-style.

Display:

- restaurant name,
- items,
- quantity controls,
- customization,
- item price,
- remove,
- add more items,
- special instructions.

Bill:

```text
Item total
Delivery fee
Platform fee
Taxes
Discount
--------------------------------
To Pay
```

Support coupon, remove coupon, quantity changes, remove item, clear cart and continue shopping.

Floating cart bar on Home appears only when cart has items.

---

# 19. COUPONS

Implement a real calculation-based coupon system.

Example coupons:

```text
OBLIQ10
10% OFF

FOOD20
20% OFF

WELCOME
₹100 OFF

FREEDELIVERY
Free Delivery
```

Show code, benefit, minimum order if applicable, validity, apply state and error state.

Never display a discount without recalculating the bill.

---

# 20. CHECKOUT

Checkout must include:

## Address

- Home
- Work
- Other
- Add new address
- Change address

## Delivery Instructions

- Leave at door
- Avoid calling
- Call on arrival

## Payment

Provide UI for:

- UPI
- Card
- Cash on Delivery
- Obliq Wallet

Selection must visibly change.

## Order Summary

Show restaurant, items, fees, discount and final amount.

CTA:

```text
Place Order • ₹XXX
```

---

# 21. ORDER TRACKING

After placing an order:

```text
Order Placed
     ↓
Restaurant Confirmed
     ↓
Preparing
     ↓
Picked Up
     ↓
Out for Delivery
     ↓
Delivered
```

Include order number, restaurant, items, total, ETA, address, delivery partner card and call/chat UI.

For offline/mock mode, implement a local status simulator. Each advance action moves to the next valid status.

---

# 22. ORDER HISTORY

Tabs:

- Active
- Past

Each order shows restaurant, date, items, amount, status, reorder, rate and details.

Reorder must recreate compatible cart items and open Cart.

---

# 23. REVIEWS & RATINGS

After delivery:

```text
Rate your order
★★★★★
```

Support:

- overall rating,
- food rating,
- delivery rating,
- comment,
- submit.

Save review in local state.

---

# 24. DINING EXPERIENCE

Dining must be a real section.

Dining home:

- search,
- nearby dining,
- top restaurants,
- offers,
- cuisines,
- collections.

Restaurant dining detail:

- images,
- rating,
- cuisine,
- price,
- opening hours,
- address,
- availability,
- offers.

Booking flow:

```text
Select restaurant
 ↓
Select date
 ↓
Select time
 ↓
Select guests
 ↓
Select table/time slot
 ↓
Confirm booking
```

Show booking ID and confirmation details.

---

# 25. QUICK MARKET

If retained, make it usable rather than decorative.

Categories:

- Fruits
- Vegetables
- Dairy
- Snacks
- Drinks
- Bakery
- Household
- Personal Care

Product cards include image, name, pack size, price, MRP, discount and ADD.

Provide a real market cart and total calculation.

---

# 26. PROFILE

Profile should include:

### Orders
- My Orders

### Saved
- Favorites
- Collections

### Account
- Saved Addresses
- Payment Methods
- Notifications

### Preferences
- Veg Mode
- Dark Mode
- Language

### Support
- Help Center
- Contact Support
- Terms
- Privacy

### Logout

Every item must work.

---

# 27. NOTIFICATIONS

Categories:

- Offers
- Orders
- Payments
- Dining
- General

Support unread badge, open, mark read, mark all read and clear where appropriate.

---

# 28. LOCATION SYSTEM

Use `geolocator`/`geocoding` only when genuinely needed.

Android behavior must correctly handle:

- permission request,
- denied permission,
- permanently denied permission,
- disabled location service,
- unavailable location,
- recovery/open-settings action.

Do not claim real GPS coordinates when unavailable.

Location must update Home and checkout context.

---

# 29. UI DESIGN SYSTEM

Use Material 3 or a clean custom system.

Primary OBLIQ green:

```text
#0B8F55
```

Optional OBLIQ orange accent may be used.

Do not copy Zomato's logo or trademarked branding.

Use a modern readable font, clear typography hierarchy, rounded cards, subtle borders/shadows and an 8-point spacing system:

```text
4 / 8 / 12 / 16 / 20 / 24 / 32
```

Interactive elements must have comfortable touch targets.

---

# 30. FINAL HOME LAYOUT

The final Home screen should approximately follow:

```text
STATUS BAR

LOCATION HEADER
[Location]                      [Bell] [Profile]

SEARCH
[ 🔍 Restaurant name or a dish... 🎙 ]

VEG MODE
                [ ON/OFF ]

FOOD CATEGORIES
[Sandwich] [Sweets] [Thali] [Paneer] [North Indian] ...

FILTERS
[Filters] [Near & Fast] [Under ₹200] [Sort] [Rating] ...

RESTAURANTS
Restaurant cards
Restaurant cards
Restaurant cards

EXPLORE MORE
[Offers] [Top 10] [Food on Train] [Collections] ...

TRY NEW DEALS
Explore more, save more

Deal cards
Deal cards
Deal cards

TOP RESTAURANTS / RECOMMENDED
Restaurant feed

FLOATING CART BAR if cart has items

BOTTOM NAVIGATION
```

Use vertical scrolling and horizontal carousels.

---

# 31. RESPONSIVE UI

Test common Android phone sizes.

Avoid:

- text overflow,
- clipped cards,
- bottom-nav overlap,
- horizontal overflow,
- keyboard covering fields,
- distorted images.

Use responsive constraints, not fixed screen coordinates.

---

# 32. DARK MODE

Dark mode must cover the entire app:

- background,
- cards,
- text,
- search,
- navigation,
- dialogs,
- bottom sheets,
- restaurant pages,
- cart,
- checkout.

No unreadable text or low-contrast controls.

---

# 33. STATE MANAGEMENT

Prefer the existing Provider architecture where appropriate.

Recommended domains:

```text
CartProvider
FavoritesProvider
OrderProvider
LocationProvider
NotificationProvider
SearchProvider
DiningProvider
HealthyModeProvider / VegModeProvider
MembershipProvider
```

Do not create duplicate providers for one responsibility. Keep models separate from UI.

---

# 34. DATA MODELS

Restaurant:

```text
id
name
image
cuisines
rating
reviewCount
priceForTwo
deliveryTime
distance
isVeg
hasOffer
offerText
categories
address
```

Food:

```text
id
restaurantId
name
description
image
price
isVeg
isBestseller
category
addons
variants
```

Order:

```text
id
restaurantId
items
subtotal
deliveryFee
platformFee
tax
discount
total
address
paymentMethod
status
createdAt
```

Use realistic Indian/Jodhpur-oriented sample data while keeping architecture reusable.

---

# 35. OFFLINE / MOCK MODE

For the standalone APK:

- use local mock data,
- use Provider/local state,
- no mandatory backend,
- no localhost,
- no development server.

Structure code so a future REST/Firebase/Spring Boot backend can replace repositories without rewriting all UI.

---

# 36. LOADING / EMPTY / ERROR STATES

Every major list needs a loading state and meaningful empty/error states.

Example empty state:

```text
No restaurants found
Try changing your filters or location.
[Reset Filters]
```

Example error state:

```text
Something went wrong
[Try Again]
```

Never show a blank white screen as a state.

---

# 37. ACCESSIBILITY

Provide:

- semantic labels for icons,
- readable contrast,
- usable touch targets,
- meaningful labels for critical actions.

---

# 38. PERFORMANCE

Avoid excessive rebuilds, huge unbounded images, unnecessary nested scroll views and unnecessary provider notifications.

Use `const` where useful, lazy lists, constrained images and efficient builders.

---

# 39. ASSET RULES

Use original or properly licensed assets.

Do not scrape or package Zomato images, logos, trademarks or proprietary promotional artwork.

The goal is a premium food-discovery experience inspired by the reference, while OBLIQ remains the brand.

---

# 40. SEARCH / FILTER ACCEPTANCE TESTS

Verify:

```text
Search "pizza"
→ pizza restaurants/dishes

Search "biryani"
→ biryani restaurants/dishes

Tap Thali
→ thali results

Tap Under ₹200
→ matching restaurants/items

Tap Rating 4+
→ matching restaurants

Enable Pure Veg
→ non-veg results removed

Reset
→ original results restored
```

---

# 41. CART ACCEPTANCE TESTS

Verify:

```text
Restaurant
→ ADD
→ Cart

Increase quantity
→ total increases

Decrease quantity
→ total decreases

Add addon
→ item total increases

Remove item
→ item disappears

Apply FOOD20
→ discount appears

Remove coupon
→ discount disappears

Checkout
→ address + payment

Place Order
→ order tracking
```

---

# 42. ORDER ACCEPTANCE TEST

Verify:

```text
Place Order
→ Placed

Advance
→ Confirmed

Advance
→ Preparing

Advance
→ Picked Up

Advance
→ Out for Delivery

Advance
→ Delivered

Rate
→ Review saved

Reorder
→ Cart populated
```

---

# 43. DINING ACCEPTANCE TEST

```text
Dining
→ Restaurant
→ Date
→ Time
→ Guests
→ Confirm
→ Booking confirmation
```

---

# 44. PROFILE ACCEPTANCE TEST

```text
Profile
→ Orders
→ Favorites
→ Addresses
→ Payments
→ Notifications
→ Dark Mode
→ Veg Mode
→ Support
```

No menu item may be decorative.

---

# 45. CODE QUALITY AUDIT

Search the project for:

```text
TODO
FIXME
Coming Soon
Lorem ipsum
dummy
placeholder
onPressed: null
onTap: null
USD
```

For `$`, distinguish Dart string interpolation from currency. Currency displayed to users must be INR.

Also audit for:

- unreachable routes,
- empty callbacks,
- hard-coded broken navigation,
- fake success messages,
- development URLs,
- debug-only UI.

---

# 46. NAVIGATION AUDIT

Verify every relevant route:

```text
Home
Search
Category
Restaurant
Food Detail
Cart
Checkout
Order Tracking
Orders
Favorites
Offers
Top 10
Collections
Dining
Dining Restaurant
Booking
Quick Market
Market Cart
Notifications
Profile
Addresses
Payments
Support
```

Every route must open correctly and have a usable back/navigation path.

---

# 47. RELEASE BUILD

Run:

```powershell
C:\src\flutter\bin\flutter.bat clean
C:\src\flutter\bin\flutter.bat pub get
C:\src\flutter\bin\flutter.bat analyze
C:\src\flutter\bin\flutter.bat test
C:\src\flutter\bin\flutter.bat build apk --release
```

Do **not** use `flutter run` as the final release workflow.

---

# 48. APK REQUIREMENTS

Final APK:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Verify:

- file exists,
- release build,
- package ID = `com.obliq.fooddelivery`,
- versionName valid,
- versionCode valid,
- size recorded,
- installable,
- no development server required,
- Flutter is not required on the phone,
- PC/USB is not required after installation.

Use compatible Android versioning, e.g.:

```text
1.0.0 / 1
1.0.1 / 2
1.0.2 / 3
```

A newer APK should update an existing installation when application ID and signing remain compatible.

---

# 49. DO NOT CLAIM AUTOMATIC CODE UPDATES

Changing Flutter source code does not automatically change an already-installed standalone APK.

Correct release model:

```text
Source changes
      ↓
Build new release APK
      ↓
Transfer/download new APK
      ↓
Install update
      ↓
New features appear
```

Do not falsely report automatic code updates for a normal APK.

---

# 50. FINAL QA CHECKLIST

## UI

- [ ] Home matches supplied visual reference in structure and density
- [ ] Search is prominent
- [ ] Location is visible and functional
- [ ] Veg Mode works
- [ ] Category carousel works
- [ ] Filters work
- [ ] Restaurant cards work
- [ ] Explore More works
- [ ] Deals work
- [ ] Bottom navigation works

## Delivery

- [ ] Search
- [ ] Categories
- [ ] Filters
- [ ] Restaurant
- [ ] Food
- [ ] Customization
- [ ] Cart
- [ ] Coupons
- [ ] Checkout
- [ ] Payment
- [ ] Tracking
- [ ] Orders
- [ ] Reorder
- [ ] Review

## Dining

- [ ] Discovery
- [ ] Restaurant
- [ ] Date
- [ ] Time
- [ ] Guests
- [ ] Booking
- [ ] Confirmation

## Profile

- [ ] Orders
- [ ] Favorites
- [ ] Addresses
- [ ] Payments
- [ ] Notifications
- [ ] Preferences
- [ ] Dark mode
- [ ] Veg mode
- [ ] Support

## Technical

- [ ] No TODO/FIXME
- [ ] No dead buttons
- [ ] No blank screens
- [ ] No placeholder text
- [ ] No USD currency
- [ ] No localhost dependency
- [ ] No development-server dependency
- [ ] `flutter analyze` passes
- [ ] `flutter test` passes
- [ ] release APK builds
- [ ] package ID verified
- [ ] APK path verified

---

# 51. EXECUTE — DO NOT ONLY WRITE A PLAN

Do not stop after describing what should be done.

Actually implement the changes in the existing Flutter project.

Work in this order:

```text
1. Inspect existing project
        ↓
2. Map implementation against this specification
        ↓
3. Identify missing/weak features
        ↓
4. Implement Home/Delivery first
        ↓
5. Implement Search + Filters
        ↓
6. Implement Restaurant + Food
        ↓
7. Implement Cart + Coupons + Checkout
        ↓
8. Implement Tracking + Orders + Reviews
        ↓
9. Implement Dining
        ↓
10. Implement Offers + Top 10 + Collections
        ↓
11. Implement Profile + Notifications
        ↓
12. Implement Quick Market if retained
        ↓
13. Fix location/GPS
        ↓
14. Fix responsive UI
        ↓
15. Audit dead buttons/placeholders
        ↓
16. flutter analyze
        ↓
17. flutter test
        ↓
18. build release APK
        ↓
19. Verify APK
        ↓
20. Generate final QA report
```

Do not claim a feature is complete merely because a Dart file exists. Verify the actual behavior and user flow from the implementation.

If an existing feature is incomplete, modify it.

If an existing feature conflicts with this specification, prioritize this specification while preserving OBLIQ branding and valid existing architecture.

---

# 52. FINAL REPORT FORMAT

After implementation, report:

```text
OBLIQ ZOMATO-STYLE IMPLEMENTATION COMPLETE

Home UI: PASS / FAIL
Search: PASS / FAIL
Categories: PASS / FAIL
Filters: PASS / FAIL
Restaurant: PASS / FAIL
Food customization: PASS / FAIL
Cart: PASS / FAIL
Coupons: PASS / FAIL
Checkout: PASS / FAIL
Order tracking: PASS / FAIL
Orders/Reorder: PASS / FAIL
Reviews: PASS / FAIL
Dining: PASS / FAIL
Offers: PASS / FAIL
Top 10: PASS / FAIL
Collections: PASS / FAIL
Favorites: PASS / FAIL
Notifications: PASS / FAIL
Profile: PASS / FAIL
Location/GPS: PASS / FAIL
Dark mode: PASS / FAIL
Veg mode: PASS / FAIL
Flutter analyze: PASS / FAIL
Flutter tests: PASS / FAIL
Release APK: PASS / FAIL

APK path:
<exact path>

APK size:
<size>

Package ID:
com.obliq.fooddelivery

Version:
<version>

Remaining limitations:
<only genuine limitations>
```

---

# 53. MOST IMPORTANT REQUIREMENT

The current application shown in the supplied screenshot is **not sufficient merely because it has a search bar, categories, filters, and restaurant cards**.

The target is a complete food-discovery/order product experience.

The implementation must provide:

```text
DISCOVER
SEARCH
FILTER
COMPARE
OPEN RESTAURANT
VIEW MENU
CUSTOMIZE FOOD
ADD TO CART
USE COUPON
CHECKOUT
PAY
TRACK
DELIVER
RATE
REORDER
FAVORITE
DISCOVER DEALS
EXPLORE COLLECTIONS
BOOK DINING
MANAGE PROFILE
```

The final application should feel like a **serious, polished, modern Indian food-delivery application inspired by the interaction patterns of Zomato**, while remaining clearly branded as **OBLIQ** and using original assets/content.

**Do not produce a superficial clone. Implement the complete product flow.**
