const db = require('lowdb')('db.json')

function initDb() {
  db.defaults({ sites: [] }).write()
}
initDb()

module.exports = db
