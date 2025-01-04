import 'location.dart';
import 'participation.dart'; // Importa la clase Participation si no está ya importada.

class EscapeRoom {
  final int _id;
  final String _title;
  final String _description;
  final String _solution;
  final int _difficulty;
  final int _price;
  final int _maxSessionDuration;
  final Location _location;
  final List<Participation> _participations;

  const EscapeRoom(
      this._id,
      this._title,
      this._description,
      this._solution,
      this._difficulty,
      this._price,
      this._maxSessionDuration,
      this._location,
      this._participations,
      );

  factory EscapeRoom.fromJson(Map<String, dynamic> json) {
    try {
      final escapeRoomJson = json['escape_room'] as Map<String, dynamic>;
      return EscapeRoom(
        escapeRoomJson['id'] as int,
        escapeRoomJson['title'] as String,
        escapeRoomJson['description'] as String,
        '', // Omite el campo `solution` ya que no está en el JSON
        escapeRoomJson['difficulty'] as int,
        escapeRoomJson['price'] as int,
        escapeRoomJson['maxSessionDuration'] as int,
        Location.fromJson(escapeRoomJson['location'] as Map<String, dynamic>),
        (json['participations'] as List<dynamic>?)
            ?.map((e) => Participation.fromJson(e as Map<String, dynamic>))
            .toList() ??
            [], // Lista vacía si `participations` es nulo
      );
    } catch (e) {
      throw FormatException('Failed to load escape room: $e');
    }
  }



  int get id => _id;
  String get title => _title;
  String get description => _description;
  String get solution => _solution;
  int get difficulty => _difficulty;
  int get price => _price;
  int get maxSessionDuration => _maxSessionDuration;
  Location get location => _location;
  List<Participation> get participations => _participations;
}
