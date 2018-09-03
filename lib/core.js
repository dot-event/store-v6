import Emitter from "dot-event"
import dot from "@invrs/dot-prop-immutable"

export default function createStore({
  emitter = new Emitter(),
  state = {},
} = {}) {
  const store = { state }

  emitter
    .opSync("get")
    .op("delete", "merge", "set", "time", "toggle")

  emitter.onAny([
    [{ store }, "get", get],
    [{ store }, "delete", del],
    [{ store }, "merge", merge],
    [{ store }, "set", set],
    [{ store }, "time", time],
    [{ store }, "toggle", toggle],
  ])

  return emitter
}

function get({ event, store }) {
  const { props } = event
  const { state } = store

  if (props) {
    event.returnValue = dot.get(state, props)
  } else {
    event.returnValue = state
  }
}

function del({ event, store }) {
  const { props } = event
  store.state = dot.delete(store.state, props)
}

function merge({ event, store }) {
  const { props, options } = event
  store.state = dot.merge(store.state, props, options)
}

function set({ event, store }) {
  const { extras, props, options } = event
  const value = options || extras[0]
  store.state = dot.set(store.state, props, value)
}

function time({ event, store }) {
  const { props } = event
  store.state = dot.set(
    store.state,
    props,
    new Date().getTime()
  )
}

function toggle({ event, store }) {
  const { props } = event
  store.state = dot.toggle(store.state, props)
}
