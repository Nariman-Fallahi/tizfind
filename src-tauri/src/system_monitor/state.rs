use std::sync::Mutex;
use std::time::Instant;
use sysinfo::{Components, Disks, Networks, System};

pub struct SystemMonitorState {
    pub inner: Mutex<SystemMonitor>,
}

pub struct SystemMonitor {
    pub system: System,
    pub disks: Disks,
    pub networks: Networks,
    pub last_network_refresh: Instant,
    pub components: Components,
    pub last_swap_in: u64,
    pub last_swap_out: u64,
    pub last_swap_refresh: Instant,
    pub swap_initialized: bool,
}

impl SystemMonitorState {
    pub fn new() -> Result<Self, String> {
        let system =
            System::new_all().map_err(|err| format!("Failed to initialize system: {err}"))?;

        let disks = Disks::new_with_refreshed_list()
            .map_err(|err| format!("Failed to initialize disks: {err}"))?;

        let networks = Networks::new_with_refreshed_list()
            .map_err(|err| format!("Failed to initialize networks: {err}"))?;

        let components = Components::new_with_refreshed_list()
            .map_err(|err| format!("Failed to initialize components: {err}"))?;

        Ok(Self {
            inner: Mutex::new(SystemMonitor {
                system,
                disks,
                networks,
                last_network_refresh: Instant::now(),
                components,
                last_swap_in: 0,
                last_swap_out: 0,
                last_swap_refresh: Instant::now(),
                swap_initialized: false,
            }),
        })
    }
}
