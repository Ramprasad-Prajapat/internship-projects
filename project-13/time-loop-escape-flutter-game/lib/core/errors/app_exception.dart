// lib/core/errors/app_exception.dart

abstract class AppException implements Exception {
  final String message;
  final String? code;

  const AppException(this.message, {this.code});

  @override
  String toString() => 'AppException[$code]: $message';
}

class StorageException extends AppException {
  const StorageException(String message, {String? code})
      : super(message, code: code ?? 'STORAGE_ERROR');
}

class StateException extends AppException {
  const StateException(String message, {String? code})
      : super(message, code: code ?? 'STATE_ERROR');
}

class LoopException extends AppException {
  const LoopException(String message, {String? code})
      : super(message, code: code ?? 'LOOP_ERROR');
}
