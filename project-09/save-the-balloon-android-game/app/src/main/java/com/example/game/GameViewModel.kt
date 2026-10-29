package com.example.game

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppDatabase
import com.example.data.GameRepository
import com.example.data.GameStats
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import kotlin.random.Random

class GameViewModel(application: Application) : AndroidViewModel(application) {
    private val repository: GameRepository
    val soundManager = SoundEffectsManager()

    // Screen State
    private val _currentScreen = MutableStateFlow(Screen.Splash)
    // New control mode state, default Manual
    private val _controlMode = MutableStateFlow(ControlMode.Manual)
    val controlMode: StateFlow<ControlMode> = _controlMode.asStateFlow()
    fun setControlMode(mode: ControlMode) {
        _controlMode.value = mode
    }
    val currentScreen: StateFlow<Screen> = _currentScreen.asStateFlow()

    // Persistent Stats
    private val _highScore = MutableStateFlow(0)
    val highScore: StateFlow<Int> = _highScore.asStateFlow()

    private val _totalCoins = MutableStateFlow(0)
    val totalCoins: StateFlow<Int> = _totalCoins.asStateFlow()

    private val _soundEnabled = MutableStateFlow(true)
    val soundEnabled: StateFlow<Boolean> = _soundEnabled.asStateFlow()

    private val _selectedSkin = MutableStateFlow("Red")
    val selectedSkin: StateFlow<String> = _selectedSkin.asStateFlow()

    private val _unlockedSkins = MutableStateFlow("Red")
    val unlockedSkins: StateFlow<String> = _unlockedSkins.asStateFlow()

    // Gameplay States
    private val _score = MutableStateFlow(0f)
    val score: StateFlow<Float> = _score.asStateFlow()

    private val _coinsCollected = MutableStateFlow(0)
    val coinsCollected: StateFlow<Int> = _coinsCollected.asStateFlow()

    private val _balloonX = MutableStateFlow(0.5f) // Center
    val balloonX: StateFlow<Float> = _balloonX.asStateFlow()

    val balloonY = 0.7f // Fixed vertical position (70% height)
    val balloonRadius = 0.05f

    private val _isPaused = MutableStateFlow(false)
    val isPaused: StateFlow<Boolean> = _isPaused.asStateFlow()

    // Power-ups
    private val _shieldTime = MutableStateFlow(0f)
    val shieldTime: StateFlow<Float> = _shieldTime.asStateFlow()

    private val _magnetTime = MutableStateFlow(0f)
    val magnetTime: StateFlow<Float> = _magnetTime.asStateFlow()

    private val _slowMoTime = MutableStateFlow(0f)
    val slowMoTime: StateFlow<Float> = _slowMoTime.asStateFlow()

    // Active entities
    private val _obstacles = MutableStateFlow<List<Obstacle>>(emptyList())
    val obstacles: StateFlow<List<Obstacle>> = _obstacles.asStateFlow()

    private val _coins = MutableStateFlow<List<Coin>>(emptyList())
    val coins: StateFlow<List<Coin>> = _coins.asStateFlow()

    private val _powerUps = MutableStateFlow<List<PowerUp>>(emptyList())
    val powerUps: StateFlow<List<PowerUp>> = _powerUps.asStateFlow()

    // Wind States
    private val _windDirection = MutableStateFlow(0f) // -1f = left, 1f = right
    val windDirection: StateFlow<Float> = _windDirection.asStateFlow()

    private val _windSpeed = MutableStateFlow(0f)
    val windSpeed: StateFlow<Float> = _windSpeed.asStateFlow()

    private var windChangeTimer = 0f

    // Screen Shake & Effects
    private val _screenShake = MutableStateFlow(0f)
    val screenShake: StateFlow<Float> = _screenShake.asStateFlow()

    private val _shieldBreakEffect = MutableStateFlow(0f)
    val shieldBreakEffect: StateFlow<Float> = _shieldBreakEffect.asStateFlow()

    // Bursting Game Over State
    private val _isBursting = MutableStateFlow(false)
    val isBursting: StateFlow<Boolean> = _isBursting.asStateFlow()

    // Combo States
    private val _comboCount = MutableStateFlow(0)
    val comboCount: StateFlow<Int> = _comboCount.asStateFlow()

    private val _comboText = MutableStateFlow("")
    val comboText: StateFlow<String> = _comboText.asStateFlow()

    private var comboTimer = 0f

    // Missions System
    data class Mission(
        val id: String,
        val description: String,
        val target: Int,
        val reward: Int,
        val progress: Int,
        val isCompleted: Boolean,
        val isClaimed: Boolean = false
    )

    private val _missions = MutableStateFlow(
        listOf(
            Mission("collect_20", "Collect 20 Coins", 20, 50, 0, false),
            Mission("reach_100", "Reach 100m Height", 100, 50, 0, false),
            Mission("avoid_10", "Avoid 10 Obstacles", 10, 50, 0, false),
            Mission("use_shield", "Use Shield Once", 1, 50, 0, false)
        )
    )
    val missions: StateFlow<List<Mission>> = _missions.asStateFlow()

    // Game loop control
    private var gameLoopJob: Job? = null
    private var lastTimeMillis = 0L

    // Spawning timers
    private var obstacleSpawnTimer = 0f
    private var coinSpawnTimer = 0f
    private var powerUpSpawnTimer = 0f

    // Unique IDs for entities
    private var nextEntityId = 1L

    init {
        val database = AppDatabase.getDatabase(application)
        repository = GameRepository(database.gameStatsDao())

        // Sync with repository
        viewModelScope.launch {
            repository.gameStats.collectLatest { stats ->
                _highScore.value = stats.highScore
                _totalCoins.value = stats.totalCoins
                _soundEnabled.value = stats.soundEnabled
                soundManager.isSoundEnabled = stats.soundEnabled
                _selectedSkin.value = stats.selectedSkin
                _unlockedSkins.value = stats.unlockedSkins
            }
        }

        // Navigate from Splash to Menu after 2 seconds
        viewModelScope.launch {
            delay(2000)
            if (_currentScreen.value == Screen.Splash) {
                _currentScreen.value = Screen.Menu
            }
        }
    }

    fun startGame() {
        soundManager.playTapSound()
        // Reset gameplay values
        _score.value = 0f
        _coinsCollected.value = 0
        _balloonX.value = 0.5f
        _isPaused.value = false
        _shieldTime.value = 0f
        _magnetTime.value = 0f
        _slowMoTime.value = 0f

        _obstacles.value = emptyList()
        _coins.value = emptyList()
        _powerUps.value = emptyList()

        _windSpeed.value = 0f
        _windDirection.value = 0f
        windChangeTimer = 3.0f

        _screenShake.value = 0f
        _shieldBreakEffect.value = 0f
        _isBursting.value = false

        _comboCount.value = 0
        _comboText.value = ""
        comboTimer = 0f

        // Reset missions for the new run
        _missions.value = listOf(
            Mission("collect_20", "Collect 20 Coins", 20, 50, 0, false),
            Mission("reach_100", "Reach 100m Height", 100, 50, 0, false),
            Mission("avoid_10", "Avoid 10 Obstacles", 10, 50, 0, false),
            Mission("use_shield", "Use Shield Once", 1, 50, 0, false)
        )

        obstacleSpawnTimer = 1.0f // Spawn first obstacle after 1 second
        coinSpawnTimer = 0.5f     // Spawn first coin quickly
        powerUpSpawnTimer = 8.0f  // Power-up spawning timing

        _currentScreen.value = Screen.Game
        startGameLoop()
    }

    fun pauseGame() {
        soundManager.playTapSound()
        _isPaused.value = !_isPaused.value
        if (!_isPaused.value) {
            lastTimeMillis = System.currentTimeMillis()
        }
    }

    fun resumeGame() {
        soundManager.playTapSound()
        _isPaused.value = false
        lastTimeMillis = System.currentTimeMillis()
    }

    fun quitToMenu() {
        soundManager.playTapSound()
        stopGameLoop()
        _currentScreen.value = Screen.Menu
    }

    fun setScreen(screen: Screen) {
        soundManager.playTapSound()
        _currentScreen.value = screen
    }

    fun toggleSound() {
        viewModelScope.launch {
            val nextSoundState = !_soundEnabled.value
            repository.toggleSound(nextSoundState)
            soundManager.playTapSound()
        }
    }

    fun moveBalloon(deltaX: Float) {
        if (deltaX.isNaN() || _isPaused.value || _currentScreen.value != Screen.Game) return
        val currentX = _balloonX.value
        // Clamp horizontal movement within play boundaries (0.05f to 0.95f)
        _balloonX.value = (currentX + deltaX).coerceIn(0.08f, 0.92f)
    }

    fun setBalloonX(x: Float) {
        if (x.isNaN() || _isPaused.value || _currentScreen.value != Screen.Game) return
        _balloonX.value = x.coerceIn(0.08f, 0.92f)
    }

    private fun startGameLoop() {
        stopGameLoop()
        lastTimeMillis = System.currentTimeMillis()
        gameLoopJob = viewModelScope.launch {
            while (true) {
                if (!_isPaused.value) {
                    val currentTime = System.currentTimeMillis()
                    val elapsedMillis = currentTime - lastTimeMillis
                    lastTimeMillis = currentTime

                    // Cap elapsed millis to prevent extreme jumps on frame hiccups
                    val delta = (elapsedMillis.coerceAtMost(100L)) / 1000f
                    updateGame(delta)
                } else {
                    lastTimeMillis = System.currentTimeMillis()
                }
                delay(16) // ~60 FPS
            }
        }
    }

    private fun stopGameLoop() {
        gameLoopJob?.cancel()
        gameLoopJob = null
    }

    private fun updateGame(delta: Float) {
        // Decrement Screen Shake & Shield Break effect timers
        if (_screenShake.value > 0f) _screenShake.value = (_screenShake.value - delta).coerceAtLeast(0f)
        if (_shieldBreakEffect.value > 0f) _shieldBreakEffect.value = (_shieldBreakEffect.value - delta).coerceAtLeast(0f)

        // Decrement Combo Timer
        if (comboTimer > 0f) {
            comboTimer -= delta
            if (comboTimer <= 0f) {
                _comboCount.value = 0
                _comboText.value = ""
            }
        }

        // If balloon is bursting, let existing elements drift but freeze game progression
        if (_isBursting.value) {
            val speedFactor = if (_slowMoTime.value > 0f) 0.5f else 1.0f
            _obstacles.value = _obstacles.value.mapNotNull { obstacle ->
                if (obstacle.warningTimer > 0f) {
                    obstacle.copy(warningTimer = (obstacle.warningTimer - delta).coerceAtLeast(0f))
                } else {
                    val nextY = obstacle.y + obstacle.speed * speedFactor * delta
                    val nextX = (obstacle.x + obstacle.driftSpeed * delta * speedFactor).coerceIn(0.02f, 0.98f)
                    if (nextY > 1.1f) null else obstacle.copy(x = nextX, y = nextY)
                }
            }
            return
        }

        // 1. Update distance score (increases as the balloon goes up)
        val scoreMultiplier = if (_slowMoTime.value > 0f) 0.5f else 1.0f
        _score.value += delta * 15f * scoreMultiplier

        // Update reach_100 mission progress
        updateMissionProgress("reach_100", _score.value.toInt(), isIncremental = false)

        // 2. Decrement power-up active timers
        if (_shieldTime.value > 0f) _shieldTime.value = (_shieldTime.value - delta).coerceAtLeast(0f)
        if (_magnetTime.value > 0f) _magnetTime.value = (_magnetTime.value - delta).coerceAtLeast(0f)
        if (_slowMoTime.value > 0f) _slowMoTime.value = (_slowMoTime.value - delta).coerceAtLeast(0f)

        // 3. Spawning Logic
        spawnEntities(delta)

        // Wind System update
        windChangeTimer -= delta
        if (windChangeTimer <= 0f) {
            windChangeTimer = Random.nextFloat() * 4f + 4f
            if (Random.nextFloat() < 0.35f) { // 35% chance of no wind
                _windSpeed.value = 0f
                _windDirection.value = 0f
            } else {
                _windDirection.value = if (Random.nextBoolean()) 1f else -1f
                _windSpeed.value = Random.nextFloat().coerceIn(0.04f, 0.12f)
            }
        }

        // Apply wind push to balloon
        if (_windSpeed.value > 0f) {
            val windPush = _windDirection.value * _windSpeed.value * delta
            _balloonX.value = (_balloonX.value + windPush).coerceIn(0.08f, 0.92f)
        }

        // 4. Update existing entity positions
        val speedFactor = if (_slowMoTime.value > 0f) 0.5f else 1.0f
        val difficultySpeedMultiplier = 1.0f + (_score.value / 1000f) * 0.15f // subtle difficulty scaling

        // Update Obstacles
        _obstacles.value = _obstacles.value.mapNotNull { obstacle ->
            if (obstacle.warningTimer > 0f) {
                // Rockets warning countdown
                val newTimer = obstacle.warningTimer - delta
                obstacle.copy(warningTimer = newTimer)
            } else {
                // Downward vertical movement
                val speed = obstacle.speed * speedFactor * difficultySpeedMultiplier
                val nextY = obstacle.y + speed * delta

                // Horizontal movement / drift
                val nextX = (obstacle.x + obstacle.driftSpeed * delta * speedFactor).coerceIn(0.02f, 0.98f)

                if (nextY > 1.1f) {
                    updateMissionProgress("avoid_10", 1, isIncremental = true)
                    null // off screen
                }
                else obstacle.copy(x = nextX, y = nextY)
            }
        }

        // Update Coins
        _coins.value = _coins.value.mapNotNull { coin ->
            val nextY: Float
            val nextX: Float

            // Magnetic pull
            if (_magnetTime.value > 0f && !coin.isCollected) {
                val dx = _balloonX.value - coin.x
                val dy = balloonY - coin.y
                val dist = kotlin.math.sqrt(dx * dx + dy * dy)
                if (dist < 0.28f) { // coin is pulled towards the balloon
                    val pullForce = 1.5f * delta
                    nextX = coin.x + (dx / dist) * pullForce
                    nextY = coin.y + (dy / dist) * pullForce
                    coin.isBeingPulled = true
                } else {
                    nextX = coin.x
                    nextY = coin.y + 0.28f * speedFactor * delta
                    coin.isBeingPulled = false
                }
            } else {
                nextX = coin.x
                nextY = coin.y + 0.28f * speedFactor * delta
                coin.isBeingPulled = false
            }

            if (nextY > 1.1f || coin.isCollected) null
            else coin.copy(x = nextX, y = nextY, isBeingPulled = coin.isBeingPulled)
        }

        // Update Power-ups
        _powerUps.value = _powerUps.value.mapNotNull { powerUp ->
            val nextY = powerUp.y + 0.25f * speedFactor * delta
            if (nextY > 1.1f || powerUp.isCollected) null
            else powerUp.copy(y = nextY)
        }

        // 5. Collision Check
        checkCollisions()
    }

    private fun spawnEntities(delta: Float) {
        // Decrease spawn counters
        obstacleSpawnTimer -= delta
        coinSpawnTimer -= delta
        powerUpSpawnTimer -= delta

        // Adaptive obstacle spawn intervals: gets faster as score gets higher
        val currentScore = _score.value
        val obstacleSpawnInterval = (1.5f - (currentScore / 2000f) * 0.3f).coerceIn(0.8f, 2.5f)

        // Spawn Obstacle
        if (obstacleSpawnTimer <= 0) {
            val type = ObstacleType.values().random()
            val size = when (type) {
                ObstacleType.Spikes -> 0.08f
                ObstacleType.Bird -> 0.10f
                ObstacleType.Needle -> 0.06f
                ObstacleType.Cloud -> 0.16f
                ObstacleType.Rocket -> 0.09f
            }
            val speed = when (type) {
                ObstacleType.Spikes -> 0.28f
                ObstacleType.Bird -> 0.32f
                ObstacleType.Needle -> 0.42f
                ObstacleType.Cloud -> 0.18f
                ObstacleType.Rocket -> 0.75f // Rocket moves very fast once launched
            }
            val startX = Random.nextFloat().coerceIn(0.1f, 0.9f)
            val driftSpeed = when (type) {
                ObstacleType.Bird -> if (Random.nextBoolean()) 0.12f else -0.12f
                ObstacleType.Cloud -> if (Random.nextBoolean()) 0.04f else -0.04f
                else -> 0f
            }
            val warningTimer = if (type == ObstacleType.Rocket) 1.2f else 0f // Rocket flashes indicator first!

            val newObstacle = Obstacle(
                id = nextEntityId++,
                type = type,
                x = startX,
                y = if (type == ObstacleType.Rocket) -0.05f else -0.1f,
                speed = speed,
                size = size,
                driftSpeed = driftSpeed,
                warningTimer = warningTimer
            )
            _obstacles.value = _obstacles.value + newObstacle
            obstacleSpawnTimer = obstacleSpawnInterval
        }

        // Spawn Coin
        if (coinSpawnTimer <= 0) {
            val startX = Random.nextFloat().coerceIn(0.08f, 0.92f)
            // Sometimes spawn a nice vertical line of 3 coins!
            if (Random.nextFloat() < 0.4f) {
                val baseId = nextEntityId++
                val newCoins = listOf(
                    Coin(id = baseId, x = startX, y = -0.1f),
                    Coin(id = baseId + 1000, x = startX, y = -0.18f),
                    Coin(id = baseId + 2000, x = startX, y = -0.26f)
                )
                _coins.value = _coins.value + newCoins
                nextEntityId += 3
            } else {
                val newCoin = Coin(id = nextEntityId++, x = startX, y = -0.1f)
                _coins.value = _coins.value + newCoin
            }
            coinSpawnTimer = Random.nextFloat().coerceIn(1.2f, 2.8f)
        }

        // Spawn Power-up (Shield, Magnet, SlowMotion)
        if (powerUpSpawnTimer <= 0) {
            val type = PowerUpType.values().random()
            val startX = Random.nextFloat().coerceIn(0.12f, 0.88f)
            val newPowerUp = PowerUp(id = nextEntityId++, type = type, x = startX, y = -0.1f)
            _powerUps.value = _powerUps.value + newPowerUp
            powerUpSpawnTimer = Random.nextFloat().coerceIn(14f, 22f)
        }
    }

    private fun collectCoinCombo() {
        if (comboTimer > 0f) {
            _comboCount.value += 1
            comboTimer = 1.8f
            val count = _comboCount.value
            val message = when {
                count >= 5 -> "UNBELIEVABLE x$count!"
                count >= 4 -> "AWESOME x$count!"
                count >= 3 -> "GREAT x$count!"
                else -> "Combo x$count"
            }
            _comboText.value = message
            
            // Give small bonus coins for combos
            val bonus = count - 1
            if (bonus > 0) {
                _coinsCollected.value += bonus
            }
        } else {
            _comboCount.value = 1
            comboTimer = 1.8f
            _comboText.value = ""
        }
    }

    fun updateMissionProgress(id: String, progressValue: Int, isIncremental: Boolean = false) {
        _missions.value = _missions.value.map { mission ->
            if (mission.id == id && !mission.isCompleted) {
                val newProgress = if (isIncremental) mission.progress + progressValue else progressValue
                val completed = newProgress >= mission.target
                if (completed) {
                    viewModelScope.launch {
                        val currentStats = repository.gameStats.first()
                        val updated = currentStats.copy(totalCoins = currentStats.totalCoins + mission.reward)
                        repository.saveStats(updated)
                        soundManager.playPowerUpSound()
                    }
                    mission.copy(progress = mission.target, isCompleted = true, isClaimed = true)
                } else {
                    mission.copy(progress = newProgress.coerceAtMost(mission.target))
                }
            } else {
                mission
            }
        }
    }

    // Skins management
    fun selectSkin(skin: String) {
        viewModelScope.launch {
            val currentStats = repository.gameStats.first()
            val updated = currentStats.copy(selectedSkin = skin)
            repository.saveStats(updated)
            soundManager.playTapSound()
        }
    }

    fun unlockSkin(skin: String, cost: Int): Boolean {
        val currentCoins = _totalCoins.value
        if (currentCoins >= cost) {
            viewModelScope.launch {
                val currentStats = repository.gameStats.first()
                val skinsList = currentStats.unlockedSkins.split(",")
                if (!skinsList.contains(skin)) {
                    val newSkins = currentStats.unlockedSkins + "," + skin
                    val updated = currentStats.copy(
                        totalCoins = currentCoins - cost,
                        unlockedSkins = newSkins
                    )
                    repository.saveStats(updated)
                    soundManager.playPowerUpSound()
                }
            }
            return true
        }
        return false
    }

    private fun checkCollisions() {
        val balloonXVal = _balloonX.value
        val balloonYVal = balloonY

        // Use custom approximate distance check scaled to screen space
        // Assume relative bounding box check to keep it fast and accurate

        // 1. Coin collection
        _coins.value = _coins.value.map { coin ->
            val dist = distance(balloonXVal, balloonYVal, coin.x, coin.y)
            if (dist < (balloonRadius + coin.size / 2f) && !coin.isCollected) {
                soundManager.playCoinSound()
                _coinsCollected.value += 1
                collectCoinCombo()
                updateMissionProgress("collect_20", 1, isIncremental = true)
                coin.copy(isCollected = true)
            } else {
                coin
            }
        }

        // 2. Power-up collection
        _powerUps.value = _powerUps.value.map { powerUp ->
            val dist = distance(balloonXVal, balloonYVal, powerUp.x, powerUp.y)
            if (dist < (balloonRadius + powerUp.size / 2f) && !powerUp.isCollected) {
                soundManager.playPowerUpSound()
                when (powerUp.type) {
                    PowerUpType.Shield -> {
                        _shieldTime.value = 8.0f // 8 seconds of shielding
                        updateMissionProgress("use_shield", 1, isIncremental = false)
                    }
                    PowerUpType.Magnet -> _magnetTime.value = 8.0f // 8 seconds magnet
                    PowerUpType.SlowMotion -> _slowMoTime.value = 6.0f // 6 seconds slow motion
                }
                powerUp.copy(isCollected = true)
            } else {
                powerUp
            }
        }

        // 3. Obstacle Collision (Spawns Game Over)
        val obstaclesList = _obstacles.value
        for (obstacle in obstaclesList) {
            if (obstacle.warningTimer > 0f) continue // Skip rocket while only in warning phase!

            val dist = distance(balloonXVal, balloonYVal, obstacle.x, obstacle.y)
            val collisionThreshold = balloonRadius + (obstacle.size / 2f) - 0.012f // generous padding for cute gameplay

            if (dist < collisionThreshold) {
                // We have a collision!
                if (_shieldTime.value > 0f) {
                    // Shield protects us! Deactivate shield and remove the obstacle
                    _shieldTime.value = 0f
                    _shieldBreakEffect.value = 0.6f
                    _screenShake.value = 0.4f
                    _obstacles.value = obstaclesList.filter { it.id != obstacle.id }
                    soundManager.playPowerUpSound() // Nice feedback
                    break
                } else {
                    // Game Over Bursting sequence!
                    _isBursting.value = true
                    _screenShake.value = 0.6f
                    viewModelScope.launch {
                        soundManager.playGameOverSound() // Play immediately
                        delay(600) // 600ms burst animation delay
                        triggerGameOver()
                    }
                    break
                }
            }
        }
    }

    private fun triggerGameOver() {
        stopGameLoop()
        val finalScore = _score.value.toInt()
        val coinsAdded = _coinsCollected.value

        viewModelScope.launch {
            repository.updateHighScoreAndCoins(finalScore, coinsAdded)
            _currentScreen.value = Screen.GameOver
        }
    }

    private fun distance(x1: Float, y1: Float, x2: Float, y2: Float): Float {
        val dx = x1 - x2
        // Make collision slightly elongated vertically to match the natural shape of a balloon
        val dy = (y1 - y2) * 1.25f
        return kotlin.math.sqrt(dx * dx + dy * dy)
    }

    override fun onCleared() {
        super.onCleared()
        stopGameLoop()
        soundManager.release()
    }
}
