class Location{
  final _country;
  final _city;
  final _street;
  final _streetNumber;
  final _coordinates;
  final _info;

  const Location(
    this._country,
    this._city,
    this._street,
    this._streetNumber,
    this._coordinates,
    this._info,
  );

  factory Location.fromJson(Map<String, dynamic> json) {
    switch (json) {
      case {
      'country': String country,
      'city': String city,
      'street': String street,
      'street_number': int streetNumber,
      'coordinates': String coordinates
      }:
        return Location(
          country,
          city,
          street,
          streetNumber,
          coordinates,
          ''
        );
      default:
        throw const FormatException('Failed to load location.');
    }
  }

  String get country => this._country;
  String get city => this._city;
  String get street => this._street;
  int get streetNumber => this._streetNumber;
  String get coordinates => this._coordinates;
  String get info => this._info;
}