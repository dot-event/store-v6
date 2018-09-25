import Events from "dot-event"
import dot from "@dot-store/dot-prop-immutable"

export default function composeStore(
  events = new Events()
) {
  events.storeQueue = Promise.resolve()

  events
    .setName("store")
    .setOps("delete", "merge", "set", "time", "toggle")

  events.withOp("delete").onAny(del)
  events.withOp("merge").onAny(merge)
  events.withOp("set").onAny(set)
  events.withOp("time").onAny(time)

  events.get = get.bind({ events })

  return events
}

function get(props) {
  const { events } = this
  const { state } = events

  if (props) {
    return dot.get(state, props)
  } else {
    return state
  }
}

function del({ event, store }) {
  const { props } = event
  const { state } = store
  store.setState(dot.delete(state, props))
}

async function merge({ event, store, value }) {
  if (await enqueue({ event, fn: merge, store, value })) {
    return
  }

  const { args, props } = event
  const { state } = store

  store.setState(dot.merge(state, props, value || args[0]))
}

async function set({ event, store, value }) {
  if (await enqueue({ event, fn: set, store, value })) {
    return
  }

  const { args, props } = event
  const { state } = store

  store.setState(dot.set(state, props, value || args[0]))
}

function time({ event, store }) {
  const { props } = event
  const { state } = store
  store.setState(
    dot.set(state, props, new Date().getTime())
  )
}

async function enqueue({ event, fn, store, value }) {
  if (value) {
    return
  }

  const { args } = event

  if (typeof args[0] === "function") {
    store.storeQueue = store.storeQueue.then(async () => {
      await fn({ event, store, value: await args[0]() })
    })
    await store.storeQueue
    return true
  }
}
