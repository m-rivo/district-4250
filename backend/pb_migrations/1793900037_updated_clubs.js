/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("geoPoint1587448267")

  // add field
  collection.fields.addAt(14, new Field({
    "exceptDomains": [],
    "help": "Google maps embed src url",
    "hidden": false,
    "id": "url1587448267",
    "name": "location",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "geoPoint1587448267",
    "name": "location",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // remove field
  collection.fields.removeById("url1587448267")

  return app.save(collection)
})
