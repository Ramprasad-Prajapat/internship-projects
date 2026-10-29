import 'package:flutter/material.dart';

class DeliveryProvider extends ChangeNotifier {
  bool _isOnline = true;
  double _todayEarnings = 1450.0;
  double _weeklyEarnings = 9200.0;
  int _completedDeliveriesCount = 14;

  bool get isOnline => _isOnline;
  double get todayEarnings => _todayEarnings;
  double get weeklyEarnings => _weeklyEarnings;
  int get completedDeliveriesCount => _completedDeliveriesCount;

  void toggleOnlineStatus(bool status) {
    _isOnline = status;
    notifyListeners();
  }

  void recordCompletedDelivery(double earnings) {
    _todayEarnings += earnings;
    _weeklyEarnings += earnings;
    _completedDeliveriesCount += 1;
    notifyListeners();
  }

  List<Map<String, dynamic>> get recentEarningsHistory => [
        {
          'id': 'DEL-9901',
          'restaurant': 'Lake City Thali House',
          'locality': 'Hiran Magri Sector 4',
          'distance': '3.2 km',
          'earnings': 65.0,
          'time': '10 mins ago',
        },
        {
          'id': 'DEL-9884',
          'restaurant': 'Mewar Rasoi & Heritage Kitchen',
          'locality': 'Bhuwana',
          'distance': '4.8 km',
          'earnings': 85.0,
          'time': '1 hour ago',
        },
        {
          'id': 'DEL-9852',
          'restaurant': 'Pichola Rooftop Kitchen',
          'locality': 'Chandpole, Lake Pichola',
          'distance': '2.1 km',
          'earnings': 50.0,
          'time': '3 hours ago',
        },
      ];
}
