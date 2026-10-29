import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/search_provider.dart';
import '../screens/search/search_screen.dart';
import '../theme/obliq_theme.dart';

class VoiceSearchModal extends StatefulWidget {
  const VoiceSearchModal({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const VoiceSearchModal(),
    );
  }

  @override
  State<VoiceSearchModal> createState() => _VoiceSearchModalState();
}

class _VoiceSearchModalState extends State<VoiceSearchModal> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  final String _statusText = 'Listening... Say a dish or restaurant name';
  Timer? _timer;

  final List<String> _quickVoicePrompts = [
    'Dal Baati Churma',
    'Pyaaz Kachori',
    'Butter Chicken',
    'Mewari Thali',
    'Margherita Pizza',
    'Cold Coffee',
    'Ghewar',
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.25).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    // Simulate speech detection after 3 seconds if untouched
    _timer = Timer(const Duration(seconds: 3), () {
      if (mounted) {
        _selectQuery('Biryani');
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  void _selectQuery(String query) {
    _timer?.cancel();
    final searchProvider = Provider.of<SearchProvider>(context, listen: false);
    searchProvider.setQuery(query);
    searchProvider.addRecentSearch(query);

    Navigator.pop(context);
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const SearchScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? ObliqTheme.surfaceDark : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 24),

          // Animated Pulsing Mic Button
          ScaleTransition(
            scale: _pulseAnimation,
            child: Container(
              width: 90,
              height: 90,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: ObliqTheme.primaryOrange.withValues(alpha: 0.15),
                border: Border.all(color: ObliqTheme.primaryOrange, width: 2),
              ),
              child: const Center(
                child: CircleAvatar(
                  radius: 32,
                  backgroundColor: ObliqTheme.primaryOrange,
                  child: Icon(Icons.mic, color: Colors.white, size: 36),
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),

          Text(
            _statusText,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: isDark ? ObliqTheme.textPrimaryDark : ObliqTheme.textPrimaryLight,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Try saying "Paneer Butter Masala" or "Pizza Palace"',
            style: TextStyle(color: Colors.grey, fontSize: 13),
          ),
          const SizedBox(height: 24),

          // Quick Prompts
          Wrap(
            alignment: WrapAlignment.center,
            spacing: 8,
            runSpacing: 8,
            children: _quickVoicePrompts.map((prompt) {
              return ActionChip(
                avatar: const Icon(Icons.record_voice_over, size: 14, color: ObliqTheme.primaryOrange),
                label: Text(prompt, style: const TextStyle(fontSize: 12)),
                backgroundColor: ObliqTheme.primaryOrange.withValues(alpha: 0.08),
                onPressed: () => _selectQuery(prompt),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
