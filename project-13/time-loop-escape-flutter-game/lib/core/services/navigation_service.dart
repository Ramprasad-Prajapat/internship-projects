// lib/core/services/navigation_service.dart
import 'package:flutter/material.dart';

/// Global Navigation Service providing context-decoupled navigation,
/// route observation, and modal/sheet management.
class NavigationService {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  NavigatorState? get _navigator => navigatorKey.currentState;

  Future<T?>? navigateTo<T>(String routeName, {Object? arguments}) {
    return _navigator?.pushNamed<T>(routeName, arguments: arguments);
  }

  Future<T?>? pushReplacement<T, TO>(String routeName, {Object? arguments, TO? result}) {
    return _navigator?.pushReplacementNamed<T, TO>(
      routeName,
      arguments: arguments,
      result: result,
    );
  }

  Future<T?>? pushAndRemoveUntil<T>(String routeName, {Object? arguments}) {
    return _navigator?.pushNamedAndRemoveUntil<T>(
      routeName,
      (route) => false,
      arguments: arguments,
    );
  }

  void pop<T>([T? result]) {
    if (_navigator?.canPop() ?? false) {
      _navigator?.pop<T>(result);
    }
  }
}
