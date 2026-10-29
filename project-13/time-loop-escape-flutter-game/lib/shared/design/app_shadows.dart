// lib/shared/design/app_shadows.dart
import 'package:flutter/material.dart';

class AppShadows {
  static const List<BoxShadow> panelShadow = [
    BoxShadow(
      color: Color(0x59000000), // rgba(0,0,0,0.35)
      offset: Offset(0, 20),
      blurRadius: 60,
    ),
  ];

  static const List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Color(0x2E000000), // rgba(0,0,0,0.18)
      offset: Offset(0, 12),
      blurRadius: 40,
    ),
  ];

  static const List<BoxShadow> glowGold = [
    BoxShadow(
      color: Color(0x40F59E0B),
      offset: Offset(0, 4),
      blurRadius: 20,
    ),
  ];

  static const List<BoxShadow> glowCyan = [
    BoxShadow(
      color: Color(0x4022D3EE),
      offset: Offset(0, 4),
      blurRadius: 20,
    ),
  ];

  static const List<BoxShadow> glowRed = [
    BoxShadow(
      color: Color(0x50FB7185),
      offset: Offset(0, 4),
      blurRadius: 24,
    ),
  ];
}
