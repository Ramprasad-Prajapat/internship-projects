import 'dart:convert';
import '../models/user.dart';
import 'storage_service.dart';

class AuthService {
  static const String _userStorageKey = 'obliq_current_user_v5';
  static const String _authStatusKey = 'obliq_auth_status_v5';

  // Offline mock OTP code for development/testing
  static const String mockOtpCode = '123456';

  Future<User?> restoreSession() async {
    try {
      final userJsonStr = await StorageService.instance.getString(_userStorageKey);
      if (userJsonStr != null && userJsonStr.isNotEmpty) {
        final Map<String, dynamic> userMap = jsonDecode(userJsonStr);
        return User.fromJson(userMap);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> sendMockOtp(String phone) async {
    // Simulates sending OTP locally without network dependency
    await Future.delayed(const Duration(milliseconds: 600));
    return true;
  }

  Future<User> verifyOtpAndLogin({
    required String phone,
    required String otp,
    String? name,
    String? email,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (otp != mockOtpCode && otp != '000000' && otp.length != 6) {
      throw Exception('Invalid Verification Code. Use demo code $mockOtpCode');
    }

    final String userId = 'usr_${phone.replaceAll(RegExp(r'\D'), '')}';
    final User user = User(
      id: userId.isNotEmpty ? userId : 'usr_9829012345',
      name: (name != null && name.isNotEmpty) ? name : 'Udaipur Foodie',
      email: (email != null && email.isNotEmpty) ? email : 'foodie@obliq.in',
      phone: phone.isNotEmpty ? phone : '+91 98290 12345',
      role: UserRole.customer,
      isGuest: false,
      defaultAddress: 'Hiran Magri Sector 4, Udaipur, Rajasthan',
    );

    await saveSession(user);
    return user;
  }

  Future<User> loginWithGoogle() async {
    await Future.delayed(const Duration(milliseconds: 600));
    final User user = User(
      id: 'usr_google_udaipur',
      name: 'Mewar Food Lover',
      email: 'mewar.foodie@gmail.com',
      phone: '+91 94140 54321',
      role: UserRole.customer,
      isGuest: false,
      defaultAddress: 'Lake Pichola Road, Old City, Udaipur, Rajasthan',
    );

    await saveSession(user);
    return user;
  }

  Future<User> continueAsGuest() async {
    final User guestUser = User(
      id: 'guest_${DateTime.now().millisecondsSinceEpoch}',
      name: 'Guest Explorer',
      email: 'guest@obliq.in',
      phone: '+91 00000 00000',
      role: UserRole.customer,
      isGuest: true,
      defaultAddress: 'Fatehpura Main Circle, Udaipur, Rajasthan',
    );

    await saveSession(guestUser);
    return guestUser;
  }

  Future<void> saveSession(User user) async {
    try {
      final jsonStr = jsonEncode(user.toJson());
      await StorageService.instance.setString(_userStorageKey, jsonStr);
      await StorageService.instance.setString(_authStatusKey, user.isGuest ? 'guest' : 'authenticated');
    } catch (_) {}
  }

  Future<void> logout() async {
    await StorageService.instance.remove(_userStorageKey);
    await StorageService.instance.remove(_authStatusKey);
  }
}
