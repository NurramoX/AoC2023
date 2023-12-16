use std::collections::{HashMap, HashSet};
use std::process::Command;
use std::str::FromStr;

struct GameData {
    id: u32,
    red: i32,
    green: i32,
    blue: i32
}

fn main() {
    const RED: i32 = 12;
    const GREEN: i32 = 13;
    const BLUE: i32 = 14;
    let file_path = "../payload.txt";
    let awk_script = "{\
        $1=$2=\"\";
        sub(/^  */, \"\");
        n = split($0, arr, \"; \");
        for (i = 1; i <= n; i++) {
            if (arr[i] != \"\") {
                print \"game \" NR \", \" arr[i];
            }
        }
    }";
    let output = Command::new("awk")
        .arg(awk_script)
        .arg(file_path)
        .output()
        .expect("Failed to execute command");

    let output_string = String::from_utf8_lossy(&output.stdout);
    let mut games = parse_game_data(&output_string);

    // Subproblem 1
    let mut game_ids: HashSet<u32> = games.iter().map(|game| game.id).collect();
    for game in &mut games {
        if ((game.red - RED) > 0 || (game.blue - BLUE) > 0 || (game.green - GREEN) > 0) {
            game_ids.remove(&game.id);
        };
    }

    let total_sum: u32 = game_ids.iter().sum();

    println!("Total of Subproblem 1: {}", total_sum);
    // Subproblem 2
    let mut grouped_games: HashMap<u32, GameData> = HashMap::new();

    for game in games {
        grouped_games.entry(game.id).and_modify(|e| {
            e.red = e.red.max(game.red);
            e.green = e.green.max(game.green);
            e.blue = e.blue.max(game.blue);
        }).or_insert(game);
    }

    // Now grouped_games contains the maximum values for each color per id
    let mut sum = 0;
    for (id, game) in grouped_games {
        sum += game.red * game.green * game.blue;
        println!("ID: {}, Red: {}, Green: {}, Blue: {}", id, game.red, game.green, game.blue);
    }
    println!("Total of Subproblem 2: {}", sum);
}

fn parse_game_data(data: &str) -> Vec<GameData> {
    let mut games: Vec<GameData> = Vec::new();
    for line in data.lines() {
        let parts: Vec<&str> = line.split(|c| c == ',' || c == ' ').collect();
        let mut game_data = GameData { id: 0, red: 0, green: 0, blue: 0 };

        for i in 0..parts.len() {
            match parts[i] {
                "game" => game_data.id = u32::from_str(parts[i + 1]).unwrap_or(0),
                "red" => game_data.red = i32::from_str(parts[i - 1]).unwrap_or(0),
                "green" => game_data.green = i32::from_str(parts[i - 1]).unwrap_or(0),
                "blue" => game_data.blue = i32::from_str(parts[i - 1]).unwrap_or(0),
                _ => (),
            }
        }
        games.push(game_data);
    }
    games
}
