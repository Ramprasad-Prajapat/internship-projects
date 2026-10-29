// lib/core/errors/failures.dart

abstract class Failure {
  final String message;
  const Failure(this.message);
}

class StorageFailure extends Failure {
  const StorageFailure(String message) : super(message);
}

class StateTransitionFailure extends Failure {
  const StateTransitionFailure(String message) : super(message);
}
