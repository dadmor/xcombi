var fs = require("fs");
const {
  createSlug,
  indexDefaultValidationGuard,
  getIndexRow,
} = require("./helpers");
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
      /* todo - move to helpers */
      for (const key in intersection) {
        prepareDocument[intersection[key]] = data[intersection[key]];
      }
      const indexRow = getIndexRow(schema, prepareDocument);

      /* todo - add transaction guardian */
      if (!fs.existsSync(`${_dir}/documents/${collection_name}/${subDir}`)) {
        fs.mkdirSync(`${_dir}/documents/${collection_name}/${subDir}`);
      }
      fs.writeFileSync(
        `${_dir}/documents/${collection_name}/${subDir}/${prepareSlug}.json`,
        JSON.stringify(prepareDocument)
      );
      fs.appendFileSync(`${_dir}/collections/${collection_name}.txt`, indexRow);
      resolve({ ...prepareDocument, meta: { index: indexRow } });
    } else {
      /* todo: return data validation error */
    }
  }).catch(function (e) {
    /* todo: add method for that */
    return resultError;
  });
};

const getEntry = (collection_name, entry_slug) => {
  return new Promise((resolve) => {
    const subDir = entry_slug.substring(0, 3);
    const data = fs.readFileSync(
      `${_dir}/documents/${collection_name}/${subDir}/${entry_slug}.json`,
      "utf8"
    );
    resolve({ ...JSON.parse(data), meta: {} });
  }).catch(function (e) {
    /* todo: add method for that */
    return resultError;
  });
};

module.exports = {
  getCollectionSchema,
  getEntry,
  addEntry,
};
