const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'report',
});
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'johshopp_joh',
//   password: '#JohShopping2be',
//   database: 'johshopp_report',
// });

module.exports = pool.promise();
