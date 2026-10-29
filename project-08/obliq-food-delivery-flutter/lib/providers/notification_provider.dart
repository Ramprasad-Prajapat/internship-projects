import 'package:flutter/material.dart';

class AppNotification {
  final String id;
  final String title;
  final String message;
  final DateTime timestamp;
  final String category; // 'orders', 'offers', 'general'
  bool isRead;

  AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.timestamp,
    this.category = 'general',
    this.isRead = false,
  });
}

class NotificationProvider extends ChangeNotifier {
  final List<AppNotification> _notifications = [
    AppNotification(
      id: 'notif_1',
      title: 'Order Delivered! 🎉',
      message: 'Your order from Biryani Blues & Grills has been delivered. Enjoy your meal!',
      timestamp: DateTime.now().subtract(const Duration(minutes: 25)),
      category: 'orders',
      isRead: false,
    ),
    AppNotification(
      id: 'notif_2',
      title: 'Flat 20% OFF Mega Sale 🍕',
      message: 'Use code FOOD20 at checkout for 20% off gourmet pizza and burgers!',
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      category: 'offers',
      isRead: false,
    ),
    AppNotification(
      id: 'notif_3',
      title: 'Free Delivery Special 🚀',
      message: 'Zero delivery fees on orders above ₹199 today!',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      category: 'offers',
      isRead: true,
    ),
  ];

  List<AppNotification> get notifications => List.unmodifiable(_notifications);

  int get unreadCount => _notifications.where((n) => !n.isRead).length;

  void markAsRead(String id) {
    int index = _notifications.indexWhere((n) => n.id == id);
    if (index >= 0) {
      _notifications[index].isRead = true;
      notifyListeners();
    }
  }

  void markAllAsRead() {
    for (var n in _notifications) {
      n.isRead = true;
    }
    notifyListeners();
  }

  void clearAll() {
    _notifications.clear();
    notifyListeners();
  }
}
