import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/role_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_switcher_modal.dart';

class AdminSettingsScreen extends StatelessWidget {
  const AdminSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final roleProvider = Provider.of<RoleProvider>(context);

    final admin = roleProvider.adminUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin System Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
                    backgroundColor: Colors.purple.shade100,
                    child: const Icon(Icons.admin_panel_settings, color: Colors.purple, size: 36),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(admin.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
                        Text('Role: ${admin.accessLevel}', style: const TextStyle(color: Colors.purple, fontWeight: FontWeight.bold, fontSize: 12)),
                        Text('Email: ${admin.email}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Role Switcher Tile
            Container(
              decoration: BoxDecoration(
                color: Colors.purple.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.purple),
              ),
              child: ListTile(
                leading: const Icon(Icons.swap_horiz, color: Colors.purple),
                title: const Text('Switch Role', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.purple)),
                subtitle: const Text('Switch active role (Customer, Restaurant, Delivery)'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.purple),
                onTap: () => RoleSwitcherModal.show(context),
              ),
            ),
            const SizedBox(height: 20),

            const Text('SYSTEM CONTROLS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.1)),
            const SizedBox(height: 8),

            _tile(Icons.cloud_done, 'Backend Engine Status', 'Offline In-Memory Engine (Udaipur Production Build)', context),
            _tile(Icons.security, 'Security Audit Logs', 'All roles permission verified', context),
            _tile(Icons.phonelink_setup, 'App Version', 'v2.4.0 (Build 50.1 MB Standalone)', context),
          ],
        ),
      ),
    );
  }

  Widget _tile(IconData icon, String title, String subtitle, BuildContext context) {
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
      ),
    );
  }
}
