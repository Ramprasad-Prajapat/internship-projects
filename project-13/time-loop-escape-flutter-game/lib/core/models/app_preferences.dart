// lib/core/models/app_preferences.dart

/// User preferences model for audio, feedback, and accessibility settings.
/// Strictly decoupled from gameplay GameState.
class AppPreferences {
  final bool masterAudioEnabled;
  final bool musicEnabled;
  final bool effectsEnabled;
  final bool ambientEnabled;
  final bool hapticsEnabled;
  final bool reducedMotion;
  final bool subtitlesEnabled;
  final int stateVersion;

  const AppPreferences({
    this.masterAudioEnabled = true,
    this.musicEnabled = true,
    this.effectsEnabled = true,
    this.ambientEnabled = true,
    this.hapticsEnabled = true,
    this.reducedMotion = false,
    this.subtitlesEnabled = true,
    this.stateVersion = 1,
  });

  AppPreferences copyWith({
    bool? masterAudioEnabled,
    bool? musicEnabled,
    bool? effectsEnabled,
    bool? ambientEnabled,
    bool? hapticsEnabled,
    bool? reducedMotion,
    bool? subtitlesEnabled,
    int? stateVersion,
  }) {
    return AppPreferences(
      masterAudioEnabled: masterAudioEnabled ?? this.masterAudioEnabled,
      musicEnabled: musicEnabled ?? this.musicEnabled,
      effectsEnabled: effectsEnabled ?? this.effectsEnabled,
      ambientEnabled: ambientEnabled ?? this.ambientEnabled,
      hapticsEnabled: hapticsEnabled ?? this.hapticsEnabled,
      reducedMotion: reducedMotion ?? this.reducedMotion,
      subtitlesEnabled: subtitlesEnabled ?? this.subtitlesEnabled,
      stateVersion: stateVersion ?? this.stateVersion,
    );
  }

  Map<String, dynamic> toJson() => {
        'masterAudioEnabled': masterAudioEnabled,
        'musicEnabled': musicEnabled,
        'effectsEnabled': effectsEnabled,
        'ambientEnabled': ambientEnabled,
        'hapticsEnabled': hapticsEnabled,
        'reducedMotion': reducedMotion,
        'subtitlesEnabled': subtitlesEnabled,
        'stateVersion': stateVersion,
      };

  factory AppPreferences.fromJson(Map<String, dynamic> json) {
    return AppPreferences(
      masterAudioEnabled: json['masterAudioEnabled'] as bool? ?? true,
      musicEnabled: json['musicEnabled'] as bool? ?? true,
      effectsEnabled: json['effectsEnabled'] as bool? ?? true,
      ambientEnabled: json['ambientEnabled'] as bool? ?? true,
      hapticsEnabled: json['hapticsEnabled'] as bool? ?? true,
      reducedMotion: json['reducedMotion'] as bool? ?? false,
      subtitlesEnabled: json['subtitlesEnabled'] as bool? ?? true,
      stateVersion: (json['stateVersion'] as num?)?.toInt() ?? 1,
    );
  }
}
