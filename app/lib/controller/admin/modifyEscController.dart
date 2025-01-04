import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ModifyEscapeController {

  final TextEditingController tittleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController levelController = TextEditingController();
  final TextEditingController solutionController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController storyController = TextEditingController();

  final List<Map<String, String>> clues = [];
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND'; // Cambia por tu URL
  final String Id;

  ModifyEscapeController({required this.Id}) {
    // Verifica si el ID se pasa correctamente al crear la instancia del controlador
    print('ID inicializado en ModifyEscapeController: $Id');

  }
  /// Recoger datos de ambas vistas y enviar a la API
  Future<void> recoger(BuildContext context, String id) async {


    final String title = tittleController.text!.trim();
    final String description = descriptionController.text.trim();
    final String solution = solutionController.text.trim();
    final String level = levelController.text.trim();
    final String price = priceController.text.trim();

    if (title.isEmpty || description.isEmpty || solution.isEmpty || level.isEmpty || price.isEmpty) {
      _showDialog(context, 'Error', 'Por favor, rellena todos los campos obligatorios.');
      return;
    }

    int number = int.parse(id);
    final Map<String, dynamic> requestBody = {
      'id': number,
      'title': title,
      'description': description,
      'solution': solution,
      'difficulty': level,
      'price': price,
      'clues': clues,
    };
    print(requestBody);
    final token = await _getToken();
    if(token == null){
      throw Exception('No se encontró un token válido. Inicia sesión nuevamente.');
    }

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/escaperoom/admin/modify'),
        headers: {'Authorization': token,'Content-Type': 'application/json',},
        body: jsonEncode(requestBody),
      );


      if (response.statusCode == 200) {
        _showDialog(context, 'Éxito', 'Escape Room modificado correctamente.');
      } else {
        _showDialog(context, 'Error', '${response.statusCode}');
      }
    } catch (e) {
      _showDialog(context, 'Error', 'Ocurrió un error al conectar con el servidor.');
    }
  }

  /// Mostrar diálogo para mensajes de error o éxito
  void _showDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  /// Confirmar cancelación
  void confirmCancel(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Cancelar'),
        content: Text('¿Estás seguro de que deseas cancelar los cambios?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('No'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text('Sí'),
          ),
        ],
      ),
    ).then((result) {
      if (result == true) {
        Navigator.pop(context);
      }
    });
  }
}
Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('auth_token');
}

