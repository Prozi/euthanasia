# euthanasia

when your node.js process uses too much memory or cpu, allow it to gracefully exit

## usage:

```js
const euthanasia = require('euthanasia');

euthanasia({
  memory: 100,      // 100 MB limit
  cpu: 80,          // 80% CPU limit
  interval: 10000,  // check every 10 seconds
  // called when either memory or CPU limit is exceeded
  ready: async ({ memory, cpu }) => {
    // your logic here
    if (memory) {
      console.log(`Memory limit exceeded: ${memory} MB`);
    }
    if (cpu) {
      console.log(`CPU limit exceeded: ${cpu.toFixed(2)}%`);
    }
    // You can return false to skip exit (e.g., wait for cleanup)
    return true;
  }
});
```

## install:

```bash
npm i euthanasia --save
```

## license:

MIT
