/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select258142582",
    "maxSelect": 0,
    "name": "region",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "norte",
      "centro-sur",
      "occidente"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("select258142582")

  return app.save(collection)
})
