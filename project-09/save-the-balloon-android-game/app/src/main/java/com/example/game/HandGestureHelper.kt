import androidx.core.content.ContextCompat

import android.content.Context
import android.util.Log
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.lifecycle.LifecycleOwner
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.handdetector.HandDetector
import com.google.mediapipe.tasks.vision.handdetector.HandDetectorOptions
import android.graphics.Bitmap
import android.media.Image
import org.tensorflow.lite.support.image.TensorImage
import com.example.game.GameViewModel
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * Helper class to initialize CameraX and MediaPipe Hand detection when Hand control mode is active.
 * This is a minimal stub implementation designed to compile without full MediaPipe pipeline setup.
 * The [start] method sets up a front‑facing camera and an [ImageAnalysis] use case that would feed
 * frames to MediaPipe. The actual hand landmark processing is omitted for brevity – developers can
 * extend this class with the full MediaPipe pipeline as needed.
 */
class HandGestureHelper(
    private val context: Context,
    private val viewModel: GameViewModel
) {
    private var cameraProvider: ProcessCameraProvider? = null
    private var analysisExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private var handDetector: HandDetector? = null

    /** Starts camera preview and hand detection. */
    fun start() {
        // Obtain camera provider asynchronously using main executor.
        ProcessCameraProvider.getInstance(context).also { future ->
            future.addListener({
                cameraProvider = future.get()
                bindCameraUseCases()
            }, ContextCompat.getMainExecutor(context))
        }
    }

    /** Stops camera and releases resources. */
    fun stop() {
        cameraProvider?.unbindAll()
        handDetector?.close()
        analysisExecutor.shutdown()
    }

    /** Binds Preview and ImageAnalysis use‑cases to the front camera. */
    private fun bindCameraUseCases() {
        val provider = cameraProvider ?: return
        val preview = Preview.Builder().build()
        val previewView = PreviewView(context)
        preview.setSurfaceProvider(previewView.surfaceProvider)

        // ImageAnalysis for feeding frames to MediaPipe (stub – no real processing).
        val analysis = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
        analysis.setAnalyzer(analysisExecutor) { imageProxy ->
            val bitmap = imageProxy.toBitmap()
            val mpImage = BitmapImageBuilder(bitmap).build()
            handDetector?.let { detector ->
                try {
                    val result = detector.detect(mpImage)
                    if (result != null && result.hands().isNotEmpty()) {
                        val hand = result.hands()[0]
                        var sumX = 0f
                        hand.landmarks().forEach { lm -> sumX += lm.x() }
                        val avgX = sumX / hand.landmarks().size
                        // Front camera mirrors horizontally; invert coordinate
                        val mirroredX = 1f - avgX
                        viewModel.setBalloonX(mirroredX)
                    }
                } catch (e: Exception) {
                    Log.e("HandGestureHelper", "Hand detection failed", e)
                }
            }
            imageProxy.close()
        }

        // Front‑facing camera selector.
        val cameraSelector = CameraSelector.Builder()
            .requireLensFacing(CameraSelector.LENS_FACING_FRONT)
            .build()

        provider.unbindAll()
        provider.bindToLifecycle(context as LifecycleOwner, cameraSelector, preview, analysis)

        // Initialize MediaPipe HandDetector (lightweight configuration).
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("hand_landmark_full.task")
                .build()
            val options = HandDetectorOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinHandDetectionConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .build()
            handDetector = HandDetector.createFromOptions(context, options)
        } catch (e: Exception) {
            Log.e("HandGestureHelper", "Failed to create HandDetector", e)
        }
    }
}
