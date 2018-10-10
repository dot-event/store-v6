import Events from "dot-event"
import composeStore from "../dist/core"

test("get", () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events(), state)

  expect(store.get("hello.world")).toBe(true)
})

test("delete", async () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events(), state)

  await store.delete("hello.world")
  expect(store.get("hello.world")).toBeUndefined()
})

test("merge", async () => {
  const state = { hello: { world: true } }
  const store = composeStore(new Events(), state)

  await store.merge("hello", { hi: true })
  expect(store.get("hello")).toEqual({
    hi: true,
    world: true,
  })
})

test("merge with function", async () => {
  const store = composeStore(new Events())
  const promises = []

  await store.set("counter.test", 0)

  for (let i = 0; i < 100; i++) {
    promises.push(
      store.merge("counter", ({ get }) => ({
        test: get("counter.test") + 1,
      }))
    )
  }

  await Promise.all(promises)
  expect(store.get("counter.test")).toBe(100)
})

test("set", async () => {
  const store = composeStore(new Events())

  await store.set("hello.world", true)
  expect(store.get("hello.world")).toBe(true)

  await store.set("hello.world", { hi: true })
  expect(store.get("hello.world")).toEqual({ hi: true })
})

test("set emits", async () => {
  const events = new Events()
  const store = composeStore(events)
  const fn = jest.fn()

  events.on("store.hello.world", fn)

  await store.set("hello.world", true)
  expect(fn.mock.calls.length).toBe(1)
})

test("set provides prevGet", async () => {
  const events = new Events()
  const store = composeStore(events)

  expect.assertions(2)

  events.on("store.hello.world", ({ prevGet }) => {
    expect(prevGet()).toEqual({})
    expect(store.get()).toEqual({ hello: { world: true } })
  })

  await store.set("hello.world", true)
})

test("set with function", async () => {
  const store = composeStore(new Events())
  const promises = []

  await store.set("counter", 0)

  for (let i = 0; i < 100; i++) {
    promises.push(
      store.set("counter", ({ get }) => get("counter") + 1)
    )
  }

  await Promise.all(promises)
  expect(store.get("counter")).toBe(100)
})

test("time", async () => {
  const store = composeStore(new Events())

  await store.time("hello.world")
  expect(store.get("hello.world")).toEqual(
    expect.any(Number)
  )
})
