import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user.dart';
import '../providers/cart_provider.dart';
import '../providers/role_provider.dart';
import '../theme/obliq_theme.dart';
import 'admin/admin_customers_screen.dart';
import 'admin/admin_dashboard_screen.dart';
import 'admin/admin_delivery_partners_screen.dart';
import 'admin/admin_orders_screen.dart';
import 'admin/admin_restaurants_screen.dart';
import 'admin/admin_settings_screen.dart';
import 'cart/cart_screen.dart';
import 'delivery_partner/delivery_dashboard_screen.dart';
import 'delivery_partner/delivery_earnings_screen.dart';
import 'delivery_partner/delivery_history_screen.dart';
import 'delivery_partner/delivery_orders_screen.dart';
import 'delivery_partner/delivery_profile_screen.dart';
import 'dining/dining_home_screen.dart';
import 'home/home_screen.dart';
import 'market/obliq_market_screen.dart';
import 'offers/offers_screen.dart';
import 'profile/profile_screen.dart';
import 'restaurant_partner/restaurant_analytics_screen.dart';
import 'restaurant_partner/restaurant_dashboard_screen.dart';
import 'restaurant_partner/restaurant_menu_screen.dart';
import 'restaurant_partner/restaurant_orders_screen.dart';
import 'restaurant_partner/restaurant_profile_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _customerIndex = 0;
  int _restaurantIndex = 0;
  int _deliveryIndex = 0;
  int _adminIndex = 0;

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final roleProvider = Provider.of<RoleProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context);

    switch (roleProvider.currentRole) {
      case UserRole.customer:
        return _buildCustomerShell(isDark, cartProvider);
      case UserRole.restaurant:
        return _buildRestaurantShell(isDark);
      case UserRole.deliveryPartner:
        return _buildDeliveryShell(isDark);
      case UserRole.admin:
        return _buildAdminShell(isDark);
    }
  }

  // --- 1. CUSTOMER SHELL ---
  Widget _buildCustomerShell(bool isDark, CartProvider cartProvider) {
    final List<Widget> screens = [
      const HomeScreen(),
      const OffersScreen(),
      const DiningHomeScreen(),
      const ObliqMarketScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _customerIndex,
        children: screens,
      ),
      floatingActionButton: cartProvider.itemCount > 0
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CartScreen()),
                );
              },
              backgroundColor: ObliqTheme.primaryOrange,
              icon: const Icon(Icons.shopping_cart, color: Colors.white),
              label: Text(
                'View Cart (${cartProvider.itemCount}) • ₹${cartProvider.grandTotal.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
              ),
            )
          : null,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _customerIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: ObliqTheme.primaryOrange,
        unselectedItemColor: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
        onTap: (index) => setState(() => _customerIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.delivery_dining_outlined),
            activeIcon: Icon(Icons.delivery_dining, color: ObliqTheme.primaryOrange),
            label: 'Delivery',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.savings_outlined),
            activeIcon: Icon(Icons.savings, color: ObliqTheme.primaryOrange),
            label: 'Under ₹250',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant_outlined),
            activeIcon: Icon(Icons.restaurant, color: ObliqTheme.primaryOrange),
            label: 'Dining',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.storefront_outlined),
            activeIcon: Icon(Icons.storefront, color: ObliqTheme.primaryOrange),
            label: 'Quick Market',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person, color: ObliqTheme.primaryOrange),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  // --- 2. RESTAURANT SHELL ---
  Widget _buildRestaurantShell(bool isDark) {
    final List<Widget> screens = [
      const RestaurantDashboardScreen(),
      const RestaurantOrdersScreen(),
      const RestaurantMenuScreen(),
      const RestaurantAnalyticsScreen(),
      const RestaurantProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _restaurantIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _restaurantIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.indigo,
        unselectedItemColor: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
        onTap: (index) => setState(() => _restaurantIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard, color: Colors.indigo),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            activeIcon: Icon(Icons.receipt_long, color: Colors.indigo),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant_menu_outlined),
            activeIcon: Icon(Icons.restaurant_menu, color: Colors.indigo),
            label: 'Menu',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics_outlined),
            activeIcon: Icon(Icons.analytics, color: Colors.indigo),
            label: 'Analytics',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.store_outlined),
            activeIcon: Icon(Icons.store, color: Colors.indigo),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  // --- 3. DELIVERY SHELL ---
  Widget _buildDeliveryShell(bool isDark) {
    final List<Widget> screens = [
      const DeliveryDashboardScreen(),
      const DeliveryOrdersScreen(),
      const DeliveryEarningsScreen(),
      const DeliveryHistoryScreen(),
      const DeliveryProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _deliveryIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _deliveryIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.green.shade700,
        unselectedItemColor: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
        onTap: (index) => setState(() => _deliveryIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.speed_outlined),
            activeIcon: Icon(Icons.speed, color: Colors.green),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.two_wheeler_outlined),
            activeIcon: Icon(Icons.two_wheeler, color: Colors.green),
            label: 'Deliveries',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.payments_outlined),
            activeIcon: Icon(Icons.payments, color: Colors.green),
            label: 'Earnings',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history_outlined),
            activeIcon: Icon(Icons.history, color: Colors.green),
            label: 'History',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_pin_outlined),
            activeIcon: Icon(Icons.person_pin, color: Colors.green),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  // --- 4. ADMIN SHELL ---
  Widget _buildAdminShell(bool isDark) {
    final List<Widget> screens = [
      const AdminDashboardScreen(),
      const AdminOrdersScreen(),
      const AdminRestaurantsScreen(),
      const AdminDeliveryPartnersScreen(),
      const AdminCustomersScreen(),
      const AdminSettingsScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _adminIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _adminIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.purple.shade700,
        unselectedItemColor: isDark ? Colors.grey.shade400 : Colors.grey.shade600,
        onTap: (index) => setState(() => _adminIndex = index),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.admin_panel_settings_outlined),
            activeIcon: Icon(Icons.admin_panel_settings, color: Colors.purple),
            label: 'Control',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list_alt_outlined),
            activeIcon: Icon(Icons.list_alt, color: Colors.purple),
            label: 'Orders',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.storefront_outlined),
            activeIcon: Icon(Icons.storefront, color: Colors.purple),
            label: 'Stores',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.two_wheeler_outlined),
            activeIcon: Icon(Icons.two_wheeler, color: Colors.purple),
            label: 'Partners',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_alt_outlined),
            activeIcon: Icon(Icons.people_alt, color: Colors.purple),
            label: 'Users',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            activeIcon: Icon(Icons.settings, color: Colors.purple),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
