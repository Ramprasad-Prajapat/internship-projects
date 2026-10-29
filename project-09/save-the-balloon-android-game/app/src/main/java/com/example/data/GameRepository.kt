package com.example.data

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

class GameRepository(private val dao: GameStatsDao) {
    val gameStats: Flow<GameStats> = dao.getGameStats().map { it ?: GameStats() }

    suspend fun saveStats(stats: GameStats) {
        dao.saveGameStats(stats)
    }

    suspend fun updateHighScoreAndCoins(score: Int, additionalCoins: Int) {
        val current = gameStats.first()
        val newHighScore = if (score > current.highScore) score else current.highScore
        val newTotalCoins = current.totalCoins + additionalCoins
        dao.saveGameStats(current.copy(highScore = newHighScore, totalCoins = newTotalCoins))
    }

    suspend fun toggleSound(enabled: Boolean) {
        val current = gameStats.first()
        dao.saveGameStats(current.copy(soundEnabled = enabled))
    }
}
