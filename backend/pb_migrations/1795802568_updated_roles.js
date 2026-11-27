/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2105053228")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3503249970",
    "help": "",
    "hidden": false,
    "id": "relation1653163849",
    "maxSelect": 10,
    "minSelect": 0,
    "name": "permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2105053228")

  // update field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3503249970",
    "help": "",
    "hidden": false,
    "id": "relation1653163849",
    "maxSelect": 10,
    "minSelect": 0,
    "name": "relation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
