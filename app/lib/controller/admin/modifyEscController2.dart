import 'package:flutter/material.dart';


class EscapeRoomController {
  final TextEditingController storyController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  List<Map<String, dynamic>> fragments = [];

  void addFragment(Function showError) {
    if (storyController.text.isNotEmpty && nameController.text.isNotEmpty ) {
      fragments.add({
        'info': storyController.text,
        'title': nameController.text,

      });
      storyController.clear();
      nameController.clear();
    }
  }
}
