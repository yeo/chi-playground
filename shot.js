const webshot = require('webshot')
const readline = require('readline')
const stream = require('stream')

const fs = require('fs')
const instream = fs.createReadStream('./urls')
const outstream = new stream
const rl = readline.createInterface(instream, outstream)

rl.on('line', url => {
  console.log(url)

  webshot('google.com', `${url}.png`, function(err) {
    console.log("Fail to process", err)
  })
})

