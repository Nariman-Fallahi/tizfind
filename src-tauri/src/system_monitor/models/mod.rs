pub mod cpu;
pub mod disk;
pub mod memory;
pub mod network;
pub mod swap;
pub mod system;
pub mod temperature;

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct SystemOverview {
    pub cpu: cpu::CpuStats,
    pub memory: memory::MemoryStats,
    pub swap: swap::SwapStats,
    pub disk: disk::DiskStats,
    pub system: system::SystemStats,
    pub network: network::NetworkStats,
    pub temperature: temperature::TemperatureStats,
}
