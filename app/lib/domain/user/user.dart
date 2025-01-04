class User {
  final int _id;
  final String _email;
  final String _username;
  final String _role;
  final int _points;

  const User(
      this._id,
      this._email,
      this._username,
      this._role,
      this._points, // Cambiado el orden para que coincida
      );

  factory User.fromJson(Map<String, dynamic> json) {
    try {
      return User(
        json['id'] is int ? json['id'] as int : int.parse(json['id']), // Convertir a int si es String
        json['email'] ?? '', // Si falta el campo, usar un valor por defecto
        json['username'] ?? '', // Si falta el campo, usar un valor por defecto
        json['role'] ?? 'N/A', // Manejar roles nulos
        json['points'] is int ? json['points'] as int : int.tryParse(json['points'] ?? '0') ?? 0, // Convertir puntos si es String
      );
    } catch (e) {
      throw FormatException('Failed to load user profile: $e');
    }
  }

  int get id => this._id;
  String get email => this._email;
  String get username => this._username;
  int get points => this._points;
  String get role => this._role;
}
