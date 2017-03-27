const db = require('lowdb')('./db/db.json')

function initDb() {
  db.defaults({ sites: [] }).write()
}
initDb()

module.exports = db
