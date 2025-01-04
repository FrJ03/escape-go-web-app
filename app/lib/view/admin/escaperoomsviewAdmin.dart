import 'package:flutter/material.dart';
import'../../controller/admin/escape_room_controller.dart';
import'../../controller/admin/deleteEscController.dart';
import 'package:escape_go_mobile/domain/escape_rooms/escape_room_list_item.dart';
import '../widgets/widgets.dart';
import 'addParticipationView.dart';
import'modify_escape.dart';
//Vista para listar todos los Escape Rooms por distancia en el participante

void main() {
  runApp(MaterialApp(
    home: EscapeRoomScreen(),
    theme: ThemeData(
      fontFamily: 'Roboto',
    ),
  ));
}

class EscapeRoomScreen extends StatelessWidget {
  final EscapeRoomController _controllerA = EscapeRoomController();
  final DeleteEscapeRoomController _deleteController = DeleteEscapeRoomController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Escape Rooms',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
        ),
        backgroundColor: Color(0xFFA2DAF1),
        centerTitle: true,
      ),
      body: FutureBuilder<List<EscapeRoomListItem>>(
        future: _controllerA.getEscapeRooms(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator()); // Indicador de carga
          } else if (snapshot.hasError) {
            return Center(
              child: Text(
                'Error: ${snapshot.error}',
                style: TextStyle(color: Colors.red),
              ),
            );
          } else if (!snapshot.hasData) {
            return Center(
              child: Text(
                'No se encontraron escape rooms.',
                style: TextStyle(fontSize: 18),
              ),
            );
          }

          final escapeRooms = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(10.0),
            itemCount: escapeRooms.length,
            itemBuilder: (context, index) {
              final escapeRoom = escapeRooms[index];
              return EscapeRoomRow(
              escapeRoom: escapeRoom,
              deleteController: _deleteController,
              );
            },
          );
        },
      ),
    );
  }
}

class EscapeRoomRow extends StatelessWidget {
  final EscapeRoomListItem escapeRoom;
  final DeleteEscapeRoomController deleteController;

  const EscapeRoomRow({
    required this.escapeRoom,
    required this.deleteController,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  escapeRoom.title, // Muestra el título del escape room
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
                SizedBox(height: 5),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: Icon(Icons.edit, color: Colors.blue),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => ModifyEscapeScreen(id: escapeRoom.id.toString())),
                        );
                      },
                    ),
                    IconButton(
                      icon: Icon(Icons.delete, color: Colors.red),
                      onPressed: () {
                        _confirmDelete(context, escapeRoom.id); //FALLO escapeRoom.id siempre manda 1 
                      },

                    ),
                    IconButton(
                      icon: Icon(Icons.add, color: Colors.green),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => AddParticipationScreen(id: escapeRoom.id.toString())),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  void _confirmDelete(BuildContext context, int escapeRoomId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirmar eliminación'),
        content: Text('¿Estás seguro de que deseas eliminar este Escape Room?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              deleteController.deleteEscapeRoom(context, escapeRoomId);
            },
            child: Text(
              'Eliminar',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}