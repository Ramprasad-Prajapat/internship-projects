import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:obliq_food_delivery/models/food_item.dart';
import 'package:obliq_food_delivery/models/order.dart';
import 'package:obliq_food_delivery/models/restaurant.dart';
import 'package:obliq_food_delivery/providers/auth_provider.dart';
import 'package:obliq_food_delivery/providers/cart_provider.dart';
import 'package:obliq_food_delivery/providers/favorites_provider.dart';
import 'package:obliq_food_delivery/providers/location_provider.dart';
import 'package:obliq_food_delivery/providers/notification_provider.dart';
import 'package:obliq_food_delivery/providers/order_provider.dart';
import 'package:obliq_food_delivery/providers/search_provider.dart';
import 'package:obliq_food_delivery/providers/theme_provider.dart';

void main() {
  group('AuthProvider Tests', () {
    late AuthProvider authProvider;

    setUp(() {
      authProvider = AuthProvider();
    });

    test('Request OTP sets pending phone', () async {
      bool success = await authProvider.requestOtp('+91 98290 12345');
      expect(success, isTrue);
      expect(authProvider.pendingPhone, equals('+91 98290 12345'));
    });

    test('Verify OTP with demo code 123456 authenticates user', () async {
      await authProvider.requestOtp('+91 98290 12345');
      bool success = await authProvider.verifyOtpAndLogin('123456', name: 'Udaipur User');
      expect(success, isTrue);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser?.name, equals('Udaipur User'));
    });

    test('Continue as Guest sets guest auth status', () async {
      await authProvider.continueAsGuest();
      expect(authProvider.isGuest, isTrue);
      expect(authProvider.isAuthenticated, isTrue);
      expect(authProvider.currentUser?.isGuest, isTrue);
    });

    test('Logout clears session and updates status', () async {
      await authProvider.continueAsGuest();
      expect(authProvider.isAuthenticated, isTrue);

      await authProvider.logout();
      expect(authProvider.isAuthenticated, isFalse);
      expect(authProvider.status, equals(AuthStatus.unauthenticated));
    });
  });

  group('CartProvider Tests', () {
    late CartProvider cartProvider;
    late FoodItem testFood;

    setUp(() {
      cartProvider = CartProvider();
      testFood = FoodItem(
        id: 'test_101',
        name: 'Butter Chicken',
        description: 'Rich creamy tomato gravy chicken',
        price: 300.0,
        imageUrl: 'https://example.com/food.jpg',
        category: 'indian',
      );
    });

    test('Initial cart is empty', () {
      expect(cartProvider.items.isEmpty, isTrue);
      expect(cartProvider.itemCount, equals(0));
      expect(cartProvider.subtotal, equals(0.0));
      expect(cartProvider.grandTotal, equals(0.0));
    });

    test('Add item to cart updates subtotal and delivery fee', () {
      cartProvider.addToCart(testFood, 'rest_1', 'The Curry House', quantity: 2);
      expect(cartProvider.itemCount, equals(2));
      expect(cartProvider.subtotal, equals(600.0));
      expect(cartProvider.deliveryFee, equals(30.0));
      expect(cartProvider.tax, equals(30.0)); // 5% of 600
      expect(cartProvider.grandTotal, equals(680.0)); // 600 + 30 + 15(pkg) + 5(plt) + 30
    });

    test('Apply 10% promo code OBLIQ10', () {
      cartProvider.addToCart(testFood, 'rest_1', 'The Curry House', quantity: 1); // 300
      bool success = cartProvider.applyPromoCode('OBLIQ10');
      expect(success, isTrue);
      expect(cartProvider.appliedPromoCode, equals('OBLIQ10'));
      expect(cartProvider.discountAmount, equals(30.0)); // 10% of 300
      expect(cartProvider.grandTotal, equals(335.0)); // 300 + 30 + 15(pkg) + 5(plt) + 15 - 30
    });

    test('Apply FREEDELIVERY promo code', () {
      cartProvider.addToCart(testFood, 'rest_1', 'The Curry House', quantity: 1); // 300
      bool success = cartProvider.applyPromoCode('FREEDELIVERY');
      expect(success, isTrue);
      expect(cartProvider.deliveryFee, equals(0.0));
    });
  });

  group('FavoritesProvider Tests', () {
    late FavoritesProvider favoritesProvider;
    late Restaurant testRest;

    setUp(() {
      favoritesProvider = FavoritesProvider();
      testRest = Restaurant(
        id: 'rest_999',
        name: 'Test Grill',
        cuisine: 'Kebabs',
        imageUrl: 'https://example.com/rest.jpg',
        rating: 4.5,
        reviewsCount: 50,
        deliveryTime: '20 min',
        deliveryFee: 30.0,
        minOrder: 150.0,
        address: 'Ratanada, Udaipur',
        menu: [],
      );
    });

    test('Toggle restaurant favorite', () {
      expect(favoritesProvider.isRestaurantFavorite('rest_999'), isFalse);
      favoritesProvider.toggleRestaurantFavorite(testRest);
      expect(favoritesProvider.isRestaurantFavorite('rest_999'), isTrue);
      favoritesProvider.toggleRestaurantFavorite(testRest);
      expect(favoritesProvider.isRestaurantFavorite('rest_999'), isFalse);
    });
  });

  group('OrderProvider Tests', () {
    late OrderProvider orderProvider;

    setUp(() {
      orderProvider = OrderProvider();
    });

    test('Place order adds new active order', () {
      int countBefore = orderProvider.orders.length;
      orderProvider.placeOrder(
        items: [],
        subtotal: 500.0,
        deliveryFee: 30.0,
        tax: 25.0,
        discount: 50.0,
        totalAmount: 505.0,
        deliveryAddress: 'Home, Udaipur',
        paymentMethod: 'UPI',
      );
      expect(orderProvider.orders.length, equals(countBefore + 1));
      expect(orderProvider.orders.first.status, equals(OrderStatus.placed));
    });

    test('Advance order status progresses timeline', () {
      var newOrder = orderProvider.placeOrder(
        items: [],
        subtotal: 500.0,
        deliveryFee: 30.0,
        tax: 25.0,
        discount: 50.0,
        totalAmount: 505.0,
        deliveryAddress: 'Home, Udaipur',
        paymentMethod: 'UPI',
      );
      OrderStatus initialStatus = newOrder.status;
      orderProvider.advanceOrderStatus(newOrder.id);
      var updatedOrder = orderProvider.orders.firstWhere((o) => o.id == newOrder.id);
      expect(updatedOrder.status.index, greaterThan(initialStatus.index));
    });
  });

  group('NotificationProvider Tests', () {
    late NotificationProvider notifProvider;

    setUp(() {
      notifProvider = NotificationProvider();
    });

    test('Unread notification count and mark all read', () {
      expect(notifProvider.unreadCount, greaterThan(0));
      notifProvider.markAllAsRead();
      expect(notifProvider.unreadCount, equals(0));
    });
  });

  group('LocationProvider Tests', () {
    late LocationProvider locationProvider;

    setUp(() {
      locationProvider = LocationProvider();
    });

    test('Default location is Udaipur', () {
      expect(locationProvider.currentAddress.city, equals('Udaipur'));
      expect(locationProvider.savedAddresses.length, greaterThanOrEqualTo(2));
    });
  });

  group('SearchProvider Tests', () {
    late SearchProvider searchProvider;

    setUp(() {
      searchProvider = SearchProvider();
    });

    test('Search query and recent search tracking', () {
      searchProvider.setQuery('Biryani');
      expect(searchProvider.query, equals('Biryani'));

      searchProvider.addRecentSearch('Butter Chicken');
      expect(searchProvider.recentSearches.contains('Butter Chicken'), isTrue);
    });

    test('Veg mode filter toggle', () {
      expect(searchProvider.pureVegOnly, isFalse);
      searchProvider.togglePureVeg(true);
      expect(searchProvider.pureVegOnly, isTrue);
    });
  });

  group('ThemeProvider Tests', () {
    late ThemeProvider themeProvider;

    setUp(() {
      themeProvider = ThemeProvider();
    });

    test('Default theme is light mode', () {
      expect(themeProvider.themeMode, equals(ThemeMode.light));
      expect(themeProvider.isDarkMode, isFalse);
    });

    test('Toggle theme switches between light and dark mode', () {
      themeProvider.toggleTheme();
      expect(themeProvider.themeMode, equals(ThemeMode.dark));
      expect(themeProvider.isDarkMode, isTrue);

      themeProvider.toggleTheme();
      expect(themeProvider.themeMode, equals(ThemeMode.light));
    });
  });
}
