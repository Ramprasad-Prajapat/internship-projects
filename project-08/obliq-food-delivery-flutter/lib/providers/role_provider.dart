import 'package:flutter/material.dart';
import '../models/user.dart';

class RoleProvider extends ChangeNotifier {
  UserRole _currentRole = UserRole.customer;

  UserRole get currentRole => _currentRole;

  String get roleDisplayName => _currentRole.displayName;

  // Demo Users for each role
  final User customerUser = User(
    id: 'user_cust_01',
    name: 'Rahul Sharma',
    email: 'customer@obliq.app',
    phone: '+91 98290 12345',
    role: UserRole.customer,
  );

  final RestaurantUser restaurantUser = RestaurantUser(
    id: 'user_rest_01',
    name: 'Chef Rameshwar Mewari',
    email: 'restaurant@obliq.app',
    phone: '+91 94141 55443',
    restaurantId: 'rest_1',
    restaurantName: 'Lake City Thali House',
    address: 'Lake Pichola Road, Udaipur',
  );

  final DeliveryPartnerUser deliveryUser = DeliveryPartnerUser(
    id: 'user_del_01',
    name: 'Vikram Singh',
    email: 'delivery@obliq.app',
    phone: '+91 98288 77665',
    vehicleType: 'Hero Splendor Plus',
    vehicleNumber: 'RJ-27-EV-4820',
  );

  final AdminUser adminUser = AdminUser(
    id: 'user_admin_01',
    name: 'Aditya Vardhan (Udaipur Admin)',
    email: 'admin@obliq.app',
    phone: '+91 98299 00112',
    accessLevel: 'Super Administrator',
  );

  User get currentUser {
    switch (_currentRole) {
      case UserRole.customer:
        return customerUser;
      case UserRole.restaurant:
        return restaurantUser;
      case UserRole.deliveryPartner:
        return deliveryUser;
      case UserRole.admin:
        return adminUser;
    }
  }

  void setRole(UserRole newRole) {
    if (_currentRole != newRole) {
      _currentRole = newRole;
      notifyListeners();
    }
  }

  void switchRole(UserRole newRole) => setRole(newRole);

  void switchRoleByEmail(String email) {
    if (email.contains('restaurant')) {
      setRole(UserRole.restaurant);
    } else if (email.contains('delivery')) {
      setRole(UserRole.deliveryPartner);
    } else if (email.contains('admin')) {
      setRole(UserRole.admin);
    } else {
      setRole(UserRole.customer);
    }
  }
}
