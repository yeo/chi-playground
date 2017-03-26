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
      return `"rgb(${c[0]},${c[1]},${c[2]})"`
    })
}

function generate(site) {
  console.log(site)
  const d = new Date();
  var n = d.toISOString();

  const siteColors = getColor('./shots/' + site.id + '.png')
  let post = `+++
date = "${n}"
title = "${site.src}"
draft = false
+++

<span style="background-color: ${siteColors}; width: 10x; height: 10px; display: inline-block;"></span>
`
  fs.writeFile(`./copvan/content/colors/${site.id}.md`, post, err => {
    if (err) {
      return console.log(err);
    }
  })
}

db.get('sites').value().forEach(generate)

