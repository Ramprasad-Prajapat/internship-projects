// lib/features/splash/splash_screen.dart
import 'package:flutter/material.dart';
import '../../app/app_config.dart';
import '../../app/app_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.home);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D0C10),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              '11:57',
              style: TextStyle(
                fontSize: 64,
                fontWeight: FontWeight.bold,
                letterSpacing: 4.0,
                color: Color(0xFFD4AF37),
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'THE LAST CHECK-IN',
              style: TextStyle(
                fontSize: 16,
                letterSpacing: 6.0,
                color: Color(0xFFE6E1E5),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              AppConfig.appTitle,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.white38,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
