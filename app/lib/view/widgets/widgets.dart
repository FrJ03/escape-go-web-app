import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class CustomButton extends StatelessWidget {
  final String value;
  final Color color;
  final VoidCallback onPressed;

  const CustomButton({
    Key? key,
    required this.value,
    required this.color,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color, // Color de fondo del botón
          foregroundColor: Colors.black, // Color del texto
          padding: const EdgeInsets.all(12),
        ),
        child: Text(
          value,
          style: const TextStyle(fontSize: 17),
        ),
      ),
    );
  }
}



class PanelButton extends StatelessWidget {
  final String value;
  final Color color;
  final VoidCallback onPressed;

  const PanelButton({
    Key? key,
    required this.value,
    required this.color,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color, // Color de fondo del botón
          foregroundColor: Colors.black, // Color del texto
          padding: const EdgeInsets.all(12),
          fixedSize: const Size(250, 75)
        ),
        child: Text(
          value,
          style: const TextStyle(fontSize: 17),
        ),
      ),
    );
  }
}


class ImagePickerWidget extends StatefulWidget {
  @override
  _ImagePickerWidgetState createState() => _ImagePickerWidgetState();
}

class _ImagePickerWidgetState extends State<ImagePickerWidget> {
  File? _image;

  final ImagePicker _picker = ImagePicker();

  Future<void> _pickImage() async {
    final XFile? pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: _pickImage,
          child: Container(
            width: 150,
            height: 150,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(10),
            ),
            child: _image != null
                ? ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.file(
                _image!,
                fit: BoxFit.cover,
              ),
            )
                : Center(
              child: Icon(Icons.add_a_photo, color: Colors.grey, size: 50),
            ),
          ),
        ),
        SizedBox(height: 10),
        ElevatedButton(
          onPressed: () {
            if (_image != null) {
              print("Imagen seleccionada: ${_image!.path}");
            } else {
              print("No se ha seleccionado ninguna imagen");
            }
          },
          child: Text("Subir Imagen"),
        ),
      ],
    );
  }
}
