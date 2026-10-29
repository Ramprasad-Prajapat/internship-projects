import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/support_provider.dart';
import '../../theme/obliq_theme.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  void _showNewTicketModal(BuildContext context, SupportProvider supportProvider) {
    TextEditingController subjectCtrl = TextEditingController();
    TextEditingController descCtrl = TextEditingController();
    String selectedCategory = 'Delivery issue';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Create Support Ticket'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Issue Category:', style: TextStyle(fontSize: 12)),
            DropdownButtonFormField<String>(
              initialValue: selectedCategory,
              items: const [
                DropdownMenuItem(value: 'Delivery issue', child: Text('Delivery issue')),
                DropdownMenuItem(value: 'Order issue', child: Text('Order issue / Food quality')),
                DropdownMenuItem(value: 'Payment issue', child: Text('Payment / Refund issue')),
                DropdownMenuItem(value: 'Restaurant issue', child: Text('Restaurant complaint')),
                DropdownMenuItem(value: 'Other', child: Text('Other inquiry')),
              ],
              onChanged: (val) {
                if (val != null) selectedCategory = val;
              },
              decoration: const InputDecoration(border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: subjectCtrl,
              decoration: const InputDecoration(labelText: 'Subject', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: descCtrl,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Detailed Description', border: OutlineInputBorder()),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
            onPressed: () {
              if (subjectCtrl.text.isNotEmpty && descCtrl.text.isNotEmpty) {
                supportProvider.createTicket(selectedCategory, subjectCtrl.text.trim(), descCtrl.text.trim());
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Support ticket created! Our team will respond shortly.'), backgroundColor: Colors.green),
                );
              }
            },
            child: const Text('Submit Ticket'),
          ),
        ],
      ),
    );
  }

  void _openChatModal(BuildContext context, SupportTicket ticket, SupportProvider supportProvider) {
    TextEditingController msgCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) => Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom, left: 16, right: 16, top: 16),
          child: SizedBox(
            height: 450,
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Ticket #${ticket.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    IconButton(onPressed: () => Navigator.pop(ctx), icon: const Icon(Icons.close)),
                  ],
                ),
                Text(ticket.subject, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const Divider(),
                Expanded(
                  child: ListView.builder(
                    itemCount: ticket.messages.length,
                    itemBuilder: (context, index) {
                      final msg = ticket.messages[index];
                      bool isUser = msg.sender == 'User';
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Align(
                          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: isUser ? ObliqTheme.primaryOrange : Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              msg.text,
                              style: TextStyle(color: isUser ? Colors.white : Colors.black87, fontSize: 13),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: msgCtrl,
                          decoration: const InputDecoration(hintText: 'Type your message...', border: OutlineInputBorder()),
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.send, color: ObliqTheme.primaryOrange),
                        onPressed: () {
                          if (msgCtrl.text.trim().isNotEmpty) {
                            supportProvider.addMessageToTicket(ticket.id, msgCtrl.text.trim());
                            msgCtrl.clear();
                            setState(() {});
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final supportProvider = Provider.of<SupportProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Help & Customer Support')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showNewTicketModal(context, supportProvider),
        icon: const Icon(Icons.add_comment),
        label: const Text('Raise Ticket'),
        backgroundColor: ObliqTheme.primaryOrange,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Emergency Contact Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.blue),
              ),
              child: const Row(
                children: [
                  Icon(Icons.headset_mic, color: Colors.blue, size: 36),
                  SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('24/7 Udaipur Care Helpline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.blue)),
                        Text('Call +91 0294 2800999 or chat with support below.', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('MY SUPPORT TICKETS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            ...supportProvider.tickets.map((t) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? ObliqTheme.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Ticket #${t.id}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: t.status == TicketStatus.resolved ? Colors.green.withValues(alpha: 0.1) : Colors.orange.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              t.status.name.toUpperCase(),
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: t.status == TicketStatus.resolved ? Colors.green : Colors.orange,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(t.subject, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text(t.description, style: const TextStyle(color: Colors.grey, fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton.icon(
                          onPressed: () => _openChatModal(context, t, supportProvider),
                          icon: const Icon(Icons.chat_bubble_outline, size: 16),
                          label: const Text('Open Chat'),
                        ),
                      ),
                    ],
                  ),
                )),

            const SizedBox(height: 24),
            const Text('FREQUENTLY ASKED QUESTIONS', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            const ExpansionTile(title: Text('How does Delivery OTP work?'), children: [Padding(padding: EdgeInsets.all(12), child: Text('When your delivery partner arrives, share the 4-digit OTP shown on your order tracking screen to confirm handover.'))]),
            const ExpansionTile(title: Text('What is the minimum order value in Udaipur?'), children: [Padding(padding: EdgeInsets.all(12), child: Text('Minimum order amount is ₹99 across all localities in Udaipur.'))]),
            const ExpansionTile(title: Text('How do wallet refunds work?'), children: [Padding(padding: EdgeInsets.all(12), child: Text('In case of cancelled orders or promo cashback, funds are instantly credited to your Obliq Wallet.'))]),
          ],
        ),
      ),
    );
  }
}
