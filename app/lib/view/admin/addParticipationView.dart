import 'package:escape_go_mobile/view/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../controller/admin/addParticipationController.dart'; // Asegúrate de importar tu controlador

class AddParticipationScreen extends StatefulWidget {
  final String id;

  AddParticipationScreen({Key? key, required this.id}) : super(key: key);

  @override
  _AddParticipationScreenState createState() => _AddParticipationScreenState();
}

class _AddParticipationScreenState extends State<AddParticipationScreen> {
  final TextEditingController _startDateController = TextEditingController();
  final TextEditingController _endDateController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;

  final AddParticipationController _controller = AddParticipationController(); // Instanciamos el controlador

  void _selectDate(BuildContext context, bool isStart) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (pickedDate != null) {
      final TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
      );

      if (pickedTime != null) {
        final DateTime fullDateTime = DateTime(
          pickedDate.year,
          pickedDate.month,
          pickedDate.day,
          pickedTime.hour,
          pickedTime.minute,
        );

        setState(() {
          if (isStart) {
            _startDate = fullDateTime;
            _startDateController.text = DateFormat('yyyy-MM-dd HH:mm').format(fullDateTime);
          } else {
            _endDate = fullDateTime;
            _endDateController.text = DateFormat('yyyy-MM-dd HH:mm').format(fullDateTime);
          }
        });
      }
    }
  }


  void _createParticipation() async {
    if (_startDate == null || _endDate == null) {
      _showDialog('Error', 'Por favor selecciona ambas fechas.');
      return;
    }

    // Llamamos al controlador para crear la participación
    final response = await _controller.createParticipation(widget.id, _startDate!, _endDate!);

    if (response) {
      _showDialog('Éxito', 'La participación fue creada correctamente.');
    } else {
      _showDialog('Error', 'No se pudo crear la participación.');
    }
  }

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
    return Scaffold(
      appBar: AppBar(
        title: Text('Añadir Participación',style: TextStyle(fontWeight: FontWeight.bold,fontSize: 30),),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Fecha de Inicio'),
            TextField(
              controller: _startDateController,
              readOnly: true,
              decoration: InputDecoration(
                hintText: 'Selecciona la fecha de inicio',
              ),
              onTap: () => _selectDate(context, true),
            ),
            SizedBox(height: 16),
            Text('Fecha de Fin'),
            TextField(
              controller: _endDateController,
              readOnly: true,
              decoration: InputDecoration(
                hintText: 'Selecciona la fecha de fin',
              ),
              onTap: () => _selectDate(context, false),
            ),
            SizedBox(height: 16),
            Center(child:
            CustomButton(
              key: Key('create_part_button'),
              color: Color(0xFFA2DAF1),
              onPressed: _createParticipation,
              value: 'Crear Participación',
            ),)

          ],
        ),
      ),
    );
  }
}
