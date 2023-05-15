const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '',
});

db.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL server: ' + error.stack);
    return;
  }

  console.log('Connected to MySQL server with threadId ' + db.threadId);
});

module.exports = db;
