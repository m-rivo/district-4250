/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3130199401",
    "max": 0,
    "min": 0,
    "name": "profession",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3820185180",
    "max": 0,
    "min": 0,
    "name": "biography",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // remove field
  collection.fields.removeById("text3130199401")

  // remove field
  collection.fields.removeById("text3820185180")

  return app.save(collection)
})
