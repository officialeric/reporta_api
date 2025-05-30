const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'spancial',
//   password: '',
//   database: 'report',
// });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'johshopp_joh', 
  password: '#JohShopping2be',
  database: 'johshopp_report',
});
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'johshopp_test', 
//   password: '#JohShopping2be',
//   database: 'johshopp_test',
// });

module.exports = pool.promise();
