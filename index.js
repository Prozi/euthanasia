/**
 * @typedef {Object} ResourceUsage
 * @property {number | undefined} memory - Current memory usage in MB (if memory limit was exceeded)
 * @property {number | undefined} cpu - Current CPU usage percentage (if CPU limit was exceeded)
 */

/**
 * @typedef {Object} EuthanasiaOptions
 * @property {number} [memory] - Memory usage limit in MB
 * @property {number} [cpu] - CPU usage limit as a percentage (0–100 per core)
 * @property {number} [interval] - Interval between checks, in milliseconds
 * @property {(usage: ResourceUsage) => Promise<boolean>} [ready] - Called when memory or CPU usage exceeds limits
 */

const TO_MEGABYTE = 1 / 1024 / 1024;
const DEFAULT_MEMORY = 0;
const DEFAULT_INTERVAL = 60_000;

const DEFAULT_READY = async ({ memory, cpu }) => {
  if (memory) {
    console.info(`[OOM] Memory usage exceeded: ${memory} MB`);
  }
  if (cpu) {
    console.info(`[CPU] CPU usage exceeded: ${cpu.toFixed(2)}%`);
  }
  return true;
};

/**
 * Returns current heap memory usage in MB.
 * @returns {number}
 */
function getHeapMemoryUsageMb() {
  return Math.round(process.memoryUsage().heapUsed * TO_MEGABYTE);
}

/**
 * Calculates average CPU usage percentage over a time interval.
 * @param {{user: number, system: number}} startUsage - CPU usage at start of interval
 * @param {{user: number, system: number}} endUsage - CPU usage at end of interval
 * @param {number} intervalMs - Interval length in milliseconds
 * @returns {number} CPU usage as a percentage of a single core
 */
function calculateCpuUsagePercent(startUsage, endUsage, intervalMs) {
  const userDiff = endUsage.user - startUsage.user; // microseconds
  const systemDiff = endUsage.system - startUsage.system; // microseconds
  const totalDiffMicros = userDiff + systemDiff;
  const intervalMicros = intervalMs * 1000;

  return (totalDiffMicros / intervalMicros) * 100;
}

/**
 * Monitors memory and CPU usage and terminates the process if limits are exceeded.
 * @param {EuthanasiaOptions} options - Monitoring configuration
 */
function euthanasia({
  memory = DEFAULT_MEMORY,
  cpu = 0,
  interval = DEFAULT_INTERVAL,
  ready = DEFAULT_READY
} = {}) {
  let lastCpuUsage = process.cpuUsage();

  const check = async () => {
    const currentMemoryMb = getHeapMemoryUsageMb();
    const currentCpuPercent =
      cpu > 0
        ? calculateCpuUsagePercent(lastCpuUsage, process.cpuUsage(), interval)
        : 0;

    lastCpuUsage = process.cpuUsage();

    const memoryExceeded = memory > 0 && currentMemoryMb > memory;
    const cpuExceeded = cpu > 0 && currentCpuPercent > cpu;

    /** @type {ResourceUsage} */
    const usage = {};
    if (memoryExceeded) usage.memory = currentMemoryMb;
    if (cpuExceeded) usage.cpu = currentCpuPercent;

    if ((memoryExceeded || cpuExceeded) && (await ready(usage))) {
      process.exit(0);
    }
  };

  setInterval(check, interval);
}

module.exports = euthanasia;
