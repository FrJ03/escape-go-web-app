import 'package:flutter/material.dart';
import 'widgets/widgets.dart';
import 'loginview.dart';
import '../controller/profileController.dart';
import '../domain/user/user.dart';
import 'delete_account_view.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'modify_account_view.dart';


void main() {
	runApp(MaterialApp(
		home: ProfileScreen(),
		theme: ThemeData(
			fontFamily: 'Roboto',
		),
	));
}

class ProfileScreen extends StatelessWidget {
	final ProfileController profileController = ProfileController();

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(
				title: Text(
					'Mi perfil',
					style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
				),
				backgroundColor: Color(0xFFA2DAF1),
				centerTitle: true,
			),
			body: FutureBuilder<User>(
				future: profileController.getUserProfile(), // Llamada al controlador
				builder: (context, snapshot) {
					if (snapshot.connectionState == ConnectionState.waiting) {
						// Mostrar un indicador de carga
						return Center(child: CircularProgressIndicator());
					} else if (snapshot.hasError) {
						// Mostrar un mensaje de error
						return Center(
							child: Text(
								'Error: ${snapshot.error}',
								style: TextStyle(
										color: Colors.red, fontWeight: FontWeight.bold),
							),
						);
					} else if (snapshot.hasData) {
						// Mostrar los datos del usuario
						final user = snapshot.data!;
						return buildProfile(context, user);
					} else {
						// Manejar el caso de datos nulos (por si acaso)
						return Center(child: Text('No se encontraron datos.'));
					}
				},
			),
		);
	}

	Widget buildProfile(BuildContext context, User user) {
		return Container(
			width: double.infinity,
			padding: const EdgeInsets.all(10.0),
			child: Column(
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Center(child: Image.asset('lib/view/assets/perfil.png', height: 150)),
					SizedBox(height: 30),
					buildProfileDetail('Nombre de usuario:', user.username),
					SizedBox(height: 30),
					buildProfileDetail('Email:', user.email),
					SizedBox(height: 30),
					buildProfileDetail('Role:', user.role),
					SizedBox(height: 30),
					buildProfileDetail('Puntos:', user.points.toString()),
					SizedBox(height: 100),
					Center(
						child: Column(
							children: [
								CustomButton(
									key: Key('modify_profile_button'),
									value: 'Modificar perfil',
									color: Color(0xFFA2DAF1),
									onPressed: () {
										Navigator.pushReplacement(
											context,
											MaterialPageRoute(
													builder: (context) => ModifyAccountScreen()),
										);
									},
								),
								SizedBox(height: 16),
								CustomButton(
									key: Key('delete_account_button'),
									value: 'Eliminar cuenta',
									color: Color(0xFFFFA1A1),
									onPressed: () {
										Navigator.pushReplacement(
											context,
											MaterialPageRoute(
													builder: (context) => DeleteAccountScreen()),
										);
									},
								),
								SizedBox(height: 16),
								CustomButton(
									key: Key('logout_button'),
									value: 'Cerrar sesión',
									color: Color(0xFFFFA1A1),
									onPressed: () {
										showLogoutDialog(context); // Ahora tiene acceso al contexto
									},
								),
							],
						),
					),
				],
			),
		);
	}


	Widget buildProfileDetail(String title, String value) {
		return Column(
			crossAxisAlignment: CrossAxisAlignment.start,
			mainAxisSize: MainAxisSize.min,
			children: [
				Center(child:
				Text(
					title,
					style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
				),),
				SizedBox(height: 5),
				Center(child: Text(
					value,
					style: TextStyle(fontSize: 16),
				),)
			],
		);
	}


	void showLogoutDialog(BuildContext context) {
		showDialog(
			context: context,
			builder: (context) =>
					AlertDialog(
						title: Text(
							'¿Quieres cerrar sesión?',
							textAlign: TextAlign.center,
							style: TextStyle(
									color: Color(0xFFFFA1A1), fontWeight: FontWeight.bold),
						),
						content: Text(
								'Si pulsas cerrar sesión tendrás que volver a iniciar sesión.'),
						actions: [
							TextButton(
								onPressed: () async {
									// Limpiar el token almacenado
									final SharedPreferences prefs = await SharedPreferences
											.getInstance();
									await prefs.remove(
											'token'); // Elimina el token de las preferencias

									// Navegar a la pantalla de inicio de sesión
									FocusScope.of(context).unfocus();
									Navigator.pushAndRemoveUntil(
										context,
										MaterialPageRoute(builder: (context) => LoginScreen()),
												(route) => false,
									);
								},
								child: Text('Cerrar sesión',
										style: TextStyle(fontWeight: FontWeight.bold)),
							),
							TextButton(
								onPressed: () {
									FocusScope.of(context).unfocus();
									Navigator.pop(context);
								},
								child: Text(
										'Cancelar', style: TextStyle(fontWeight: FontWeight.bold)),
							),
						],
					),
		);
	}
}
