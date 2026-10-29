package com.example.data

import android.content.Context
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf

class TypingRepository(private val context: Context) {
    private val db = TypingDatabase.getDatabase(context)
    private val dao = db.typingDao()
    private val sharedPrefs = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    suspend fun syncDatabaseWithPreferences() {
        val email = sharedPrefs.getString("current_user_email", null) ?: return
        val userProgressKey = "progress_$email"
        val progressJson = sharedPrefs.getString(userProgressKey, null) ?: return
        
        try {
            val json = org.json.JSONObject(progressJson)
            val currentStats = dao.getUserStatsSync() ?: UserStatsEntity(
                id = 1,
                username = email.substringBefore("@"),
                email = email,
                coins = 1250,
                bestWpm = 45,
                accuracy = 92.0,
                streak = 5,
                rank = "Top 5%",
                level = 4,
                xp = 2400,
                nextLevelXp = 5000
            )
            
            val isDefaultStats = currentStats.coins == 1250 && currentStats.bestWpm == 45 && currentStats.level == 4 && currentStats.xp == 2400
            val updatedStats = if (isDefaultStats) {
                currentStats.copy(
                    email = email,
                    username = email.substringBefore("@"),
                    coins = json.optInt("coins", currentStats.coins),
                    bestWpm = json.optInt("bestWpm", currentStats.bestWpm),
                    accuracy = json.optDouble("accuracy", currentStats.accuracy),
                    streak = json.optInt("streak", currentStats.streak),
                    rank = json.optString("rank", currentStats.rank),
                    level = json.optInt("level", currentStats.level),
                    xp = json.optInt("xp", currentStats.xp),
                    nextLevelXp = json.optInt("nextLevelXp", currentStats.nextLevelXp)
                )
            } else {
                currentStats.copy(
                    email = email,
                    username = email.substringBefore("@"),
                    coins = maxOf(currentStats.coins, json.optInt("coins", 0)),
                    bestWpm = maxOf(currentStats.bestWpm, json.optInt("bestWpm", 0)),
                    accuracy = maxOf(currentStats.accuracy, json.optDouble("accuracy", 0.0)),
                    streak = maxOf(currentStats.streak, json.optInt("streak", 0)),
                    rank = if (currentStats.rank == "Top 5%") json.optString("rank", currentStats.rank) else currentStats.rank,
                    level = maxOf(currentStats.level, json.optInt("level", 0)),
                    xp = maxOf(currentStats.xp, json.optInt("xp", 0)),
                    nextLevelXp = maxOf(currentStats.nextLevelXp, json.optInt("nextLevelXp", 0))
                )
            }
            dao.insertUserStats(updatedStats)

            val modesArray = json.optJSONArray("modes")
            if (modesArray != null) {
                val dbModes = dao.getAllModesSync()
                for (i in 0 until modesArray.length()) {
                    val modeObj = modesArray.getJSONObject(i)
                    val mId = modeObj.getString("id")
                    val progress = modeObj.getInt("progressPercent")
                    val dbMode = dbModes.find { it.id == mId }
                    val maxProgress = maxOf(dbMode?.progressPercent ?: 0, progress)
                    dao.updateModeProgress(mId, maxProgress)
                }
            }

            val levelsArray = json.optJSONArray("levels")
            if (levelsArray != null) {
                val dbLevels = dao.getAllLevelsSync()
                for (i in 0 until levelsArray.length()) {
                    val levelObj = levelsArray.getJSONObject(i)
                    val lId = levelObj.getString("id")
                    val stars = levelObj.optInt("stars", 0)
                    val completed = levelObj.optBoolean("completed", false)
                    val unlocked = levelObj.optBoolean("unlocked", false)
                    val bestWpm = levelObj.optInt("bestWpm", 0)
                    val bestAccuracy = levelObj.optDouble("bestAccuracy", 0.0)
                    
                    val dbLvl = dbLevels.find { it.id == lId }
                    val maxStars = maxOf(dbLvl?.stars ?: 0, stars)
                    val isCompleted = dbLvl?.completed == true || completed
                    val isUnlocked = dbLvl?.unlocked == true || unlocked
                    val maxWpm = maxOf(dbLvl?.bestWpm ?: 0, bestWpm)
                    val maxAccuracy = maxOf(dbLvl?.bestAccuracy ?: 0.0, bestAccuracy)
                    
                    dao.updateLevelResult(lId, maxStars, isCompleted, maxWpm, maxAccuracy)
                    dao.updateLevelUnlockStatus(lId, isUnlocked)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    suspend fun saveUserProgressToPrefs() {
        val email = sharedPrefs.getString("current_user_email", null) ?: return
        val stats = dao.getUserStatsSync() ?: return
        val modesList = dao.getAllModesSync()
        val levelsList = dao.getAllLevelsSync()

        try {
            val progressObj = org.json.JSONObject()
            progressObj.put("coins", stats.coins)
            progressObj.put("bestWpm", stats.bestWpm)
            progressObj.put("accuracy", stats.accuracy)
            progressObj.put("streak", stats.streak)
            progressObj.put("rank", stats.rank)
            progressObj.put("level", stats.level)
            progressObj.put("xp", stats.xp)
            progressObj.put("nextLevelXp", stats.nextLevelXp)

            val modesArr = org.json.JSONArray()
            modesList.forEach { mode ->
                val mObj = org.json.JSONObject()
                mObj.put("id", mode.id)
                mObj.put("progressPercent", mode.progressPercent)
                modesArr.put(mObj)
            }
            progressObj.put("modes", modesArr)

            val levelsArr = org.json.JSONArray()
            levelsList.forEach { lvl ->
                val lObj = org.json.JSONObject()
                lObj.put("id", lvl.id)
                lObj.put("stars", lvl.stars)
                lObj.put("completed", lvl.completed)
                lObj.put("unlocked", lvl.unlocked)
                lObj.put("bestWpm", lvl.bestWpm)
                lObj.put("bestAccuracy", lvl.bestAccuracy)
                levelsArr.put(lObj)
            }
            progressObj.put("levels", levelsArr)

            val userProgressKey = "progress_$email"
            sharedPrefs.edit().putString(userProgressKey, progressObj.toString()).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    suspend fun checkAndSeedDatabase() {
        val stats = dao.getUserStatsSync()
        if (stats == null) {
            TypingDatabase.seedDatabase(dao)
        }
        syncDatabaseWithPreferences()
    }

    suspend fun resetDatabase() {
        db.clearAllTables()
        TypingDatabase.seedDatabase(dao)
        val email = sharedPrefs.getString("current_user_email", null)
        if (email != null) {
            val auth = com.example.auth.AuthManager(context)
            auth.initializeDefaultProgress(email, force = true)
            syncDatabaseWithPreferences()
        }
    }

    // Expose Domain Models mapped from Room Entities

    val userStatsFlow: Flow<UserData?> = dao.getUserStats().map { entity ->
        entity?.let {
            UserData(
                username = it.username,
                email = it.email,
                coins = it.coins,
                bestWpm = it.bestWpm,
                accuracy = it.accuracy,
                streak = it.streak,
                rank = it.rank,
                level = it.level,
                xp = it.xp,
                nextLevelXp = it.nextLevelXp
            )
        }
    }

    val modesFlow: Flow<List<ModeData>> = dao.getAllModes().map { list ->
        list.map {
            ModeData(
                id = it.id,
                name = it.name,
                category = it.category,
                difficulty = it.difficulty,
                description = it.description,
                progressPercent = it.progressPercent,
                iconName = it.iconName
            )
        }
    }

    fun getLevelsForMode(modeId: String): Flow<List<LevelData>> {
        return dao.getLevelsForMode(modeId).map { list ->
            list.map {
                LevelData(
                    id = it.id,
                    modeId = it.modeId,
                    name = it.name,
                    targetText = it.targetText,
                    unlocked = it.unlocked,
                    completed = it.completed,
                    stars = it.stars,
                    bestWpm = it.bestWpm,
                    bestAccuracy = it.bestAccuracy,
                    difficultyLabel = it.difficultyLabel
                )
            }
        }
    }

    val allLevelsFlow: Flow<List<LevelData>> = dao.getAllLevels().map { list ->
        list.map {
            LevelData(
                id = it.id,
                modeId = it.modeId,
                name = it.name,
                targetText = it.targetText,
                unlocked = it.unlocked,
                completed = it.completed,
                stars = it.stars,
                bestWpm = it.bestWpm,
                bestAccuracy = it.bestAccuracy,
                difficultyLabel = it.difficultyLabel
            )
        }
    }

    val mistakesFlow: Flow<List<MistakeData>> = dao.getAllMistakes().map { list ->
        list.map {
            MistakeData(
                id = it.id,
                originalWord = it.originalWord,
                typedWord = it.typedWord,
                typeLabel = it.typeLabel,
                originalSentence = it.originalSentence,
                typedSentence = it.typedSentence,
                helpText = it.helpText,
                userId = it.userId,
                sessionId = it.sessionId,
                modeId = it.modeId,
                levelId = it.levelId,
                challengeId = it.challengeId,
                promptText = it.promptText,
                expectedText = it.expectedText,
                submittedText = it.submittedText,
                timestamp = it.timestamp
            )
        }
    }

    val equipmentFlow: Flow<List<EquipmentData>> = dao.getAllEquipment().map { list ->
        list.map {
            EquipmentData(
                id = it.id,
                name = it.name,
                category = it.category,
                rarity = it.rarity,
                effect = it.effect,
                cost = it.cost,
                unlocked = it.unlocked,
                equipped = it.equipped,
                iconName = it.iconName
            )
        }
    }

    val badgesFlow: Flow<List<BadgeData>> = dao.getAllBadges().map { list ->
        list.map {
            BadgeData(
                id = it.id,
                title = it.title,
                description = it.description,
                iconName = it.iconName,
                unlocked = it.unlocked
            )
        }
    }

    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    val sessionHistoryFlow: Flow<List<SessionHistoryEntity>> = userStatsFlow.flatMapLatest { user ->
        val email = user?.email ?: ""
        if (email.isNotEmpty()) {
            dao.getSessionHistory(email)
        } else {
            kotlinx.coroutines.flow.flowOf(emptyList())
        }
    }

    // Mutator operations

    suspend fun recordGameplayResult(
        levelId: String,
        modeId: String,
        score: Int,
        wpm: Int,
        accuracy: Double,
        stars: Int,
        madeMistakes: List<MistakeData>,
        success: Boolean,
        sessionId: String,
        completedItems: Int,
        requiredItems: Int,
        remainingTime: Int,
        remainingHealth: Int,
        maxCombo: Int,
        outcome: String
    ) {
        val email = sharedPrefs.getString("current_user_email", null) ?: return

        // Idempotent duplicate check
        if (dao.hasSession(sessionId) > 0) return

        // 1. Update level stats if better
        val currentLevels = dao.getLevelsForMode(modeId).map { list -> list.find { it.id == levelId } }.firstOrNull()
        val alreadyCompleted = currentLevels?.completed == true

        val xpGain = if (success && !alreadyCompleted) (100 + (score / 100)) else 0
        val coinGain = if (success && !alreadyCompleted) (200 + (stars * 50)) else 0

        // Save session history record
        val sessionEntity = SessionHistoryEntity(
            id = sessionId,
            email = email,
            modeId = modeId,
            levelId = levelId,
            score = score,
            wpm = wpm,
            accuracy = accuracy,
            completedItems = completedItems,
            requiredItems = requiredItems,
            remainingTime = remainingTime,
            remainingHealth = remainingHealth,
            maxCombo = maxCombo,
            outcome = outcome,
            earnedXp = xpGain,
            earnedCoins = coinGain,
            timestamp = System.currentTimeMillis()
        )
        dao.insertSession(sessionEntity)

        if (success) {
            if (currentLevels != null) {
                val maxWpm = maxOf(currentLevels.bestWpm, wpm)
                val maxAcc = maxOf(currentLevels.bestAccuracy, accuracy)
                val maxStars = maxOf(currentLevels.stars, stars)
                dao.updateLevelResult(levelId, maxStars, true, maxWpm, maxAcc)
            } else {
                dao.updateLevelResult(levelId, stars, true, wpm, accuracy)
            }

            // 2. Unlock the next level in this mode if exists
            val allLevelsInMode = dao.getLevelsForMode(modeId).firstOrNull() ?: emptyList()
            val currentIndex = allLevelsInMode.indexOfFirst { it.id == levelId }
            if (currentIndex != -1 && currentIndex < allLevelsInMode.size - 1) {
                val nextLevel = allLevelsInMode[currentIndex + 1]
                dao.updateLevelUnlockStatus(nextLevel.id, true)
            }
        }

        // 3. Save any mistakes made
        madeMistakes.forEach {
            dao.insertMistake(
                MistakeEntity(
                    id = it.id,
                    originalWord = it.originalWord,
                    typedWord = it.typedWord,
                    typeLabel = it.typeLabel,
                    originalSentence = it.originalSentence,
                    typedSentence = it.typedSentence,
                    helpText = it.helpText,
                    userId = email,
                    sessionId = sessionId,
                    modeId = modeId,
                    levelId = levelId,
                    challengeId = it.challengeId,
                    promptText = it.promptText,
                    expectedText = it.expectedText,
                    submittedText = it.submittedText,
                    timestamp = it.timestamp
                )
            )
        }

        if (success) {
            // 4. Update mode completion progress percentage
            val updatedLevels = dao.getLevelsForMode(modeId).firstOrNull() ?: emptyList()
            val completedCount = updatedLevels.count { it.completed }
            val newProgress = if (updatedLevels.isNotEmpty()) (completedCount * 100) / updatedLevels.size else 0
            dao.updateModeProgress(modeId, newProgress)
        }

        // 5. Update user coins, XP, level, bestWpm, accuracy
        val userStats = dao.getUserStatsSync()
        if (userStats != null) {
            var newXp = userStats.xp + xpGain
            var newLevel = userStats.level
            var nextLvlXp = userStats.nextLevelXp
            while (newXp >= nextLvlXp) {
                newXp -= nextLvlXp
                newLevel += 1
                nextLvlXp = (nextLvlXp * 1.2).toInt()
            }

            val newCoins = userStats.coins + coinGain
            val updatedBestWpm = maxOf(userStats.bestWpm, wpm)
            val updatedAccuracy = if (userStats.accuracy == 0.0) accuracy else (userStats.accuracy * 0.8 + accuracy * 0.2)

            dao.insertUserStats(
                userStats.copy(
                    coins = newCoins,
                    bestWpm = updatedBestWpm,
                    accuracy = updatedAccuracy,
                    level = newLevel,
                    xp = newXp,
                    nextLevelXp = nextLvlXp
                )
            )

            // Trigger Badge check for "Speed Demon"
            if (success && wpm >= 80) {
                dao.insertBadges(listOf(BadgeEntity("badge_1", "Speed Demon", "Type faster than 80 WPM in a game.", "speed", true)))
            }
            if (success && accuracy == 100.0) {
                dao.insertBadges(listOf(BadgeEntity("badge_2", "Perfect 100", "Achieve 100% accuracy in a Sentence Run.", "ads_click", true)))
            }
        }
        
        saveUserProgressToPrefs()
    }

    suspend fun buyEquipment(itemId: String, cost: Int): Boolean {
        val stats = dao.getUserStatsSync() ?: return false
        if (stats.coins >= cost) {
            dao.insertUserStats(stats.copy(coins = stats.coins - cost))
            dao.updateEquipmentUnlock(itemId, true)
            saveUserProgressToPrefs()
            return true
        }
        return false
    }

    suspend fun equipItem(itemId: String, category: String) {
        dao.unequipAllInCategory(category)
        dao.updateEquipmentEquipped(itemId, true)
    }

    suspend fun clearMistake(id: String) {
        dao.deleteMistake(id)
    }

    suspend fun clearAllMistakes() {
        dao.clearAllMistakes()
    }

    fun getCurrentUserEmail(): String? {
        return sharedPrefs.getString("current_user_email", null)
    }
}
