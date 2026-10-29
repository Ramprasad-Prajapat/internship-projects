import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/user.dart';
import '../providers/role_provider.dart';
import '../theme/obliq_theme.dart';
import 'role_switcher_modal.dart';

class RoleIndicatorBanner extends StatelessWidget {
  const RoleIndicatorBanner({super.key});

  @override
  Widget build(BuildContext context) {
    final roleProvider = Provider.of<RoleProvider>(context);

    if (roleProvider.currentRole == UserRole.customer) {
      return const SizedBox.shrink();
    }

    Color bannerColor;
    IconData roleIcon;

    switch (roleProvider.currentRole) {
      case UserRole.restaurant:
        bannerColor = Colors.indigo;
        roleIcon = Icons.storefront;
        break;
      case UserRole.deliveryPartner:
        bannerColor = Colors.green.shade700;
        roleIcon = Icons.two_wheeler;
        break;
      case UserRole.admin:
        bannerColor = Colors.purple.shade700;
        roleIcon = Icons.admin_panel_settings;
        break;
      default:
        bannerColor = ObliqTheme.primaryOrange;
        roleIcon = Icons.person;
    }

    return GestureDetector(
      onTap: () => RoleSwitcherModal.show(context),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        color: bannerColor,
        child: SafeArea(
          bottom: false,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(roleIcon, color: Colors.white, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Active Role: ${roleProvider.roleDisplayName}',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    '(${roleProvider.currentUser.email})',
                    style: const TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.25),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: const [
                    Text('Switch', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    SizedBox(width: 2),
                    Icon(Icons.swap_horiz, color: Colors.white, size: 14),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
