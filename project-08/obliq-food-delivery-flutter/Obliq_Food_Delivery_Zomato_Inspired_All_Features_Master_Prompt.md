# OBLIQ FOOD DELIVERY — ZOMATO-INSPIRED HIGH-FIDELITY MASTER IMPLEMENTATION PROMPT
## Single Master Prompt for Antigravity / Gemini — Complete UI, UX, Features, Interactions, Data, QA and APK

> **Execution mode:** Autonomous implementation.  
> **Target:** Existing Flutter project `obliq_food_delivery_flutter`.  
> **Primary goal:** Transform the current Obliq app into a polished, production-style Indian food-discovery and delivery experience closely matching the **layout language, information hierarchy, interaction patterns, density, spacing and visual polish** shown in the supplied Zomato reference screenshots, while keeping **OBLIQ** as the original brand.  
> **Important:** Do not copy Zomato logos, trademarks, proprietary artwork, exact text, or branded assets. Recreate the UX patterns and visual structure with original Obliq branding/assets.

---

# 0. NON-NEGOTIABLE EXECUTION RULE

You are Antigravity operating as a senior Flutter product engineer, UI/UX designer, QA engineer and release engineer.

**Do not merely create a report. Actually modify the existing project.**

You must:

1. Inspect the complete existing Flutter project first.
2. Preserve working functionality unless a replacement is clearly superior.
3. Reuse existing models/providers where possible.
4. Create missing providers/models/screens/widgets/services.
5. Implement every feature in this document.
6. Ensure every visible button, card, chip, icon, banner, tab and menu performs a meaningful action.
7. Never leave a blank page.
8. Never leave a dead button.
9. Never use placeholder text such as `TODO`, `Coming Soon`, `Lorem ipsum`, or empty containers for a required feature.
10. If a real backend is unavailable, implement a realistic local/mock data flow with Provider and deterministic seeded data.
11. Do not add Firebase, Supabase, external APIs or a database unless the existing project already requires them.
12. Keep the app APK frontend-only and functional offline after build.
13. Use INR (`₹`) everywhere.
14. Use Indian/Jodhpur data throughout the demo experience.
15. Make the UI responsive for common Android phone sizes.
16. Avoid horizontal overflow and RenderFlex overflow.
17. Respect accessibility: readable text, adequate touch targets, contrast and semantic labels.
18. Run `flutter pub get`, `flutter analyze`, `flutter test`, and `flutter build apk --release`.
19. If an Android device is available through ADB, install and smoke-test the APK.
20. Fix every error discovered before declaring completion.

---

# 1. REFERENCE SCREENSHOT ANALYSIS

Two supplied 720×1600 screenshots are the visual reference.

## Reference A — Discovery / Deals screen

The reference contains:

- Android status-bar area.
- Large rounded search field.
- Green search icon.
- Search placeholder similar to “Restaurant name or a dish...”.
- Microphone action.
- VEG MODE switch at upper-right.
- Circular/food-image category rail.
- Categories such as Sandwich, Sweets, Thali, Paneer, North Indian.
- Horizontal filter rail.
- Filters button.
- Near & Fast chip.
- Under ₹200 chip.
- More filters horizontally scrollable.
- Restaurant cards.
- Rating badge.
- ETA.
- Large “EXPLORE MORE” discovery section.
- Square feature cards:
  - Offers
  - Top 10
  - Food on train
  - Collections
- Promotional deals section.
- Light lavender promotional background.
- “TRY NEW DEALS” eyebrow.
- “Explore more, save more” heading.
- Percentage/deal visual.
- Horizontal restaurant deal cards.
- Restaurant image.
- Offer badge.
- Rating.
- Restaurant name.
- ETA.
- Offer information.

## Reference B — Main food discovery home

The reference contains:

### Header
- Location icon.
- Location title.
- Down arrow.
- Secondary address.
- Membership/premium pill.
- Wallet/payment shortcut.
- Circular profile avatar.
- VEG MODE switch.

### Search
- Large white rounded search box.
- Search icon.
- Search text/query.
- Divider.
- Microphone icon.

### Hero promotion
- Large edge-to-edge promotional banner.
- Premium/gold-style membership promotion.
- CTA.
- Pagination dots.
- Warm gradient/background.
- Decorative confetti.
- Banner carousel.

### Category rail
- “Meals under ₹250” discovery card.
- All.
- Pizza.
- Sandwich.
- Sweets.
- Food image above each label.
- Active category indicator.

### Filters
- Filters.
- Near & Fast.
- Under ₹200.
- Additional horizontally scrollable filters.

### Restaurant listing
- “RECOMMENDED FOR YOU”.
- 3-column compact visual density on larger layouts / horizontally scrollable cards on narrow phones.
- Offer badge at image top.
- Rating pill.
- Restaurant name.
- Lightning/fast-delivery indicator.
- ETA.
- Multiple rows of restaurants.

### Bottom navigation
The reference shows a floating pill-style navigation area with:
- Delivery
- Under ₹250
- Dining
- an external/partner-style shortcut.

For OBLIQ:
- Delivery
- Under ₹250
- Dining
- Obliq Market / Quick Shop
- Profile or More

Do not use the Blinkit name/logo.

---

# 2. DESIGN DIRECTION

## Brand

Brand name: **OBLIQ**

Primary brand color:
- Obliq Green: `#0B8F55` / use a consistent accessible green token.

Supporting colors:
- Deep charcoal: `#202124`
- Muted gray: `#70757D`
- Background: `#FFFFFF`
- Soft gray: `#F7F7F7`
- Deal lavender: `#F5F0FF`
- Deal purple: `#7250B8`
- Success green: `#0B8F55`
- Warning amber: `#F4B400`
- Error red: `#D93025`

Do not hard-code colors across individual widgets. Put all colors in `ObliqTheme`.

## Typography

Use a modern rounded/system-friendly font.

Hierarchy:

- Hero headline: 26–32 px, bold.
- Section heading: 20–24 px, semibold.
- Section eyebrow: 13–15 px, letter spacing 2–3.
- Restaurant title: 16–19 px, semibold.
- Body: 14–16 px.
- Secondary: 12–14 px.
- Prices: semibold/bold.
- ETA: medium.

## Shape

- Search field radius: 18–24.
- Restaurant image radius: 14–18.
- Feature card radius: 16–20.
- Chips: 12–18.
- Bottom navigation: 28–34.
- Buttons: 14–18.

## Shadows

Use very subtle shadows only:
- low elevation cards
- medium elevation floating cart/navigation
- avoid excessive Material shadows.

## Spacing

Use an 8-point grid:
8 / 12 / 16 / 20 / 24 / 32.

---

# 3. PROJECT ARCHITECTURE

Use:

```text
lib/
  main.dart

  models/
    restaurant.dart
    food_item.dart
    cart_item.dart
    order.dart
    address.dart
    coupon.dart
    review.dart
    notification.dart
    collection.dart
    dining_place.dart
    delivery_partner.dart
    healthy_profile.dart
    subscription.dart
    discovery_item.dart

  providers/
    cart_provider.dart
    favorites_provider.dart
    order_provider.dart
    search_provider.dart
    location_provider.dart
    notification_provider.dart
    coupon_provider.dart
    veg_mode_provider.dart
    healthy_mode_provider.dart
    discovery_provider.dart
    dining_provider.dart
    schedule_provider.dart
    membership_provider.dart
    address_provider.dart
    payment_provider.dart
    review_provider.dart
    theme_provider.dart

  mock_data/
    mock_food_data.dart
    mock_restaurant_data.dart
    mock_discovery_data.dart
    mock_offer_data.dart
    mock_dining_data.dart
    mock_collection_data.dart
    mock_notification_data.dart

  screens/
    main_navigation_screen.dart

    home/
      home_screen.dart

    search/
      search_screen.dart
      search_results_screen.dart

    restaurant/
      restaurant_detail_screen.dart

    food/
      food_detail_screen.dart

    cart/
      cart_screen.dart

    checkout/
      checkout_screen.dart

    orders/
      orders_screen.dart

    tracking/
      order_tracking_screen.dart

    offers/
      offers_screen.dart

    favorites/
      favorites_screen.dart

    notifications/
      notifications_screen.dart

    profile/
      profile_screen.dart

    discovery/
      collections_screen.dart
      top_restaurants_screen.dart
      food_on_train_screen.dart
      gourmet_screen.dart
      party_planner_screen.dart

    healthy/
      healthy_mode_screen.dart
      healthy_profile_screen.dart

    schedule/
      schedule_order_screen.dart

    dining/
      dining_home_screen.dart
      dining_detail_screen.dart
      dining_booking_screen.dart

    membership/
      obliq_plus_screen.dart

    gift/
      gift_cards_screen.dart

    market/
      obliq_market_screen.dart

  widgets/
    app_search_bar.dart
    location_header.dart
    veg_mode_switch.dart
    category_rail.dart
    filter_chip_rail.dart
    hero_carousel.dart
    discovery_card.dart
    restaurant_card.dart
    compact_restaurant_card.dart
    food_card.dart
    deal_card.dart
    offer_badge.dart
    rating_badge.dart
    eta_badge.dart
    floating_cart_bar.dart
    bottom_nav_bar.dart
    section_header.dart
    empty_state.dart
    loading_skeleton.dart
    error_state.dart
    image_placeholder.dart
    price_breakdown_card.dart
    coupon_card.dart
    review_card.dart
    quantity_stepper.dart
    add_button.dart
    custom_button.dart

  theme/
    obliq_theme.dart
```

---

# 4. MAIN APP SHELL

Implement a polished shell.

## Bottom navigation

Primary tabs:

1. Delivery
2. Under ₹250
3. Dining
4. Obliq Market
5. Profile

Requirements:

- Animated active state.
- Floating/pill container.
- Correct selected icon.
- Badge support.
- Cart overlay must not hide navigation.
- State preserved between tabs.
- Back navigation works correctly.

---

# 5. HOME SCREEN — HIGHEST PRIORITY

The Home screen must visually follow the supplied references as closely as possible while remaining OBLIQ-branded.

## 5.1 Header

Implement:

```text
[Location icon] Roop Nagar ▼       [OBLIQ+] [Wallet] [Avatar]
Rawat Nagar, Jodhpur, Rajasthan...
```

Location is interactive.

Opening it shows:

- Current location
- Home
- Work
- Saved addresses
- Use current location
- Add new address

Demo locations:

- Roop Nagar
- Ratanada
- Rawat Nagar
- Shastri Nagar
- Paota
- Sardarpura

## 5.2 VEG MODE

Global toggle.

When enabled:

- Only vegetarian dishes/restaurants appear in discovery lists.
- Restaurant detail filters accordingly.
- Search results filter accordingly.
- Cart remains unchanged.
- Toggle state persists during session.

Add subtle green active animation.

---

# 6. SEARCH BAR

Search is a core experience.

Placeholder rotation:

- Restaurant name or a dish...
- Search “pizza”
- Search “biryani”
- Search “thali”
- Search “paneer”
- Search “burger”

Features:

- Tap opens SearchScreen.
- Voice icon opens a mock voice-search dialog.
- Clear button.
- Recent searches.
- Trending searches.
- Search suggestions while typing.
- Search across:
  - restaurants
  - dishes
  - cuisines
  - collections
  - offers
  - attributes
- Search result ranking by relevance.

Implement contextual filters similar to a modern food discovery app:

- Near & Fast
- Pure Veg
- Rating 4+
- Under ₹200
- Under ₹250
- Offers
- Fast Delivery
- Previously Ordered
- Free Delivery
- Top Rated

---

# 7. CATEGORY RAIL

Horizontal food category rail with image + label.

Minimum:

- All
- Pizza
- Burger
- Biryani
- Thali
- Paneer
- North Indian
- South Indian
- Chinese
- Rolls
- Sandwich
- Sweets
- Cake
- Desserts
- Beverages

Interaction:

Tap category → filtered restaurant/dish results.

Active category:
- green underline
- subtle scale animation.

---

# 8. HERO CAROUSEL

Create 4–6 original promotional banners.

Examples:

### Banner 1
**OBLIQ PLUS**
“Free delivery on eligible orders”
CTA: “Explore benefits”

### Banner 2
**Weekend Feast**
“Up to 60% OFF”
CTA: “Order now”

### Banner 3
**Meals Under ₹250**
“Great food, easy prices”
CTA: “Explore”

### Banner 4
**Healthy Picks**
“High-protein meals near you”
CTA: “Discover”

### Banner 5
**Schedule Your Meal**
“Plan lunch before the rush”
CTA: “Schedule”

Requirements:

- Auto-scroll.
- Manual swipe.
- Page dots.
- CTA works.
- Banner click opens relevant screen.
- No blank destination.

---

# 9. DISCOVERY FEATURE GRID

Create horizontal cards:

1. Offers
2. Top 10
3. Food on Train
4. Collections
5. Meals Under ₹250
6. Near & Fast
7. Gourmet
8. Healthy
9. Plan a Party
10. Gift Cards

Each must open a populated screen.

---

# 10. FILTER SYSTEM

Filters must be functional, not decorative.

Filter sheet:

### Sort
- Relevance
- Rating high → low
- Fastest delivery
- Cost low → high
- Cost high → low
- Distance

### Dietary
- Pure Veg
- Eggless
- Healthy

### Price
- Under ₹100
- Under ₹200
- Under ₹250
- ₹250–₹500
- ₹500+

### Offers
- Offers
- Free delivery
- Buy 1 Get 1
- Flat discount

### Delivery
- Under 20 min
- Under 30 min
- Under 45 min

### Rating
- 4+
- 4.5+

Apply / Reset buttons.

---

# 11. RECOMMENDED FOR YOU

Use a dense, visual restaurant feed.

Each card:

- Image
- Offer badge
- Rating badge
- Restaurant name
- Cuisine
- Cost for one
- ETA
- Fast-delivery indicator
- Distance
- Veg indicator
- Bookmark
- Offer text

Examples:

- Thali 360
- Roll Junction
- Big Bite
- Khao Pio
- Pizza 99
- Greet & Meet
- Royal Biryani & Grills
- Punjabi Rasoi
- The Curry House
- South Indian Express

---

# 12. TRY NEW DEALS

Create the reference-style lavender section.

Header:

```text
TRY NEW DEALS
Explore more, save more
```

Use a percentage/deal illustration.

Horizontal cards:

- 50% OFF select items
- 60% OFF select items
- ₹100 OFF above ₹149
- Buy 1 Get 1
- Free delivery

Each card must be tappable.

---

# 13. RESTAURANT DETAIL

Restaurant page must be a complete storefront.

Header:

- Cover image
- Back
- Share
- Favorite
- Restaurant name
- Rating
- Review count
- Cuisine
- Cost for two
- ETA
- Delivery fee
- Distance
- Offer banners

Tabs:

- Menu
- Recommended
- Reviews
- About
- Offers

Menu:

- Category rail
- Search menu
- Veg/non-veg indicator
- Bestseller
- Item image
- Description
- Rating
- Price
- ADD button

Do not create a page where only the header is populated.

---

# 14. FOOD DETAIL

Bottom sheet or detail screen.

Show:

- Large food image
- Food name
- Rating
- Description
- Price
- Veg badge
- Bestseller badge
- Quantity
- Customization
- Add-ons
- Cooking instructions
- Allergens
- Nutrition when available
- Final total

Add-ons examples:

- Extra cheese +₹30
- Extra paneer +₹40
- Extra sauce +₹15
- Extra butter +₹20

Sticky CTA:

`Add item • ₹XXX`

---

# 15. HEALTHY MODE

Implement a modern Healthy Mode inspired by current food-discovery patterns.

Features:

- Healthy Mode toggle/tab.
- Healthy Score 0–100.
- Protein.
- Calories.
- Carbs.
- Fat.
- Fibre.
- Ingredient quality.
- High protein filter.
- Lower calorie filter.
- Low carb filter.
- User calorie preference.
- User protein preference.

Do not claim medical advice.

Example:

```text
Healthy Score 86
High Protein
520 kcal
Protein 31g
Carbs 48g
Fat 16g
Fibre 8g
```

Add a unique OBLIQ feature:

**Smart Meal Match**
- “Best match for your selected preferences”
- Explain why a dish is recommended.

---

# 16. COLLECTIONS

Create populated collections:

- Best Biryani in Jodhpur
- Date Night
- Budget Meals
- Family Feast
- Late Night Cravings
- Student Picks
- High Protein
- Dessert Lovers
- Office Lunch
- Weekend Special

Each collection opens restaurant results.

---

# 17. TOP 10

Create:

- Top 10 restaurants
- Top 10 dishes
- Top 10 budget meals
- Top 10 desserts

Rank cards:

`#1`, `#2`, `#3`, etc.

---

# 18. FOOD ON TRAIN

Create a functional mock flow:

- Enter train number.
- Enter station.
- Select delivery station.
- Browse eligible restaurants.
- Select meal.
- Add to cart.
- Select coach/seat.
- Place simulated order.

Show clear local/demo status.

---

# 19. GOURMET

Create premium discovery:

- Gourmet restaurants.
- Premium dishes.
- Chef specials.
- Curated collections.
- High-quality cards.

---

# 20. PLAN A PARTY

Unique Obliq feature.

Inputs:

- Number of guests.
- Vegetarian / mixed.
- Budget per person.
- Cuisine.
- Date.
- Time.

Generate:

- Recommended restaurants.
- Suggested menu.
- Estimated total.
- Per-person price.

CTA:

`Build Party Order`

---

# 21. SCHEDULE ORDER

Allow:

- ASAP
- Later today
- Tomorrow
- Custom date/time.

Validate:

- Time cannot be in the past.
- Show scheduled order confirmation.
- Scheduled order appears in Orders.

---

# 22. OBLIQ PLUS

Create an original membership program instead of copying Zomato Gold branding.

Name:

**OBLIQ PLUS**

Benefits:

- Free delivery on eligible orders.
- Member-only offers.
- Extra restaurant discounts.
- Early access to deals.
- Priority support.
- Birthday reward.

Show:

- Membership card.
- Benefits.
- Plan price.
- Start/end date.
- Usage stats.

---

# 23. OFFERS

Offer center:

- Coupons.
- Restaurant offers.
- Free delivery.
- Buy 1 Get 1.
- Percentage discounts.
- Flat discounts.

Coupon cards:

```text
OBLIQ10
10% OFF
Minimum order ₹299
[Apply]
```

Coupons must update the actual cart calculation.

---

# 24. CART

Cart must behave like a real food delivery basket.

Features:

- Quantity +/-
- Delete.
- Save for later.
- Restaurant grouping.
- Add more items.
- Coupon.
- Delivery fee.
- Platform fee.
- GST.
- Discount.
- Membership savings.
- Grand total.

Formula:

```text
Grand Total =
Subtotal
+ Delivery Fee
+ Platform Fee
+ GST
- Discounts
- Membership Savings
```

All numbers must update immediately.

---

# 25. CHECKOUT

Sections:

### Delivery address
- Home
- Work
- Other
- Add address

### Delivery instructions
- Leave at door
- Call on arrival
- Avoid calling
- Custom note

### Payment
- UPI
- Card
- Cash on Delivery
- Obliq Wallet

### Coupon
- Applied coupon
- Remove coupon
- Available offers

### Final bill

CTA:

`Place Order • ₹XXX`

---

# 26. ORDER TRACKING

Create a polished live-style tracking page.

Timeline:

1. Order placed
2. Restaurant confirmed
3. Food being prepared
4. Pickup
5. Out for delivery
6. Delivered

Driver section:

- Name
- Rating
- Vehicle
- Call button
- Message button

Since this is frontend-only:

- Use a deterministic simulator.
- “Simulate next status” advances state.
- Do not claim actual GPS tracking.

---

# 27. ORDERS

Tabs:

- Active
- Past
- Scheduled

Each order:

- Restaurant
- Items
- Total
- Date
- Status
- Reorder
- Rate order
- View details

Reorder must actually repopulate cart.

---

# 28. REVIEWS

Review flow:

- Overall star rating.
- Food rating.
- Delivery rating.
- Tags:
  - Tasty
  - Good quantity
  - Fast delivery
  - Fresh
  - Great packaging
- Text review.
- Submit.

Submitted review appears in local state.

---

# 29. FAVORITES

Tabs:

- Restaurants
- Dishes
- Collections

Empty state must include:

- Illustration/icon.
- Message.
- CTA to explore food.

---

# 30. DINING

Create a populated Dining experience.

Features:

- Nearby restaurants.
- Cuisine filters.
- Rating.
- Distance.
- Offers.
- Table reservation.
- Date.
- Time.
- Guests.

Booking flow:

Restaurant → date/time → guests → confirmation.

---

# 31. OBLIQ MARKET

Create an original quick-commerce section.

Categories:

- Snacks
- Beverages
- Desserts
- Breakfast
- Dairy
- Essentials

Show:

- Product image.
- Price.
- Discount.
- Quantity stepper.
- Add button.

Do not use Blinkit branding.

---

# 32. GIFT CARDS

Gift card screen:

- ₹250
- ₹500
- ₹1000
- ₹2000
- Custom amount

Recipient name.
Recipient phone/email.
Personal message.
Preview.
Purchase simulation.

---

# 33. NOTIFICATIONS

Categories:

- All
- Orders
- Offers
- Dining
- Membership

Actions:

- Mark read.
- Mark all read.
- Delete.
- Open related destination.

Unread badge must update.

---

# 34. PROFILE

Sections:

### Account
- Profile
- Phone
- Email

### Orders
- Orders
- Scheduled orders

### Saved
- Favorites
- Addresses
- Payment methods

### Preferences
- Veg Mode
- Healthy Mode
- Notifications
- Theme

### Support
- Help Center
- Contact support
- FAQ

### Legal
- Terms
- Privacy
- About

Every row must open a working screen/dialog.

---

# 35. LOCATION SYSTEM

Implement a local location selector.

Default:

```text
Roop Nagar
Rawat Nagar, Jodhpur, Rajasthan
```

Options:

- Ratanada
- Sardarpura
- Shastri Nagar
- Paota
- Chopasni
- Pal Road
- Basni

Location change should refresh restaurant ordering/ETA data.

---

# 36. EMPTY / LOADING / ERROR STATES

Every screen must have all three.

## Loading

Use skeleton shimmer-style placeholders.

## Empty

Example:

```text
Nothing here yet
Explore more restaurants and dishes.
[Explore Food]
```

## Error

Example:

```text
Something went wrong
Please try again.
[Retry]
```

Never display a completely blank white screen.

---

# 37. IMAGE STRATEGY

Use high-quality original food imagery where available.

Rules:

- No Zomato screenshots as production UI assets.
- No Zomato logo.
- No copyrighted branded promotional artwork.
- If remote image loading is unreliable, provide local fallback assets.
- Every image must have a fallback.
- Avoid broken-image icons.

Use food-image categories matching the visual reference:

- Pizza
- Thali
- Paneer
- North Indian
- Sandwich
- Sweets
- Biryani
- Burger
- Dosa
- Rolls

---

# 38. MICRO-INTERACTIONS

Add subtle animations:

- Search focus.
- Category selection.
- Favorite heart.
- Add-to-cart.
- Quantity changes.
- Coupon application.
- Bottom-sheet appearance.
- Navigation selection.
- Hero carousel.
- Filter selection.
- Order status transition.

Do not over-animate.

---

# 39. CART BAR

When cart contains items:

Floating bottom bar:

```text
[2 items]
View Cart                    ₹438
```

Behavior:

- Always visible above bottom navigation.
- Tap → Cart.
- Updates live.
- Hidden when cart empty.
- Does not cover content.

---

# 40. DATASET REQUIREMENTS

Seed at least:

### Restaurants
20+.

### Dishes
60+.

### Categories
15+.

### Offers
15+.

### Collections
10+.

### Dining places
10+.

### Market products
20+.

### Notifications
10+.

### Reviews
30+.

Every screen must therefore have enough content to demonstrate scrolling and interactions.

---

# 41. JODHPUR DEMO DATA

Use realistic Jodhpur references:

- Roop Nagar
- Ratanada
- Sardarpura
- Shastri Nagar
- Paota
- Pal Road
- Chopasni
- Basni

Do not claim that mock restaurants are actual businesses unless they are clearly labeled as demo data.

---

# 42. NAVIGATION MATRIX

Every route must be tested.

```text
Home
 ├─ Search
 ├─ Location
 ├─ Veg Mode
 ├─ Category
 ├─ Filters
 ├─ Offers
 ├─ Top 10
 ├─ Food on Train
 ├─ Collections
 ├─ Healthy
 ├─ Gourmet
 ├─ Party Planner
 ├─ Schedule
 ├─ Restaurant
 │   └─ Food Detail
 │       └─ Cart
 │           └─ Checkout
 │               └─ Tracking
 ├─ Dining
 ├─ Market
 └─ Profile
```

Back button behavior must be correct.

---

# 43. BUTTON AUDIT

Antigravity must inspect every `onTap`, `onPressed`, `GestureDetector`, `InkWell`, `IconButton`, navigation item and CTA.

For every button:

- It must perform an action.
- If the feature is simulated, show a real local flow.
- No silent buttons.
- No dead-end navigation.
- No blank route.

Create a QA checklist mapping:

```text
Button
Screen
Expected action
Actual action
PASS/FAIL
```

---

# 44. RESPONSIVE DESIGN

Test at minimum:

- 360×800
- 393×852
- 412×915
- 720×1600 reference ratio

Requirements:

- No overflow.
- No clipped text.
- Horizontal rails scroll.
- Cards adapt.
- Bottom navigation remains visible.
- Search bar scales.
- Dialogs fit.

---

# 45. DARK MODE

Support complete dark mode.

Dark surfaces:

- `#101214`
- `#181A1D`
- `#22252A`

Maintain:

- readable text
- visible dividers
- accessible green
- visible chips
- visible cards
- visible bottom navigation.

Do not simply invert colors.

---

# 46. ACCESSIBILITY

Every meaningful icon must have a tooltip/semantic label.

Minimum touch target:

`44×44`

Support:

- large text reasonably.
- screen reader labels.
- sufficient contrast.
- no information conveyed only by color.

---

# 47. PERFORMANCE

Requirements:

- Avoid unnecessary rebuilds.
- Use `const` widgets where possible.
- Lazy lists.
- Avoid loading huge images.
- Cache images if applicable.
- Do not block startup.
- Keep release APK around or below the current ~55 MB target.
- No unnecessary dependencies.

---

# 48. PROVIDER STATE RULES

Use Provider consistently.

Examples:

```text
CartProvider
FavoritesProvider
OrderProvider
SearchProvider
LocationProvider
NotificationProvider
CouponProvider
VegModeProvider
HealthyModeProvider
DiscoveryProvider
DiningProvider
ScheduleProvider
MembershipProvider
AddressProvider
PaymentProvider
ReviewProvider
```

No duplicate state implementations.

---

# 49. COUPON ENGINE

Support:

```text
OBLIQ10
FOOD20
WELCOME
FREEDELIVERY
PARTY50
HEALTHY15
PLUS20
```

Rules:

- case-insensitive.
- invalid coupon gives visible error.
- successful coupon updates bill.
- remove works.
- discount cannot make total negative.
- free delivery sets delivery fee to zero.

---

# 50. UNIQUE OBLIQ FEATURES

Add features that make Obliq more than a clone:

## A. Smart Meal Match
Based on:
- budget
- cuisine
- delivery time
- veg preference
- healthy preference

## B. Budget Guard
User enters:
`₹250`

App highlights combinations that stay below budget.

## C. Group Cart
Generate invite/share UI and simulate multiple participants adding items.

## D. Meal Planner
Breakfast/lunch/dinner planning.

## E. Local Jodhpur Picks
Curated demo collections by locality.

## F. Taste Profile
User selects:
- spicy
- mild
- sweet
- protein-rich
- comfort food
- budget-friendly

Use it for recommendations.

---

# 51. ANALYTICS-LIKE LOCAL EVENTS

No external analytics required.

Create an optional local event logger for development:

```text
search_started
restaurant_opened
food_added
coupon_applied
checkout_started
order_placed
review_submitted
favorite_added
```

Use debug logging only.

---

# 52. QA TEST PLAN

Create automated tests for:

### Cart
- add item
- increase quantity
- decrease quantity
- remove item
- calculate subtotal
- calculate tax
- calculate discount
- grand total

### Coupons
- valid coupon
- invalid coupon
- remove coupon
- free delivery

### Search
- restaurant query
- dish query
- cuisine query
- no result
- filter

### Favorites
- add
- remove
- empty state

### Orders
- place
- status progression
- reorder
- review

### Location
- switch address

### Veg Mode
- enable
- disable
- filter result

### Healthy Mode
- score rendering
- preference filter

Target:
**20+ meaningful unit/provider tests.**

---

# 53. STATIC QA

Run:

```bash
flutter clean
flutter pub get
flutter analyze
flutter test
flutter build apk --release
```

Expected:

```text
flutter analyze → 0 errors
flutter test → all tests pass
build apk → SUCCESS
```

Fix all warnings that represent real defects.

---

# 54. ANDROID QA

If ADB device exists:

```bash
adb devices
adb install -r <apk>
adb shell am force-stop com.obliq.fooddelivery
adb shell monkey -p com.obliq.fooddelivery 1
```

Smoke test:

1. Launch.
2. Home loads.
3. Search.
4. Category.
5. Restaurant.
6. Food.
7. Add to cart.
8. Coupon.
9. Checkout.
10. Place order.
11. Tracking.
12. Orders.
13. Reorder.
14. Favorites.
15. Profile.
16. Theme.
17. Notifications.
18. Dining.
19. Market.
20. Back navigation.

If no device exists, clearly report:
`Physical-device QA NOT PERFORMED`.
Never falsely claim device testing.

---

# 55. VISUAL QA AGAINST SUPPLIED REFERENCES

Compare the actual app against the two supplied screenshots.

Check:

- search bar width
- search bar height
- top padding
- VEG MODE position
- category image size
- category label spacing
- filter chip height
- restaurant card dimensions
- image aspect ratio
- rating badge placement
- section heading spacing
- promotional background
- discovery card radius
- banner height
- carousel dots
- bottom navigation height
- horizontal margins
- typography weight
- whitespace
- visual density

The result should feel like a modern Indian food-delivery app with the same interaction hierarchy as the references.

Do not make it a literal Zomato-branded clone.

---

# 56. FINAL SCREEN QUALITY BAR

A screen is only complete when:

- It has populated data.
- Its main CTA works.
- Back works.
- Loading state exists.
- Empty state exists.
- Error/retry state exists where relevant.
- No overflow.
- No dead buttons.
- No placeholder copy.
- No broken images.
- No console errors.
- Theme works.
- Navigation works.

---

# 57. FINAL DELIVERABLE

At completion, provide:

## Code
All implementation changes in the existing project.

## Tests
All automated tests.

## APK

```text
build/app/outputs/flutter-apk/app-release.apk
```

## Final report

Include:

- Features implemented.
- Screens implemented.
- Providers created/updated.
- Tests passed.
- Analyze result.
- APK size.
- Package ID.
- Device QA status.
- Known limitations.
- Any remaining defects.

---

# 58. FINAL EXECUTION ORDER

Execute in this exact sequence:

### PHASE 1
Audit existing project.

### PHASE 2
Fix architecture and theme.

### PHASE 3
Rebuild Home to reference-level quality.

### PHASE 4
Implement search and contextual filters.

### PHASE 5
Implement discovery sections.

### PHASE 6
Implement restaurant storefront.

### PHASE 7
Implement food detail/customization.

### PHASE 8
Implement cart/coupon/checkout.

### PHASE 9
Implement tracking/orders/reorder/reviews.

### PHASE 10
Implement Healthy Mode.

### PHASE 11
Implement Collections/Top 10/Gourmet/Food on Train.

### PHASE 12
Implement Schedule/Party Planner/Gift Cards.

### PHASE 13
Implement Dining.

### PHASE 14
Implement Obliq Market.

### PHASE 15
Implement Obliq Plus membership.

### PHASE 16
Implement notifications/profile/settings.

### PHASE 17
Implement unique Obliq features.

### PHASE 18
Populate every screen with demo data.

### PHASE 19
Run full navigation/button audit.

### PHASE 20
Run responsive visual QA.

### PHASE 21
Run unit/provider tests.

### PHASE 22
Run analyzer.

### PHASE 23
Build release APK.

### PHASE 24
ADB install/smoke test if device available.

### PHASE 25
Fix all discovered issues.

### PHASE 26
Rebuild final APK.

---

# 59. DEFINITION OF DONE

Do NOT declare completion until all of these are true:

- [ ] Home visually matches the supplied reference structure.
- [ ] Search works.
- [ ] Location works.
- [ ] Veg Mode works globally.
- [ ] Category rail works.
- [ ] Hero carousel works.
- [ ] Discovery cards work.
- [ ] Filters work.
- [ ] Restaurant listing works.
- [ ] Restaurant detail works.
- [ ] Food detail works.
- [ ] Customization works.
- [ ] Cart works.
- [ ] Coupons work.
- [ ] Checkout works.
- [ ] Order placement works.
- [ ] Tracking works.
- [ ] Orders work.
- [ ] Reorder works.
- [ ] Reviews work.
- [ ] Favorites work.
- [ ] Notifications work.
- [ ] Healthy Mode works.
- [ ] Collections work.
- [ ] Top 10 works.
- [ ] Food on Train works.
- [ ] Gourmet works.
- [ ] Party Planner works.
- [ ] Schedule Order works.
- [ ] Dining works.
- [ ] Gift Cards work.
- [ ] Obliq Market works.
- [ ] Obliq Plus works.
- [ ] Profile works.
- [ ] Dark mode works.
- [ ] All buttons work.
- [ ] No blank pages.
- [ ] No placeholder content.
- [ ] No overflow.
- [ ] No broken images.
- [ ] `flutter analyze` passes.
- [ ] `flutter test` passes.
- [ ] Release APK builds.
- [ ] Device QA is performed if a device is available.
- [ ] Final APK is regenerated after all fixes.

---

# 60. IMPORTANT PRODUCT PRINCIPLE

The objective is **not** to reproduce the Zomato brand.

The objective is to reproduce the **quality of the user experience shown in the reference screenshots**:

- search-first discovery
- location-first personalization
- dense visual food discovery
- contextual filters
- deal-led merchandising
- fast add-to-cart interactions
- polished restaurant storefronts
- complete checkout
- transparent tracking
- strong discovery surfaces
- premium membership
- healthy discovery
- dining
- scheduled ordering
- curated collections
- modern floating navigation

Build all of this under the **OBLIQ** identity.

**Do not stop after creating UI. Wire every screen to functional local state and demo data.**

**Do not return a plan instead of implementation. Implement first, test second, report last.**
