// lib/app/app_router.dart
import 'package:flutter/material.dart';
import '../features/ending/ending_screen.dart';
import '../features/home/home_screen.dart';
import '../features/splash/splash_screen.dart';
import '../shared/animations/app_page_route.dart';
import '../shared/design/app_colors.dart';
import '../shared/design/app_spacing.dart';
import '../shared/design/app_typography.dart';
import '../shared/widgets/app_button.dart';
import '../shared/widgets/app_card.dart';
import 'app_shell.dart';

class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';
  static const String game = '/game';
  static const String settings = '/settings';
  static const String knowledge = '/knowledge';
  static const String ending = '/ending';
}

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.splash:
        return AppPageRoute(
          page: const SplashScreen(),
          settings: settings,
        );

      case AppRoutes.home:
        return AppPageRoute(
          page: const HomeScreen(),
          settings: settings,
        );

      case AppRoutes.game:
        return AppPageRoute(
          page: const AppShell(),
          settings: settings,
        );

      case AppRoutes.ending:
        return AppPageRoute(
          page: const EndingScreen(),
          settings: settings,
        );

      case AppRoutes.settings:
        return AppPageRoute(
          page: const AppShell(
            body: Center(
              child: Padding(
                padding: EdgeInsets.all(AppSpacing.xl),
                child: AppCard(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.tune_rounded, size: 48, color: AppColors.accentCyan),
                      SizedBox(height: AppSpacing.md),
                      Text('SETTINGS & PREFERENCES', style: AppTypography.h1),
                      SizedBox(height: AppSpacing.sm),
                      Text('Audio, localization, and gameplay controls configuration.', style: AppTypography.bodyMedium),
                    ],
                  ),
                ),
              ),
            ),
          ),
          settings: settings,
        );

      default:
        // Safe non-blank unknown route handler
        return AppPageRoute(
          page: Builder(
            builder: (context) => Scaffold(
              backgroundColor: AppColors.background,
              body: Center(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: AppCard(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.location_off_rounded, size: 48, color: AppColors.danger),
                        const SizedBox(height: AppSpacing.md),
                        const Text('ROUTE NOT FOUND', style: AppTypography.h1),
                        const SizedBox(height: AppSpacing.sm),
                        Text(
                          'The route "${settings.name}" does not exist in the navigation hierarchy.',
                          style: AppTypography.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppSpacing.lg),
                        AppButton(
                          label: 'RETURN TO HOME',
                          icon: Icons.home_rounded,
                          onPressed: () {
                            Navigator.of(context).pushReplacementNamed(AppRoutes.home);
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
          settings: settings,
        );
    }
  }
}
