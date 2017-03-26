const webshot = require('webshot')
const readline = require('readline')
const stream = require('stream')
const async   = require('async')
const db = require('lowdb')('db.json')

const fs = require('fs')
const instream = fs.createReadStream('./urls')
const outstream = new stream
const rl = readline.createInterface(instream, outstream)
let queue = []

function initDb() {
  db.defaults({ sites: [] }).write()
}

rl.on('line', url => {
  const filename = url.replace(/[^\w]/g, "-")
  if (filename == "") {
    return
  }

  queue.push(url)
  console.log('Enqueue', url)
})

rl.on('close', () => {
  console.log("Processing")
  async.eachLimit(queue, 10, (url, next) => {
    const filename = url.replace(/[^\w]/g, "-")
    console.log("Doing", url)
    webshot(url, `shots/${filename}.png`, {
      phantomConfig: {
        "ssl-protocol": "any",
        "ignore-ssl-errors": "yes",
      }
    }, (err) => {
      if (err) {
        console.log("Error when take", url, err)
      } else {
        db.get('sites')
          .push({id: filename, src: filename})
          .write()
      }
      next()
    })
  }, (err, result) => {
    if (err) {
      console.log("Get error", err)
      return
    }

    console.log("Done")
  })
})

