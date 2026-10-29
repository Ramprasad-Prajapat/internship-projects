import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../theme/obliq_theme.dart';

class OffersScreen extends StatelessWidget {
  const OffersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Map<String, String>> coupons = [
      {
        'code': 'OBLIQ10',
        'title': '10% Instant Discount',
        'desc': 'Get 10% off on all food orders above ₹149.',
        'tag': 'MOST POPULAR',
        'expiry': 'Valid till 31 Dec',
      },
      {
        'code': 'FOOD20',
        'title': '20% Mega Savings',
        'desc': 'Save 20% on premium dining & gourmet burgers.',
        'tag': 'BEST VALUE',
        'expiry': 'Valid till 25 Dec',
      },
      {
        'code': 'WELCOME',
        'title': '₹100 Flat Off',
        'desc': 'Special welcome discount for new Obliq foodies.',
        'tag': 'NEW USER',
        'expiry': 'Valid for 7 days',
      },
      {
        'code': 'FREEDELIVERY',
        'title': 'Free Unlimited Delivery',
        'desc': 'Zero delivery fees on orders from featured restaurants.',
        'tag': 'FREE SHIPPING',
        'expiry': 'Valid today',
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Offers & Promo Codes'),
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Banner Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [ObliqTheme.primaryOrange, ObliqTheme.accentAmber],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(Icons.local_offer, size: 48, color: Colors.white),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Hungry for Savings?',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Apply promo codes at checkout for instant discounts on every meal!',
                        style: TextStyle(fontSize: 13, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'AVAILABLE COUPONS',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          ...coupons.map((coupon) => _buildCouponCard(context, coupon, isDark)),
        ],
      ),
    );
  }

  Widget _buildCouponCard(BuildContext context, Map<String, String> coupon, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.confirmation_number, color: ObliqTheme.primaryOrange, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            coupon['title']!,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: ObliqTheme.accentAmber.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              coupon['tag']!,
                              style: const TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFFD84315),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        coupon['desc']!,
                        style: TextStyle(
                          fontSize: 13,
                          color: isDark ? ObliqTheme.textSecondaryDark : ObliqTheme.textSecondaryLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Divider(height: 1, color: isDark ? Colors.white10 : Colors.grey.shade200),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.schedule, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(
                      coupon['expiry']!,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ],
                ),
                InkWell(
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: coupon['code']!));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Coupon "${coupon['code']}" copied to clipboard!'),
                        backgroundColor: ObliqTheme.primaryOrange,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      border: Border.all(color: ObliqTheme.primaryOrange),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'COPY CODE: ${coupon['code']}',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: ObliqTheme.primaryOrange,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
