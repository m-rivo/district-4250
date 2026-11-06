/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(12, new Field({
    "exceptDomains": [],
    "help": "",
    "hidden": false,
    "id": "url1802815712",
    "name": "facebook",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1481407378",
    "max": 0,
    "min": 0,
    "name": "sponsor_club",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("url1802815712")

  // remove field
  collection.fields.removeById("text1481407378")

  return app.save(collection)
})
