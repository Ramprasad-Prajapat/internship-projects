import 'package:flutter/material.dart';

class WalletTransaction {
  final String id;
  final String title;
  final double amount;
  final bool isCredit;
  final DateTime date;

  WalletTransaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.isCredit,
    required this.date,
  });
}

class WalletProvider extends ChangeNotifier {
  double _balance = 450.0;
  int _rewardPoints = 350;
  final List<WalletTransaction> _transactions = [];

  WalletProvider() {
    _initMockTransactions();
  }

  void _initMockTransactions() {
    _transactions.addAll([
      WalletTransaction(
        id: 'TXN-109',
        title: 'Welcome Cashback Offer',
        amount: 200.0,
        isCredit: true,
        date: DateTime.now().subtract(const Duration(days: 2)),
      ),
      WalletTransaction(
        id: 'TXN-104',
        title: 'Added Money via GPay',
        amount: 300.0,
        isCredit: true,
        date: DateTime.now().subtract(const Duration(days: 5)),
      ),
      WalletTransaction(
        id: 'TXN-101',
        title: 'Paid for Order #ORD-8810',
        amount: 50.0,
        isCredit: false,
        date: DateTime.now().subtract(const Duration(days: 7)),
      ),
    ]);
  }

  double get balance => _balance;
  int get rewardPoints => _rewardPoints;
  List<WalletTransaction> get transactions => List.unmodifiable(_transactions);

  void addMoney(double amount, String paymentMethod) {
    _balance += amount;
    _transactions.insert(
      0,
      WalletTransaction(
        id: 'TXN-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        title: 'Added Money via $paymentMethod',
        amount: amount,
        isCredit: true,
        date: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  bool payFromWallet(double amount, String orderId) {
    if (_balance >= amount) {
      _balance -= amount;
      _transactions.insert(
        0,
        WalletTransaction(
          id: 'TXN-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
          title: 'Paid for Order #$orderId',
          amount: amount,
          isCredit: false,
          date: DateTime.now(),
        ),
      );
      // Earn 10 points per ₹100 spent
      _rewardPoints += (amount / 10).floor();
      notifyListeners();
      return true;
    }
    return false;
  }

  void redeemPoints(int points) {
    if (_rewardPoints >= points) {
      _rewardPoints -= points;
      double walletValue = (points / 10).toDouble(); // 10 points = ₹1
      _balance += walletValue;
      _transactions.insert(
        0,
        WalletTransaction(
          id: 'TXN-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
          title: 'Redeemed $points Reward Points',
          amount: walletValue,
          isCredit: true,
          date: DateTime.now(),
        ),
      );
      notifyListeners();
    }
  }
}
