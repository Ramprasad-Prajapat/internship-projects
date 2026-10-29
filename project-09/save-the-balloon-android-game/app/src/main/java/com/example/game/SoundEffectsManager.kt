package com.example.game

import android.media.AudioManager
import android.media.ToneGenerator
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SoundEffectsManager {
    private var toneGenerator: ToneGenerator? = null
    var isSoundEnabled: Boolean = true

    init {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 85)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun playCoinSound() {
        if (!isSoundEnabled) return
        CoroutineScope(Dispatchers.Default).launch {
            try {
                toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 60)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun playPowerUpSound() {
        if (!isSoundEnabled) return
        CoroutineScope(Dispatchers.Default).launch {
            try {
                toneGenerator?.startTone(ToneGenerator.TONE_CDMA_PIP, 120)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun playGameOverSound() {
        if (!isSoundEnabled) return
        CoroutineScope(Dispatchers.Default).launch {
            try {
                toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP2, 300)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun playTapSound() {
        if (!isSoundEnabled) return
        CoroutineScope(Dispatchers.Default).launch {
            try {
                toneGenerator?.startTone(ToneGenerator.TONE_PROP_ACK, 40)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun release() {
        toneGenerator?.release()
        toneGenerator = null
    }
}
