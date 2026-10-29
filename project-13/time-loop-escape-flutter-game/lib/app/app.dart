// lib/app/app.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/repositories/game_repository.dart';
import '../core/repositories/game_repository_impl.dart';
import '../core/services/audio_service.dart';
import '../core/services/ending_service.dart';
import '../core/services/exploration_service.dart';
import '../core/services/feedback_service.dart';
import '../core/services/game_service.dart';
import '../core/services/haptic_feedback_service.dart';
import '../core/services/hint_service.dart';
import '../core/services/interaction_service.dart';
import '../core/services/inventory_service.dart';
import '../core/services/knowledge_service.dart';
import '../core/services/navigation_service.dart';
import '../core/services/npc_service.dart';
import '../core/services/preferences_service.dart';
import '../core/services/puzzle_service.dart';
import '../core/services/time_loop_service.dart';
import '../core/storage/file_local_storage.dart';
import '../core/storage/local_storage.dart';
import '../shared/widgets/error_boundary.dart';
import 'app_config.dart';
import 'app_router.dart';
import 'app_theme.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<NavigationService>(create: (_) => NavigationService()),
        Provider<LocalStorageService>(create: (_) => FileLocalStorage()..init()),
        ChangeNotifierProxyProvider<LocalStorageService, PreferencesService>(
          create: (context) => PreferencesService(Provider.of<LocalStorageService>(context, listen: false))..init(),
          update: (_, storage, previous) => previous ?? (PreferencesService(storage)..init()),
        ),
        ProxyProvider<PreferencesService, HapticFeedbackService>(
          update: (_, pref, __) => HapticFeedbackService(pref),
        ),
        ChangeNotifierProxyProvider<PreferencesService, AudioService>(
          create: (context) => AudioService(Provider.of<PreferencesService>(context, listen: false)),
          update: (_, pref, previous) => previous ?? AudioService(pref),
        ),
        ProxyProvider2<AudioService, HapticFeedbackService, FeedbackService>(
          update: (_, audio, haptics, __) => FeedbackService(audio, haptics),
        ),
        ProxyProvider<LocalStorageService, GameRepository>(
          update: (_, storage, __) => LocalGameRepositoryImpl(storage),
        ),
        ChangeNotifierProxyProvider<GameRepository, GameService>(
          create: (context) => GameService(Provider.of<GameRepository>(context, listen: false)),
          update: (_, repo, previous) => previous ?? GameService(repo),
        ),
        ChangeNotifierProxyProvider2<GameService, FeedbackService, TimeLoopService>(
          create: (context) => TimeLoopService(
            Provider.of<GameService>(context, listen: false),
            Provider.of<FeedbackService>(context, listen: false),
          ),
          update: (_, gameService, feedbackService, previous) =>
              previous ?? TimeLoopService(gameService, feedbackService),
        ),
        ChangeNotifierProxyProvider<GameService, ExplorationService>(
          create: (context) => ExplorationService(Provider.of<GameService>(context, listen: false)),
          update: (_, gameService, previous) => previous ?? ExplorationService(gameService),
        ),
        ChangeNotifierProxyProvider2<GameService, TimeLoopService, InteractionService>(
          create: (context) => InteractionService(
            Provider.of<GameService>(context, listen: false),
            Provider.of<TimeLoopService>(context, listen: false),
          ),
          update: (_, gameService, timeLoopService, previous) =>
              previous ?? InteractionService(gameService, timeLoopService),
        ),
        ChangeNotifierProxyProvider<GameService, InventoryService>(
          create: (context) => InventoryService(Provider.of<GameService>(context, listen: false)),
          update: (_, gameService, previous) => previous ?? InventoryService(gameService),
        ),
        ChangeNotifierProxyProvider<GameService, KnowledgeService>(
          create: (context) => KnowledgeService(Provider.of<GameService>(context, listen: false)),
          update: (_, gameService, previous) => previous ?? KnowledgeService(gameService),
        ),
        ChangeNotifierProxyProvider2<GameService, TimeLoopService, PuzzleService>(
          create: (context) => PuzzleService(
            Provider.of<GameService>(context, listen: false),
            Provider.of<TimeLoopService>(context, listen: false),
          ),
          update: (_, gameService, timeLoopService, previous) =>
              previous ?? PuzzleService(gameService, timeLoopService),
        ),
        ChangeNotifierProxyProvider2<GameService, TimeLoopService, NpcService>(
          create: (context) => NpcService(
            Provider.of<GameService>(context, listen: false),
            Provider.of<TimeLoopService>(context, listen: false),
          ),
          update: (_, gameService, timeLoopService, previous) =>
              previous ?? NpcService(gameService, timeLoopService),
        ),
        ChangeNotifierProxyProvider3<GameService, TimeLoopService, PuzzleService, HintService>(
          create: (context) => HintService(
            Provider.of<GameService>(context, listen: false),
            Provider.of<TimeLoopService>(context, listen: false),
            Provider.of<PuzzleService>(context, listen: false),
          ),
          update: (_, gameService, timeLoopService, puzzleService, previous) =>
              previous ?? HintService(gameService, timeLoopService, puzzleService),
        ),
        ChangeNotifierProxyProvider<GameService, EndingService>(
          create: (context) => EndingService(Provider.of<GameService>(context, listen: false)),
          update: (_, gameService, previous) => previous ?? EndingService(gameService),
        ),
      ],
      child: Consumer<NavigationService>(
        builder: (context, navService, child) {
          return ErrorBoundary(
            child: MaterialApp(
              title: AppConfig.appTitle,
              theme: AppTheme.darkTheme,
              navigatorKey: navService.navigatorKey,
              onGenerateRoute: AppRouter.generateRoute,
              initialRoute: AppRoutes.splash,
              debugShowCheckedModeBanner: false,
            ),
          );
        },
      ),
    );
  }
}
