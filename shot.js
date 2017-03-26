const webshot = require('webshot')
const readline = require('readline')
const stream = require('stream')
const async   = require('async')
const db = require('./db')

const fs = require('fs')
const instream = fs.createReadStream('./urls')
const outstream = new stream
const rl = readline.createInterface(instream, outstream)
let queue = []

rl.on('line', url => {
  if (url == "") {
    return
  }

  queue.push(url)
  console.log('Enqueue', url)
})

rl.on('close', () => {
  console.log("Start processing")
  async.eachLimit(queue, 5, (url, next) => {
    const filename = url.replace(/[^\w]/g, "-")

    webshot(url, `shots/${filename}.png`, {
      phantomConfig: {
        "ssl-protocol": "any",
        "ignore-ssl-errors": "yes",
      }
    }, (err) => {
      if (err) {
        console.log("Error when take", url, err)
        console.log("[ ]", url)
      } else {
        db.get('sites')
          .push({id: filename, src: filename, address: url})
          .write()
        console.log("[x]", url)
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

