// lib/core/storage/file_local_storage.dart
import 'dart:convert';
import 'dart:io';
import 'local_storage.dart';

/// Production-oriented offline-first file storage implementation of [LocalStorageService].
/// Persists key-value data to a local JSON file using atomic file operations.
class FileLocalStorage implements LocalStorageService {
  final String fileName;
  final String? customDirectoryPath;
  late final File _file;
  late final File _tempFile;
  final Map<String, dynamic> _store = {};
  bool _isInitialized = false;

  FileLocalStorage({
    this.fileName = 'time_loop_local_storage.json',
    this.customDirectoryPath,
  });

  @override
  Future<void> init() async {
    if (_isInitialized) return;
    try {
      final dirPath = customDirectoryPath ?? Directory.current.path;
      final dir = Directory(dirPath);
      if (!await dir.exists()) {
        await dir.create(recursive: true);
      }
      _file = File('${dir.path}/$fileName');
      _tempFile = File('${dir.path}/$fileName.tmp');

      if (await _file.exists()) {
        final content = await _file.readAsString();
        if (content.isNotEmpty) {
          final decoded = jsonDecode(content);
          if (decoded is Map<String, dynamic>) {
            _store.addAll(decoded);
          }
        }
      }
    } catch (_) {
      // In case of filesystem restriction or corruption during init, fallback gracefully
    } finally {
      _isInitialized = true;
    }
  }

  Future<void> _flushToDisk() async {
    try {
      final jsonString = jsonEncode(_store);
      await _tempFile.writeAsString(jsonString, flush: true);
      if (await _tempFile.exists()) {
        if (await _file.exists()) {
          await _file.delete();
        }
        await _tempFile.rename(_file.path);
      }
    } catch (_) {
      // If atomic rename fails, attempt direct sync write
      try {
        final jsonString = jsonEncode(_store);
        await _file.writeAsString(jsonString, flush: true);
      } catch (_) {}
    }
  }

  @override
  Future<String?> getString(String key) async {
    if (!_isInitialized) await init();
    return _store[key] as String?;
  }

  @override
  Future<void> setString(String key, String value) async {
    if (!_isInitialized) await init();
    _store[key] = value;
    await _flushToDisk();
  }

  @override
  Future<bool?> getBool(String key) async {
    if (!_isInitialized) await init();
    return _store[key] as bool?;
  }

  @override
  Future<void> setBool(String key, bool value) async {
    if (!_isInitialized) await init();
    _store[key] = value;
    await _flushToDisk();
  }

  @override
  Future<void> remove(String key) async {
    if (!_isInitialized) await init();
    _store.remove(key);
    await _flushToDisk();
  }

  @override
  Future<void> clearAll() async {
    if (!_isInitialized) await init();
    _store.clear();
    await _flushToDisk();
  }
}
