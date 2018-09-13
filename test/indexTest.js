import Events from "dot-event"
import composeStore from "../dist/core"

test("get", () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events({ state }))

  expect(store.get("hello.world")).toBe(true)
})

test("delete", async () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events({ state }))

  await store.delete("hello.world")
  expect(store.get("hello.world")).toBeUndefined()
})

test("merge", async () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events({ state }))

  await store.merge("hello", { hi: true })
  expect(store.get("hello")).toEqual({
    hi: true,
    world: true,
  })
})

test("set", async () => {
  const store = composeStore(new Events())

  await store.set("hello.world", true)
  expect(store.get("hello.world")).toBe(true)

  await store.set("hello.world", { hi: true })
  expect(store.get("hello.world")).toEqual({ hi: true })
})

test("time", async () => {
  const store = composeStore(new Events())

  await store.time("hello.world")
  expect(store.get("hello.world")).toEqual(
    expect.any(Number)
  )
})

test("toggle", async () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events({ state }))

  await store.toggle("hello.world")
  expect(store.get("hello.world")).toBe(false)
})
