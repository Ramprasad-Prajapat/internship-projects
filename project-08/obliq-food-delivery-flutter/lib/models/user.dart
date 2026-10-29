enum UserRole {
  customer,
  restaurant,
  deliveryPartner,
  admin,
}

extension UserRoleExtension on UserRole {
  String get displayName {
    switch (this) {
      case UserRole.customer:
        return 'Customer';
      case UserRole.restaurant:
        return 'Restaurant Partner';
      case UserRole.deliveryPartner:
        return 'Delivery Partner';
      case UserRole.admin:
        return 'Admin';
    }
  }
}

class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final UserRole role;
  final String? profileImage;
  bool isActive;
  final bool isGuest;
  final String defaultAddress;
  final List<String> savedAddresses;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.profileImage,
    this.isActive = true,
    this.isGuest = false,
    this.defaultAddress = 'Hiran Magri Sector 4, Udaipur, Rajasthan',
    this.savedAddresses = const [
      'Hiran Magri Sector 4, Udaipur',
      'Celebration Mall Road, Bhuwana, Udaipur',
      'Lake Pichola Road, Old City, Udaipur'
    ],
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role.index,
      'profileImage': profileImage,
      'isActive': isActive,
      'isGuest': isGuest,
      'defaultAddress': defaultAddress,
      'savedAddresses': savedAddresses,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 'usr_demo',
      name: json['name'] ?? 'Udaipur Foodie',
      email: json['email'] ?? 'foodie@obliq.in',
      phone: json['phone'] ?? '+91 98290 12345',
      role: UserRole.values[json['role'] ?? 0],
      profileImage: json['profileImage'],
      isActive: json['isActive'] ?? true,
      isGuest: json['isGuest'] ?? false,
      defaultAddress: json['defaultAddress'] ?? 'Hiran Magri Sector 4, Udaipur, Rajasthan',
      savedAddresses: (json['savedAddresses'] as List<dynamic>?)?.map((e) => e.toString()).toList() ??
          ['Hiran Magri Sector 4, Udaipur'],
      createdAt: json['createdAt'] != null ? DateTime.tryParse(json['createdAt']) : DateTime.now(),
    );
  }
}

class RestaurantUser extends User {
  final String restaurantId;
  final String restaurantName;
  final String address;

  RestaurantUser({
    required super.id,
    required super.name,
    required super.email,
    required super.phone,
    required this.restaurantId,
    required this.restaurantName,
    required this.address,
    super.profileImage,
    super.isActive = true,
  }) : super(role: UserRole.restaurant);
}

class DeliveryPartnerUser extends User {
  final String vehicleType;
  final String vehicleNumber;
  bool isOnline;
  double rating;
  int completedOrders;

  DeliveryPartnerUser({
    required super.id,
    required super.name,
    required super.email,
    required super.phone,
    required this.vehicleType,
    required this.vehicleNumber,
    this.isOnline = true,
    this.rating = 4.8,
    this.completedOrders = 142,
    super.profileImage,
    super.isActive = true,
  }) : super(role: UserRole.deliveryPartner);
}

class AdminUser extends User {
  final String accessLevel;

  AdminUser({
    required super.id,
    required super.name,
    required super.email,
    required super.phone,
    this.accessLevel = 'Super Admin',
    super.profileImage,
    super.isActive = true,
  }) : super(role: UserRole.admin);
}
