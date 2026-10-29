import 'package:flutter/material.dart';
import '../theme/obliq_theme.dart';

class PriceBreakdownCard extends StatelessWidget {
  final double subtotal;
  final double deliveryFee;
  final double packagingFee;
  final double platformFee;
  final double tax;
  final double discount;
  final double grandTotal;

  const PriceBreakdownCard({
    super.key,
    required this.subtotal,
    required this.deliveryFee,
    this.packagingFee = 0.0,
    this.platformFee = 0.0,
    required this.tax,
    required this.discount,
    required this.grandTotal,
  });

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.08) : Colors.grey.shade200,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Summary Breakdown',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 12),
          _row('Item Subtotal', '₹${subtotal.toStringAsFixed(2)}', isDark),
          const SizedBox(height: 8),
          _row('Delivery Fee', deliveryFee == 0 ? 'FREE' : '₹${deliveryFee.toStringAsFixed(2)}', isDark),
          if (packagingFee > 0) ...[
            const SizedBox(height: 8),
            _row('Restaurant Packaging Fee', '₹${packagingFee.toStringAsFixed(2)}', isDark),
          ],
          if (platformFee > 0) ...[
            const SizedBox(height: 8),
            _row('Platform Support Fee', '₹${platformFee.toStringAsFixed(2)}', isDark),
          ],
          const SizedBox(height: 8),
          _row('GST / Taxes (5%)', '₹${tax.toStringAsFixed(2)}', isDark),
          if (discount > 0) ...[
            const SizedBox(height: 8),
            _row('Promo Coupon Discount', '-₹${discount.toStringAsFixed(2)}', isDark, isDiscount: true),
          ],
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(height: 1),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Amount',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                ),
              ),
              Text(
                '₹${grandTotal.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: ObliqTheme.primaryOrange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _row(String label, String value, bool isDark, {bool isDiscount = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: isDiscount
                ? ObliqTheme.successGreen
                : isDark
                    ? ObliqTheme.textPrimaryDark
                    : ObliqTheme.textPrimaryLight,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}
