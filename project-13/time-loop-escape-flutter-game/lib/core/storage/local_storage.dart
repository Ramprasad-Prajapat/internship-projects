// lib/core/storage/local_storage.dart

abstract class LocalStorageService {
  Future<void> init();
  Future<String?> getString(String key);
  Future<void> setString(String key, String value);
  Future<bool?> getBool(String key);
  Future<void> setBool(String key, bool value);
  Future<void> remove(String key);
  Future<void> clearAll();
}
