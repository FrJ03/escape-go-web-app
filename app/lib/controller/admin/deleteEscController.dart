import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class DeleteEscapeRoomController {
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';

  Future<void> deleteEscapeRoom(BuildContext context, int escapeRoomId) async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final response = await _deleteEscapeRoomFromServer(escapeRoomId, token);

      if (response.statusCode == 200) {
        _showSuccessDialog(
            context, 'Correcto', 'Escape Room eliminado correctamente.');
      } else if (response.statusCode == 404) {
        print(escapeRoomId);
        _showDialog(context, 'Error',
            'Escape Room no encontrado. Puede que ya haya sido eliminado.');
      } else {
        _showDialog(
            context, 'Error', 'Error al eliminar el Escape Room: ${response.body}');
      }
    } catch (e) {
      _showDialog(context, 'Error', 'Error al conectar con el servidor: $e');
    }
  }


  Future<http.Response> _deleteEscapeRoomFromServer(int escapeRoomId, String token) async {
    final url = Uri.parse('$baseUrl/escaperoom/admin/delete/$escapeRoomId');
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': token, // Token para autenticación
    };

    return await http.delete(url, headers: headers);
  }

  /// Obtener el token almacenado
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  void _showDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title,
            style:
                TextStyle(color: Color(0xFFFFA1A1), fontWeight: FontWeight.bold)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title,
            style:
                TextStyle(color: Color(0xFFA2F1A5), fontWeight: FontWeight.bold)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}