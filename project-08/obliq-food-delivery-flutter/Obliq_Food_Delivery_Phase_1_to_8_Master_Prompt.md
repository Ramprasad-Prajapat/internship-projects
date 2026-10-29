# Obliq Food Delivery — Phase 1 to Phase 8 Master Implementation Prompt

## MASTER OBJECTIVE

You are the lead Flutter architect, senior mobile UI/UX engineer, and QA engineer responsible for completing the **Obliq Food Delivery** Android application.

Build a **production-level frontend-only Flutter application** that combines:

1. The existing Obliq Food Delivery APK as the primary visual/reference baseline.
2. The approved Obliq feature set.
3. Zomato-style food-discovery, restaurant, ordering, offers, review, tracking, and profile UX patterns.
4. A polished, responsive, modern Android experience suitable for a final APK demonstration.

### NON-NEGOTIABLE CONSTRAINTS

- Framework: **Flutter**
- Platform: **Android only**
- Deliverable: **release APK**
- Backend: **DO NOT ADD**
- Database: **DO NOT ADD**
- Firebase: **DO NOT ADD**
- REST APIs: **DO NOT ADD**
- Authentication server: **DO NOT ADD**
- Git/GitHub: **DO NOT ADD**
- Web/iOS/Linux/macOS/Windows targets: **DO NOT ADD**
- Use only local/mock/static data and local in-memory state.
- Do not replace the existing Obliq app with a generic template.
- Preserve the existing Obliq brand identity unless a phase explicitly improves it.
- Do not remove working features without a clear reason.
- Do not create unnecessary Markdown/documentation files inside the Flutter project.
- Do not create unnecessary test/demo files unless specifically required for verification.
- Final output must be a working `app-release.apk`.

## REFERENCE RULE

The current Obliq APK is the visual and functional baseline.

Before changing a screen:
- inspect the existing implementation;
- understand its current layout, spacing, typography, colors, cards, navigation, interactions, and assets;
- preserve the parts that already work;
- improve only where required by the phase;
- do not blindly redesign the entire app.

When the reference APK and a new requirement conflict:
1. Preserve the Obliq brand.
2. Preserve existing working functionality.
3. Add the requested feature using the same design language.
4. Keep UX consistent across all screens.

---

# PHASE 1 — PROJECT AUDIT, BASELINE & ARCHITECTURE

## Goal

Establish a clean and reliable baseline before implementing new features.

## Tasks

1. Inspect the entire Flutter project.
2. Inspect:
   - `pubspec.yaml`
   - `lib/`
   - `android/`
   - assets
   - theme
   - models
   - providers
   - screens
   - widgets
3. Verify the Android package:
   - `com.obliq.fooddelivery`
4. Verify `MainActivity.kt` package consistency.
5. Verify AndroidManifest configuration.
6. Identify duplicate, unused, broken, or unnecessary files.
7. Do not delete useful application code without verifying references.
8. Keep Android-only project configuration.
9. Confirm there is no backend/database/API dependency.
10. Confirm the app can build in release mode.

## Architecture

Use a clean structure such as:

```text
lib/
├── main.dart
├── theme/
├── models/
├── mock_data/
├── providers/
├── screens/
│   ├── home/
│   ├── search/
│   ├── restaurant/
│   ├── food/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── tracking/
│   ├── favorites/
│   ├── offers/
│   └── profile/
└── widgets/
```

Use Provider or the existing local state-management approach.

## Phase 1 completion criteria

- No architecture-breaking issues.
- No backend.
- Android build configuration valid.
- `flutter analyze` passes.
- Release build succeeds.

---

# PHASE 2 — DESIGN SYSTEM & REFERENCE-LEVEL UI

## Goal

Make the complete application visually consistent with the existing Obliq APK while bringing it to production-level quality.

## Brand direction

Use the established Obliq visual language:

- Primary orange/red
- Amber/yellow accent
- Charcoal/dark surfaces
- Off-white/light surfaces
- Material 3
- Rounded cards
- Premium food imagery
- Clear hierarchy
- Modern typography
- Strong CTA buttons
- Consistent spacing

## Create/review

- Color system
- Typography scale
- Border radius system
- Elevation/shadows
- Button styles
- Input fields
- Chips
- Cards
- Bottom navigation
- App bars
- Empty states
- Loading states
- Error states
- Snackbars
- Dialogs
- Bottom sheets

## UX requirements

- No overflow.
- No clipped text.
- Keyboard must not cover important controls.
- SafeArea must be handled.
- Touch targets should be comfortable.
- Scrolling must be smooth.
- Back navigation must be predictable.
- Loading and empty states must look intentional.

## Phase 2 completion criteria

Every existing screen should look like one coherent production application rather than independent screens.

---

# PHASE 3 — HOME, DISCOVERY & SEARCH

## Goal

Upgrade the Obliq home experience with Zomato-style discovery patterns.

## Home features

Implement/refine:

1. Location selector.
2. Current delivery location.
3. Notification icon.
4. Search bar.
5. Search suggestions.
6. Recent searches.
7. Popular searches.
8. Food categories.
9. Restaurant categories.
10. Promotional banners.
11. Offers section.
12. Recommended restaurants.
13. Top-rated restaurants.
14. Popular dishes.
15. Trending food.
16. Nearby restaurants.
17. Fast delivery section.
18. Cuisine discovery.
19. Restaurant cards.
20. Food cards.
21. Rating.
22. Delivery time.
23. Price indicators.
24. Distance.
25. Veg/non-veg indicators where applicable.
26. Favorite button.
27. Quick-add button.

## Search behavior

Search locally through mock data.

Support:
- restaurant name;
- food name;
- cuisine;
- category;
- tags.

Include:
- empty search state;
- no-result state;
- clear search;
- filter/sort controls.

## Filters

Add local UI for:

- Rating
- Delivery time
- Price
- Cuisine
- Veg
- Offers
- Distance
- Popularity

## Phase 3 completion criteria

A user should be able to open the app and discover restaurants/food naturally without needing backend data.

---

# PHASE 4 — RESTAURANT & FOOD EXPERIENCE

## Goal

Create a rich restaurant browsing and food ordering experience inspired by modern food-delivery apps.

## Restaurant detail

Include:

1. Hero image.
2. Restaurant name.
3. Rating.
4. Review count.
5. Cuisine.
6. Price range.
7. Delivery time.
8. Distance.
9. Address.
10. Favorite.
11. Share UI.
12. Offer banners.
13. Restaurant information.
14. Menu categories.
15. Sticky category navigation.
16. Search within menu.
17. Popular dishes.
18. Recommended dishes.
19. Food cards.
20. Add button.

## Food detail

Include:

- Large image
- Name
- Price
- Rating
- Description
- Ingredients
- Customization
- Add-ons
- Quantity
- Special instructions
- Dynamic total
- Add to cart

## Food customization

Support mock/local options such as:

- size;
- spice level;
- add-ons;
- extras;
- quantity;
- special request.

All pricing must update immediately.

## Phase 4 completion criteria

Restaurant → food → customization → cart must work as a complete local flow.

---

# PHASE 5 — CART, OFFERS & CHECKOUT

## Goal

Create a polished and realistic ordering flow.

## Cart

Include:

1. Cart items.
2. Restaurant information.
3. Quantity controls.
4. Delete item.
5. Edit customization.
6. Add more items.
7. Promo code.
8. Coupon selection.
9. Savings display.
10. Delivery fee.
11. Taxes.
12. Packaging fee where applicable.
13. Discount.
14. Grand total.
15. Free-delivery threshold UI.
16. Checkout CTA.

## Mock coupons

Use examples such as:

- `OBLIQ10`
- `FOOD20`
- `WELCOME`
- `FREEDELIVERY`

Coupon validation must happen locally.

## Checkout

Include:

- Delivery address
- Saved addresses
- Add address UI
- Delivery instructions
- Contact information
- Payment method
- Order summary
- Coupon/savings
- Total
- Place Order

## Payment UI

Frontend-only mock options:

- Credit/Debit Card
- Cash on Delivery
- Wallet
- UPI-style option

Do not connect to a real payment gateway.

## Phase 5 completion criteria

The complete local order flow must work:

```text
Home
→ Restaurant
→ Food
→ Customization
→ Cart
→ Coupon
→ Address
→ Payment
→ Place Order
```

---

# PHASE 6 — ORDER TRACKING, HISTORY & CUSTOMER EXPERIENCE

## Goal

Make the post-order experience production-quality while remaining frontend-only.

## Order confirmation

Show:

- Order success
- Order number
- Restaurant
- Items
- Total
- Estimated delivery
- Track Order CTA

## Tracking

Create a realistic local simulation:

```text
Order Placed
↓
Confirmed
↓
Preparing
↓
Ready for Pickup
↓
Out for Delivery
↓
Delivered
```

Include:

- progress indicator;
- estimated arrival;
- restaurant information;
- delivery partner card;
- call/contact UI;
- help/support UI;
- order summary.

Do not claim real GPS tracking.

## Order history

Include:

- Active orders
- Past orders
- Order date
- Restaurant
- Items
- Total
- Status
- Reorder

## Reorder

Allow local reorder using the same mock data.

## Reviews

Add frontend-only review UI:

- rating;
- food rating;
- delivery rating;
- text review;
- selectable tags;
- submit confirmation.

Store only in local app state during the session.

## Phase 6 completion criteria

The user can complete an order and continue through confirmation, tracking, history, reorder, and review flows.

---

# PHASE 7 — FAVORITES, OFFERS, PROFILE & PREMIUM POLISH

## Goal

Complete the remaining product-level user experience.

## Favorites

Support:

- favorite restaurants;
- favorite dishes;
- remove favorite;
- empty state;
- quick navigation.

## Offers

Create a dedicated offers page containing:

- restaurant offers;
- food discounts;
- coupon cards;
- free-delivery offers;
- limited-time offer UI;
- copy coupon interaction;
- applied-state feedback.

All offers are mock/local.

## Profile

Include:

- Profile header
- Name
- Email/phone placeholder
- Orders
- Favorites
- Saved addresses
- Payment methods
- Offers
- Help & support
- Settings
- Theme switch
- About

## Settings

Include polished frontend-only controls:

- Light/Dark theme
- Notifications UI
- Language UI
- Location UI
- Privacy UI
- Terms UI
- About app

Do not add unnecessary backend functionality.

## Help & Support

Provide local UI for:

- FAQs
- Order issue categories
- Contact support UI
- Report issue
- Refund/help information

No real support backend.

## Phase 7 completion criteria

The app should feel like a complete consumer food-delivery application rather than only an ordering demo.

---

# PHASE 8 — PRODUCTION QA, OPTIMIZATION & FINAL APK

## Goal

Prepare the final Android APK for delivery.

## Functional QA

Verify every major flow:

### Launch

- App installs.
- App launches.
- Splash/startup does not crash.
- Home screen renders.

### Discovery

- Search works.
- Categories work.
- Filters work.
- Restaurant cards open.
- Food cards open.

### Restaurant

- Menu categories work.
- Food detail works.
- Favorites work.
- Add to cart works.

### Cart

- Add/remove works.
- Quantity works.
- Customization works.
- Coupon works.
- Price calculations are correct.

### Checkout

- Address selection works.
- Payment selection works.
- Place order works.

### Order

- Confirmation works.
- Tracking works.
- Status simulation works.
- History works.
- Reorder works.
- Review UI works.

### Profile

- Favorites work.
- Offers work.
- Theme switch works.
- Settings open correctly.

## UI QA

Check:

- Small Android phones
- Large Android phones
- Portrait orientation
- Keyboard behavior
- Safe areas
- Long restaurant names
- Long food names
- Empty lists
- Large quantities
- Long descriptions
- Dark mode
- Light mode

## Performance

Optimize:

- unnecessary rebuilds;
- oversized widgets;
- image loading;
- list rendering;
- repeated calculations;
- navigation transitions.

Do not introduce unnecessary dependencies.

## Final validation commands

Run:

```powershell
flutter clean
flutter pub get
flutter analyze
flutter build apk --release
```

If tests exist and are intentionally retained, run them.

## APK verification

Verify:

- APK exists.
- APK opens as a valid archive.
- Package ID is `com.obliq.fooddelivery`.
- Version is correct.
- Release build succeeds.
- APK size is reasonable.
- No debug-only dependency is required.

## Final APK location

Use:

```text
build/app/outputs/flutter-apk/app-release.apk
```

---

# COMPLETE FEATURE CHECKLIST

The final application should contain approximately 30–40 meaningful frontend features, including:

1. Location selector
2. Search
3. Search suggestions
4. Recent searches
5. Categories
6. Promotional banners
7. Restaurant discovery
8. Food discovery
9. Sorting
10. Filters
11. Restaurant details
12. Restaurant favorites
13. Restaurant offers
14. Menu categories
15. Menu search
16. Food details
17. Food customization
18. Add-ons
19. Special instructions
20. Cart
21. Quantity management
22. Coupons
23. Price breakdown
24. Address selection
25. Payment selection
26. Order placement
27. Order confirmation
28. Order tracking
29. Delivery status simulation
30. Order history
31. Reorder
32. Reviews
33. Favorite foods
34. Dedicated offers
35. Profile
36. Saved addresses
37. Settings
38. Dark/light mode
39. Help/support
40. Premium empty/loading/error states

---

# MASTER IMPLEMENTATION RULES

## Rule 1 — Do not fake backend functionality

Anything that normally requires a server must be represented as a local/mock interaction.

## Rule 2 — Every button must have intentional behavior

No dead buttons unless clearly marked as unavailable.

## Rule 3 — Maintain visual consistency

Do not mix unrelated UI styles.

## Rule 4 — Preserve the Obliq identity

The application should remain recognizably Obliq.

## Rule 5 — Avoid unnecessary dependencies

Prefer Flutter SDK widgets and already-installed packages.

## Rule 6 — No scope creep

Do not add:
- backend;
- database;
- Firebase;
- real payments;
- real maps;
- real GPS;
- real authentication;
- real push notifications.

## Rule 7 — Production-quality means polished frontend

Production-level in this project means:
- stable;
- responsive;
- visually polished;
- consistent;
- interactive;
- release-build ready.

It does NOT mean adding a backend.

## Rule 8 — Do not destroy working code

Before modifying existing code, inspect its dependencies and usage.

## Rule 9 — Build after major phases

At the end of each phase:

```powershell
flutter analyze
flutter build apk --release
```

Fix all blocking issues before continuing.

## Rule 10 — Final deliverable

The only required user-facing deliverable is:

```text
app-release.apk
```

---

# ANTIGRAVITY EXECUTION INSTRUCTION

Execute these phases sequentially.

Do not jump directly to Phase 8.

For every phase:

1. Inspect current implementation.
2. Make a concrete implementation plan.
3. Implement the phase.
4. Run static analysis.
5. Fix errors.
6. Build release APK.
7. Verify the affected user flows.
8. Continue to the next phase.

Do not repeatedly ask for approval after every small task.

If a requirement is clear, implement it.

If a genuinely destructive or ambiguous decision is required, stop and ask.

At the end, provide only a concise final report containing:

- features completed;
- files changed;
- verification result;
- APK build result;
- exact APK path.

# FINAL SUCCESS CONDITION

The project is complete only when:

- all 8 phases are implemented;
- Obliq's original identity is preserved;
- Zomato-style discovery/order UX has been integrated;
- all 30–40 target features are implemented as frontend/mock functionality;
- no backend/database/API/Firebase is added;
- Android-only project remains clean;
- `flutter analyze` passes;
- release APK builds successfully;
- final `app-release.apk` is available.
