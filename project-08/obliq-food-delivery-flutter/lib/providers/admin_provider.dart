import 'package:flutter/material.dart';
import '../mock_data/mock_food_data.dart';
import '../models/restaurant.dart';
import '../models/user.dart';

class AdminProvider extends ChangeNotifier {
  late List<Restaurant> _restaurants;
  late List<DeliveryPartnerUser> _deliveryPartners;
  late List<User> _customers;

  AdminProvider() {
    _restaurants = List.from(MockFoodData.restaurants);

    _deliveryPartners = [
      DeliveryPartnerUser(
        id: 'del_1',
        name: 'Vikram Singh',
        email: 'vikram.delivery@obliq.app',
        phone: '+91 98288 77665',
        vehicleType: 'Hero Splendor Plus',
        vehicleNumber: 'RJ-27-EV-4820',
        rating: 4.9,
        isOnline: true,
        completedOrders: 184,
      ),
      DeliveryPartnerUser(
        id: 'del_2',
        name: 'Karan Meena',
        email: 'karan.delivery@obliq.app',
        phone: '+91 94142 88990',
        vehicleType: 'TVS Jupiter 125',
        vehicleNumber: 'RJ-27-SX-9012',
        rating: 4.7,
        isOnline: true,
        completedOrders: 112,
      ),
      DeliveryPartnerUser(
        id: 'del_3',
        name: 'Deepak Rathore',
        email: 'deepak.delivery@obliq.app',
        phone: '+91 98291 33445',
        vehicleType: 'Bajaj Pulsar 150',
        vehicleNumber: 'RJ-27-AB-5511',
        rating: 4.6,
        isOnline: false,
        completedOrders: 95,
      ),
    ];

    _customers = [
      User(
        id: 'cust_101',
        name: 'Rahul Sharma',
        email: 'rahul.s@gmail.com',
        phone: '+91 98290 12345',
        role: UserRole.customer,
      ),
      User(
        id: 'cust_102',
        name: 'Priya Vyas',
        email: 'priya.v@gmail.com',
        phone: '+91 94140 88776',
        role: UserRole.customer,
      ),
      User(
        id: 'cust_103',
        name: 'Amitabh Choudhary',
        email: 'amitabh.c@gmail.com',
        phone: '+91 98293 44556',
        role: UserRole.customer,
      ),
    ];
  }

  List<Restaurant> get restaurants => List.unmodifiable(_restaurants);
  List<DeliveryPartnerUser> get deliveryPartners => List.unmodifiable(_deliveryPartners);
  List<User> get customers => List.unmodifiable(_customers);

  void toggleRestaurantStatus(String restaurantId, RestaurantStatus newStatus) {
    int idx = _restaurants.indexWhere((r) => r.id == restaurantId);
    if (idx != -1) {
      _restaurants[idx].status = newStatus;
      notifyListeners();
    }
  }

  void toggleDeliveryPartnerStatus(String partnerId) {
    int idx = _deliveryPartners.indexWhere((d) => d.id == partnerId);
    if (idx != -1) {
      _deliveryPartners[idx].isActive = !_deliveryPartners[idx].isActive;
      notifyListeners();
    }
  }

  void toggleCustomerStatus(String customerId) {
    int idx = _customers.indexWhere((c) => c.id == customerId);
    if (idx != -1) {
      _customers[idx].isActive = !_customers[idx].isActive;
      notifyListeners();
    }
  }

  Map<String, dynamic> get platformMetrics => {
        'totalCustomers': 4850,
        'totalRestaurants': _restaurants.length,
        'totalDeliveryPartners': _deliveryPartners.length,
        'ordersToday': 342,
        'revenueToday': 128500.0,
        'activeDeliveries': 24,
      };

  List<Map<String, dynamic>> get areaAnalytics => [
        {'area': 'Hiran Magri (Sectors 1-14)', 'orders': 120, 'share': '35%'},
        {'area': 'Bhuwana & Celebration Mall Road', 'orders': 85, 'share': '25%'},
        {'area': 'Lake Pichola & Old City', 'orders': 65, 'share': '19%'},
        {'area': 'Fatehpura & Panchwati', 'orders': 42, 'share': '12%'},
        {'area': 'Surajpole & Udiapole', 'orders': 30, 'share': '9%'},
      ];
}
