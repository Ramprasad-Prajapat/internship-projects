import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/delivery_provider.dart';
import '../../providers/role_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_switcher_modal.dart';

class DeliveryProfileScreen extends StatelessWidget {
  const DeliveryProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final deliveryProvider = Provider.of<DeliveryProvider>(context);
    final roleProvider = Provider.of<RoleProvider>(context);

    final user = roleProvider.deliveryUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Partner Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Header Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: Colors.green.shade100,
                    child: const Icon(Icons.two_wheeler, color: Colors.green, size: 36),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                        Text('Vehicle: ${user.vehicleType} (${user.vehicleNumber})', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                        Text('Rating: ${user.rating} ⭐ • Deliveries: ${user.completedOrders}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Online Toggle Row
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: deliveryProvider.isOnline ? Colors.green.shade50 : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: deliveryProvider.isOnline ? Colors.green : Colors.grey),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    deliveryProvider.isOnline ? "Duty Status: ONLINE 🟢" : "Duty Status: OFFLINE ⚪",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: deliveryProvider.isOnline ? Colors.green.shade800 : Colors.grey.shade800),
                  ),
                  Switch(
                    value: deliveryProvider.isOnline,
                    activeThumbColor: Colors.green,
                    onChanged: (val) => deliveryProvider.toggleOnlineStatus(val),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Role Switcher Tile
            Container(
              decoration: BoxDecoration(
                color: Colors.green.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.green),
              ),
              child: ListTile(
                leading: const Icon(Icons.swap_horiz, color: Colors.green),
                title: const Text('Switch Role', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                subtitle: const Text('Change active role (Customer, Restaurant, Admin)'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.green),
                onTap: () => RoleSwitcherModal.show(context),
              ),
            ),
            const SizedBox(height: 20),

            const Text('PARTNER PREFERENCES & DOCUMENTS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
            const SizedBox(height: 8),

            _infoTile(Icons.badge, 'Driving License', 'RJ-27-2022-009182', context),
            _infoTile(Icons.verified, 'KYC Verification', 'Verified (Aadhaar Linked)', context),
            _infoTile(Icons.phone, 'Emergency Support', '+91 94140 00111', context),
            _infoTile(Icons.account_balance, 'Bank Account Payout', 'State Bank of India **** 4810', context),
          ],
        ),
      ),
    );
  }

  Widget _infoTile(IconData icon, String title, String value, BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.grey),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
        subtitle: Text(value, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$title inspected')),
          );
        },
      ),
    );
  }
}
