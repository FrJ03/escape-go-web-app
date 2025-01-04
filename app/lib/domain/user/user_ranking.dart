class User {
  final String _username;
  final int _points;

  const User(
      this._username,
      this._points, // Cambiado el orden para que coincida
      );

  factory User.fromJson(Map<String, dynamic> json) {
    try {
      return User(
        json['username'] ?? '', // Usa un valor por defecto si no existe
        json['points'] is int
            ? json['points'] as int
            : int.tryParse(json['points']?.toString() ?? '0') ?? 0, // Convierte String a int
      );
    } catch (e) {
      throw FormatException('Failed to parse user: $e');
    }
  }


  String get username => this._username;
  int get points => this._points;

}
