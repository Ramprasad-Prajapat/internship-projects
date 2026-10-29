import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/restaurant_provider.dart';
import '../../providers/role_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_switcher_modal.dart';

class RestaurantProfileScreen extends StatelessWidget {
  const RestaurantProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final restProvider = Provider.of<RestaurantProvider>(context);
    final roleProvider = Provider.of<RoleProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Restaurant Partner Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile Card
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
                    backgroundColor: Colors.indigo.shade100,
                    child: const Icon(Icons.store, color: Colors.indigo, size: 36),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          restProvider.currentRestaurant.name,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Partner Email: ${roleProvider.currentUser.email}',
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        Text(
                          'Location: ${restProvider.currentRestaurant.address}',
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Role Switcher Tile
            Container(
              decoration: BoxDecoration(
                color: Colors.indigo.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.indigo),
              ),
              child: ListTile(
                leading: const Icon(Icons.swap_horiz, color: Colors.indigo),
                title: const Text('Switch Role', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo)),
                subtitle: const Text('Change active role (Customer, Delivery, Admin)'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.indigo),
                onTap: () => RoleSwitcherModal.show(context),
              ),
            ),
            const SizedBox(height: 20),

            const Text('RESTAURANT SETTINGS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
            const SizedBox(height: 8),

            _settingTile(Icons.access_time, 'Operating Hours', '10:00 AM - 11:00 PM Daily', context),
            _settingTile(Icons.phone, 'Contact Helpline', '+91 94141 55443', context),
            _settingTile(Icons.receipt_long, 'FSSAI License', 'LIC-214219900018', context),
            _settingTile(Icons.account_balance, 'Bank Account Payouts', 'HDFC Bank **** 9012', context),
          ],
        ),
      ),
    );
  }

  Widget _settingTile(IconData icon, String title, String subtitle, BuildContext context) {
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
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('$title details requested')),
          );
        },
      ),
    );
  }
}
