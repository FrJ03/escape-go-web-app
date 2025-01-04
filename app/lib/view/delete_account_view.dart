import 'package:flutter/material.dart';
import 'widgets/widgets.dart';
import 'registerview.dart';
import '../controller/profileController.dart';
import 'loginview.dart';
void main() {
  runApp(MaterialApp(
    home: DeleteAccountScreen(),
    theme: ThemeData(
      fontFamily: 'Roboto',
    ),
  ));
}

class DeleteAccountScreen extends StatelessWidget {
  final ProfileController controller=ProfileController();


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Eliminar cuenta',style: TextStyle(fontWeight: FontWeight.bold,fontSize: 30),),
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
            Center(
              child:
              Text('Nota: para eliminar esta cuenta primero debes introducir el email y la contraseña como medida de seguridad',key:Key('Tittle'),style: TextStyle(fontSize: 15,fontWeight: FontWeight.bold),),
            ),
            SizedBox(height: 30),
            Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start, // Alinea el texto y el campo de entrada a la izquierda dentro del ancho definido
                mainAxisSize: MainAxisSize.min, // Ajusta la altura de la columna a sus contenidos
                children: [
                  Text('Email:',style:  TextStyle(fontWeight: FontWeight.bold,fontSize: 17)),
                  SizedBox(height: 8),
                  SizedBox(
                    width: 300.0, // Cambia este valor para ajustar el ancho
                    child: TextField(
                      controller: controller.nameController,
                      decoration: InputDecoration(
                        hintText: 'Introduzca el email',
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
                  Text('Contraseña:',style:  TextStyle(fontWeight: FontWeight.bold,fontSize: 17),),
                  SizedBox(height: 8),
                  SizedBox(
                    width: 300.0, // Cambia este valor para ajustar el ancho
                    child: TextField(
                      controller: controller.passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        hintText: 'Introduzca la contraseña',
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15.0)),

                      ),
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 200),
            Center(
              child:
              CustomButton(
                key: Key('delete_profile_button'),
                value: 'Eliminar cuenta',
                color: Color(0xFFA2DAF1),
                onPressed: () async {
                  bool result = await controller.deleteProfile(context);
                  if (result) {
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => LoginScreen()),
                          (route) => false,
                    );
                  }
                },

              ),
            ),
          ],
        ),
      ),
    );
  }
}
