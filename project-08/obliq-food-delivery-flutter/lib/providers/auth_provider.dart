import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

enum AuthStatus {
  uninitialized,
  unauthenticated,
  authenticating,
  authenticated,
  guest,
}

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  AuthStatus _status = AuthStatus.uninitialized;
  User? _currentUser;
  String? _errorMessage;
  String? _pendingPhone;
  bool _isLoading = false;

  AuthStatus get status => _status;
  User? get currentUser => _currentUser;
  String? get errorMessage => _errorMessage;
  String? get pendingPhone => _pendingPhone;
  bool get isLoading => _isLoading;

  bool get isAuthenticated => _status == AuthStatus.authenticated || _status == AuthStatus.guest;
  bool get isGuest => _status == AuthStatus.guest || (_currentUser?.isGuest ?? false);

  AuthProvider() {
    initAuthSession();
  }

  Future<void> initAuthSession() async {
    _status = AuthStatus.authenticating;
    notifyListeners();

    try {
      final savedUser = await _authService.restoreSession();
      if (savedUser != null) {
        _currentUser = savedUser;
        _status = savedUser.isGuest ? AuthStatus.guest : AuthStatus.authenticated;
      } else {
        _status = AuthStatus.unauthenticated;
      }
    } catch (e) {
      _status = AuthStatus.unauthenticated;
    }
    notifyListeners();
  }

  Future<bool> requestOtp(String phone) async {
    _isLoading = true;
    _errorMessage = null;
    _pendingPhone = phone;
    notifyListeners();

    try {
      await _authService.sendMockOtp(phone);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<bool> verifyOtpAndLogin(String otp, {String? name, String? email}) async {
    if (_pendingPhone == null || _pendingPhone!.isEmpty) {
      _errorMessage = 'Phone number missing. Please try again.';
      notifyListeners();
      return false;
    }

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _authService.verifyOtpAndLogin(
        phone: _pendingPhone!,
        otp: otp,
        name: name,
        email: email,
      );
      _currentUser = user;
      _status = AuthStatus.authenticated;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString().replaceAll('Exception: ', '');
      notifyListeners();
      return false;
    }
  }

  Future<bool> loginWithGoogle() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final user = await _authService.loginWithGoogle();
      _currentUser = user;
      _status = AuthStatus.authenticated;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<void> continueAsGuest() async {
    _isLoading = true;
    notifyListeners();

    try {
      final guest = await _authService.continueAsGuest();
      _currentUser = guest;
      _status = AuthStatus.guest;
    } catch (_) {
      _currentUser = User(
        id: 'guest_fallback',
        name: 'Guest Explorer',
        email: 'guest@obliq.in',
        phone: '+91 00000 00000',
        role: UserRole.customer,
        isGuest: true,
      );
      _status = AuthStatus.guest;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _authService.logout();
    _currentUser = null;
    _pendingPhone = null;
    _status = AuthStatus.unauthenticated;
    _isLoading = false;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
