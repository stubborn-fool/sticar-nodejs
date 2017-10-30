var engine = require('ejs-locals')
var express = require('express')
var newsController = require('./controllers/newsController')
var categoryController = require('./controllers/categoryController')

var app = express()

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.use(express.static('./public'))

newsController(app)
categoryController(app)

app.listen(3000)
