const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParse = require('body-parser')
const mongoose = require('mongoose')

const port = 3000

// 連線mongodb
mongoose.connect('mongodb://127.0.0.1/shortURL', { useNewUrlParser: true, useUnifiedTopology: true })

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

app.listen(port, () => {
  console.log(`app is running on:http://localhost:${port}`)
})

