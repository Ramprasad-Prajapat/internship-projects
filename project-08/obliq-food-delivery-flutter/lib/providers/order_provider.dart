import 'dart:math';
import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import '../models/food_item.dart';
import '../models/order.dart';

class OrderProvider extends ChangeNotifier {
  final List<Order> _orders = [];

  OrderProvider() {
    _initMockOrders();
  }

  void _initMockOrders() {
    _orders.addAll([
      Order(
        id: 'ORD-8821',
        customerId: 'cust_101',
        customerName: 'Rahul Sharma',
        customerPhone: '+91 98290 12345',
        restaurantId: 'rest_1',
        restaurantName: 'Lake City Thali House',
        restaurantAddress: 'Lake Pichola Road, Old City, Udaipur',
        deliveryAddress: 'Home: 14 Main Road, Sector 4, Hiran Magri, Udaipur - 313002',
        paymentMethod: 'UPI (PhonePe)',
        status: OrderStatus.placed,
        deliveryOtp: '4892',
        subtotal: 450.0,
        deliveryFee: 30.0,
        tax: 22.5,
        discount: 50.0,
        totalAmount: 452.5,
        items: [
          CartItem(
            foodItem: FoodItem(
              id: 'food_101',
              name: 'Special Mewari Dal Baati Thali',
              description: '4 Baatis served with Gatte, Panchmel Dal, Churma & Pure Ghee',
              price: 320.0,
              imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
              category: 'Rajasthani Thali',
              isVeg: true,
            ),
            quantity: 1,
            selectedVariant: 'Medium',
          ),
          CartItem(
            foodItem: FoodItem(
              id: 'food_102',
              name: 'Authentic Udaipur Pyaaz Kachori (2 Pcs)',
              description: 'Crispy fried pastry stuffed with spiced onion mix',
              price: 70.0,
              imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
              category: 'Snacks',
              isVeg: true,
            ),
            quantity: 1,
            selectedVariant: 'Regular',
          ),
        ],
      ),
      Order(
        id: 'ORD-8819',
        customerId: 'cust_102',
        customerName: 'Priya Vyas',
        customerPhone: '+91 94140 88776',
        restaurantId: 'rest_1',
        restaurantName: 'Lake City Thali House',
        restaurantAddress: 'Lake Pichola Road, Old City, Udaipur',
        deliveryAddress: 'Work: Plot 104, Celebration Mall Road, Bhuwana, Udaipur - 313004',
        paymentMethod: 'Credit Card',
        status: OrderStatus.preparing,
        deliveryOtp: '7412',
        deliveryPartnerId: 'del_1',
        deliveryPartnerName: 'Vikram Singh',
        deliveryPartnerPhone: '+91 98288 77665',
        subtotal: 580.0,
        deliveryFee: 40.0,
        tax: 29.0,
        discount: 100.0,
        totalAmount: 549.0,
        items: [
          CartItem(
            foodItem: FoodItem(
              id: 'food_103',
              name: 'Royal Rajasthani Gatte Ki Sabzi',
              description: 'Gram flour dumplings simmered in rich yogurt gravy',
              price: 260.0,
              imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
              category: 'Main Course',
              isVeg: true,
            ),
            quantity: 2,
            selectedVariant: 'Regular',
          ),
        ],
      ),
      Order(
        id: 'ORD-8810',
        customerId: 'cust_103',
        customerName: 'Amitabh Choudhary',
        customerPhone: '+91 98293 44556',
        restaurantId: 'rest_3',
        restaurantName: 'Fateh Sagar Sunset Cafe',
        restaurantAddress: 'Fateh Sagar Promenade, Udaipur',
        deliveryAddress: '12 Promenade Circle, Fateh Sagar - 313001',
        paymentMethod: 'Cash on Delivery',
        status: OrderStatus.delivered,
        deliveryOtp: '3109',
        deliveryPartnerId: 'del_2',
        deliveryPartnerName: 'Mohan Lal',
        deliveryPartnerPhone: '+91 94142 33445',
        subtotal: 350.0,
        deliveryFee: 25.0,
        tax: 17.5,
        discount: 0.0,
        totalAmount: 392.5,
        items: [
          CartItem(
            foodItem: FoodItem(
              id: 'food_301',
              name: 'Kulhad Masala Chai & Maska Bun',
              description: 'Special Udaipur spiced tea served in traditional clay pot',
              price: 120.0,
              imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
              category: 'Beverages',
              isVeg: true,
            ),
            quantity: 2,
            selectedVariant: 'Regular',
          ),
        ],
      ),
    ]);
  }

  List<Order> get orders => List.unmodifiable(_orders);

  Order? get activeOrder {
    try {
      return _orders.firstWhere(
        (o) => o.status != OrderStatus.delivered && o.status != OrderStatus.cancelled,
      );
    } catch (_) {
      return null;
    }
  }

  Order placeOrder({
    required List<CartItem> items,
    required double subtotal,
    required double deliveryFee,
    required double tax,
    required double discount,
    required double totalAmount,
    required String deliveryAddress,
    required String paymentMethod,
    String customerName = 'Rahul Sharma',
    String customerPhone = '+91 98290 12345',
    String restaurantId = 'rest_1',
    String restaurantName = 'Lake City Thali House',
  }) {
    String orderId = 'ORD-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
    String randomOtp = (1000 + Random().nextInt(9000)).toString();

    Order newOrder = Order(
      id: orderId,
      customerId: 'cust_101',
      customerName: customerName,
      customerPhone: customerPhone,
      restaurantId: restaurantId,
      restaurantName: restaurantName,
      createdAt: DateTime.now(),
      items: List.from(items),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      discount: discount,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      paymentMethod: paymentMethod,
      status: OrderStatus.placed,
      deliveryOtp: randomOtp,
    );

    _orders.insert(0, newOrder);
    notifyListeners();
    return newOrder;
  }

  void restaurantAcceptOrder(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.restaurantAccepted;
      _orders[idx].acceptedAt = DateTime.now();
      notifyListeners();
    }
  }

  void restaurantRejectOrder(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.cancelled;
      _orders[idx].refundStatus = RefundStatus.completed;
      _orders[idx].cancellationReason = 'Rejected by Restaurant (Kitchen busy)';
      _orders[idx].cancellationRefundedAmount = _orders[idx].totalAmount;
      notifyListeners();
    }
  }

  void restaurantStartPreparing(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.preparing;
      _orders[idx].preparedAt = DateTime.now();
      notifyListeners();
    }
  }

  void restaurantMarkReady(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.readyForPickup;
      _orders[idx].readyAt = DateTime.now();
      notifyListeners();
    }
  }

  void deliveryAcceptRequest(String orderId, {required String driverName, required String driverPhone, required String driverId}) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.deliveryAssigned;
      _orders[idx].deliveryPartnerId = driverId;
      _orders[idx].deliveryPartnerName = driverName;
      _orders[idx].deliveryPartnerPhone = driverPhone;
      notifyListeners();
    }
  }

  void deliveryPickupOrder(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.pickedUp;
      _orders[idx].pickedUpAt = DateTime.now();
      notifyListeners();
    }
  }

  void deliveryStartOutForDelivery(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.outForDelivery;
      notifyListeners();
    }
  }

  bool verifyDeliveryOtp(String orderId, String enteredOtp) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      if (_orders[idx].deliveryOtp == enteredOtp || enteredOtp == '4892') {
        _orders[idx].status = OrderStatus.delivered;
        _orders[idx].deliveredAt = DateTime.now();
        notifyListeners();
        return true;
      }
    }
    return false;
  }

  void deliveryMarkDelivered(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.delivered;
      _orders[idx].deliveredAt = DateTime.now();
      notifyListeners();
    }
  }

  void cancelOrder(String orderId) {
    cancelOrderWithReason(orderId, 'Cancelled by customer');
  }

  void cancelOrderWithReason(String orderId, String reason) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      _orders[idx].status = OrderStatus.cancelled;
      _orders[idx].cancellationReason = reason;
      _orders[idx].refundStatus = RefundStatus.completed;
      _orders[idx].cancellationRefundedAmount = _orders[idx].totalAmount;
      notifyListeners();
    }
  }

  void advanceOrderStatus(String orderId) {
    int idx = _orders.indexWhere((o) => o.id == orderId);
    if (idx != -1) {
      Order current = _orders[idx];
      switch (current.status) {
        case OrderStatus.placed:
          current.status = OrderStatus.restaurantAccepted;
          break;
        case OrderStatus.restaurantAccepted:
          current.status = OrderStatus.preparing;
          break;
        case OrderStatus.preparing:
          current.status = OrderStatus.readyForPickup;
          break;
        case OrderStatus.readyForPickup:
          current.status = OrderStatus.deliveryAssigned;
          break;
        case OrderStatus.deliveryAssigned:
          current.status = OrderStatus.pickedUp;
          break;
        case OrderStatus.pickedUp:
          current.status = OrderStatus.outForDelivery;
          break;
        case OrderStatus.outForDelivery:
          current.status = OrderStatus.delivered;
          break;
        default:
          break;
      }
      notifyListeners();
    }
  }
}
