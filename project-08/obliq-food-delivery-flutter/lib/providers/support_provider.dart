import 'package:flutter/material.dart';

enum TicketStatus { open, inProgress, resolved }

class SupportMessage {
  final String sender;
  final String text;
  final DateTime time;

  SupportMessage({required this.sender, required this.text, DateTime? time})
      : time = time ?? DateTime.now();
}

class SupportTicket {
  final String id;
  final String category;
  final String subject;
  final String description;
  TicketStatus status;
  final DateTime createdAt;
  final List<SupportMessage> messages;

  SupportTicket({
    required this.id,
    required this.category,
    required this.subject,
    required this.description,
    this.status = TicketStatus.open,
    DateTime? createdAt,
    List<SupportMessage>? messages,
  })  : createdAt = createdAt ?? DateTime.now(),
        messages = messages ?? [];
}

class SupportProvider extends ChangeNotifier {
  final List<SupportTicket> _tickets = [];

  SupportProvider() {
    _initMockTickets();
  }

  void _initMockTickets() {
    _tickets.addAll([
      SupportTicket(
        id: 'TK-8942',
        category: 'Delivery issue',
        subject: 'Delay in order delivery #ORD-8821',
        description: 'Order delivery driver was delayed near Fateh Sagar road.',
        status: TicketStatus.inProgress,
        messages: [
          SupportMessage(sender: 'User', text: 'Hi, my order is delayed by 15 mins.'),
          SupportMessage(sender: 'Support', text: 'We are checking with delivery partner Vikram Singh.'),
        ],
      ),
      SupportTicket(
        id: 'TK-7701',
        category: 'Payment issue',
        subject: 'Promo discount auto-refund',
        description: 'Applied coupon UDAIPUR50 refund credited to wallet.',
        status: TicketStatus.resolved,
        messages: [
          SupportMessage(sender: 'User', text: 'Where is my coupon cashback?'),
          SupportMessage(sender: 'Support', text: '₹50 has been credited to your Obliq Wallet!'),
        ],
      ),
    ]);
  }

  List<SupportTicket> get tickets => List.unmodifiable(_tickets);

  SupportTicket createTicket(String category, String subject, String description) {
    String id = 'TK-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
    SupportTicket ticket = SupportTicket(
      id: id,
      category: category,
      subject: subject,
      description: description,
      status: TicketStatus.open,
      messages: [
        SupportMessage(sender: 'User', text: description),
        SupportMessage(sender: 'Support', text: 'Thank you for reaching out! Obliq Udaipur support team will reply within 5 minutes.'),
      ],
    );
    _tickets.insert(0, ticket);
    notifyListeners();
    return ticket;
  }

  void addMessageToTicket(String ticketId, String messageText) {
    int idx = _tickets.indexWhere((t) => t.id == ticketId);
    if (idx != -1) {
      _tickets[idx].messages.add(SupportMessage(sender: 'User', text: messageText));
      notifyListeners();
      // Auto mock support reply after 1 sec
      Future.delayed(const Duration(seconds: 1), () {
        if (idx < _tickets.length) {
          _tickets[idx].messages.add(SupportMessage(
            sender: 'Support',
            text: 'Obliq Support Specialist is reviewing your request. Update will follow shortly.',
          ));
          notifyListeners();
        }
      });
    }
  }
}
