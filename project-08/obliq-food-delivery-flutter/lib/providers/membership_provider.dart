import 'package:flutter/material.dart';

enum MembershipPlan { free, plus, vip }

class MembershipProvider extends ChangeNotifier {
  MembershipPlan _plan = MembershipPlan.plus;
  String _expiryDate = '31 Dec 2026';
  double _totalSavings = 1450.0;

  MembershipPlan get plan => _plan;
  bool get isPlusMember => _plan == MembershipPlan.plus || _plan == MembershipPlan.vip;
  String get planName => _plan == MembershipPlan.vip ? 'OBLIQ VIP' : (_plan == MembershipPlan.plus ? 'OBLIQ PLUS' : 'OBLIQ FREE');
  String get expiryDate => _expiryDate;
  double get totalSavings => _totalSavings;

  void upgradePlan(MembershipPlan newPlan) {
    _plan = newPlan;
    _expiryDate = '31 Dec 2026';
    if (newPlan == MembershipPlan.vip) _totalSavings += 500;
    notifyListeners();
  }

  void toggleMembership() {
    if (_plan == MembershipPlan.free) {
      _plan = MembershipPlan.plus;
    } else {
      _plan = MembershipPlan.free;
    }
    notifyListeners();
  }
}
