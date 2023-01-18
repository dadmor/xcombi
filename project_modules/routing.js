const cors = require("cors");
const { getCollectionSchema, addEntry, getEntry } = require("./resolver");
const { genereteFake } = require("./helpers");
const { searchStream } = require("./search");
var fs = require("fs");
const { exists } = require("fs");

const configure = (app) => {
  app.use(cors());

  // # ENDPOINT /entry collection POST
  app.post("/entry/:collection", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    addEntry(collection, req.body).then((response) => {
      const end = performance.now();
      res.status(200).json({
        ...response,
        meta: { ...response.meta, timeSpent: end - start },
      });
    });
  });
  app.post("/fakeentry/:collection", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;

    getCollectionSchema(collection).then((response) => {
      console.log(response);
      addEntry(collection, genereteFake(response)).then((entryResponse) => {
        const end = performance.now();
        res.status(200).json({
          ...entryResponse,
          meta: { ...entryResponse.meta, timeSpent: end - start },
        });
      });
    });
  });
  // # ENDPOINT /collection schema GET
  app.get("/collection/:collection", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    getCollectionSchema(collection).then((response) => {
      const end = performance.now();
      res.status(200).json({
        ...response,
        meta: { ...response.meta, timeSpent: end - start },
      });
    });
  });
  // # ENDPOINT /entry collection GET
  app.get("/entry/:collection/:slug", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    const slug = req.params.slug;
    getEntry(collection, slug).then((response) => {
      const end = performance.now();
      res.status(200).json({
        ...response,
        meta: { ...response.meta, timeSpent: end - start },
      });
    });
  });

  app.get("/search/:collection/:search", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    const search = req.params.search;

    /* todo: move to resolver */
    exists(`./base/collections/${collection}.txt`, (e) => {
      if (!e) {
        res.status(404).json({ error: "Resources not exist" });
        return;
      }
    });

    if (req.params.text && req.params.text.length < 4) {
      res.status(400).json({ warning: "Need more characters (min4)" });
      return;
    }

    searchStream(`./base/collections/${collection}.txt`, search).then((n) => {
      if (n?.length === 0) {
        res.status(400).json({
          warning: `I dont have results for this request`,
        });
      }
      if (n?.length > 0) {
        const end = performance.now();
        const sliced = n.slice(0, 10);
        res.json({
          results: sliced,
          meta: { n: n?.length, timeSpent: end - start },
        });
      }
    });
  });

  app.get("*", (req, res) => {
    res.json({ error: "something is comming out" });
  });
};

module.exports = {
  configure,
};
