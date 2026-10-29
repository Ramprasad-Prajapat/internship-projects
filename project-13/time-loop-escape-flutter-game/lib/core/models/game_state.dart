// lib/core/models/game_state.dart

/// Game Lifecycle Phase representing the active state machine phase.
enum GameLifecyclePhase {
  newGame,
  loopActive,
  investigation,
  loopResetting,
  loopCompleted,
}

List<String> _safeStringList(dynamic raw) {
  if (raw is! List) return const [];
  return raw.map((e) => e?.toString() ?? '').where((s) => s.isNotEmpty).toList();
}

Map<String, dynamic> _safeMap(dynamic raw) {
  if (raw is! Map) return const {};
  return Map<String, dynamic>.from(raw);
}

/// Resettable world state that resets at midnight (every 5-minute loop).
class ResettableWorldState {
  final String playerLocationId;
  final Map<String, dynamic> roomStates;
  final Map<String, dynamic> npcPositions;
  final Map<String, dynamic> npcStates;
  final Map<String, dynamic> activePuzzleStates;
  final List<String> physicalInventoryItemIds;

  const ResettableWorldState({
    this.playerLocationId = 'lobby_reception',
    this.roomStates = const {},
    this.npcPositions = const {},
    this.npcStates = const {},
    this.activePuzzleStates = const {},
    this.physicalInventoryItemIds = const [],
  });

  ResettableWorldState copyWith({
    String? playerLocationId,
    Map<String, dynamic>? roomStates,
    Map<String, dynamic>? npcPositions,
    Map<String, dynamic>? npcStates,
    Map<String, dynamic>? activePuzzleStates,
    List<String>? physicalInventoryItemIds,
  }) {
    return ResettableWorldState(
      playerLocationId: playerLocationId ?? this.playerLocationId,
      roomStates: roomStates ?? Map<String, dynamic>.from(this.roomStates),
      npcPositions: npcPositions ?? Map<String, dynamic>.from(this.npcPositions),
      npcStates: npcStates ?? Map<String, dynamic>.from(this.npcStates),
      activePuzzleStates: activePuzzleStates ?? Map<String, dynamic>.from(this.activePuzzleStates),
      physicalInventoryItemIds: physicalInventoryItemIds ?? List<String>.from(this.physicalInventoryItemIds),
    );
  }

  Map<String, dynamic> toJson() => {
        'playerLocationId': playerLocationId,
        'roomStates': roomStates,
        'npcPositions': npcPositions,
        'npcStates': npcStates,
        'activePuzzleStates': activePuzzleStates,
        'physicalInventoryItemIds': physicalInventoryItemIds,
      };

  factory ResettableWorldState.fromJson(Map<String, dynamic> json) {
    return ResettableWorldState(
      playerLocationId: json['playerLocationId']?.toString() ?? 'lobby_reception',
      roomStates: _safeMap(json['roomStates']),
      npcPositions: _safeMap(json['npcPositions']),
      npcStates: _safeMap(json['npcStates']),
      activePuzzleStates: _safeMap(json['activePuzzleStates']),
      physicalInventoryItemIds: _safeStringList(json['physicalInventoryItemIds']),
    );
  }
}

/// Persistent player knowledge that survives every loop reset.
class PersistentKnowledgeState {
  final List<String> discoveredClueIds;
  final List<String> unlockedCodeIds;
  final List<String> knowledgeBoardTopicIds;
  final List<String> unlockedDialogueTopicIds;
  final List<String> anchoredItemIds;
  final List<String> unlockedEndings;
  final List<String> revealedHintIds;
  final int currentChapter;
  final int stateVersion;
  final String? completedEndingId;
  final String? endingCompletedAt;

  const PersistentKnowledgeState({
    this.discoveredClueIds = const [],
    this.unlockedCodeIds = const [],
    this.knowledgeBoardTopicIds = const [],
    this.unlockedDialogueTopicIds = const [],
    this.anchoredItemIds = const [],
    this.unlockedEndings = const [],
    this.revealedHintIds = const [],
    this.currentChapter = 1,
    this.stateVersion = 1,
    this.completedEndingId,
    this.endingCompletedAt,
  });

  bool get isEndingCompleted => completedEndingId != null && completedEndingId!.isNotEmpty;

  PersistentKnowledgeState copyWith({
    List<String>? discoveredClueIds,
    List<String>? unlockedCodeIds,
    List<String>? knowledgeBoardTopicIds,
    List<String>? unlockedDialogueTopicIds,
    List<String>? anchoredItemIds,
    List<String>? unlockedEndings,
    List<String>? revealedHintIds,
    int? currentChapter,
    int? stateVersion,
    String? completedEndingId,
    String? endingCompletedAt,
  }) {
    return PersistentKnowledgeState(
      discoveredClueIds: discoveredClueIds ?? List<String>.from(this.discoveredClueIds),
      unlockedCodeIds: unlockedCodeIds ?? List<String>.from(this.unlockedCodeIds),
      knowledgeBoardTopicIds: knowledgeBoardTopicIds ?? List<String>.from(this.knowledgeBoardTopicIds),
      unlockedDialogueTopicIds: unlockedDialogueTopicIds ?? List<String>.from(this.unlockedDialogueTopicIds),
      anchoredItemIds: anchoredItemIds ?? List<String>.from(this.anchoredItemIds),
      unlockedEndings: unlockedEndings ?? List<String>.from(this.unlockedEndings),
      revealedHintIds: revealedHintIds ?? List<String>.from(this.revealedHintIds),
      currentChapter: currentChapter ?? this.currentChapter,
      stateVersion: stateVersion ?? this.stateVersion,
      completedEndingId: completedEndingId ?? this.completedEndingId,
      endingCompletedAt: endingCompletedAt ?? this.endingCompletedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'discoveredClueIds': discoveredClueIds,
        'unlockedCodeIds': unlockedCodeIds,
        'knowledgeBoardTopicIds': knowledgeBoardTopicIds,
        'unlockedDialogueTopicIds': unlockedDialogueTopicIds,
        'anchoredItemIds': anchoredItemIds,
        'unlockedEndings': unlockedEndings,
        'revealedHintIds': revealedHintIds,
        'currentChapter': currentChapter,
        'stateVersion': stateVersion,
        'completedEndingId': completedEndingId,
        'endingCompletedAt': endingCompletedAt,
      };

  factory PersistentKnowledgeState.fromJson(Map<String, dynamic> json) {
    return PersistentKnowledgeState(
      discoveredClueIds: _safeStringList(json['discoveredClueIds']),
      unlockedCodeIds: _safeStringList(json['unlockedCodeIds']),
      knowledgeBoardTopicIds: _safeStringList(json['knowledgeBoardTopicIds']),
      unlockedDialogueTopicIds: _safeStringList(json['unlockedDialogueTopicIds']),
      anchoredItemIds: _safeStringList(json['anchoredItemIds']),
      unlockedEndings: _safeStringList(json['unlockedEndings']),
      revealedHintIds: _safeStringList(json['revealedHintIds']),
      currentChapter: (json['currentChapter'] as num?)?.toInt() ?? 1,
      stateVersion: (json['stateVersion'] as num?)?.toInt() ?? 1,
      completedEndingId: json['completedEndingId'] as String?,
      endingCompletedAt: json['endingCompletedAt'] as String?,
    );
  }
}

/// Root GameState model combining loop metadata, resettable world state, and persistent knowledge.
class GameState {
  final int currentLoopNumber;
  final int elapsedLoopSeconds;
  final GameLifecyclePhase lifecyclePhase;
  final ResettableWorldState worldState;
  final PersistentKnowledgeState persistentKnowledge;

  const GameState({
    this.currentLoopNumber = 1,
    this.elapsedLoopSeconds = 0,
    this.lifecyclePhase = GameLifecyclePhase.newGame,
    this.worldState = const ResettableWorldState(),
    this.persistentKnowledge = const PersistentKnowledgeState(),
  });

  GameState copyWith({
    int? currentLoopNumber,
    int? elapsedLoopSeconds,
    GameLifecyclePhase? lifecyclePhase,
    ResettableWorldState? worldState,
    PersistentKnowledgeState? persistentKnowledge,
  }) {
    return GameState(
      currentLoopNumber: currentLoopNumber ?? this.currentLoopNumber,
      elapsedLoopSeconds: elapsedLoopSeconds ?? this.elapsedLoopSeconds,
      lifecyclePhase: lifecyclePhase ?? this.lifecyclePhase,
      worldState: worldState ?? this.worldState,
      persistentKnowledge: persistentKnowledge ?? this.persistentKnowledge,
    );
  }

  Map<String, dynamic> toJson() => {
        'currentLoopNumber': currentLoopNumber,
        'elapsedLoopSeconds': elapsedLoopSeconds,
        'lifecyclePhase': lifecyclePhase.name,
        'worldState': worldState.toJson(),
        'persistentKnowledge': persistentKnowledge.toJson(),
      };

  factory GameState.fromJson(Map<String, dynamic> json) {
    GameLifecyclePhase phase = GameLifecyclePhase.loopActive;
    final phaseStr = json['lifecyclePhase'] as String?;
    if (phaseStr != null) {
      phase = GameLifecyclePhase.values.firstWhere(
        (e) => e.name == phaseStr,
        orElse: () => GameLifecyclePhase.loopActive,
      );
    }

    return GameState(
      currentLoopNumber: int.tryParse(json['currentLoopNumber']?.toString() ?? '') ?? 1,
      elapsedLoopSeconds: int.tryParse(json['elapsedLoopSeconds']?.toString() ?? '') ?? 0,
      lifecyclePhase: phase,
      worldState: ResettableWorldState.fromJson(_safeMap(json['worldState'])),
      persistentKnowledge: PersistentKnowledgeState.fromJson(_safeMap(json['persistentKnowledge'])),
    );
  }
}
