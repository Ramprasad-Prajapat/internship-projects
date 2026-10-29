import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../theme/obliq_theme.dart';

class AdminCustomersScreen extends StatelessWidget {
  const AdminCustomersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Customer Directory'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: adminProvider.customers.length,
        itemBuilder: (context, index) {
          final cust = adminProvider.customers[index];
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
                  radius: 24,
                  backgroundColor: Colors.blue.shade100,
                  child: const Icon(Icons.person, color: Colors.blue),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(cust.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                      Text(cust.email, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                      Text('Phone: ${cust.phone}', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
                Switch(
                  value: cust.isActive,
                  activeThumbColor: Colors.blue,
                  onChanged: (val) {
                    adminProvider.toggleCustomerStatus(cust.id);
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
