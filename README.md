# euthanasia

when your node.js process uses too much memory, allow it to gracefully exit

## usage:

```js
const euthanasia = require('euthanasia');

// if you need to do some cleanup you do it in an async ready function
// usage is in MB just like the first parameter of default function
const ready = async (usage) => {
  // whatever to want do after memory used > 256 MB
  console.info(`[OOM] Sorry but you used ${usage} MB`);

  // return false here to still keep on livin'
  // for example there are still connected active users
  return true;
};

// check is memory usage > than 256 MB, every minute
euthanasia(256, 60 * 1000, ready);
```

## install:

```bash
npm i euthanasia --save
```

## license:

MIT
