/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "geoPoint1587448267",
    "name": "location",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "geoPoint"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url2225635011",
    "name": "instagram",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url847873150",
    "name": "tiktok",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1861980104")

  // remove field
  collection.fields.removeById("geoPoint1587448267")

  // remove field
  collection.fields.removeById("url2225635011")

  // remove field
  collection.fields.removeById("url847873150")

  return app.save(collection)
})
