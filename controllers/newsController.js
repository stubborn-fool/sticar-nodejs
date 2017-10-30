var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var mongoose = require('mongoose')
var fetch = require('node-fetch')
var fs = require('fs')

// Connect to the DB
mongoose.Promise = global.Promise
mongoose.connection.openUri('mongodb://root:secret@ds141175.mlab.com:41175/sticar-triadi')

// Load models
var Category = require('../models/categoryModel.js')
var News = require('../models/newsModel.js')
var Comment = require('../models/commentModel.js')

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.redirect('/news')
    })

    app.get('/news', function(req, res) {
        fetch('http://127.0.0.1:3000/api/news')
            .then(function(res) {
                return res.json()
            }).then(function(json) {
                // Write to JSON Doc
                /*
                fs.writeFile('./results/news.json', JSON.stringify(json), 'utf8')
                fs.readFile('./results/news.json', 'utf8', function (err, data) {
                    if (err) throw err

                    res.render('pages/news', {
                        title: 'List News',
                        pageUrl: 'news',
                        news: JSON.parse(data)
                    })
                })
                */
                // Write to JSON Doc

                res.render('pages/news', {
                    title: 'List News',
                    pageUrl: 'news',
                    news: json
                })
            })
    })

    app.get('/news/create', function(req, res) {
        fetch('http://127.0.0.1:3000/api/category')
            .then(function(res) {
                return res.json()
            }).then(function(json) {
                res.render('pages/news-create', {
                    title: 'Create News',
                    pageUrl: 'news',
                    category: json
                })
            })
    })

    app.post('/news/create', urlencodedParser, function(req, res) {
        News({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }).save(function (err, news) {
            if (err) throw err

            Category.findOne({
                _id: req.body.category
            }).
            exec(callback)

            function callback(err, catg) {
                if (err) throw err

                catg.news.push(news)
                catg.save()

                res.redirect('/news')
            }
        })
    })

    app.get('/news/get', function(req, res) {
        if (req.query.id) {
            fetch('http://127.0.0.1:3000/api/news/get?id=' + req.query.id)
                .then(function(res) {
                    return res.json()
                }).then(function(json) {
                    if (!isEmptyObject(json)) {
                        res.render('pages/news-get', {
                            title: json.title,
                            pageUrl: 'news',
                            news: json,
                            category: json.category[0]

                        })
                    } else {
                        res.redirect('/news')
                    }

                })
        } else {
            res.redirect('/news')
        }
    })

    app.post('/news/comment', urlencodedParser, function(req, res) {
        Comment({
            content: req.body.content
        }).save(function (err, comm) {
            News.findOne({
                _id: req.body.news_id
            }).
            exec(callback)

            function callback(err, news) {
                if (err) throw err

                news.comments.push(comm)
                news.save()

                res.json(comm)
            }
        })
    })

    app.post('/news/comment/delete', urlencodedParser, function(req, res) {
        Comment.findOne({
            _id: req.body.comment_id
        }).
        exec(callbackFirst)

        function callbackFirst(err, comm) {
            News.findOne({
                _id: req.body.news_id
            }).
            exec(callbackSecond)

            function callbackSecond(err, news) {
                if (err) throw err

                news.comments.pull(comm)
                comm.remove()
                news.save()

                res.send(200)
            }
        }
    })

    app.post('/news/search', urlencodedParser, function(req, res) {
        News.find({
            $or: [
                {title: new RegExp(".*" + req.body.search.replace(/(\W)/g, "\\$1") + ".*", "i")},
                {description: new RegExp(".*" + req.body.search.replace(/(\W)/g, "\\$1") + ".*", "i")}
            ]
        }).
        exec(callback)

        function callback(err, news) {
            if (err) throw err

            console.log(req.body.search)
            console.log(news)
            res.render('pages/news-search', {
                title: 'Search News',
                pageUrl: 'news',
                news: news,
                data: req.body
            })
        }
    })

    app.get('/api/news', function(req, res) {
        News.find({}).
        exec(callback)

        function callback(err, data) {
            if (err) throw err
            res.json(data)
        }
    })

    app.get('/api/news/get', function(req, res) {
        News.findOne({
            _id: req.query.id
        }).
        populate('category').
        populate('comments').
        exec(callback)

        function callback(err, data) {
            if (err) throw err
            res.json(data)
        }
    })
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false
        }
    }

    return true
}
