# euthanasia

when your node.js process uses too much memory, allow it to gracefully exit

## usage:

```js
const euthanasia = require("euthanasia")

// check every minute is memory usage bigger than 256 MB
euthanasia(256, 60 * 1000, () => {
  // whatever to do after memory used > 256 MB
  console.info("Sorry but OOM")

  // return false here to still keep on livin'
  return true
})
```

## install:

```bash
npm i euthanasia --save
```

## license:

MIT
