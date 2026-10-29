import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/membership_provider.dart';
import '../../providers/role_provider.dart';
import '../../providers/theme_provider.dart';
import '../../providers/wallet_provider.dart';
import '../../theme/obliq_theme.dart';
import '../../widgets/role_switcher_modal.dart';
import '../auth/login_screen.dart';
import '../favorites/favorites_screen.dart';
import '../membership/membership_screen.dart';
import '../offers/offers_screen.dart';
import '../orders/orders_screen.dart';
import '../support/support_screen.dart';
import '../wallet/wallet_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final String _referralCode = 'OBLIQ-UDAIPUR-2026';

  void _showReferralModal() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.card_giftcard, color: ObliqTheme.primaryOrange),
            SizedBox(width: 8),
            Text('Refer & Earn'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Share your unique Udaipur code with friends. When they place their first order, you both get ₹100 in Obliq Wallet!'),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: ObliqTheme.primaryOrange),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _referralCode,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: ObliqTheme.primaryOrange),
                  ),
                  IconButton(
                    icon: const Icon(Icons.copy, color: ObliqTheme.primaryOrange),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Referral code copied to clipboard!')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final themeProvider = Provider.of<ThemeProvider>(context);
    final roleProvider = Provider.of<RoleProvider>(context);
    final walletProvider = Provider.of<WalletProvider>(context);
    final membershipProvider = Provider.of<MembershipProvider>(context);

    final currentUser = roleProvider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Account & Profile'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // User Avatar Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isDark ? ObliqTheme.cardDark : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: ObliqTheme.primaryOrange,
                    child: Text(
                      currentUser.name.split(' ').map((e) => e.isNotEmpty ? e[0] : '').take(2).join(),
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentUser.name,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${currentUser.email} • ${currentUser.phone}',
                          style: const TextStyle(color: Colors.grey, fontSize: 12),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                          decoration: BoxDecoration(
                            color: ObliqTheme.primaryOrange.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Active Role: ${roleProvider.roleDisplayName}',
                            style: const TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Obliq Wallet Quick Card
            GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const WalletScreen()));
              },
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFFF8C00), Color(0xFFFF5252)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.account_balance_wallet, color: Colors.white, size: 32),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Obliq Wallet & Rewards',
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          Text(
                            'Balance ₹${walletProvider.balance.toStringAsFixed(2)} • ${walletProvider.rewardPoints} Pts',
                            style: const TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const WalletScreen()));
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: ObliqTheme.primaryOrange,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        minimumSize: Size.zero,
                      ),
                      child: const Text('Manage', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Membership Quick Card
            GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const MembershipScreen()));
              },
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isDark ? ObliqTheme.cardDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.amber, width: 1.5),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.workspace_premium, color: Colors.amber, size: 28),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            membershipProvider.planName,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            'Saved ₹${membershipProvider.totalSavings.toStringAsFixed(0)} on Udaipur orders',
                            style: const TextStyle(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.chevron_right, color: Colors.amber),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Role Switcher Card
            Container(
              decoration: BoxDecoration(
                color: ObliqTheme.primaryOrange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: ObliqTheme.primaryOrange, width: 1.5),
              ),
              child: ListTile(
                leading: const Icon(Icons.swap_horiz, color: ObliqTheme.primaryOrange, size: 28),
                title: const Text('Switch App Role', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: ObliqTheme.primaryOrange)),
                subtitle: const Text('Switch between Customer, Restaurant, Delivery & Admin', style: TextStyle(fontSize: 12)),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: ObliqTheme.primaryOrange),
                onTap: () => RoleSwitcherModal.show(context),
              ),
            ),
            const SizedBox(height: 20),

            // Profile Options Menu
            _menuGroup(
              'Account & Activity',
              isDark,
              [
                _menuTile(
                  Icons.receipt_long_outlined,
                  'My Orders & History',
                  'View active & past orders',
                  () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const OrdersScreen()),
                    );
                  },
                ),
                _menuTile(
                  Icons.favorite_outline,
                  'Favorite Restaurants & Dishes',
                  'Your bookmarked meals',
                  () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const FavoritesScreen()),
                    );
                  },
                ),
                _menuTile(
                  Icons.card_giftcard,
                  'Refer & Earn ₹100',
                  'Share code $_referralCode with friends',
                  _showReferralModal,
                ),
                _menuTile(
                  Icons.location_on_outlined,
                  'Saved Addresses',
                  'Hiran Magri, Bhuwana, Fateh Sagar',
                  () => _showDialog('Saved Addresses', '• Home: 14 Main Road, Sector 4, Hiran Magri, Udaipur - 313002\n• Work: Plot 104, Celebration Mall Road, Bhuwana - 313004\n• Other: 12 Promenade Circle, Fateh Sagar - 313001'),
                ),
                _menuTile(
                  Icons.payment_outlined,
                  'Payment Methods',
                  'UPI, Wallet & Cards',
                  () => _showDialog('Saved Payment Methods', '• GPay / PhonePe / Paytm UPI\n• HDFC Credit Card (**** 4242)\n• Obliq Wallet (Balance: ₹${walletProvider.balance.toStringAsFixed(2)})\n• Cash on Delivery'),
                ),
                _menuTile(
                  Icons.local_offer_outlined,
                  'Offers & Promotions',
                  'Udaipur coupons (UDAIPUR50, MEWAR100)',
                  () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const OffersScreen()),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),

            _menuGroup(
              'App Preferences',
              isDark,
              [
                ListTile(
                  leading: const Icon(Icons.dark_mode_outlined, color: ObliqTheme.primaryOrange),
                  title: const Text('Dark Mode Theme'),
                  trailing: Switch(
                    value: themeProvider.isDarkMode,
                    activeThumbColor: ObliqTheme.primaryOrange,
                    onChanged: (val) => themeProvider.toggleTheme(),
                  ),
                ),
                _menuTile(
                  Icons.language_outlined,
                  'Language Preference',
                  'English (Udaipur, India)',
                  () => _showDialog('Language Preference', 'Currently set to English (India).'),
                ),
              ],
            ),
            const SizedBox(height: 16),

            _menuGroup(
              'Support & Help',
              isDark,
              [
                _menuTile(
                  Icons.support_agent_outlined,
                  'Help & Customer Support',
                  'Support tickets, live chat & FAQs',
                  () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SupportScreen()),
                    );
                  },
                ),
                _menuTile(
                  Icons.privacy_tip_outlined,
                  'Privacy Policy & Terms',
                  'Version 2.4.0',
                  () => _showDialog('Privacy & Terms', 'Obliq Food Delivery values your privacy. Your personal information and delivery preferences are safely secured locally.'),
                ),
                _menuTile(
                  Icons.info_outline,
                  'About Obliq Udaipur Platform',
                  'Version 2.4.0 (Build 2026.08)',
                  () => _showDialog('About Obliq', 'Obliq Multi-Role Food Delivery Android App\nVersion 2.4.0\nBuild 2026.08 (Udaipur Release)\n\nBuilt with Flutter for high-performance multi-role food discovery, restaurant management, delivery partner tracking, and admin controls.'),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Logout Button
            OutlinedButton.icon(
              onPressed: () async {
                final authProvider = Provider.of<AuthProvider>(context, listen: false);
                final messenger = ScaffoldMessenger.of(context);
                final navigator = Navigator.of(context);
                await authProvider.logout();
                messenger.showSnackBar(
                  const SnackBar(content: Text('Logged out of Obliq Food Delivery session.')),
                );
                navigator.pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
              icon: const Icon(Icons.logout, color: ObliqTheme.errorRed),
              label: const Text('LOG OUT', style: TextStyle(color: ObliqTheme.errorRed, fontWeight: FontWeight.bold)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: ObliqTheme.errorRed),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDialog(String title, String content) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK', style: TextStyle(color: ObliqTheme.primaryOrange)),
          ),
        ],
      ),
    );
  }

  Widget _menuGroup(String title, bool isDark, List<Widget> children) {
    return Material(
      color: isDark ? ObliqTheme.cardDark : Colors.white,
      borderRadius: BorderRadius.circular(16),
      clipBehavior: Clip.antiAlias,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: Text(
                title,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey),
              ),
            ),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _menuTile(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: ObliqTheme.primaryOrange),
      title: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
      subtitle: subtitle.isNotEmpty ? Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)) : null,
      trailing: const Icon(Icons.chevron_right, size: 20, color: Colors.grey),
      onTap: onTap,
    );
  }
}
