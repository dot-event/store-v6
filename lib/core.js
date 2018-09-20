import Events from "dot-event"
import dot from "@dot-store/dot-prop-immutable"

export default function composeStore(
  events = new Events()
) {
  events
    .setName("store")
    .setOps("delete", "merge", "set", "time", "toggle")

  events.withOp("delete").onAny(del)
  events.withOp("merge").onAny(merge)
  events.withOp("set").onAny(set)
  events.withOp("time").onAny(time)
  events.withOp("toggle").onAny(toggle)

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
