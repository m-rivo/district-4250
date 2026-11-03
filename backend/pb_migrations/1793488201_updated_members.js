/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

  // remove field
  collection.fields.removeById("text3820185180")

  // add field
  collection.fields.addAt(13, new Field({
    "convertURLs": false,
    "help": "",
    "hidden": false,
    "id": "editor3820185180",
    "maxSize": 0,
    "name": "biography",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458134665")

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

  // remove field
  collection.fields.removeById("editor3820185180")

  return app.save(collection)
})
