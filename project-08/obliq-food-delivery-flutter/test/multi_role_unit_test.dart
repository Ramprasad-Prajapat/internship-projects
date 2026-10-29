import 'package:flutter_test/flutter_test.dart';
import 'package:obliq_food_delivery/models/user.dart';
import 'package:obliq_food_delivery/models/order.dart';
import 'package:obliq_food_delivery/models/food_item.dart';
import 'package:obliq_food_delivery/models/restaurant.dart';
import 'package:obliq_food_delivery/providers/role_provider.dart';
import 'package:obliq_food_delivery/providers/restaurant_provider.dart';
import 'package:obliq_food_delivery/providers/delivery_provider.dart';
import 'package:obliq_food_delivery/providers/admin_provider.dart';
import 'package:obliq_food_delivery/providers/order_provider.dart';
import 'package:obliq_food_delivery/providers/cart_provider.dart';

void main() {
  group('Multi-Role Ecosystem Unit Tests', () {
    test('RoleProvider handles switching across all 4 roles seamlessly', () {
      final roleProvider = RoleProvider();

      expect(roleProvider.currentRole, UserRole.customer);
      expect(roleProvider.roleDisplayName, 'Customer');

      roleProvider.switchRole(UserRole.restaurant);
      expect(roleProvider.currentRole, UserRole.restaurant);
      expect(roleProvider.roleDisplayName, 'Restaurant Partner');

      roleProvider.switchRole(UserRole.deliveryPartner);
      expect(roleProvider.currentRole, UserRole.deliveryPartner);
      expect(roleProvider.roleDisplayName, 'Delivery Partner');

      roleProvider.switchRole(UserRole.admin);
      expect(roleProvider.currentRole, UserRole.admin);
      expect(roleProvider.roleDisplayName, 'Admin');
    });

    test('RestaurantProvider manages menu availability and updates', () {
      final restProvider = RestaurantProvider();
      final initialCount = restProvider.menu.length;

      final testItem = FoodItem(
        id: 'test_food_99',
        name: 'Test Udaipur Kachori',
        description: 'Test Description',
        price: 50.0,
        category: 'Snacks',
        imageUrl: 'https://example.com/test.jpg',
        isVeg: true,
      );

      restProvider.addMenuItem(testItem);
      expect(restProvider.menu.length, initialCount + 1);
      expect(restProvider.menu.first.id, 'test_food_99');

      restProvider.toggleItemAvailability('test_food_99');
      expect(restProvider.menu.first.isAvailable, false);

      restProvider.deleteMenuItem('test_food_99');
      expect(restProvider.menu.length, initialCount);
    });

    test('DeliveryProvider toggles online duty and records earnings', () {
      final deliveryProvider = DeliveryProvider();

      expect(deliveryProvider.isOnline, true);
      deliveryProvider.toggleOnlineStatus(false);
      expect(deliveryProvider.isOnline, false);

      final initialEarnings = deliveryProvider.todayEarnings;
      final initialDeliveries = deliveryProvider.completedDeliveriesCount;

      deliveryProvider.recordCompletedDelivery(65.0);
      expect(deliveryProvider.todayEarnings, initialEarnings + 65.0);
      expect(deliveryProvider.completedDeliveriesCount, initialDeliveries + 1);
    });

    test('AdminProvider tracks Udaipur platform metrics and entity toggles', () {
      final adminProvider = AdminProvider();

      expect(adminProvider.restaurants.isNotEmpty, true);
      expect(adminProvider.deliveryPartners.isNotEmpty, true);
      expect(adminProvider.customers.isNotEmpty, true);

      final restId = adminProvider.restaurants.first.id;
      adminProvider.toggleRestaurantStatus(restId, RestaurantStatus.suspended);
      expect(adminProvider.restaurants.first.status, RestaurantStatus.suspended);
    });

    test('Cart 2.0 calculates fees, savings, and validates minimum order', () {
      final cartProvider = CartProvider();
      final testItem = FoodItem(
        id: 'test_100',
        name: 'Rajasthani Thali',
        description: 'Traditional thali',
        price: 250.0,
        imageUrl: 'https://example.com/thali.jpg',
        category: 'Thali',
        isVeg: true,
      );

      cartProvider.addToCart(testItem, 'rest_1', 'Lake City Thali House', quantity: 1);
      expect(cartProvider.subtotal, 250.0);
      expect(cartProvider.packagingFee, 15.0);
      expect(cartProvider.platformFee, 5.0);
      expect(cartProvider.isMinimumOrderMet, true);

      bool applied = cartProvider.applyPromoCode('UDAIPUR50');
      expect(applied, true);
      expect(cartProvider.discountAmount, 50.0);
      expect(cartProvider.totalSavings, 50.0);
    });

    test('Cross-Role Order Lifecycle flows from Placed to Delivered', () {
      final orderProvider = OrderProvider();
      final order = orderProvider.orders.first;

      expect(order.status, OrderStatus.placed);

      // Restaurant accepts
      orderProvider.restaurantAcceptOrder(order.id);
      expect(order.status, OrderStatus.restaurantAccepted);

      // Restaurant prepares
      orderProvider.restaurantStartPreparing(order.id);
      expect(order.status, OrderStatus.preparing);

      // Restaurant ready
      orderProvider.restaurantMarkReady(order.id);
      expect(order.status, OrderStatus.readyForPickup);

      // Delivery partner accepts
      orderProvider.deliveryAcceptRequest(
        order.id,
        driverName: 'Vikram Singh',
        driverPhone: '+91 98288 77665',
        driverId: 'del_1',
      );
      expect(order.status, OrderStatus.deliveryAssigned);

      // Delivery partner picks up
      orderProvider.deliveryPickupOrder(order.id);
      expect(order.status, OrderStatus.pickedUp);

      // Delivery partner out for delivery
      orderProvider.deliveryStartOutForDelivery(order.id);
      expect(order.status, OrderStatus.outForDelivery);

      // Delivery partner delivers
      orderProvider.deliveryMarkDelivered(order.id);
      expect(order.status, OrderStatus.delivered);
    });
  });
}
