import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user.dart';
import '../providers/role_provider.dart';
import '../theme/obliq_theme.dart';

class RoleSwitcherModal extends StatelessWidget {
  const RoleSwitcherModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const RoleSwitcherModal(),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final roleProvider = Provider.of<RoleProvider>(context);

    final roles = [
      {
        'role': UserRole.customer,
        'title': 'Customer App',
        'subtitle': 'Order Udaipur food, browse thalis & lakeview dining',
        'icon': Icons.shopping_bag_outlined,
        'email': 'customer@obliq.app',
        'color': ObliqTheme.primaryOrange,
      },
      {
        'role': UserRole.restaurant,
        'title': 'Restaurant Partner',
        'subtitle': 'Manage menu, accept incoming orders & track revenue',
        'icon': Icons.storefront_outlined,
        'email': 'restaurant@obliq.app',
        'color': Colors.indigo,
      },
      {
        'role': UserRole.deliveryPartner,
        'title': 'Delivery Partner',
        'subtitle': 'Accept delivery requests, view earnings & navigation',
        'icon': Icons.two_wheeler_outlined,
        'email': 'delivery@obliq.app',
        'color': Colors.green.shade700,
      },
      {
        'role': UserRole.admin,
        'title': 'Admin Dashboard',
        'subtitle': 'Platform control center, restaurants & user analytics',
        'icon': Icons.admin_panel_settings_outlined,
        'email': 'admin@obliq.app',
        'color': Colors.purple.shade700,
      },
    ];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade400,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 20),

          Row(
            children: const [
              Icon(Icons.switch_account_outlined, color: ObliqTheme.primaryOrange, size: 24),
              SizedBox(width: 10),
              Text(
                'Switch App Role',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 4),
          const Text(
            'Select a demo role to experience role-based dashboards in Udaipur',
            style: TextStyle(color: Colors.grey, fontSize: 13),
          ),
          const SizedBox(height: 20),

          ...roles.map((item) {
            UserRole r = item['role'] as UserRole;
            bool isSelected = roleProvider.currentRole == r;
            Color themeColor = item['color'] as Color;

            return GestureDetector(
              onTap: () {
                roleProvider.setRole(r);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Switched to ${item['title']} (${item['email']})'),
                    backgroundColor: themeColor,
                    duration: const Duration(seconds: 2),
                  ),
                );
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isSelected
                      ? themeColor.withValues(alpha: 0.12)
                      : (isDark ? ObliqTheme.cardDark : Colors.grey.shade50),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected ? themeColor : (isDark ? Colors.white10 : Colors.grey.shade200),
                    width: isSelected ? 2 : 1,
                  ),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 22,
                      backgroundColor: themeColor.withValues(alpha: 0.2),
                      child: Icon(item['icon'] as IconData, color: themeColor, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                item['title'] as String,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: isSelected ? themeColor : null,
                                ),
                              ),
                              if (isSelected) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: themeColor,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Text(
                                    'ACTIVE',
                                    style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            item['subtitle'] as String,
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Demo login: ${item['email']}',
                            style: TextStyle(
                              color: themeColor.withValues(alpha: 0.8),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      isSelected ? Icons.check_circle : Icons.arrow_forward_ios,
                      color: isSelected ? themeColor : Colors.grey,
                      size: isSelected ? 24 : 16,
                    ),
                  ],
                ),
              ),
            );
          }),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}
