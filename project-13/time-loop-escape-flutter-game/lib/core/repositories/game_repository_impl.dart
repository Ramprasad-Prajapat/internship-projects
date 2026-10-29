// lib/core/repositories/game_repository_impl.dart
import 'dart:async';
import 'dart:convert';
import '../errors/app_exception.dart';
import '../models/game_state.dart';
import '../storage/local_storage.dart';
import 'game_repository.dart';

/// Implementation of [GameRepository] enforcing atomic sequential writes,
/// deterministic JSON serialization, and safe corruption recovery.
class LocalGameRepositoryImpl implements GameRepository {
  static const String _saveDataKey = 'time_loop_save_game_v1';
  final LocalStorageService _storage;
  Future<void>? _activeSaveOperation;

  LocalGameRepositoryImpl(this._storage);

  @override
  Future<GameState?> loadSaveData() async {
    try {
      final rawJson = await _storage.getString(_saveDataKey);
      if (rawJson == null || rawJson.trim().isEmpty) {
        return null;
      }
      final decoded = jsonDecode(rawJson);
      if (decoded is! Map<String, dynamic>) {
        await clearSaveData();
        throw const StorageException('Corrupted game save structure: expected JSON map.');
      }
      return GameState.fromJson(decoded);
    } catch (e) {
      if (e is StorageException) rethrow;
      // Corrupt save recovery: clear corrupted key safely without crashing app
      await clearSaveData();
      throw StorageException('Corrupted game save detected and cleared safely: ${e.toString()}');
    }
  }

  @override
  Future<void> saveGameState(GameState state) async {
    // Serialized save queue guaranteeing sequential execution without race conditions
    final previousOp = _activeSaveOperation;
    final Completer<void> completer = Completer<void>();
    _activeSaveOperation = completer.future;

    try {
      if (previousOp != null) {
        try {
          await previousOp;
        } catch (_) {}
      }
      final serialized = state.toJson();
      final rawJson = jsonEncode(serialized);
      await _storage.setString(_saveDataKey, rawJson);
      completer.complete();
    } catch (e) {
      completer.completeError(
        StorageException('Failed to persist game state to local storage: ${e.toString()}'),
      );
      rethrow;
    }
  }

  @override
  Future<void> clearSaveData() async {
    try {
      await _storage.remove(_saveDataKey);
    } catch (e) {
      throw StorageException('Failed to clear local save data: ${e.toString()}');
    }
  }

  @override
  Future<bool> hasSavedGame() async {
    try {
      final raw = await _storage.getString(_saveDataKey);
      return raw != null && raw.trim().isNotEmpty;
    } catch (_) {
      return false;
    }
  }
}
