use std::process::Command;

pub fn launch(exec: String) -> Result<(), String> {
    let cleaned: Vec<String> = exec
        .split_whitespace()
        .filter(|part| !(part.starts_with('%') && part.len() == 2))
        .map(|part| part.trim_matches('"').to_string())
        .collect();

    let (cmd, args) = cleaned.split_first().ok_or("Empty exec")?;

    Command::new(cmd)
        .args(args)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}
