import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../domain/user/user.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
class ProfileController {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';
  Future<User> getUserProfile() async {
    try {
      String ? token = await _getToken();
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/profile'); // Cambia esta URL a la correcta para obtener el perfil del usuario.
      final headers = {'Authorization': token};

      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        return User.fromJson(json); // Suponiendo que el perfil es un solo objeto JSON
      } else {
        throw Exception('Error al obtener el perfil: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
  Future<bool> deleteProfile(BuildContext context) async {
    String email = nameController.text;
    String password = passwordController.text;
    print(password);
    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }
    if (email.isEmpty || password.isEmpty) {
      _showDialog(context, 'Error', 'Por favor, completa todos los campos.');
      return false;
    }

    if (!isValidEmail(email)) {
      _showDialog(context, 'Error', 'Por favor, introduce un correo válido de Gmail.');
      return false;
    }
    final body = jsonEncode(<String, String>{
      'password': password,
      'email': email
    });
    print(body);
    final headers = {'Authorization': token,
      'Content-Type': 'application/json',};
    final response = await http.post(Uri.parse('$baseUrl/account/delete'),headers: headers,body: body);

      if (response.statusCode == 200) {
        return true;
      } else {
        _showDialog(context, 'Error', '${response.body}');
        return false;
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }

  }

  Future<bool> modifyProfile(BuildContext context) async {
    String username = nameController.text;
    String password = passwordController.text;
    String email = emailController.text;

    try {
      final token = await _getToken();
      if (token == null) {
        throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
      }

      if (email != '') {
        if (!isValidEmail(email)) {
          _showDialog(context, 'Error', 'Por favor, introduce un correo válido de Gmail.');
          return false;
        }
      }

      final body = jsonEncode(<String, String>{
        'emailNuevo': email,
        'username': username,
        'password': password,
      });
      print(body);

      final headers = {
        'Authorization': token,
        'Content-Type': 'application/json',
      };

      final response = await http.put(
        Uri.parse('$baseUrl/profile/update'),
        headers: headers,
        body: body,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body); // Decodifica el JSON
        final token = data['token']; // Obtén el token
        if (token != null) {
          // Almacena el token de manera segura
          await saveToken(token);
          _showDialog(context, 'Éxito', 'Usuario cambiado correctamente');
          return true;
        }
      } else {
        _showDialog(context, 'Error', '${response.body}');
        return false;
      }
    } catch (e) {
      _showDialog(context, 'Error de conexión', 'Error de conexión: $e');
      return false;
    }

    // En caso de que por alguna razón no se cubra una ruta
    throw Exception('Unreachable code reached: modifyProfile() terminó sin devolver un valor.');
  }



  bool isValidEmail(String email) {
    final regex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return regex.hasMatch(email);
  }
  void _showDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title, style: TextStyle(color: Color(0xFFFFA1A1), fontWeight: FontWeight.bold)),
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




  /// Obtener el token almacenado
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

}
