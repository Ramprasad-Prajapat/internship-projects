import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../mock_data/mock_food_data.dart';
import '../../models/food_item.dart';
import '../../models/restaurant.dart';
import '../../providers/cart_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../providers/location_provider.dart';
import '../../providers/notification_provider.dart';
import '../../providers/search_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/collections_modal.dart';
import '../../widgets/obliq_logo.dart';
import '../../widgets/restaurant_card.dart';
import '../../widgets/voice_search_modal.dart';
import '../dining/dining_home_screen.dart';
import '../food/food_detail_screen.dart';
import '../market/obliq_market_screen.dart';
import '../membership/membership_screen.dart';
import '../notifications/notifications_screen.dart';
import '../offers/offers_screen.dart';
import '../restaurant/restaurant_detail_screen.dart';
import '../search/search_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _selectedCategory = 'all';
  String _activeFilter = 'All';

  String _getTimeBasedGreeting() {
    int hour = DateTime.now().hour;
    if (hour >= 5 && hour < 11) {
      return '☀️ Morning Special: Poha Jalebi & Kulhad Chai';
    } else if (hour >= 11 && hour < 16) {
      return '🍱 Afternoon Special: Authentic Mewari & Rajasthani Thali';
    } else if (hour >= 16 && hour < 19) {
      return '☕ Evening Special: Mirchi Vada & Lake View Snacks';
    } else if (hour >= 19 && hour < 23) {
      return '🌙 Dinner Special: Fine Lake-View & Rooftop Dining';
    } else {
      return '🌌 Late Night Munchies: Fast Delivery Across Udaipur';
    }
  }

  void _showLocationSheet(BuildContext context) {
    final locationProvider = Provider.of<LocationProvider>(context, listen: false);
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Select Delivery Location',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                TextButton.icon(
                  onPressed: () async {
                    await locationProvider.fetchCurrentLocation();
                    if (!context.mounted) return;
                    if (locationProvider.errorMessage != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(locationProvider.errorMessage!),
                          backgroundColor: Colors.red,
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Location updated'),
                          backgroundColor: ObliqTheme.primaryOrange,
                        ),
                      );
                    }
                    Navigator.pop(context);
                  },
                  icon: const Icon(Icons.my_location, size: 16, color: ObliqTheme.primaryOrange),
                  label: const Text('Use GPS', style: TextStyle(color: ObliqTheme.primaryOrange)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...locationProvider.savedAddresses.map((addr) => ListTile(
                  leading: CircleAvatar(
                    backgroundColor: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                    child: Icon(
                      addr.label == 'Home'
                          ? Icons.home
                          : addr.label == 'Work'
                              ? Icons.work
                              : Icons.location_on,
                      color: ObliqTheme.primaryOrange,
                    ),
                  ),
                  title: Text('${addr.label} (${addr.area})'),
                  subtitle: Text('${addr.streetAddress}, ${addr.city} - ${addr.pincode}'),
                  trailing: locationProvider.currentAddress.id == addr.id
                      ? const Icon(Icons.check_circle, color: ObliqTheme.primaryOrange)
                      : null,
                  onTap: () {
                    locationProvider.selectAddress(addr);
                    Navigator.pop(context);
                  },
                )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final favoritesProvider = Provider.of<FavoritesProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    final notifProvider = Provider.of<NotificationProvider>(context);
    final locationProvider = Provider.of<LocationProvider>(context);
    final searchProvider = Provider.of<SearchProvider>(context);

    // Global Veg Mode filter
    bool isVegMode = searchProvider.pureVegOnly;

    List<Restaurant> filteredRestaurants = MockFoodData.restaurants.where((r) {
      if (isVegMode && !r.menu.any((m) => m.isVeg)) return false;
      if (_selectedCategory != 'all' && !r.menu.any((item) => item.category.toLowerCase() == _selectedCategory)) {
        return false;
      }
      if (_activeFilter == 'Rating 4+') return r.rating >= 4.7;
      if (_activeFilter == 'Near & Fast') return r.deliveryTime.contains('15') || r.deliveryTime.contains('20');
      if (_activeFilter == 'Under ₹250') return r.minOrder <= 150;
      if (_activeFilter == 'Pure Veg') return r.menu.any((m) => m.isVeg);
      return true;
    }).toList();

    List<FoodItem> popularFood = MockFoodData.restaurants
        .expand((r) => r.menu)
        .where((f) => _selectedCategory == 'all' || f.category == _selectedCategory)
        .where((f) => !isVegMode || f.isVeg)
        .toList();

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // 1. TOP HEADER SECTION (OBLIQ Logo, Location, Veg Switch, Notifications)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 8),
                child: Row(
                  children: [
                    // Brand Logo + Location Info
                    Expanded(
                      child: InkWell(
                        onTap: () => _showLocationSheet(context),
                        borderRadius: BorderRadius.circular(8),
                        child: Row(
                          children: [
                            const ObliqLogo(
                              variant: ObliqLogoVariant.header,
                              size: 26,
                              showSubtitle: false,
                            ),
                            const SizedBox(width: 10),
                            Container(width: 1, height: 26, color: Colors.grey.withValues(alpha: 0.3)),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on, color: ObliqTheme.primaryOrange, size: 14),
                                      const SizedBox(width: 2),
                                      Text(
                                        'DELIVERING TO',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          color: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
                                          letterSpacing: 0.8,
                                        ),
                                      ),
                                      const Icon(Icons.keyboard_arrow_down, size: 16, color: ObliqTheme.primaryOrange),
                                    ],
                                  ),
                                  Text(
                                    locationProvider.currentLocationString,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.bold,
                                      color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // VEG MODE Toggle
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: isVegMode ? Colors.green.shade50 : (isDark ? ObliqTheme.cardDark : Colors.grey.shade100),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: isVegMode ? Colors.green : Colors.grey.shade300, width: 1.5),
                      ),
                      child: Row(
                        children: [
                          const Text('VEG', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.green)),
                          const SizedBox(width: 2),
                          SizedBox(
                            height: 24,
                            width: 38,
                            child: Switch(
                              value: isVegMode,
                              activeThumbColor: Colors.green,
                              onChanged: (val) {
                                searchProvider.togglePureVeg(val);
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),

                    // Notifications Icon
                    Stack(
                      children: [
                        CircleAvatar(
                          backgroundColor: isDark ? ObliqTheme.cardDark : Colors.grey.shade200,
                          radius: 18,
                          child: IconButton(
                            icon: const Icon(Icons.notifications_none, color: ObliqTheme.primaryOrange, size: 18),
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const NotificationsScreen()),
                              );
                            },
                          ),
                        ),
                        if (notifProvider.unreadCount > 0)
                          Positioned(
                            right: 0,
                            top: 0,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Colors.red,
                                shape: BoxShape.circle,
                              ),
                              child: Text(
                                '${notifProvider.unreadCount}',
                                style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // 2. LARGE PREMIUM SEARCH BAR WITH MIC ICON
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SearchScreen()),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isDark ? ObliqTheme.cardDark : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search, color: ObliqTheme.primaryOrange, size: 22),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text(
                            'Search for restaurants, dishes or cuisines...',
                            style: TextStyle(color: Colors.grey, fontSize: 13.5, fontWeight: FontWeight.w500),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: IconButton(
                            constraints: const BoxConstraints(),
                            padding: EdgeInsets.zero,
                            icon: const Icon(Icons.mic, color: ObliqTheme.primaryOrange, size: 20),
                            onPressed: () => VoiceSearchModal.show(context),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // 3. OBLIQ PLUS MEMBERSHIP BANNER (Gold Theme Banner)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: InkWell(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const MembershipScreen()));
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2C2517), Color(0xFF1E170C)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFFFD700), width: 1.2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFD700).withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.workspace_premium, color: Color(0xFFFFD700), size: 28),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Text(
                                    'OBLIQ PLUS',
                                    style: TextStyle(
                                      color: Color(0xFFFFD700),
                                      fontWeight: FontWeight.w900,
                                      fontSize: 15,
                                      letterSpacing: 1.0,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFFD700),
                                      borderRadius: BorderRadius.all(Radius.circular(4)),
                                    ),
                                    child: const Text(
                                      '₹1 INTRO OFFER',
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 3),
                              const Text(
                                'Unlimited FREE Delivery & Extra 20% OFF across Udaipur',
                                style: TextStyle(color: Colors.white70, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, color: Color(0xFFFFD700), size: 16),
                      ],
                    ),
                  ),
                ),
              ),
            ),

            // 4. TIME-BASED DISCOVERY GREETING
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          _getTimeBasedGreeting(),
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11.5, color: ObliqTheme.primaryOrange),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // 5. HORIZONTAL CATEGORY CAROUSEL
            const SliverToBoxAdapter(child: SizedBox(height: 12)),
            SliverToBoxAdapter(
              child: SizedBox(
                height: 94,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: MockFoodData.categories.length,
                  itemBuilder: (context, index) {
                    final cat = MockFoodData.categories[index];
                    bool isSelected = _selectedCategory == cat['id'];
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedCategory = cat['id'];
                        });
                      },
                      child: Container(
                        width: 72,
                        margin: const EdgeInsets.only(right: 12),
                        child: Column(
                          children: [
                            Container(
                              height: 58,
                              width: 58,
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? ObliqTheme.primaryOrange.withValues(alpha: 0.15)
                                    : (isDark ? ObliqTheme.cardDark : Colors.grey.shade100),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected ? ObliqTheme.primaryOrange : (isDark ? Colors.grey.shade800 : Colors.grey.shade300),
                                  width: isSelected ? 2.5 : 1.0,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  cat['icon'] ?? '🍽️',
                                  style: const TextStyle(fontSize: 26),
                                ),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              cat['name'] ?? '',
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                color: isSelected ? ObliqTheme.primaryOrange : (isDark ? Colors.white70 : Colors.black87),
                              ),
                            ),
                            if (isSelected)
                              Container(
                                margin: const EdgeInsets.only(top: 2),
                                width: 14,
                                height: 3,
                                decoration: BoxDecoration(
                                  color: ObliqTheme.primaryOrange,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            // 6. DEAL & QUICK DISCOVERY CARDS
            SliverToBoxAdapter(
              child: SizedBox(
                height: 74,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: MockFoodData.quickDiscoveryCards.length,
                  itemBuilder: (context, index) {
                    final card = MockFoodData.quickDiscoveryCards[index];
                    return GestureDetector(
                      onTap: () {
                        if (card['id'] == 'collections' || card['id'] == 'top10' || card['id'] == 'offers') {
                          CollectionsModal.show(context, card['title']!, card['subtitle']!);
                        } else {
                          setState(() {
                            if (card['id'] == 'under199') _activeFilter = 'Under ₹250';
                            if (card['id'] == 'nearfast') _activeFilter = 'Near & Fast';
                            if (card['id'] == 'rajasthani') _selectedCategory = 'rajasthani';
                            if (card['id'] == 'streetfood') _selectedCategory = 'street';
                          });
                        }
                      },
                      child: Container(
                        width: 112,
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                        decoration: BoxDecoration(
                          color: isDark ? ObliqTheme.cardDark : Colors.orange.shade50.withValues(alpha: 0.6),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: ObliqTheme.primaryOrange.withValues(alpha: 0.25)),
                        ),
                        child: Row(
                          children: [
                            Text(card['icon']!, style: const TextStyle(fontSize: 22)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    card['title']!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    card['subtitle']!,
                                    maxLines: 1,
                                    style: const TextStyle(fontSize: 9, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 12)),

            // 7. HORIZONTAL FILTER BAR CHIPS
            SliverToBoxAdapter(
              child: SizedBox(
                height: 38,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: ['All', 'Near & Fast', 'Under ₹250', 'Rating 4+', 'Pure Veg'].map((filter) {
                    bool isSelected = _activeFilter == filter;
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: ChoiceChip(
                        label: Text(filter),
                        selected: isSelected,
                        selectedColor: ObliqTheme.primaryOrange,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : (isDark ? Colors.white : Colors.black),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                        onSelected: (val) {
                          setState(() {
                            _activeFilter = val ? filter : 'All';
                          });
                        },
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 16)),

            // 8. TRY NEW DEALS SECTION
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'TRY NEW DEALS 🏷️',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                            ),
                            Text(
                              'Explore more, save more across Udaipur',
                              style: TextStyle(fontSize: 11, color: Colors.grey),
                            ),
                          ],
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.push(context, MaterialPageRoute(builder: (_) => const OffersScreen()));
                          },
                          child: const Text('SEE ALL', style: TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 160,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: popularFood.take(6).length,
                      itemBuilder: (context, idx) {
                        final food = popularFood[idx];
                        final parentRest = MockFoodData.restaurants.firstWhere(
                          (r) => r.menu.any((m) => m.id == food.id),
                          orElse: () => MockFoodData.restaurants.first,
                        );
                        return GestureDetector(
                          onTap: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              shape: const RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
                              ),
                              builder: (context) => FoodDetailScreen(food: food, restaurant: parentRest),
                            );
                          },
                          child: Container(
                            width: 140,
                            margin: const EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                              color: isDark ? ObliqTheme.cardDark : Colors.white,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200),
                              boxShadow: [
                                BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2)),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                                      child: Image.network(
                                        food.imageUrl,
                                        height: 85,
                                        width: double.infinity,
                                        fit: BoxFit.cover,
                                        errorBuilder: (ctx, err, stack) => Container(
                                          height: 85,
                                          color: Colors.orange.shade100,
                                          child: const Icon(Icons.fastfood, color: ObliqTheme.primaryOrange),
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      top: 6,
                                      left: 6,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: ObliqTheme.primaryOrange,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: const Text(
                                          '50% OFF',
                                          style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        food.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                      ),
                                      const SizedBox(height: 2),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            '₹${food.price.toStringAsFixed(0)}',
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: ObliqTheme.primaryOrange),
                                          ),
                                          InkWell(
                                            onTap: () {
                                              cartProvider.addToCart(food, parentRest.id, parentRest.name);
                                              ScaffoldMessenger.of(context).showSnackBar(
                                                SnackBar(
                                                  content: Text('Added ${food.name} to Cart'),
                                                  backgroundColor: ObliqTheme.primaryOrange,
                                                  duration: const Duration(seconds: 1),
                                                ),
                                              );
                                            },
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                              decoration: BoxDecoration(
                                                color: ObliqTheme.primaryOrange.withValues(alpha: 0.15),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: const Text('ADD +', style: TextStyle(color: ObliqTheme.primaryOrange, fontSize: 10, fontWeight: FontWeight.bold)),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 16)),

            // 9. RECOMMENDED RESTAURANTS IN UDAIPUR
            SliverToBoxAdapter(
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'RECOMMENDED FOR YOU ⭐',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                    ),
                    Text('Handpicked', style: TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final restaurant = filteredRestaurants[index];
                    return RestaurantCard(
                      restaurant: restaurant,
                      isFavorite: favoritesProvider.isRestaurantFavorite(restaurant.id),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => RestaurantDetailScreen(restaurant: restaurant),
                          ),
                        );
                      },
                      onFavoriteToggle: () {
                        favoritesProvider.toggleRestaurantFavorite(restaurant);
                      },
                    );
                  },
                  childCount: filteredRestaurants.length,
                ),
              ),
            ),

            // 10. EXPLORE MORE IN UDAIPUR
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'EXPLORE MORE IN UDAIPUR 🏰',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildExploreCard(
                            context,
                            isDark,
                            'Lake View Dining',
                            'Rooftop cafes & fine dining',
                            '🌊',
                            Colors.blue.shade50,
                            () => Navigator.push(context, MaterialPageRoute(builder: (_) => const DiningHomeScreen())),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildExploreCard(
                            context,
                            isDark,
                            'Obliq Market',
                            '10-minute grocery delivery',
                            '🛒',
                            Colors.green.shade50,
                            () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ObliqMarketScreen())),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
      ),
    );
  }

  Widget _buildExploreCard(
    BuildContext context,
    bool isDark,
    String title,
    String subtitle,
    String icon,
    Color bg,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isDark ? ObliqTheme.cardDark : bg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: ObliqTheme.primaryOrange.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 28)),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: const TextStyle(fontSize: 10, color: Colors.grey), maxLines: 1),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
