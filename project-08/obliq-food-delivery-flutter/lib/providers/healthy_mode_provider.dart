import 'package:flutter/material.dart';

class HealthyModeProvider extends ChangeNotifier {
  bool _isHealthyMode = false;
  int _targetCalories = 600;
  int _targetProtein = 25;

  bool get isHealthyMode => _isHealthyMode;
  int get targetCalories => _targetCalories;
  int get targetProtein => _targetProtein;

  void toggleHealthyMode(bool val) {
    _isHealthyMode = val;
    notifyListeners();
  }

  void updateTargets(int cal, int protein) {
    _targetCalories = cal;
    _targetProtein = protein;
    notifyListeners();
  }
}
