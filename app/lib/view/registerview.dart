import 'package:escape_go_mobile/view/loginview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'widgets/widgets.dart';
import 'package:escape_go_mobile/controller/registerController.dart';

void main() async {

  await dotenv.load(); //cargamos las variables de entorno de .env

  runApp(MaterialApp(
    home: RegisterScreen(),
    theme: ThemeData(
      fontFamily: 'Roboto',
    ),
  ));
}

class RegisterScreen extends StatelessWidget {
  final RegisterController controller = RegisterController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Escape Go',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
        ),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(10.0),
          color: const Color(0xFFE7E0EC),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 30),
              Center(child: Image.asset('lib/view/assets/logo.png', height: 150)),
              Center(
                child: Text(
                  'Registrarse',
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                ),
              ),
              SizedBox(height: 30),
              Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Usuario:',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                    ),
                    SizedBox(height: 8),
                    SizedBox(
                      width: 300.0,
                      child: TextField(
                        controller: controller.nameController,
                        decoration: InputDecoration(
                          hintText: 'Introduzca el nombre de usuario',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Email:',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                    ),
                    SizedBox(height: 8),
                    SizedBox(
                      width: 300.0,
                      child: TextField(
                        controller: controller.emailController,
                        decoration: InputDecoration(
                          hintText: 'Introduzca el correo electrónico',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Contraseña:',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
                    ),
                    SizedBox(height: 8),
                    SizedBox(
                      width: 300.0,
                      child: TextField(
                        controller: controller.passwordController,
                        obscureText: true,
                        decoration: InputDecoration(
                          hintText: 'Introduzca la contraseña',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 75),
              Center(
                child: CustomButton(
                  key: Key('register_button'),
                  value: 'Registrarse',
                  color: Color(0xFFA2DAF1),
                  onPressed: () async {
                    await controller.register(context);
                    controller.nameController.text = '';
                    controller.passwordController.text = '';
                    controller.emailController.text = '';
                  },
                ),
              ),
              Center(
                child: Column(
                  children: [
                    Text(
                      '¿Tienes cuenta?',
                      style: TextStyle(fontSize: 17),
                    ),
                    InkWell(
                      child: Text(
                        'Iniciar sesión',
                        style: TextStyle(
                            fontSize: 17, fontWeight: FontWeight.bold, decoration: TextDecoration.underline),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => LoginScreen()),
                        );
                      },
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
