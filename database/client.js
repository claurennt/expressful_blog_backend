


const { Pool } = require("pg");
const pool = new Pool();

module.exports = {
  query: (text, params) => {
    console.log({
      req: text,
      time: new Date().toLocaleTimeString(),
    });
    return pool.query(text, params);
  },
};
