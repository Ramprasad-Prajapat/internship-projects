import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/membership_provider.dart';
import '../../theme/obliq_theme.dart';

class MembershipScreen extends StatelessWidget {
  const MembershipScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final membershipProvider = Provider.of<MembershipProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Obliq Membership Club')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Banner
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.amber.shade400.withValues(alpha: 0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.amber,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          membershipProvider.planName,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.black),
                        ),
                      ),
                      const Icon(Icons.workspace_premium, color: Colors.amber, size: 28),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Unlimited Free Delivery & Exclusive Udaipur Deals',
                    style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Valid until ${membershipProvider.expiryDate} • Saved ₹${membershipProvider.totalSavings.toStringAsFixed(0)} so far',
                    style: const TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('MEMBERSHIP PLANS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            _planCard(
              context: context,
              title: 'Obliq Free Plan',
              price: '₹0 / month',
              features: ['Standard delivery fees apply', 'Access to all Udaipur restaurants', 'Standard customer support'],
              isCurrent: membershipProvider.plan == MembershipPlan.free,
              onSelect: () => membershipProvider.upgradePlan(MembershipPlan.free),
              isDark: isDark,
            ),
            const SizedBox(height: 12),

            _planCard(
              context: context,
              title: 'Obliq Plus Plan',
              price: '₹99 / month',
              features: ['Free delivery on orders above ₹149', 'Extra 10% OFF at 100+ Udaipur eateries', 'Priority delivery matching'],
              isCurrent: membershipProvider.plan == MembershipPlan.plus,
              onSelect: () => membershipProvider.upgradePlan(MembershipPlan.plus),
              isDark: isDark,
              isPopular: true,
            ),
            const SizedBox(height: 12),

            _planCard(
              context: context,
              title: 'Obliq VIP Plan',
              price: '₹199 / 3 months',
              features: ['Zero Delivery Fee on ALL orders', 'Exclusive Lake View Dining Table Reservations', '24/7 VIP Dedicated Helpline'],
              isCurrent: membershipProvider.plan == MembershipPlan.vip,
              onSelect: () => membershipProvider.upgradePlan(MembershipPlan.vip),
              isDark: isDark,
            ),
          ],
        ),
      ),
    );
  }

  Widget _planCard({
    required BuildContext context,
    required String title,
    required String price,
    required List<String> features,
    required bool isCurrent,
    required VoidCallback onSelect,
    required bool isDark,
    bool isPopular = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isCurrent ? ObliqTheme.primaryOrange : (isPopular ? Colors.amber : (isDark ? Colors.white10 : Colors.grey.shade200)),
          width: isCurrent || isPopular ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  if (isPopular) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(6)),
                      child: const Text('MOST POPULAR', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.black)),
                    ),
                  ],
                ],
              ),
              Text(price, style: const TextStyle(fontWeight: FontWeight.bold, color: ObliqTheme.primaryOrange)),
            ],
          ),
          const SizedBox(height: 12),
          ...features.map((f) => Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green, size: 16),
                    const SizedBox(width: 8),
                    Expanded(child: Text(f, style: const TextStyle(fontSize: 12))),
                  ],
                ),
              )),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: isCurrent ? Colors.grey : ObliqTheme.primaryOrange,
              ),
              onPressed: isCurrent ? null : () {
                onSelect();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Switched to $title!'), backgroundColor: Colors.green),
                );
              },
              child: Text(isCurrent ? 'ACTIVE PLAN' : 'UPGRADE TO PLAN'),
            ),
          ),
        ],
      ),
    );
  }
}
