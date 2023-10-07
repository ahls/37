const { BadRequestError } = require("../expressError");

// Generate query string for the given columns
//dataToUpdate is object, where the keys are the column headers and the value are the new value to be set
//jsToSql is a object of Sql column name where keys are the alias of the column(to be used in js) and values are the actual column names in SQL
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
