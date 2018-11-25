import dotStore from "../"

test("get", () => {
  const state = { hello: { world: true } }
  const { events } = dotStore({ state })

  expect(events.get("hello.world")).toBe(true)
})

test("delete", async () => {
  const state = { hello: { world: true } }
  const { events } = dotStore({ state })

  await events.delete("hello.world")
  expect(events.get("hello.world")).toBeUndefined()
})

test("delete with function", async () => {
  const state = { hello: { world: true } }
  const { events } = dotStore({ state })

  await events.delete("hello.world", async () => false)
  expect(events.get("hello.world")).not.toBeUndefined()

  await events.delete("hello.world", async () => true)
  expect(events.get("hello.world")).toBeUndefined()
})

test("merge", async () => {
  const state = { hello: { world: true } }
  const { events } = dotStore({ state })

  await events.merge("hello", { hi: true })
  expect(events.get("hello")).toEqual({
    hi: true,
    world: true,
  })
})

test("merge with function", async () => {
  const { events } = dotStore()
  const promises = []

  await events.set("counter.test", 0)

  for (let i = 0; i < 100; i++) {
    promises.push(
      events.merge("counter", ({ get }) => ({
        test: get("counter.test") + 1,
      }))
    )
  }

  await Promise.all(promises)
  expect(events.get("counter.test")).toBe(100)
})

test("set", async () => {
  const { events } = dotStore()

  await events.set("hello.world", true)
  expect(events.get("hello.world")).toBe(true)

  await events.set("hello.world", { hi: true })
  expect(events.get("hello.world")).toEqual({ hi: true })
})

test("set emits", async () => {
  const { events } = dotStore()
  const fn = jest.fn()

  events.on("set.hello.world", fn)

  await events.set("hello.world", true)
  expect(fn.mock.calls.length).toBe(1)
})

test("set with function", async () => {
  const { events } = dotStore()
  const promises = []

  await events.set("counter", 0)

  for (let i = 0; i < 100; i++) {
    promises.push(
      events.set("counter", ({ get }) => get("counter") + 1)
    )
  }

  await Promise.all(promises)
  expect(events.get("counter")).toBe(100)
})

test("time", async () => {
  const { events } = dotStore()

  await events.time("hello.world")
  expect(events.get("hello.world")).toEqual(
    expect.any(Number)
  )
})
