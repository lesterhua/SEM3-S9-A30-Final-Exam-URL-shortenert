const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')
const Url = require('./models/url')
const generateRandomNumber = require('./random')
const { validationResult } = require('express-validator')
const { urlValidator } = require('./urlValidator')

const port = 3000

// 連線mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/shortURL', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})



app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParse.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', urlValidator, async (req, res) => {
  console.log(req.body.link)
  const link = req.body.link
  const errors = validationResult(req)
  let errMsg = ''
  if (!errors.isEmpty()) {
    for (let errValidation of errors.errors) {
      errMsg += errValidation.msg
      console.log(errMsg)
    }
    if (errMsg) {
      return res.render('index', { errMsg })
    }
  }
  else {
    let link = req.body.link
    let site = await Url.findOne({ link })
    if (!site) {
      let url = generateRandomNumber()
      site = await Url.create({ link, url })
      console.log(url)
    } else {
      let randomNumber = generateRandomNumber()
      let url = await Url.findOne({ randomNumber })
      if (!url) {
        let url = randomNumber
        site = await Url.create({ link, url })
      }
    }
    return res.render('index', { site })
  }
})

app.get('/:url', (req, res) => {
  const url = req.params.url
  Url.findOne({ url }).then(site => {
    if (site) {
      res.redirect(site.link)
    }
  })
})

app.listen(process.env.MONGODB_URI || port, () => {
  console.log(`app is running on:http://localhost:${port}`)
})

