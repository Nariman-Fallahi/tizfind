use std::time::Instant;
use tauri::State;

use crate::system_monitor::{models::SystemOverview, state::SystemMonitorState};

#[tauri::command]
pub fn get_system_overview(state: State<'_, SystemMonitorState>) -> Result<SystemOverview, String> {
    let mut monitor = state
        .inner
        .lock()
        .map_err(|_| "System monitor lock failed".to_string())?;

    // Refresh CPU and memory
    monitor.system.refresh_cpu_usage();
    monitor.system.refresh_memory();

    // Read current swap counters from Linux kernel
    let (current_swap_in, current_swap_out) = super::collectors::swap::read_swap_counters()?;

    // Calculate elapsed time since previous swap refresh
    let elapsed = monitor.last_swap_refresh.elapsed().as_secs_f64();

    let (swap_in, swap_out) = if monitor.swap_initialized && elapsed > 0.0 {
        let page_size = super::collectors::swap::page_size() as f64;

        let swap_in =
            current_swap_in.saturating_sub(monitor.last_swap_in) as f64 * page_size / elapsed;

        let swap_out =
            current_swap_out.saturating_sub(monitor.last_swap_out) as f64 * page_size / elapsed;

        (swap_in as u64, swap_out as u64)
    } else {
        (0, 0)
    };

    monitor.last_swap_in = current_swap_in;
    monitor.last_swap_out = current_swap_out;
    monitor.last_swap_refresh = Instant::now();
    monitor.swap_initialized = true;

    // Refresh disks
    monitor.disks.refresh(false);

    // Calculate elapsed time since previous network refresh
    let elapsed_seconds = monitor.last_network_refresh.elapsed().as_secs_f64();

    // Refresh network interfaces
    monitor.networks.refresh(true);

    // Update last refresh time
    monitor.last_network_refresh = Instant::now();

    // Refresh hardware sensor readings, such as CPU temperature
    monitor.components.refresh(true);

    // Collect statistics
    let cpu = super::collectors::cpu::collect(&monitor.system);
    let memory = super::collectors::memory::collect(&monitor.system);
    let swap = super::collectors::swap::collect(&monitor.system, swap_in, swap_out);
    let disk = super::collectors::disk::collect(&monitor.disks);
    let system = super::collectors::system::collect();
    let network = super::collectors::network::collect(&monitor.networks, elapsed_seconds);
    let temperature = super::collectors::temperature::collect(&monitor.components);

    Ok(SystemOverview {
        cpu,
        memory,
        swap,
        disk,
        system,
        network,
        temperature,
    })
}
