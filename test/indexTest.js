import composeStore from "../dist/core"

test("get", () => {
  const store = composeStore({
    state: { hello: { world: true } },
  })
  expect(store.get("hello.world")).toBe(true)
})

test("delete", async () => {
  const store = composeStore({
    state: { hello: { world: true } },
  })
  await store.delete("hello.world")
  expect(store.get("hello.world")).toBeUndefined()
})

test("merge", async () => {
  const store = composeStore({
    state: { hello: { world: true } },
  })

  await store.merge("hello", { hi: true })
  expect(store.get("hello")).toEqual({
    hi: true,
    world: true,
  })
})

test("set", async () => {
  const store = composeStore()

  await store.set("hello.world", true)
  expect(store.get("hello.world")).toBe(true)

  await store.set("hello.world", { hi: true })
  expect(store.get("hello.world")).toEqual({ hi: true })
})

test("time", async () => {
  const store = composeStore()
  await store.time("hello.world")
  expect(store.get("hello.world")).toEqual(
    expect.any(Number)
  )
})

test("toggle", async () => {
  const store = composeStore({
    state: { hello: { world: true } },
  })
  await store.toggle("hello.world")
  expect(store.get("hello.world")).toBe(false)
})
