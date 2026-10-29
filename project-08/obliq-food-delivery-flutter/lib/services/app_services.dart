import '../models/food_item.dart';
import '../models/role_permission.dart';

class AuthService {
  Future<bool> authenticateUser(String phone, String otp) async {
    return otp == '1234' || otp == '4892';
  }

  UserPermissions getUserRolePermissions(String role) {
    return UserPermissions.getForRole(role);
  }
}

class ConnectivityService {
  bool get isConnected => true;
  String get connectionStatus => 'Online (Connected to Obliq Udaipur Mesh Network)';
}

class RoutingService {
  double calculateDistanceInKm(double lat1, double lon1, double lat2, double lon2) {
    return 3.2; // Simulated Udaipur locality distance
  }
}

class RecommendationService {
  List<FoodItem> getPersonalizedRecommendations(List<FoodItem> catalog, String favoriteCuisine) {
    return catalog.where((item) => item.category.toLowerCase().contains(favoriteCuisine.toLowerCase()) || item.rating >= 4.5).toList();
  }
}

class ReviewService {
  Future<bool> submitRestaurantReview(String restaurantId, double rating, String text) async {
    return true;
  }
}

class RewardsService {
  int calculateEarnedPoints(double orderTotal) {
    return (orderTotal / 10).floor();
  }
}

class LocationService {
  Future<String> fetchCurrentLocation() async {
    return 'Hiran Magri Sector 4, Udaipur, Rajasthan - 313002';
  }
}

class OrderService {
  Future<bool> processOrderPlacement(String orderId) async {
    return true;
  }
}

class PaymentService {
  Future<bool> simulateUpiPayment(String upiId, double amount) async {
    return true;
  }

  Future<bool> simulateCardPayment(String cardNumber, double amount) async {
    return true;
  }
}

class NotificationService {
  Future<void> sendPushNotification(String title, String body) async {
    // Simulated local push notification trigger
  }
}

class SearchService {
  List<String> filterLocalities(String query) {
    List<String> localities = [
      'Hiran Magri', 'Sector 4', 'Bhuwana', 'Fatehpura', 'Ashok Nagar',
      'Surajpole', 'Udiapole', 'Hathipole', 'Chandpole', 'Old City',
      'Lake Pichola', 'Fateh Sagar', 'Shobhagpura', 'Panchwati',
      'Saheli Nagar', 'Sukher', 'Goverdhan Vilas', 'Madri', 'Pratap Nagar',
      'Chetak Circle', 'Bhopalpura', 'Rani Road', 'Shakti Nagar',
      'Bada Bazaar', 'Gulab Bagh', 'Reti Stand', 'University Road',
    ];
    return localities.where((l) => l.toLowerCase().contains(query.toLowerCase())).toList();
  }
}

class RestaurantService {
  Future<void> updateRestaurantAvailability(String restaurantId, bool isOpen) async {
    // Repository update stub
  }
}

class DeliveryService {
  Future<void> updateDriverDutyStatus(bool isOnline) async {
    // Duty status stub
  }
}

class AdminService {
  Future<void> approveMerchantApplication(String merchantId) async {
    // Merchant onboarding stub
  }
}

class WalletService {
  Future<double> fetchWalletBalance() async {
    return 450.0;
  }
}

class CouponService {
  bool validateCoupon(String code, double orderTotal) {
    if (code == 'UDAIPUR50' || code == 'MEWAR100' || code == 'LAKECITY' || code == 'PICHOLA50') {
      return orderTotal >= 199.0;
    }
    return false;
  }
}

class SupportService {
  Future<String> submitTicket(String category, String subject, String description) async {
    return 'TK-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';
  }
}

class AnalyticsService {
  void logUserEvent(String eventName, Map<String, dynamic> params) {
    // Analytics logger stub
  }
}

class PersistenceService {
  Future<void> saveLocalState(String key, String data) async {
    // Shared preferences local cache stub
  }
}
