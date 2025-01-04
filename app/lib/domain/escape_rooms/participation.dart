
class Participation {
  final int id;
  final DateTime startDate;
  final DateTime endDate;
  final int? points; // Acepta valores nulos

  Participation({
    required this.id,
    required this.startDate,
    required this.endDate,
    this.points,
  });

  factory Participation.fromJson(Map<String, dynamic> json) {
    return Participation(
      id: json['id'] as int,
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      points: json['points'] != null && json['points'] != 'undefined'
          ? json['points'] as int
          : null, // Maneja `undefined` o valores nulos
    );
  }
}
