const cors = require("cors");
const { getCollectionSchema, addEntry, getEntry } = require("./resolver");
const { genereteFake } = require("./helpers");

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

  // # ENDPOINT /search collection GET
  app.get("/search/:collection/:search", (req, res) => {
    const start = performance.now();
    const search = req.params.search;
    const slug = req.params.slug;
    // getEntry(collection,slug).then((response) => {
    //   const end = performance.now();
    //   res.status(200).json({
    //     ...response,
    //     meta: { ...response.meta, timeSpent: end - start },
    //   });
    // });
  });

  app.get("*", (req, res) => {
    res.json({ error: "something is comming out" });
  });
};

module.exports = {
  configure,
};
