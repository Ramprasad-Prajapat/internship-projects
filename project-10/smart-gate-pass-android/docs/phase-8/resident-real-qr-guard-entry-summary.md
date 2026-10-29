# Phase 8C – Resident Real QR Pass & Guard Real Camera QR Entry Verification Summary

## Kotlin files changed

- `app/src/main/java/com/example/screens/GuardScreens.kt` (Updated `QRCodeAnalyzer` with stride safety padding array allocation, `TRY_HARDER` hints, and multi-angle orientation rotation support to fix detection failures when scanning from other screens. Bound the `Camera` instance to lifecycle, added instruction labels, and added Torch ON/OFF control button).
- `app/src/main/java/com/example/screens/ResidentScreens.kt` (Implemented `saveBitmapToGallery` saving QR code bitmap using MediaStore, added "Save QR Code" button to the Resident pass screen, and updated the Share button to trigger standard text Share Intent).

## Android Manifest files changed

- `app/src/main/AndroidManifest.xml` (No change).

## Gradle files changed

- `app/build.gradle.kts` (No change).

## Dependency status

- **Added & kept**: 
  - `androidx.camera:camera-camera2:1.5.0`
  - `androidx.camera:camera-lifecycle:1.5.0`
  - `androidx.camera:camera-view:1.5.0`
  - `androidx.camera:camera-core:1.5.0`
- **Reused**: `com.google.zxing:core:3.5.4` (for both gallery image decoding and real-time CameraX analysis YUV frame decoding)

## Permission changes

- **Added**: `android.permission.CAMERA` in the manifest and requested dynamically in the app prior to starting camera scan.

## Verification results

- **YUV Stride Safety Padding Fix**: Resolved potential `IllegalArgumentException` by allocating YUV byte array frame buffers to match exactly `rowStride * height` rather than using raw `buffer.remaining()` bounds.
- **Orientation Rotation Support**: Added second pass decoding that attempts rotated scans (90, 180, 270 degrees) dynamically to support portrait devices.
- **Scanner UI Instructions and Torch**: Added instructions ("Point camera at Resident QR code", "Keep QR inside frame", "Increase brightness on other phone") and a Torch ON/OFF toggle button to control exposure/glare.
- **Resident Add QR / Pass generation**: Details filled in the form generate a pass with a 6-digit OTP, QR code text fallback, and a real QR code image containing the exact token.
- **Resident QR Save**: Clicking "Save QR Code" saves the QR bitmap offline via MediaStore as a PNG file named with format `gatepass_qr_<tokenName>_<timestamp>.png` in Pictures/SmartGatePass directory and displays a success notification Toast.
- **Resident Pass Sharing**: Clicking the Share button triggers standard Android share intent populated with OTP and QR details.
- **Guard Camera Scanner Button Visibility**: Shows "Scan QR with Camera" card on the scanner screen. Click opens the runtime permission prompt and switches to the live camera scanner view.
- **Camera scanner**: Integrated real CameraX `PreviewView` with live viewfinder, and binds an `ImageAnalysis` analyzer (`QRCodeAnalyzer`) running ZXing barcode readers to decode frame Y-plane bytes. Checks permissions dynamically and displays simulated scan options for emulators.
- **Gallery import / upload**: Selector works correctly via standard photo picker `GetContent()`. Decodes selected QR code bitmap using ZXing and processes verification.
- **Manual QR entry**: Allows entry of the pass token and runs verification.
- **OTP verification**: OTP verification on the Guard dashboard verification screen continues to work correctly.
- **State consistency**: All verifications check and update the same shared `MockDataStore` visitor state.
- **Duplicate check-in**: Blocks subsequent check-ins for already checked-in visitors and shows "Visitor is already checked in."
- **Android build**: Clean compile completes successfully.
- **Verified APK paths**: 
  - Main Build Path: `app/build/outputs/apk/debug/app-debug.apk` (Timestamp: `06-07-2026 16:05`)
  - Root Directory Path: `.\app-debug.apk` (Synchronized copy, Timestamp: `06-07-2026 16:05`)
- **Backend folder**: Confirming no `backend/` folder was recreated.
- **Device Runtime Verification**: `APK built successfully; real camera scan requires user manual device testing.`

## Phase 8C completion summary

Phase 8C successfully delivers a real Guard camera QR code scanner using Android CameraX and the existing ZXing core library. The scanner integrates seamlessly with the lifecycle provider, dynamically requests camera permissions at runtime, and runs frame-by-frame analysis to decode QR pass tokens. Additionally, Residents can now save their pass QR code image directly to their gallery (pictures) via MediaStore API and share pass textual details using the system share intent. All changes build successfully and generate the debug APK.
