/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1861980104",
    "help": "",
    "hidden": false,
    "id": "relation3102619762",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "club",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1861980104",
    "help": "",
    "hidden": false,
    "id": "relation3102619762",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "club",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
