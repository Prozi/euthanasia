const TO_MEGABYTE = 1 / 1024 / 1024
const DEFAULT_MEMORY = 0
const DEFAULT_MINUTE_INTERVAL = 60 * 1000
const DEFAULT_READY = (usage) => {
  console.info(`[OOM] Sorry but you used ${usage} MB`)

  return true
}

function getMemoryUsage() {
  return Math.round(process.memoryUsage().heapUsed * TO_MEGABYTE)
}

/**
 * check is memory usage > `memory` MB, every `interval` ms unless `ready` resolves to false
 * @param {number} memory in mb
 * @param {number} interval in ms
 * @param {(number) => Promise<boolean>} ready
 */
function euthanasia(
  memory = DEFAULT_MEMORY,
  interval = DEFAULT_MINUTE_INTERVAL,
  ready = DEFAULT_READY
) {
  const check = async () => {
    const usage = getMemoryUsage()
    const oom = usage > memory

    if (oom && (await ready(usage))) {
      process.exit(0)
    }
  }

  setInterval(check, interval)
}

module.exports = euthanasia
