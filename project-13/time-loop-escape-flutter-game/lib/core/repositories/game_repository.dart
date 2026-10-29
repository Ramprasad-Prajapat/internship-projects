// lib/core/repositories/game_repository.dart
import '../models/game_state.dart';

abstract class GameRepository {
  Future<GameState?> loadSaveData();
  Future<void> saveGameState(GameState state);
  Future<void> clearSaveData();
  Future<bool> hasSavedGame();
}
