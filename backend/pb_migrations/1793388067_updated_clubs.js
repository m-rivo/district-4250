/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "date3384580175",
    "max": "",
    "min": "",
    "name": "foundation_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("date3384580175")

  return app.save(collection)
})
