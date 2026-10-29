import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../theme/obliq_theme.dart';

class AdminDeliveryPartnersScreen extends StatelessWidget {
  const AdminDeliveryPartnersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Delivery Partners'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: adminProvider.deliveryPartners.length,
        itemBuilder: (context, index) {
          final partner = adminProvider.deliveryPartners[index];
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
                  radius: 26,
                  backgroundColor: Colors.green.shade100,
                  child: const Icon(Icons.two_wheeler, color: Colors.green),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(partner.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text('${partner.vehicleType} (${partner.vehicleNumber})', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('Rating: ${partner.rating} ⭐ • Orders: ${partner.completedOrders}', style: const TextStyle(fontSize: 12, color: Colors.green)),
                    ],
                  ),
                ),
                Column(
                  children: [
                    Chip(
                      label: Text(
                        partner.isActive ? 'ACTIVE' : 'SUSPENDED',
                        style: TextStyle(color: partner.isActive ? Colors.green : Colors.red, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                    Switch(
                      value: partner.isActive,
                      activeThumbColor: Colors.green,
                      onChanged: (val) {
                        adminProvider.toggleDeliveryPartnerStatus(partner.id);
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
