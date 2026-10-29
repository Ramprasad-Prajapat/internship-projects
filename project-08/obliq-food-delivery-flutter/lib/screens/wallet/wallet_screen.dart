import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/wallet_provider.dart';
import '../../theme/obliq_theme.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  void _showAddMoneyDialog(BuildContext context, WalletProvider walletProvider) {
    TextEditingController amountCtrl = TextEditingController(text: '500');
    String selectedMethod = 'UPI (Google Pay)';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Row(
          children: [
            Icon(Icons.account_balance_wallet, color: ObliqTheme.primaryOrange),
            SizedBox(width: 8),
            Text('Add Money to Wallet'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Enter amount to add (₹):', style: TextStyle(fontSize: 13)),
            const SizedBox(height: 8),
            TextField(
              controller: amountCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                prefixText: '₹ ',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Select Payment Option:', style: TextStyle(fontSize: 13)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: selectedMethod,
              items: const [
                DropdownMenuItem(value: 'UPI (Google Pay)', child: Text('Google Pay')),
                DropdownMenuItem(value: 'UPI (PhonePe)', child: Text('PhonePe')),
                DropdownMenuItem(value: 'Debit/Credit Card', child: Text('Debit / Credit Card')),
                DropdownMenuItem(value: 'Net Banking', child: Text('Net Banking')),
              ],
              onChanged: (val) {
                if (val != null) selectedMethod = val;
              },
              decoration: const InputDecoration(border: OutlineInputBorder()),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
            onPressed: () {
              double amt = double.tryParse(amountCtrl.text.trim()) ?? 0;
              if (amt > 0) {
                walletProvider.addMoney(amt, selectedMethod);
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Successfully added ₹${amt.toStringAsFixed(2)} to Obliq Wallet!'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            child: const Text('Add Money Now'),
          ),
        ],
      ),
    );
  }

  void _showRedeemModal(BuildContext context, WalletProvider walletProvider) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Redeem Reward Points (${walletProvider.rewardPoints} pts)', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('10 Reward Points = ₹1.00 Wallet Money', style: TextStyle(color: Colors.grey, fontSize: 13)),
            const SizedBox(height: 20),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.amber, child: Icon(Icons.card_giftcard, color: Colors.white)),
              title: const Text('Redeem 100 Points → ₹10 Wallet Credit'),
              trailing: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
                onPressed: walletProvider.rewardPoints >= 100
                    ? () {
                        walletProvider.redeemPoints(100);
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Redeemed 100 points! ₹10 credited to wallet.'), backgroundColor: Colors.green),
                        );
                      }
                    : null,
                child: const Text('Redeem'),
              ),
            ),
            ListTile(
              leading: const CircleAvatar(backgroundColor: Colors.orange, child: Icon(Icons.card_giftcard, color: Colors.white)),
              title: const Text('Redeem 250 Points → ₹25 Wallet Credit'),
              trailing: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: ObliqTheme.primaryOrange),
                onPressed: walletProvider.rewardPoints >= 250
                    ? () {
                        walletProvider.redeemPoints(250);
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Redeemed 250 points! ₹25 credited to wallet.'), backgroundColor: Colors.green),
                        );
                      }
                    : null,
                child: const Text('Redeem'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;
    final walletProvider = Provider.of<WalletProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Obliq Wallet & Rewards')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFE65100), Color(0xFFF57C00)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.orange.withValues(alpha: 0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('OBLIQ CASH BALANCE', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
                      Icon(Icons.account_balance_wallet, color: Colors.white, size: 24),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '₹${walletProvider.balance.toStringAsFixed(2)}',
                    style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => _showAddMoneyDialog(context, walletProvider),
                        icon: const Icon(Icons.add, size: 18, color: ObliqTheme.primaryOrange),
                        label: const Text('ADD MONEY', style: TextStyle(color: ObliqTheme.primaryOrange, fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      OutlinedButton.icon(
                        onPressed: () => _showRedeemModal(context, walletProvider),
                        icon: const Icon(Icons.stars, size: 18, color: Colors.white),
                        label: Text('${walletProvider.rewardPoints} Pts', style: const TextStyle(color: Colors.white)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: Colors.white),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('TRANSACTION HISTORY', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.1)),
            const SizedBox(height: 12),

            ...walletProvider.transactions.map((txn) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: isDark ? ObliqTheme.cardDark : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        backgroundColor: txn.isCredit ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                        child: Icon(txn.isCredit ? Icons.arrow_downward : Icons.arrow_upward, color: txn.isCredit ? Colors.green : Colors.red),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(txn.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                            Text('${txn.date.day}/${txn.date.month}/${txn.date.year}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                      ),
                      Text(
                        '${txn.isCredit ? "+" : "-"}₹${txn.amount.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: txn.isCredit ? Colors.green : Colors.red,
                        ),
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}
