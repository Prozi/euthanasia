const TO_MB = 1 / 1024 / 1024

const MINUTE = 60 * 1000

function memoryUsage() {
  return process.memoryUsage()
}

function getMemoryUsage() {
  return Math.round(memoryUsage().heapUsed * TO_MB)
}

module.exports = function euthanasia(
  memory = 0,
  interval = MINUTE,
  ready = () => true
) {
  const check = () => {
    if (getMemoryUsage() > memory && ready()) {
      process.exit(0)
    }
  }

  setInterval(check, interval)
}
