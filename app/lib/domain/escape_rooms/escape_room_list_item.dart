import 'location.dart';

class EscapeRoomListItem{
  final _id;
  final _title;
  final _location;

  const EscapeRoomListItem(
    this._id,
    this._title,
    this._location
  );

  factory EscapeRoomListItem.fromJson(Map<String, dynamic> json){
    try {
      return EscapeRoomListItem(
        json['id'] as int,
        json['title'] as String,
        Location.fromJson(json['location'] as Map<String, dynamic>),
      );
    } catch (e) {
      throw const FormatException('Failed to load escape room list item.');
    }
  }

  int get id => this._id;
  String get title => this._title;
  Location get location => this._location;
}