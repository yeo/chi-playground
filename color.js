const readline = require('readline')
const stream = require('stream')
const async   = require('async')
const db = require('./db')
const fs = require('fs')
const ColorThief = require('color-thief')

function rgb2hex(rgb) {
  return ("0" + rgb[0].toString(16)).slice(-2) +
    ("0" + rgb[1].toString(16)).slice(-2) +
    ("0" + rgb[2].toString(16)).slice(-2)
}

function rgb2Hsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

function getColor(path) {
  const colorThief = new ColorThief
  return colorThief
    .getPalette(path, 8)
}

function classify(hue,sat, lgt) {
    if (lgt < 0.2)  return "Black"
    if (lgt > 0.8)  return "White"

    if (sat < 0.25) return "Gray"

    if (hue < 30)   return "Red"
    if (hue < 90)   return "Yellow"
    if (hue < 150)  return "Green"
    if (hue < 210)  return "Cyan"
    if (hue < 270)  return "Blue"
    if (hue < 330)  return "Magenta"
    return "Red"
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

    const hslColors = siteColors.map(c => {
      const hsl = rgb2Hsl(c[0], c[1], c[2])
      return classify(hsl[0], hsl[1],hsl[2])
    })

    const tags = hslColors.filter((key, idx) => hslColors.lastIndexOf(key) === idx).sort((a, b) => a < b ? -1 : 1).slice(0, 3).map(c => `'${c}'`).join(',')

    let post = `+++
date = "${n}"
title = "${site.address}"
draft = false
colors  = [${hexColors}]
tags   = [${hslColors}]
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

