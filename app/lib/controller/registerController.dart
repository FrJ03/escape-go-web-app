import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:escape_go_mobile/view/loginview.dart';

class RegisterController {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController emailController = TextEditingController();

  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';
  
  Future<void> register(BuildContext context) async {
    String name = nameController.text.trim();
    String password = passwordController.text.trim();
    String email = emailController.text.trim();

    if (name.isEmpty || password.isEmpty || email.isEmpty) {
      _showDialog(context,'Error','Por favor, completa todos los campos.');
      return;
    }
    if (!isValidEmail(email)) {
      _showDialog(context,'Error','Por favor, introduce un correo válido de Gmail.');
      return;
    }

  try {
      final response = await _registerWithServer(email, name, password);
      if (response.statusCode == 200) {
        // Registro exitoso
        _showSuccessDialog(context, 'Correcto', 'Usuario $name registrado correctamente.');
        
        // Redirige al loginView después del registro exitoso
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginScreen()),
        );

      } else if (response.statusCode == 400) {
        // Conflicto (correo o usuario ya existente)
        _showDialog(context, 'Error', 'El correo o el nombre de usuario ya existe.');
      } else {
        // Otro error
        _showDialog(context, 'Error', 'Error al registrar usuario: ${response.body}');
      }
    } catch (e) {
      _showDialog(context, 'Error', 'Error al conectar con el servidor: $e');
    }
  }

  Future<http.Response> _registerWithServer(String email, String name, String password) async {
    final url = Uri.parse('$baseUrl/account/signup');
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    };
    final body = jsonEncode(<String, String>{
      'email': email,
      'username': name,
      'password': password,
    });

    return await http.post(url, headers: headers, body: body);
  }

  bool isValidEmail(String email) {
    final regex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return regex.hasMatch(email);
  }


  void _showDialog(BuildContext context, String tittle, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(tittle, style: TextStyle(color: Color(0xFFFFA1A1), fontWeight: FontWeight.bold,)),
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

void _showSuccessDialog(BuildContext context, String tittle, String message) {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: Text(tittle, style: TextStyle(color: Color(0xFFA2F1A5), fontWeight: FontWeight.bold,)),
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
