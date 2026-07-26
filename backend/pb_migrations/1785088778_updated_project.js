/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3202395908")

  // update collection data
  unmarshal({
    "name": "projects"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3202395908")

  // update collection data
  unmarshal({
    "name": "project"
  }, collection)

  return app.save(collection)
})
