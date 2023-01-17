var fs = require("fs");
const _dir = `base`;

const getCollectionShema = (collection_name) => {
  if (fs.existsSync(`${_dir}/collection_${collection_name}_schema.json`)) {
    /* TODO */
    /* add valid JSON guardian */
    return JSON.parse(
      fs.readFileSync(
        `${_dir}/collection_${collection_name}_schema.json`,
        "utf8"
      )
    );
  } else {
    /* TODO */
    /* return error io */
  }
};

const getCollection = (collection_name) => {
  return new Promise((resolve) => {
    const schema = getCollectionShema(collection_name);
    resolve({ ...schema });
  }).catch(function (e) {
    return resultError;
  });
};

const addCollection = (collection_name) => {};

const addEntry = (collection_name) => {};

const getEntry = (collection_name) => {};

module.exports = {
  getCollection,
  addCollection,
  getEntry,
  addEntry,
};
