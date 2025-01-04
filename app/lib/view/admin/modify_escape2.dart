import 'package:flutter/material.dart';
import '../widgets/widgets.dart';
import '../../controller/admin/modifyEscController.dart';

class ModifyEscapeRoomScreen extends StatefulWidget {


  ModifyEscapeRoomScreen({Key? key, required this.controller, required this.id}) : super(key: key);
  final ModifyEscapeController controller;
  final String id;
  @override
  _ModifyEscapeRoomScreenState createState() => _ModifyEscapeRoomScreenState();
}

class _ModifyEscapeRoomScreenState extends State<ModifyEscapeRoomScreen> {
  void _showDialog(String title, String message) {
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

  @override
  Widget build(BuildContext context) {
    final controller = widget.controller;
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Modificar Escape Room',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
        ),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Nombre de la pista:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              TextField(
                controller: controller.nameController,
                maxLines: 1,
                decoration: InputDecoration(
                  hintText: 'Escribe el nombre de la pista...',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Historia:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              TextField(
                controller: controller.storyController,
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: 'Escribe la historia del fragmento...',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              Center(
                child: CustomButton(
                  value: 'GUARDAR PISTA',
                  color: Color(0xFFA2F1A5),
                  onPressed: () {
                    if (controller.storyController.text.trim().isEmpty) {
                      _showDialog('Error', 'El campo de historia está vacío.');
                    } else {
                      controller.clues.add({
                        'name': controller.nameController.text.trim(),
                        'info': controller.storyController.text.trim(),
                      });
                      controller.nameController.clear();
                      controller.storyController.clear();
                      setState(() {});
                    }
                  },
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Pistas creadas:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              ...controller.clues.map((clue) {
                return Card(
                  child: ListTile(
                    title: Text(clue['name'] ?? 'Nombre no disponible'),
                    subtitle: Text(clue['info'] ?? 'Información no disponible'),
                  ),
                );
              }).toList(),
              SizedBox(height: 32),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  CustomButton(
                    value: 'CANCELAR',
                    color: Color(0xFFFFA1A1),
                    onPressed: () => Navigator.pop(context),
                  ),
                  CustomButton(
                    value: 'CREAR',
                    color: Color(0xFFA2F1A5),
                    onPressed: () async {
                      await controller.recoger(context, widget.id);


                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
