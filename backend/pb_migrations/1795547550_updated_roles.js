/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2105053228")

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select105650625",
    "maxSelect": 0,
    "name": "category",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "club_board",
      "club_director",
      "district_board",
      "district_committee"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2105053228")

  // remove field
  collection.fields.removeById("select105650625")

  return app.save(collection)
})
