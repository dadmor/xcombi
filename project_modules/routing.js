const cors = require("cors");
var fs = require("fs");
const { getCollection, addEntry } = require("./resolver");

const configure = (app) => {
  app.use(cors());

  // # ENDPOINT /entry collection POST
  app.post("/entry/:collection", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    console.log('???',collection, req.body)
    addEntry(collection, req.body).then((response) => {
      const end = performance.now();
      res.status(200).json({
        ...response,
        meta: { ...response.meta, timeSpent: end - start },
      });
    });
  });
  // # ENDPOINT /collection schema GET
  app.get("/collection/:collection", (req, res) => {
    const start = performance.now();
    const collection = req.params.collection;
    getCollection(collection).then((response) => {
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
    getEntry().then((response) => {
      const end = performance.now();
      res.status(200).json({
        ...response,
        meta: { ...response.meta, timeSpent: end - start },
      });
    });
  });

  app.get("*", (req, res) => {
    res.json({ error: "something is comming out" });
  });
};

module.exports = {
  configure,
};
