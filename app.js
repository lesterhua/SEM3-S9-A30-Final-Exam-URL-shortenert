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
mongoose.connect('mongodb://127.0.0.1/shortURL', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

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

app.post('/', urlValidator, (req, res) => {
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
  } else {
    Url.findOne({ link }).then((site) => {
      if (site) {
        res.render('index', { site })
      } else {
        let randomNumber = generateRandomNumber()
        const newUrl = new Url({
          link: link,
          url: randomNumber
        })
        newUrl.save().then((site) => {
          res.render('index', { site })
        }).catch(err => {
          console.log(err)
        })
      }
    })
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

app.listen(port, () => {
  console.log(`app is running on:http://localhost:${port}`)
})

