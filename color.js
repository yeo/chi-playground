const readline = require('readline')
const stream = require('stream')
const async   = require('async')
const db = require('./db')
const fs = require('fs')
const ColorThief = require('color-thief')

function rgb2hex(rgb){
  return ("0" + rgb[0].toString(16)).slice(-2) +
    ("0" + rgb[1].toString(16)).slice(-2) +
    ("0" + rgb[2].toString(16)).slice(-2)
}

function getColor(path) {
  const colorThief = new ColorThief
  return colorThief
    .getPalette(path, 8)
}

function generate(site) {
  const d = new Date()
  var n = d.toISOString()
  const shotPath = './shots/' + site.id + '.png'
  fs.access(shotPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    console.log(site)
    if (err) {
      console.log("Access error", shotPath, err)
      return
    }

    const siteColors = getColor(shotPath)
    if (siteColors.length == 0) {
      return
    }

    const hexColors = siteColors.map(c => {
      return '"' + rgb2hex(c) + '"'
    }).join(", ")


    let post = `+++
date = "${n}"
title = "${site.address}"
draft = false
colors  = [${hexColors}]
+++`
    const hugoFile = `./copvan/content/posts/${site.id}.md`
    fs.writeFile(hugoFile, post, err => {
      if (err) {
        return console.log(err);
      }
      console.log("Write", hugoFile)
    })

  })
}

db.get('sites').value().forEach(generate)

