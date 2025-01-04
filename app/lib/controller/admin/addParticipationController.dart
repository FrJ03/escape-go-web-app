import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart'; // Importar el paquete intl

class AddParticipationController {
  final TextEditingController dateStartController = TextEditingController();
  final TextEditingController dateEndController = TextEditingController();
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND'; // Cambia por tu URL

  Future<bool> createParticipation(String id, DateTime startDate, DateTime endDate) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
    }

    final headers = {
      'Content-Type': 'application/json',
      'Authorization': token, // Token para autenticación
    };

    final Map<String, String> body = {
      'escape_room_id': id,
      'start_date': startDate.toIso8601String(), // Formato ISO 8601
      'end_date': endDate.toIso8601String(),
    };


    try {
      final response = await http.post(
        Uri.parse('$baseUrl/escaperoom/admin/participation'),
        headers: headers,
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        debugPrint('Error al crear participación: ${response.body}');
        return false;
      }
    } catch (e) {
      debugPrint('Excepción al llamar la API: $e');
      return false;
    }
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
}
