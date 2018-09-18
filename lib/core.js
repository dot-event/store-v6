import Events from "dot-event"
import dot from "@dot-store/dot-prop-immutable"

export default function composeStore(
  events = new Events()
) {
  events
    .setName("store")
    .setSyncOps("get")
    .setOps("delete", "merge", "set", "time", "toggle")

  events.withSyncOp("get").onAny(get)

  events.withOp("delete").onAny(del)
  events.withOp("merge").onAny(merge)
  events.withOp("set").onAny(set)
  events.withOp("time").onAny(time)
  events.withOp("toggle").onAny(toggle)

  return events
}

function get({ event, store }) {
  const { props } = event
  const { state } = store

  if (props) {
    event.signal.returnValue = dot.get(state, props)
  } else {
    event.signal.returnValue = state
  }
}

function del({ event, store }) {
  const { props } = event
  const { state } = store
  store.setState(dot.delete(state, props))
}

function merge({ event, store }) {
  const { args, props } = event
  const { state } = store
  store.setState(dot.merge(state, props, args[0]))
}

function set({ event, store }) {
  const { args, props } = event
  const { state } = store
  const value = args[0]
  store.setState(dot.set(state, props, value))
}

function time({ event, store }) {
  const { props } = event
  const { state } = store
  store.setState(
    dot.set(state, props, new Date().getTime())
  )
}

function toggle({ event, store }) {
  const { props } = event
  const { state } = store
  store.setState(dot.toggle(state, props))
}
