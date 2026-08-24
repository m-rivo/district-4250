/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" && @request.auth.member = id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // update collection data
  unmarshal({
    "updateRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
