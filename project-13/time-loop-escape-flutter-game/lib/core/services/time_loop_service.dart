// lib/core/services/time_loop_service.dart
import 'dart:async';
import 'package:flutter/foundation.dart';
import '../../app/app_config.dart';
import '../models/game_state.dart';
import '../models/timeline_event.dart';
import 'feedback_service.dart';
import 'game_service.dart';

/// Independent time-loop engine orchestrating the 300-second (5-minute) countdown,
/// scheduled NPC/world event triggers, duplicate timer prevention, loop reset boundaries,
/// and feedback triggers (critical time warnings and stage change cues).
class TimeLoopService extends ChangeNotifier {
  final GameService _gameService;
  final FeedbackService? _feedbackService;

  Timer? _timer;
  bool _isRunning = false;
  bool _isPaused = false;
  bool _criticalWarningTriggered = false;
  TimelineStage _lastStage = TimelineStage.calm;

  final StreamController<TimelineEvent> _eventStreamController = StreamController<TimelineEvent>.broadcast();
  List<TimelineEvent> _timelineEvents = [];

  TimeLoopService(this._gameService, [this._feedbackService]) {
    _initializeTimelineSchedule();
  }

  bool get isRunning => _isRunning;
  bool get isPaused => _isPaused;
  Stream<TimelineEvent> get onEventTriggered => _eventStreamController.stream;
  List<TimelineEvent> get timelineEvents => List.unmodifiable(_timelineEvents);

  int get elapsedSeconds => _gameService.currentState.elapsedLoopSeconds;
  int get remainingSeconds => AppConfig.targetLoopDurationSeconds - elapsedSeconds;

  TimelineStage get currentStage {
    final s = elapsedSeconds;
    if (s < 60) return TimelineStage.calm;
    if (s < 150) return TimelineStage.routineShift;
    if (s < 240) return TimelineStage.tension;
    if (s < 285) return TimelineStage.criticalDanger;
    return TimelineStage.temporalCollapse;
  }

  /// Initialize deterministic scheduled world events for the 5-minute loop timeline.
  void _initializeTimelineSchedule() {
    _timelineEvents = [
      TimelineEvent(
        id: 'event_clock_chime',
        triggerTimeSeconds: 5,
        title: 'Grandfather Clock Chiming',
        description: 'Lobby grandfather clock strikes 11:57:05 PM.',
        stage: TimelineStage.calm,
      ),
      TimelineEvent(
        id: 'event_caretaker_key',
        triggerTimeSeconds: 65,
        title: 'Caretaker Key Placement',
        description: 'Caretaker leaves maintenance room key on reception desk.',
        stage: TimelineStage.routineShift,
      ),
      TimelineEvent(
        id: 'event_guard_patrol',
        triggerTimeSeconds: 150,
        title: 'Security Guard Patrol',
        description: 'Guard departs lobby to inspect 2nd floor corridor.',
        stage: TimelineStage.tension,
      ),
      TimelineEvent(
        id: 'event_lights_flicker',
        triggerTimeSeconds: 240,
        title: 'Temporal Light Flicker',
        description: 'Hotel power destabilizes as midnight approaches.',
        stage: TimelineStage.criticalDanger,
      ),
      TimelineEvent(
        id: 'event_shockwave',
        triggerTimeSeconds: 285,
        title: 'Temporal Shockwave',
        description: 'Reality distortion distorts air and vision. Reset imminent.',
        stage: TimelineStage.temporalCollapse,
      ),
    ];
  }

  /// Start or resume the 5-minute loop countdown timer.
  /// Safely cancels any existing active timer to prevent duplicate timer leaks.
  void startLoopTimer() {
    _stopTimerInternal();

    _isRunning = true;
    _isPaused = false;
    _gameService.setLifecyclePhase(GameLifecyclePhase.loopActive);
    _lastStage = currentStage;

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      if (_isPaused || !_isRunning) return;

      final nextElapsed = _gameService.currentState.elapsedLoopSeconds + 1;

      // Evaluate scheduled events
      _checkScheduledEvents(nextElapsed);

      // Evaluate stage change feedback
      final newStage = _calculateStageForSeconds(nextElapsed);
      if (newStage != _lastStage) {
        _lastStage = newStage;
        _feedbackService?.playStageChanged();
      }

      // Final minute critical time warning trigger (fires once per loop)
      if (nextElapsed >= 240 && !_criticalWarningTriggered) {
        _criticalWarningTriggered = true;
        _feedbackService?.playCriticalWarning();
      }

      if (nextElapsed >= AppConfig.targetLoopDurationSeconds) {
        if (_isResetting) return;
        _isResetting = true;
        // Boundary reached: execute loop reset
        _stopTimerInternal();
        _feedbackService?.playLoopReset();
        await _gameService.executeLoopReset();
        _resetScheduleEvents();
        _criticalWarningTriggered = false;
        _isResetting = false;
        startLoopTimer(); // Restart next loop deterministically
      } else {
        await _gameService.updateLoopTimer(nextElapsed);
      }
      notifyListeners();
    });

    notifyListeners();
  }

  TimelineStage _calculateStageForSeconds(int s) {
    if (s < 60) return TimelineStage.calm;
    if (s < 150) return TimelineStage.routineShift;
    if (s < 240) return TimelineStage.tension;
    if (s < 285) return TimelineStage.criticalDanger;
    return TimelineStage.temporalCollapse;
  }

  /// Pause countdown timer (e.g. when inspecting Knowledge Board or Reading Brief).
  void pauseLoopTimer() {
    if (!_isRunning || _isPaused) return;
    _isPaused = true;
    _gameService.setLifecyclePhase(GameLifecyclePhase.investigation);
    notifyListeners();
  }

  /// Resume countdown timer from paused state.
  void resumeLoopTimer() {
    if (!_isRunning || !_isPaused) return;
    _isPaused = false;
    _gameService.setLifecyclePhase(GameLifecyclePhase.loopActive);
    notifyListeners();
  }

  /// Stop countdown timer.
  void stopLoopTimer() {
    _stopTimerInternal();
    _isRunning = false;
    _isPaused = false;
    notifyListeners();
  }

  void _stopTimerInternal() {
    _timer?.cancel();
    _timer = null;
  }

  bool _isResetting = false;

  void _checkScheduledEvents(int currentSeconds) {
    for (int i = 0; i < _timelineEvents.length; i++) {
      final event = _timelineEvents[i];
      if (!event.isTriggered && currentSeconds >= event.triggerTimeSeconds) {
        _timelineEvents[i] = event.copyWith(isTriggered: true);
        if (!_eventStreamController.isClosed) {
          _eventStreamController.add(_timelineEvents[i]);
        }
      }
    }
  }

  void _resetScheduleEvents() {
    _timelineEvents = _timelineEvents.map((e) => e.copyWith(isTriggered: false)).toList();
  }

  @override
  void dispose() {
    _stopTimerInternal();
    _eventStreamController.close();
    super.dispose();
  }
}
