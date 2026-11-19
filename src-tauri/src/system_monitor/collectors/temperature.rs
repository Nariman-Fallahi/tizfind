use sysinfo::Components;

use crate::system_monitor::models::temperature::TemperatureStats;

pub fn collect(components: &Components) -> TemperatureStats {
    let cores: Vec<f32> = components
        .iter()
        .filter(|component| {
            let label = component.label().to_ascii_lowercase();

            label.contains("cpu") || label.contains("core") || label.contains("package")
        })
        .filter_map(|component| component.temperature())
        .filter(|temperature| temperature.is_finite())
        .collect();

    let temperature = cores.iter().copied().reduce(f32::max);

    TemperatureStats { temperature, cores }
}
