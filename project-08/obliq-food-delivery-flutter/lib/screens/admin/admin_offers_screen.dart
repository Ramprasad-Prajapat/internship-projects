import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/coupon_provider.dart';
import '../../theme/obliq_theme.dart';

class AdminOffersScreen extends StatelessWidget {
  const AdminOffersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final couponProvider = Provider.of<CouponProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Global Platform Coupons'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: couponProvider.coupons.length,
        itemBuilder: (context, index) {
          final coupon = couponProvider.coupons[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: isDark ? ObliqTheme.cardDark : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.purple.withValues(alpha: 0.1),
                  child: const Icon(Icons.confirmation_number_outlined, color: Colors.purple),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(coupon.code, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text(coupon.description, style: const TextStyle(fontSize: 13)),
                      Text('Min Order: ₹${coupon.minOrderAmount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
                Chip(
                  label: const Text('GLOBAL', style: TextStyle(color: Colors.purple, fontSize: 10, fontWeight: FontWeight.bold)),
                  backgroundColor: Colors.purple.shade50,
                ),
              ],
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Create Global Platform Coupon modal opened!')),
          );
        },
        backgroundColor: Colors.purple,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Global Coupon', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
