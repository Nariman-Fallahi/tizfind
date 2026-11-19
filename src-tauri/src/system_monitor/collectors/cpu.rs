use sysinfo::System;

use crate::system_monitor::models::cpu::CpuStats;

pub fn collect(system: &System) -> CpuStats {
    let cpus = system.cpus();

    let name = cpus
        .first()
        .map(|cpu| cpu.brand().to_string())
        .unwrap_or_else(|| "Unknown CPU".to_string());

    CpuStats {
        name,
        usage: system.global_cpu_usage(),
        logical_cores: cpus.len(),
    }
}
