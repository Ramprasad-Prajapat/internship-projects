import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/restaurant.dart';
import '../../providers/admin_provider.dart';
import '../../theme/obliq_theme.dart';

class AdminRestaurantsScreen extends StatelessWidget {
  const AdminRestaurantsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Restaurant Directory'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: adminProvider.restaurants.length,
        itemBuilder: (context, index) {
          final rest = adminProvider.restaurants[index];
          bool isApproved = rest.status == RestaurantStatus.active || rest.status == RestaurantStatus.approved;

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
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    rest.imageUrl,
                    width: 70,
                    height: 70,
                    fit: BoxFit.cover,
                    errorBuilder: (c, e, s) => Container(width: 70, height: 70, color: Colors.grey, child: const Icon(Icons.store)),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(rest.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text(rest.address, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('Cuisine: ${rest.cuisine} • Rating: ${rest.rating} ⭐', style: const TextStyle(fontSize: 12, color: ObliqTheme.primaryOrange)),
                    ],
                  ),
                ),
                Column(
                  children: [
                    Chip(
                      label: Text(
                        isApproved ? 'ACTIVE' : 'SUSPENDED',
                        style: TextStyle(color: isApproved ? Colors.green : Colors.red, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                      backgroundColor: isApproved ? Colors.green.shade50 : Colors.red.shade50,
                    ),
                    Switch(
                      value: isApproved,
                      activeThumbColor: Colors.green,
                      onChanged: (val) {
                        adminProvider.toggleRestaurantStatus(
                          rest.id,
                          val ? RestaurantStatus.active : RestaurantStatus.suspended,
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
