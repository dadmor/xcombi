var fs = require("fs");
const { createSlug, indexDefaultValidationGuard } = require("./helpers");
const _dir = `./base`;
const resultError = { error: "errortype", errormessage: "" };

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

const getCollectionSchema = (collection_name) => {
  return new Promise((resolve) => {
    const schema = getCollectionShema(collection_name);
    resolve({ ...schema });
  }).catch(function (e) {
    return resultError;
  });
};

const addEntry = (collection_name, data) => {
  return new Promise((resolve) => {
    const schema = getCollectionShema(collection_name);
    /* check data */

    if (indexDefaultValidationGuard(schema.fields, data)) {
      const intersection = Object.keys(schema.fields).filter((x) =>
        Object.keys(data).includes(x)
      );

      const prepareSlug = createSlug(data[schema.meta.slug]);
      const subDir = prepareSlug.substring(0, 3);

      const prepareDocument = {};
      for (const key in intersection) {
        prepareDocument[intersection[key]] = data[intersection[key]];
      }

      if (!fs.existsSync(`${_dir}/documents/${collection_name}/${subDir}`)) {
        fs.mkdirSync(`${_dir}/documents/${collection_name}/${subDir}`);
      }

      fs.writeFileSync(
        `${_dir}/documents/${collection_name}/${subDir}/${prepareSlug}.json`,
        JSON.stringify(prepareDocument)
      );

      let collectionindex = "";
      for (const key in schema.fields) {
        if (schema.fields[key].index) {
          collectionindex = collectionindex + prepareDocument[key] + "¦";
        }
      }
      collectionindex = collectionindex + "\n";
      fs.appendFileSync(
        `${_dir}/collections/${collection_name}.txt`,
        collectionindex
      );

      resolve({});
    } else {
      /* return data validation error */
    }
  }).catch(function (e) {
    collection_name;
    return resultError;
  });
};

const getEntry = (collection_name, entry_slug) => {
  console.log(collection_name, entry_slug)
};

module.exports = {
  getCollectionSchema,
  getEntry,
  addEntry,
};
