import 'dart:convert';
import 'dart:io';

class StorageService {
  static StorageService? _instance;
  static StorageService get instance => _instance ??= StorageService._();

  StorageService._();

  final Map<String, String> _inMemoryStore = {};

  Future<File?> _getStorageFile() async {
    try {
      final dir = Directory.systemTemp;
      final file = File('${dir.path}/obliq_auth_store_udaipur.json');
      if (!await file.exists()) {
        await file.create(recursive: true);
      }
      return file;
    } catch (_) {
      return null;
    }
  }

  Future<void> setString(String key, String value) async {
    _inMemoryStore[key] = value;
    try {
      final file = await _getStorageFile();
      if (file != null) {
        Map<String, dynamic> data = {};
        if (await file.exists()) {
          final content = await file.readAsString();
          if (content.isNotEmpty) {
            data = jsonDecode(content) as Map<String, dynamic>;
          }
        }
        data[key] = value;
        await file.writeAsString(jsonEncode(data));
      }
    } catch (_) {}
  }

  Future<String?> getString(String key) async {
    if (_inMemoryStore.containsKey(key)) {
      return _inMemoryStore[key];
    }
    try {
      final file = await _getStorageFile();
      if (file != null && await file.exists()) {
        final content = await file.readAsString();
        if (content.isNotEmpty) {
          final data = jsonDecode(content) as Map<String, dynamic>;
          if (data.containsKey(key)) {
            _inMemoryStore[key] = data[key].toString();
            return data[key].toString();
          }
        }
      }
    } catch (_) {}
    return null;
  }

  Future<void> remove(String key) async {
    _inMemoryStore.remove(key);
    try {
      final file = await _getStorageFile();
      if (file != null && await file.exists()) {
        final content = await file.readAsString();
        if (content.isNotEmpty) {
          final data = jsonDecode(content) as Map<String, dynamic>;
          data.remove(key);
          await file.writeAsString(jsonEncode(data));
        }
      }
    } catch (_) {}
  }
}
