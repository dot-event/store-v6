# dot-store

Immutable store extension for dot-event.

![pale blue dot](https://qph.fs.quoracdn.net/main-qimg-347d2c178e6bf511ee5b91e8276c79fa)

## Install

```bash
npm install --save dot-store
```

## Create store

```js
import composeStore from "dot-store"
const store = composeStore()
```

## Use store

```js
await store.set("hello.world", true)
store.get("hello.world") // true
```
