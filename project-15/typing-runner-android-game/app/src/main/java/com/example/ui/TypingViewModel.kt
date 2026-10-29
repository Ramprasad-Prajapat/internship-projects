package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.BadgeData
import com.example.data.EquipmentData
import com.example.data.LevelData
import com.example.data.MistakeData
import com.example.data.ModeData
import com.example.data.TypingRepository
import com.example.data.UserData
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class TypingViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = TypingRepository(application)

    // Database Flows
    val userStats: StateFlow<UserData?> = repository.userStatsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val modes: StateFlow<List<ModeData>> = repository.modesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val mistakes: StateFlow<List<MistakeData>> = repository.mistakesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val equipment: StateFlow<List<EquipmentData>> = repository.equipmentFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val badges: StateFlow<List<BadgeData>> = repository.badgesFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val sessionHistory: StateFlow<List<com.example.data.SessionHistoryEntity>> = repository.sessionHistoryFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allLevels: StateFlow<List<LevelData>> = repository.allLevelsFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Active Selection State
    private val _selectedMode = MutableStateFlow<ModeData?>(null)
    val selectedMode = _selectedMode.asStateFlow()

    private val _selectedLevel = MutableStateFlow<LevelData?>(null)
    val selectedLevel = _selectedLevel.asStateFlow()

    // Mode-specific level flows
    private val _levelsList = MutableStateFlow<List<LevelData>>(emptyList())
    val levelsList = _levelsList.asStateFlow()

    // Real-Time Gameplay Session State
    private val _gameActive = MutableStateFlow(false)
    val gameActive = _gameActive.asStateFlow()

    private val _paused = MutableStateFlow(false)
    val paused = _paused.asStateFlow()

    private val _gameOutcome = MutableStateFlow<com.example.data.GameOutcome?>(null)
    val gameOutcome = _gameOutcome.asStateFlow()

    private val _currentChallengeIndex = MutableStateFlow(0)
    val currentChallengeIndex = _currentChallengeIndex.asStateFlow()

    private val _activeChallenge = MutableStateFlow<com.example.data.GameplayChallenge?>(null)
    val activeChallenge = _activeChallenge.asStateFlow()

    private val _completedItems = MutableStateFlow(0)
    val completedItems = _completedItems.asStateFlow()

    private val _score = MutableStateFlow(0)
    val score = _score.asStateFlow()

    private val _combo = MutableStateFlow(0)
    val combo = _combo.asStateFlow()

    private val _maxCombo = MutableStateFlow(0)
    val maxCombo = _maxCombo.asStateFlow()

    private val _targetText = MutableStateFlow("")
    val targetText = _targetText.asStateFlow()

    private val _typedInput = MutableStateFlow("")
    val typedInput = _typedInput.asStateFlow()

    private val _timeRemainingSeconds = MutableStateFlow(60)
    val timeRemainingSeconds = _timeRemainingSeconds.asStateFlow()

    private val _elapsedSeconds = MutableStateFlow(0)
    val elapsedSeconds = _elapsedSeconds.asStateFlow()

    private val _liveWpm = MutableStateFlow(0)
    val liveWpm = _liveWpm.asStateFlow()

    private val _liveAccuracy = MutableStateFlow(100.0)
    val liveAccuracy = _liveAccuracy.asStateFlow()

    private val _health = MutableStateFlow(3) // Phase 3 starts with 3 health
    val health = _health.asStateFlow()

    private val _coinsCollected = MutableStateFlow(0)
    val coinsCollected = _coinsCollected.asStateFlow()

    private val _streakCount = MutableStateFlow(0)
    val streakCount = _streakCount.asStateFlow()

    // Running Speed / Velocity multiplier for animations (WPM/10)
    val runnerVelocityPercent: StateFlow<Float> = _liveWpm.combine(_gameActive) { wpm, active ->
        if (!active) 0f else (wpm.toFloat() / 80f).coerceIn(0.1f, 1.5f)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0f)

    private var timerJob: Job? = null
    private var totalCharacterKeystrokes = 0
    private var correctCharacterKeystrokes = 0
    private var activeChallengesList = emptyList<com.example.data.GameplayChallenge>()
    private var requiredItems = 0
    private val activeMistakes = mutableListOf<com.example.data.MistakeData>()
    private var currentSessionId = ""

    init {
        viewModelScope.launch {
            repository.checkAndSeedDatabase()
        }
    }

    fun syncUserProgress() {
        viewModelScope.launch {
            repository.syncDatabaseWithPreferences()
        }
    }

    fun selectMode(mode: ModeData) {
        _selectedMode.value = mode
        viewModelScope.launch {
            repository.getLevelsForMode(mode.id).collect {
                _levelsList.value = it
            }
        }
    }

    fun selectLevel(level: LevelData) {
        _selectedLevel.value = level
    }

    fun resetDemoData() {
        viewModelScope.launch {
            repository.resetDatabase()
            _selectedMode.value = null
            _selectedLevel.value = null
            _levelsList.value = emptyList()
        }
    }

    // Equipment customization
    fun purchaseEquipment(item: EquipmentData) {
        viewModelScope.launch {
            repository.buyEquipment(item.id, item.cost)
        }
    }

    fun equipItem(item: EquipmentData) {
        viewModelScope.launch {
            repository.equipItem(item.id, item.category)
        }
    }

    // Mistake management
    fun clearMistake(id: String) {
        viewModelScope.launch {
            repository.clearMistake(id)
        }
    }

    fun clearAllMistakes() {
        viewModelScope.launch {
            repository.clearAllMistakes()
        }
    }

    // GAMEPLAY CYCLE

    fun startGameplaySession(modeId: String, levelId: String) {
        _gameActive.value = false
        _paused.value = false
        _gameOutcome.value = null
        _currentChallengeIndex.value = 0
        _activeChallenge.value = null
        _completedItems.value = 0
        _score.value = 0
        _combo.value = 0
        _maxCombo.value = 0
        _health.value = 3
        _elapsedSeconds.value = 0
        _liveWpm.value = 0
        _liveAccuracy.value = 100.0
        _coinsCollected.value = 0
        _typedInput.value = ""
        _targetText.value = ""
        totalCharacterKeystrokes = 0
        correctCharacterKeystrokes = 0
        activeMistakes.clear()
        currentSessionId = java.util.UUID.randomUUID().toString()

        timerJob?.cancel()

        activeChallengesList = loadChallengesForLevel(modeId, levelId)
        requiredItems = getRequiredItemsCount(modeId, levelId)

        if (activeChallengesList.isEmpty()) {
            _gameActive.value = false
            return
        }

        val firstChallenge = activeChallengesList[0]
        _activeChallenge.value = firstChallenge
        _targetText.value = firstChallenge.expectedText

        val limitSeconds = getMinimumTimeSeconds(modeId, levelId)
        _timeRemainingSeconds.value = limitSeconds

        _gameActive.value = true

        timerJob = viewModelScope.launch {
            while (_gameActive.value) {
                delay(1000)
                if (!_paused.value) {
                    _elapsedSeconds.value += 1
                    _timeRemainingSeconds.value -= 1

                    calculateRealTimeStats()

                    if (_timeRemainingSeconds.value <= 0) {
                        finishGameplaySession(com.example.data.GameOutcome.TIME_EXPIRED)
                    }
                }
            }
        }
    }

    // Keep back-compat overload just in case
    fun startGameplaySession(text: String) {
        val mode = _selectedMode.value?.id ?: "word_run"
        val lvl = _selectedLevel.value?.id ?: "word_1"
        startGameplaySession(mode, lvl)
    }

    private fun getRequiredItemsCount(modeId: String, levelId: String): Int {
        return when (modeId) {
            "word_run" -> if (levelId == "word_1") 25 else 1
            "sentence_run" -> if (levelId == "sent_1") 10 else 1
            "grammar_challenge" -> if (levelId == "gram_1") 10 else 1
            "hindi_to_english" -> if (levelId == "hindi_1") 8 else 1
            else -> 1
        }
    }

    private fun getMinimumTimeSeconds(modeId: String, levelId: String): Int {
        return when (modeId) {
            "word_run" -> if (levelId == "word_1") 90 else 120
            "sentence_run" -> if (levelId == "sent_1") 120 else 120
            "grammar_challenge" -> if (levelId == "gram_1") 120 else 120
            "hindi_to_english" -> if (levelId == "hindi_1") 120 else 120
            else -> 120
        }
    }

    private fun loadChallengesForLevel(modeId: String, levelId: String): List<com.example.data.GameplayChallenge> {
        val all = com.example.data.CentralizedChallenges.list
        return all.filter { it.modeId == modeId && it.levelId == levelId }
    }

    fun onTypedInputChanged(newValue: String) {
        if (!_gameActive.value || _paused.value) return

        val previousValue = _typedInput.value
        _typedInput.value = newValue

        if (newValue.length > previousValue.length) {
            val challenge = _activeChallenge.value ?: return
            val expected = challenge.expectedText
            val typedChar = newValue[newValue.length - 1]
            val expectedChar = expected.getOrNull(newValue.length - 1)

            totalCharacterKeystrokes++
            if (expectedChar != null && typedChar == expectedChar) {
                correctCharacterKeystrokes++
            }
        }

        calculateRealTimeStats()
    }

    fun submitCurrentAnswer() {
        if (!_gameActive.value || _paused.value) return

        val challenge = _activeChallenge.value ?: return
        val expected = challenge.expectedText
        val typed = _typedInput.value

        val isCorrect = typed.trim() == expected.trim() && typed.trim().isNotEmpty()

        if (isCorrect) {
            _completedItems.value += 1
            
            val scoreGain = 100 + (_combo.value * 10)
            _score.value += scoreGain

            _combo.value += 1
            if (_combo.value > _maxCombo.value) {
                _maxCombo.value = _combo.value
            }

            _coinsCollected.value = (correctCharacterKeystrokes / 4) + (_liveWpm.value / 5)
            _typedInput.value = ""

            if (_completedItems.value >= requiredItems) {
                finishGameplaySession(com.example.data.GameOutcome.COMPLETED)
            } else {
                val nextIndex = _currentChallengeIndex.value + 1
                if (nextIndex < activeChallengesList.size) {
                    _currentChallengeIndex.value = nextIndex
                    val nextChallenge = activeChallengesList[nextIndex]
                    _activeChallenge.value = nextChallenge
                    _targetText.value = nextChallenge.expectedText
                } else {
                    finishGameplaySession(com.example.data.GameOutcome.COMPLETED)
                }
            }
        } else {
            _health.value -= 1
            _combo.value = 0

            val trimmedTyped = typed.trim()
            if (trimmedTyped.isNotEmpty()) {
                val email = repository.getCurrentUserEmail() ?: ""
                val mode = _selectedMode.value
                val lvl = _selectedLevel.value
                val mistake = com.example.data.MistakeData(
                    id = System.currentTimeMillis().toString() + "_" + challenge.id,
                    originalWord = expected,
                    typedWord = typed,
                    typeLabel = "Final Submission",
                    originalSentence = challenge.promptText,
                    typedSentence = typed,
                    helpText = "Incorrect submission on expected answer: '$expected'",
                    userId = email,
                    sessionId = currentSessionId,
                    modeId = mode?.id ?: "",
                    levelId = lvl?.id ?: "",
                    challengeId = challenge.id,
                    promptText = challenge.promptText,
                    expectedText = expected,
                    submittedText = typed,
                    timestamp = System.currentTimeMillis()
                )
                activeMistakes.add(mistake)
            }

            if (_health.value <= 0) {
                finishGameplaySession(com.example.data.GameOutcome.HEALTH_DEPLETED)
            }
        }
    }

    fun pauseGameplay() {
        if (_gameActive.value) {
            _paused.value = true
        }
    }

    fun resumeGameplay() {
        if (_gameActive.value) {
            _paused.value = false
        }
    }

    fun togglePauseState() {
        _paused.value = !_paused.value
    }

    private fun calculateRealTimeStats() {
        val seconds = _elapsedSeconds.value.coerceAtLeast(1)
        val minutes = seconds.toDouble() / 60.0
        val wpmVal = ((correctCharacterKeystrokes.toDouble() / 5.0) / minutes).toInt()
        _liveWpm.value = wpmVal.coerceAtLeast(0)

        _liveAccuracy.value = if (totalCharacterKeystrokes > 0) {
            (correctCharacterKeystrokes.toDouble() / totalCharacterKeystrokes.toDouble() * 100.0)
                .coerceIn(0.0, 100.0)
        } else {
            100.0
        }

        _coinsCollected.value = (correctCharacterKeystrokes / 4) + (_liveWpm.value / 5)
    }

    fun finishGameplaySession(outcome: com.example.data.GameOutcome) {
        if (!_gameActive.value) return
        _gameActive.value = false
        _gameOutcome.value = outcome
        timerJob?.cancel()

        val finalWpm = _liveWpm.value.coerceAtLeast(12)
        val finalAcc = _liveAccuracy.value
        val finalHealth = _health.value
        val success = outcome == com.example.data.GameOutcome.COMPLETED && _completedItems.value >= requiredItems

        val stars = when {
            finalAcc >= 95.0 && finalHealth == 3 -> 3
            finalAcc >= 85.0 -> 2
            else -> 1
        }

        val finalScore = _score.value
        val remainingTime = _timeRemainingSeconds.value
        val remainingHealth = _health.value
        val maxCombo = _maxCombo.value
        val completedItems = _completedItems.value

        viewModelScope.launch {
            val mode = _selectedMode.value
            val lvl = _selectedLevel.value
            if (mode != null && lvl != null) {
                repository.recordGameplayResult(
                    levelId = lvl.id,
                    modeId = mode.id,
                    score = finalScore,
                    wpm = finalWpm,
                    accuracy = finalAcc,
                    stars = stars,
                    madeMistakes = activeMistakes,
                    success = success,
                    sessionId = currentSessionId,
                    completedItems = completedItems,
                    requiredItems = requiredItems,
                    remainingTime = remainingTime,
                    remainingHealth = remainingHealth,
                    maxCombo = maxCombo,
                    outcome = outcome.name
                )
            }
        }
    }

    fun stopGameplaySession() {
        _gameActive.value = false
        timerJob?.cancel()
    }
}
