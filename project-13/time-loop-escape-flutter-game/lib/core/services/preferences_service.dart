// lib/core/services/preferences_service.dart
import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/app_preferences.dart';
import '../storage/local_storage.dart';

/// Domain service managing user settings, audio toggles, haptics, and accessibility preferences.
/// Persists preferences through the existing [LocalStorageService] architecture.
class PreferencesService extends ChangeNotifier {
  static const String _prefStorageKey = 'time_loop_user_preferences_v1';
  final LocalStorageService _storage;
  AppPreferences _preferences = const AppPreferences();
  bool _isInitialized = false;

  PreferencesService(this._storage);

  AppPreferences get preferences => _preferences;
  bool get isInitialized => _isInitialized;

  bool get masterAudioEnabled => _preferences.masterAudioEnabled;
  bool get musicEnabled => _preferences.musicEnabled;
  bool get effectsEnabled => _preferences.effectsEnabled;
  bool get ambientEnabled => _preferences.ambientEnabled;
  bool get hapticsEnabled => _preferences.hapticsEnabled;
  bool get reducedMotion => _preferences.reducedMotion;
  bool get subtitlesEnabled => _preferences.subtitlesEnabled;

  /// Load user preferences from local storage.
  Future<void> init() async {
    if (_isInitialized) return;
    try {
      final rawJson = await _storage.getString(_prefStorageKey);
      if (rawJson != null && rawJson.trim().isNotEmpty) {
        final decoded = jsonDecode(rawJson);
        if (decoded is Map<String, dynamic>) {
          _preferences = AppPreferences.fromJson(decoded);
        }
      }
    } catch (_) {
      // Recovery fallback for missing or corrupted preference files
      _preferences = const AppPreferences();
      await _savePreferences();
    } finally {
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<void> _savePreferences() async {
    try {
      final jsonString = jsonEncode(_preferences.toJson());
      await _storage.setString(_prefStorageKey, jsonString);
    } catch (_) {
      // Non-fatal error handling for storage write issues
    }
  }

  Future<void> updatePreferences(AppPreferences newPreferences) async {
    _preferences = newPreferences;
    await _savePreferences();
    notifyListeners();
  }

  Future<void> setMasterAudioEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(masterAudioEnabled: enabled));
  }

  Future<void> setMusicEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(musicEnabled: enabled));
  }

  Future<void> setEffectsEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(effectsEnabled: enabled));
  }

  Future<void> setAmbientEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(ambientEnabled: enabled));
  }

  Future<void> setHapticsEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(hapticsEnabled: enabled));
  }

  Future<void> setReducedMotion(bool enabled) async {
    await updatePreferences(_preferences.copyWith(reducedMotion: enabled));
  }

  Future<void> setSubtitlesEnabled(bool enabled) async {
    await updatePreferences(_preferences.copyWith(subtitlesEnabled: enabled));
  }

  Future<void> resetToDefaults() async {
    await updatePreferences(const AppPreferences());
  }
}
