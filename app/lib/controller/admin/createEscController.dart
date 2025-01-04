import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../view/admin/panel_admin.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';


class CreateEscController {
  final String baseUrl = dotenv.env['BASEURL'] ?? 'NO BASEURL FOUND';
  final TextEditingController tittleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController levelController = TextEditingController();
  final TextEditingController solutionController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController maxDurationController = TextEditingController();

  // Nuevos campos para la ubicación
  final TextEditingController locationCountryController = TextEditingController();
  final TextEditingController locationCityController = TextEditingController();
  final TextEditingController locationStreetController = TextEditingController();
  final TextEditingController locationStreetNumberController = TextEditingController();
  final TextEditingController locationCoordinatesController = TextEditingController();
  final TextEditingController locationInfoController = TextEditingController();

  Future<void> recoger(BuildContext context) async {
    String tittle = tittleController.text;
    String description = descriptionController.text;
    String level = levelController.text;
    String solution = solutionController.text;
    String price = priceController.text;
    String duration = maxDurationController.text;
    // Nuevos campos
    String country = locationCountryController.text;
    String city = locationCityController.text;
    String street = locationStreetController.text;
    String streetNumber = locationStreetNumberController.text;
    String coordinates = locationCoordinatesController.text;
    String additionalInfo = locationInfoController.text;

    // Validar los campos
    if (tittle.isEmpty || description.isEmpty || level.isEmpty ||
        solution.isEmpty || price.isEmpty || country.isEmpty || city.isEmpty ||
        street.isEmpty || streetNumber.isEmpty || coordinates.isEmpty ||
        duration.isEmpty) {
      _showDialog(context, 'Error',
          'Por favor, completa todos los campos obligatorios.');
      return;
    }
    // Conversión de tipos
    int? difficulty = int.tryParse(level);
    double? parsedPrice = double.tryParse(price);
    int? maxSessionDuration = int.tryParse(duration);

    if (difficulty == null || parsedPrice == null || maxSessionDuration == null) {
      _showDialog(context, 'Error',
          'Asegúrate de que los campos "Dificultad", "Precio" y "Duración" sean numéricos.');
      return;
    }

    // Construir el objeto a enviar
    final escapeRoomData = {
      'title': tittle,
      'description': description,
      'solution': solution,
      'difficulty': difficulty,
      'price': parsedPrice,
      'maxSessionDuration': maxSessionDuration,
      'location': {
        'country': country,
        'city': city,
        'street': street,
        'street_number': streetNumber,
        'coordinates': coordinates,
        'info': additionalInfo,
      },
      'clues':''
    };


    // Enviar datos al servidor
    await _createEscapeRoom(context, escapeRoomData);

    // Limpiar campos después de enviar los datos
    tittleController.clear();
    descriptionController.clear();
    solutionController.clear();
    levelController.clear();
    priceController.clear();
    maxDurationController.clear();
    locationCountryController.clear();
    locationCityController.clear();
    locationStreetController.clear();
    locationStreetNumberController.clear();
    locationCoordinatesController.clear();
    locationInfoController.clear();
  }

  Future<void> _createEscapeRoom(BuildContext context,
      Map<String, dynamic> data) async {
    try {
      final token = await _getToken(); // Recupera el token almacenado
      if (token == null) {
        throw Exception(
            'No se encontró un token válido. Inicia sesión nuevamente.');
      }

      final url = Uri.parse('$baseUrl/escaperoom/admin/create'); // Ruta completa
      final headers = {
        'Authorization': token, // Token para autenticación
        'Content-Type': 'application/json', // Especifica que el cuerpo es JSON
      };

      // Serializa el mapa a JSON
      final body = json.encode(data);

      final response = await http.post(
          url, headers: headers, body: body); // Realiza el request

      if (response.statusCode == 200) {
        _showSuccessDialog(context, 'Éxito', 'Escape Room creado con éxito.');
      } else {
        _showDialog(context, 'Error',
            'Error al crear el Escape Room: ${response.body}');
      }
    } catch (e) {
      _showDialog(
          context, 'Error de conexión', 'Hubo un problema con la conexión: $e');
    }
  }
}

  void confirmCancel(BuildContext context) {
    _showDialog(
      context,
      'Cancelar',
      '¿Estás seguro de que quieres cancelar el proceso?',
      onConfirm: () {
        Navigator.pop(context); // Cierra la pantalla
      },
    );
  }

  void _showDialog(
      BuildContext context,
      String tittle,
      String message, {
        VoidCallback? onConfirm, // Callback opcional
      }) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          tittle,
          style: TextStyle(color: Color(0xFFFFA1A1), fontWeight: FontWeight.bold),
        ),
        content: Text(message),
        actions: [
          if (onConfirm != null) // Muestra este botón solo si hay callback
            TextButton(
              onPressed: () {
                FocusScope.of(context).unfocus();
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => PanelScreen()),
                      (route) => false,
                );
              },
              child: Text('SÍ', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          TextButton(
            onPressed: () => Navigator.pop(context), // Solo cierra el diálogo
            child: Text('NO', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(BuildContext context, String tittle, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          tittle,
          style: TextStyle(color: Color(0xFFA2F1A5), fontWeight: FontWeight.bold),
        ),
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
Future<String?> _getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('auth_token');
}