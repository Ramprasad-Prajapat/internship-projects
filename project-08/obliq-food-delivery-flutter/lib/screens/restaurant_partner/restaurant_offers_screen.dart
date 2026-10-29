import 'package:flutter/material.dart';
import '../../theme/obliq_theme.dart';

class RestaurantOffersScreen extends StatelessWidget {
  const RestaurantOffersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    final offers = [
      {'code': 'MEWAR50', 'title': '50% OFF up to ₹100', 'minOrder': '₹199', 'status': 'ACTIVE'},
      {'code': 'UDAIPURFOOD', 'title': 'Flat ₹75 OFF on Thali', 'minOrder': '₹249', 'status': 'ACTIVE'},
      {'code': 'LAKECITY100', 'title': 'Flat ₹100 OFF on Family Meals', 'minOrder': '₹499', 'status': 'INACTIVE'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Offers & Coupons'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'ACTIVE RESTAURANT CAMPAIGNS',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1),
            ),
            const SizedBox(height: 12),
            ...offers.map((offer) {
              bool isActive = offer['status'] == 'ACTIVE';
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
                      backgroundColor: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                      child: const Icon(Icons.local_offer, color: ObliqTheme.primaryOrange),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(offer['code']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(offer['title']!, style: const TextStyle(fontSize: 13)),
                          Text('Min Order: ${offer['minOrder']}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ),
                    Chip(
                      label: Text(offer['status']!, style: TextStyle(color: isActive ? Colors.green : Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                      backgroundColor: isActive ? Colors.green.shade50 : Colors.grey.shade100,
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('New Offer Creation Dialog opened!')),
          );
        },
        backgroundColor: ObliqTheme.primaryOrange,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Create Offer', style: TextStyle(color: Colors.white)),
      ),
    );
  }
}
