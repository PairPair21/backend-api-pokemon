const { Pool, Client } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://qsknybmz:ZR6SCZu0IXFbwFs1Cp0LzDxaD0gjx-1_@mahmud.db.elephantsql.com/qsknybmz",
});

module.exports = pool;
