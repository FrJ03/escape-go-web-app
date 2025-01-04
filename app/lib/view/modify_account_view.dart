import 'package:flutter/material.dart';
import 'widgets/widgets.dart';
import '../controller/profileController.dart';
import 'profileview.dart';
void main() {
  runApp(MaterialApp(
    home: ModifyAccountScreen(),
    theme: ThemeData(
      fontFamily: 'Roboto',
    ),
  ));
}

class ModifyAccountScreen extends StatelessWidget {
  final ProfileController controller=ProfileController();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Modificar cuenta',style: TextStyle(fontWeight: FontWeight.bold,fontSize: 30),),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(10.0),
        color: const Color(0xFFE7E0EC),
        child:

        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 30),
            Center(child:Image.asset('lib/view/assets/logo.png',height: 150)),
            SizedBox(height: 30),
            Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, // Alinea el texto y el campo de entrada a la izquierda dentro del ancho definido
                mainAxisSize: MainAxisSize.min, // Ajusta la altura de la columna a sus contenidos
                children: [
                  Text('Nombre de usuario:',style:  TextStyle(fontWeight: FontWeight.bold,fontSize: 17)),
                  SizedBox(height: 8),
                  SizedBox(
                    width: 300.0, // Cambia este valor para ajustar el ancho
                    child: TextField(
                      controller: controller.nameController,
                      decoration: InputDecoration(
                        hintText: 'Introduzca el nombre de usuario si lo deseas modificar',
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
                crossAxisAlignment: CrossAxisAlignment.start, // Alinea el texto y el campo de entrada a la izquierda dentro del ancho definido
                mainAxisSize: MainAxisSize.min, // Ajusta la altura de la columna a sus contenidos
                children: [
                  Text('email:',style:  TextStyle(fontWeight: FontWeight.bold,fontSize: 17),),
                  SizedBox(height: 8),
                  SizedBox(
                    width: 300.0, // Cambia este valor para ajustar el ancho
                    child: TextField(
                      controller: controller.emailController,
                      decoration: InputDecoration(
                        hintText: 'Introduzca el nuevo email',
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15.0)),

                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, // Alinea el texto y el campo de entrada a la izquierda dentro del ancho definido
                mainAxisSize: MainAxisSize.min, // Ajusta la altura de la columna a sus contenidos
                children: [
                  Text('Contraseña:',style:  TextStyle(fontWeight: FontWeight.bold,fontSize: 17),),
                  SizedBox(height: 8),
                  SizedBox(
                    width: 300.0, // Cambia este valor para ajustar el ancho
                    child: TextField(
                      controller: controller.passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: 'Introduzca la nueva contraseña',
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15.0)),

                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),


            SizedBox(height: 100),
            Center(
              child:
              CustomButton(
                key: Key('modify_account_button'),
                value: 'Modificar cuenta',
                color: Color(0xFFA2DAF1),
                onPressed: () async {
                  bool result = await controller.modifyProfile(context);
                  if (result) {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => ProfileScreen()),
                          (route) => false,
                    );
                  }
                },

              ),
            ),
            Center(
              child:
              CustomButton(
                key: Key('cancelar_button'),
                value: 'Cancelar',
                color: Color(0xFFFFA1A1),
                onPressed: () async {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => ProfileScreen()),
                          (route) => false,
                    );
                  }

              ),
            ),
          ],
        ),
      ),
    );
  }
}

