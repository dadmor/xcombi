var fs = require("fs");
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

const getCollection = (collection_name) => {
  return new Promise((resolve) => {
    const schema = getCollectionShema(collection_name);
    resolve({ ...schema });
  }).catch(function (e) {
    return resultError;
  });
};

const addEntry = (collection_name, data) => {
  const indexDefaultValidationGuard = (valideteData) => {
    for (const key in valideteData) {
      if (valideteData[key].index === true) {
        if (!data[key]) return false;
      }
      return true;
    }
  };
  const slug = (data) =>
    data
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  return new Promise((resolve) => {
    /* check data */
    const schema = getCollectionShema(collection_name);
    /* check required indexes */
    if (indexDefaultValidationGuard(schema.fields)) {
      /* acceptable list */
      const intersection = Object.keys(schema.fields).filter((x) =>
        Object.keys(data).includes(x)
      );

      /* create slug */
      const prepareSlug = slug(data[schema.meta.slug]);
      const subDir = prepareSlug.substring(0, 3);

      /* create static json document */
      const prepareDocument = {};
      for (const key in intersection) {
        prepareDocument[intersection[key]] = data[intersection[key]];
      }
      /* build dir */
      console.log(`${_dir}/documents/${collection_name}/${subDir}`)
      if (
        !fs.existsSync(`${_dir}/documents/${collection_name}/${subDir}`)
      ) {
        fs.mkdirSync(`${_dir}/documents/${collection_name}/${subDir}`);
      }
      /* save document */
      fs.writeFileSync(
        `${_dir}/documents/${collection_name}/${subDir}/${prepareSlug}.json`,
        JSON.stringify(prepareDocument)
      );
      //console.log(prepare);
      resolve({});
    }
  }).catch(function (e) {
    collection_name;
    return resultError;
  });
};

const getEntry = (collection_name) => {};

module.exports = {
  getCollection,
  getEntry,
  addEntry,
};
