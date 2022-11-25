#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;

#[tauri::command]
fn read_cfg () -> String {
  fs::read_to_string("cfg.json")
      .expect("failed to read the config file.")
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_cfg])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
