/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // update field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "select1400097126",
    "maxSelect": 1,
    "name": "country",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "HN",
      "BZ",
      "GT"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // update field
  collection.fields.addAt(2, new Field({
    "help": "",
    "hidden": false,
    "id": "select1400097126",
    "maxSelect": 1,
    "name": "country",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "Honduras",
      "Belize",
      "Guatemala"
    ]
  }))

  return app.save(collection)
})
