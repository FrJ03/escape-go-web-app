import 'package:flutter/material.dart';
import '../widgets/widgets.dart';
import '../../controller/admin/createEscController.dart';

void main() {
  runApp(MaterialApp(
    home: CreateEscapeScreen(),
    theme: ThemeData(
      fontFamily: 'Roboto',
    ),
  ));
}

class CreateEscapeScreen extends StatelessWidget {
  final CreateEscController controller = CreateEscController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Nuevo Escape Room',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
        ),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: Scrollbar(
        thumbVisibility: true, // Para que la barra sea visible siempre
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height,
            ),
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Column(
                      children: [
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Título del Escape Room:',
                          controller: controller.tittleController,
                          hintText: 'Introduzca el título',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Descripción:',
                          controller: controller.descriptionController,
                          hintText: 'Introduzca una descripción',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Nivel de dificultad:',
                          controller: controller.levelController,
                          hintText: 'Introduzca el nivel de dificultad',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Solución:',
                          controller: controller.solutionController,
                          hintText: 'Introduzca la solución',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Precio:',
                          controller: controller.priceController,
                          hintText: 'Introduzca el precio',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Duración máxima:',
                          controller: controller.maxDurationController,
                          hintText: 'Introduzca la duración maxima',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'País:',
                          controller: controller.locationCountryController,
                          hintText: 'Introduzca el país',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Ciudad:',
                          controller: controller.locationCityController,
                          hintText: 'Introduzca la ciudad',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Calle:',
                          controller: controller.locationStreetController,
                          hintText: 'Introduzca la calle',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Número:',
                          controller: controller.locationStreetNumberController,
                          hintText: 'Introduzca el número',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Coordenadas:',
                          controller: controller.locationCoordinatesController,
                          hintText: 'Introduzca las coordenadas',
                        ),
                        SizedBox(height: 16),
                        _buildTextField(
                          label: 'Información adicional:',
                          controller: controller.locationInfoController,
                          hintText: 'Introduzca información adicional',
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 30),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      CustomButton(
                        key: Key('create_esc_button'),
                        value: 'CREAR',
                        color: Color(0xFFA2DAF1),
                        onPressed: () => controller.recoger(context),
                      ),
                      CustomButton(
                        key: Key('cancel_esc_button'),
                        value: 'CANCELAR',
                        color: Color(0xFFFFA1A1),
                        onPressed: () => print('Cancelar creación'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hintText,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hintText,
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }
}


