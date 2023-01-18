const { faker } = require("@faker-js/faker");
const createSlug = (data) =>
  data
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const indexDefaultValidationGuard = (valideteData, data) => {
  for (const key in valideteData) {
    if (valideteData[key].index === true) {
      if (!data[key]) return false;
    }
    return true;
  }
};

const genereteFake = (schema) => {
  const out = {};
  for (const key in schema.fields) {
    if (schema.fields[key].faker === "companyName") {
      out[key] = faker.company.name();
    }
    if (schema.fields[key].type === "number") {
      const length = schema.fields[key].faker.length;

      out[key] = faker.datatype.float({
        min: parseInt(schema.fields[key].faker),
        max: parseInt(Array(length + 1).join("9")),
        precision: 1,
      });
    }
    if (schema.fields[key].type === "enum") {
      out[key] = faker.helpers.arrayElement(schema.fields[key].enum);
    }
  }
  return out;
};

module.exports = {
  createSlug,
  indexDefaultValidationGuard,
  genereteFake,
};
