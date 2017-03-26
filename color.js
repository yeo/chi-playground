const readline = require('readline')
const stream = require('stream')
const async   = require('async')
const db = require('./db')
const fs = require('fs')
const ColorThief = require('color-thief')

function getColor(path) {
  const colorThief = new ColorThief
  return colorThief
    .getPalette(path, 8)
    .map(c => {
      return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
    })
}

function generate(site) {
  console.log(site)
  const d = new Date()
  var n = d.toISOString()
  const shotPath = './shots/' + site.id + '.png'
  fs.access(shotPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
      console.log("Access error", shotPath, err)
      return
    }

    const siteColors = getColor(shotPath)
    const content = siteColors.map(c => {
      return `<span style="background-color: ${c}; width: 20px; height: 20px; display: inline-block;"></span>`
    }).join("")

    let post = `+++
date = "${n}"
title = "${site.src}"
draft = false
+++
${content}`
    fs.writeFile(`./copvan/content/posts/${site.id}.md`, post, err => {
      if (err) {
        return console.log(err);
      }
    })

  })
}

db.get('sites').value().forEach(generate)

