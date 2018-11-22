import dotEvent from "dot-event"
import dot from "@dot-store/dot-prop-immutable"

export default function dotStore({
  events = dotEvent(),
  state = {},
}) {
  if (events.ops.has("store")) {
    return store
  }

  const store = { queue: Promise.resolve(), state }
  const bind = { events, store }

  store.delete = del.bind(bind)
  store.get = get.bind(bind)
  store.merge = merge.bind(bind)
  store.set = set.bind(bind)
  store.setState = setState.bind(bind)
  store.time = time.bind(bind)

  events.setDefaultOptions({ store })
  events.setOp("store")

  return store
}

function get(props = []) {
  const { state, store } = this

  if (props) {
    return dot.get(state || store.state, props)
  } else {
    return state || store.state
  }
}

async function del(props = [], value) {
  const { events, store } = this

  if (
    await enqueue({ events, fn: del, props, store, value })
  ) {
    return
  }

  const { state } = store

  if (value !== false) {
    store.setState(dot.delete(state, props))
    await emitStore({ events, op: "del", props, state })
  }
}

async function merge(props = [], value) {
  const { events, store } = this

  if (
    await enqueue({ events, fn: set, props, store, value })
  ) {
    return
  }

  const { state } = store

  store.setState(dot.merge(state, props, value))

  await emitStore({
    events,
    op: "merge",
    props,
    state,
    value,
  })
}

async function set(props = [], value) {
  const { events, store } = this

  if (
    await enqueue({ events, fn: set, props, store, value })
  ) {
    return
  }

  const { state } = store

  store.setState(dot.set(state, props, value))

  await emitStore({
    events,
    op: "set",
    props,
    state,
    value,
  })
}

async function setState(state) {
  const { store } = this
  store.state = state
}

function time(props = []) {
  return set.call(this, props, new Date().getTime())
}

async function enqueue({
  events,
  fn,
  props,
  store,
  value,
}) {
  if (typeof value !== "function") {
    return
  }

  store.queue = store.queue.then(async () => {
    await fn.call(
      { events, store },
      props,
      await value(store)
    )
  })

  await store.queue
  return true
}

async function emitStore({
  events,
  op,
  props,
  state,
  value,
}) {
  await events.store(props, {
    op,
    prevGet: get.bind({ events, state }),
    value,
  })
}
