import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // Para cargar variables de entorno
import 'view/loginview.dart'; // Importa tu LoginView

void main() async {
  // Cargar variables de entorno desde el archivo .env
  await dotenv.load();

  // Inicializar la aplicación
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Oculta la marca de depuración
      title: 'Escape Go',
      theme: ThemeData(
        fontFamily: 'Roboto', // Configura la fuente global
        primarySwatch: Colors.blue, // Tema general de la aplicación
      ),
      home: LoginScreen(), // Pantalla de inicio (LoginView)
    );
  }
}
