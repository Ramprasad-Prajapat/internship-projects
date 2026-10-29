import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/notification_provider.dart';
import '../../theme/obliq_theme.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _selectedCategory = 'all';

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final notifProvider = Provider.of<NotificationProvider>(context);

    final filteredNotifications = notifProvider.notifications.where((n) {
      if (_selectedCategory == 'all') return true;
      return n.category == _selectedCategory;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          if (notifProvider.notifications.isNotEmpty) ...[
            TextButton(
              onPressed: () => notifProvider.markAllAsRead(),
              child: const Text('Mark all read', style: TextStyle(fontSize: 12, color: ObliqTheme.primaryOrange)),
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, size: 20),
              onPressed: () => notifProvider.clearAll(),
              tooltip: 'Clear all',
            ),
          ],
        ],
      ),
      body: Column(
        children: [
          // Filter Tabs
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                _buildFilterChip('All', 'all', notifProvider),
                const SizedBox(width: 8),
                _buildFilterChip('Orders', 'orders', notifProvider),
                const SizedBox(width: 8),
                _buildFilterChip('Offers', 'offers', notifProvider),
              ],
            ),
          ),
          const Divider(height: 1),
          // List
          Expanded(
            child: filteredNotifications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.notifications_off_outlined, size: 70, color: Colors.grey.shade400),
                        const SizedBox(height: 16),
                        Text(
                          'No Notifications',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Text('You are all caught up!', style: TextStyle(color: Colors.grey)),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredNotifications.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = filteredNotifications[index];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: item.isRead
                              ? (isDark ? ObliqTheme.cardDark : Colors.white)
                              : ObliqTheme.primaryOrange.withValues(alpha: isDark ? 0.15 : 0.05),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: item.isRead
                                ? (isDark ? Colors.white10 : Colors.grey.shade200)
                                : ObliqTheme.primaryOrange.withValues(alpha: 0.3),
                          ),
                        ),
                        child: InkWell(
                          onTap: () => notifProvider.markAsRead(item.id),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CircleAvatar(
                                backgroundColor: item.category == 'orders'
                                    ? Colors.green.withValues(alpha: 0.2)
                                    : ObliqTheme.accentAmber.withValues(alpha: 0.2),
                                radius: 20,
                                child: Icon(
                                  item.category == 'orders' ? Icons.local_shipping : Icons.local_offer,
                                  color: item.category == 'orders' ? Colors.green : ObliqTheme.primaryOrange,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          item.title,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                        ),
                                        if (!item.isRead)
                                          Container(
                                            width: 8,
                                            height: 8,
                                            decoration: const BoxDecoration(
                                              color: ObliqTheme.primaryOrange,
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      item.message,
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
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, NotificationProvider provider) {
    bool isSelected = _selectedCategory == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: ObliqTheme.primaryOrange,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.grey.shade700,
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _selectedCategory = value;
          });
        }
      },
    );
  }
}
