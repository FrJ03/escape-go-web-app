import 'package:escape_go_mobile/domain/escape_rooms/escape_room.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:escape_go_mobile/domain/escape_rooms/escape_room_list_item.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';


class EscapeRoomController{
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';
  Future<bool> createEscapeRoom(EscapeRoom escapeRoom) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
    }

    final body = {
      'title': escapeRoom.title,
      'description': escapeRoom.description,
      'solution': escapeRoom.solution,
      'difficulty': escapeRoom.difficulty,
      'price': escapeRoom.price,
      'maxSessionDuration': escapeRoom.maxSessionDuration,
      'location': {
        'country': escapeRoom.location.country,
        'city': escapeRoom.location.city,
        'street': escapeRoom.location.street,
        'street_number': escapeRoom.location.streetNumber,
        'coordinates': escapeRoom.location.coordinates,
        'info': escapeRoom.location.info,
      }
    };

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    final response = await http.post(
      Uri.parse('$baseUrl/escaperoom/create'),
      headers: headers,
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      throw Exception('Error al crear el escape room: ${response.body}');
    }
  }

  Future<bool> deleteEscapeRoom(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/escaperoom/admin/create?id=$id'));

    if(response.statusCode == 200){
      return true;
    }
    else{
      return false;
    }
  }

  Future<List<EscapeRoomListItem>> getEscapeRooms() async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/escaperoom/admin/');
      final headers = {'Authorization': token};

      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        print('Response body: ${response.body}');
        final json = jsonDecode(response.body);

        if (json['escape_rooms'] == null) {
          throw Exception('La respuesta no contiene escape rooms');
        }

        List<EscapeRoomListItem> list = [];
        for (final escapeRoom in json['escape_rooms']) {
          final item = EscapeRoomListItem.fromJson(escapeRoom as Map<String, dynamic>);
          print('Parsed EscapeRoom: ID=${item.id}, Title=${item.title}');
          list.add(item);
        }

        return list;
      } else {
        throw Exception('Error al obtener escape rooms: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }


  /// Obtener el token almacenado
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
}