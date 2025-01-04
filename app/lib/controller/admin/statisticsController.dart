import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class StatisticsController {
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';
  Future<int> getConversionRate() async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/measures/conversion'); // Ruta completa
      final headers = {
        'Authorization': token, // Token para autenticación
      };

      final response = await http.get(url, headers: headers); // Realiza el request
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        // Extrae el valor del campo 'rate' de la respuesta JSON
        final int rate = json['rate'];

        // Convierte el valor a entero si lo necesitas
        return (rate * 100); // Ejemplo: convierte 0.5 a 50 (porcentaje)
      } else {
        return Future.error('Error<${response.statusCode}>: get Conversion Rate');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  Future<int> getGrowthRate() async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/measures/growth'); // Ruta completa
      final headers = {
        'Authorization': token, // Token para autenticación
      };

      final response = await http.get(url, headers: headers); // Realiza el request
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        // Extrae el valor del campo 'rate' de la respuesta JSON
        final int rate = json['rate'];

        // Convierte el valor a entero si lo necesitas
        return (rate * 100); // Ejemplo: convierte 0.5 a 50 (porcentaje)
      } else {
        return Future.error('Error<${response.statusCode}>: get Conversion Rate');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }


  Future<String> getIntervalSession() async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/measures/sessions-interval'); // Ruta completa
      final headers = {
        'Authorization': token, // Token para autenticación
      };

      final response = await http.get(url, headers: headers); // Realiza el request
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);

        // Extrae el valor del campo 'rate' de la respuesta JSON
        final int years = json['years'];
        final int months = json['months'];
        final int days = json['days'];
        final int hours = json['hours'];
        final int minutes = json['minutes'];
        final int seconds = json['seconds'];
        final String interval= '$years años $months meses $days días $hours horas $minutes min $seconds seg';


        return interval;
      } else {
        return Future.error('Error<${response.statusCode}>: get Conversion Rate');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }



  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
}