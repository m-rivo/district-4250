/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(14, new Field({
    "exceptDomains": [],
    "help": "",
    "hidden": false,
    "id": "url2859610305",
    "name": "x_twitter",
    "onlyDomains": [],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("url2859610305")

  return app.save(collection)
})
