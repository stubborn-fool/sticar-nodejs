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

module.exports = function(app) {
    app.get('/category', function(req, res) {
        fetch('http://127.0.0.1:3000/api/category')
            .then(function(res) {
                return res.json()
            }).then(function(json) {
                res.render('pages/category', {
                    title: 'List Category',
                    pageUrl: 'category',
                    category: json
                })
            })
    })

    app.get('/category/create', function(req, res) {
        res.render('pages/category-create', {
            title: 'Create Category',
            pageUrl: 'category'
        })
    })

    app.post('/category/create', urlencodedParser, function(req, res) {
        Category({
            name: req.body.name
        }).save(function(err, data) {
            if (err) throw err

            res.redirect('/category')
        })
    })

    app.get('/category/get', function(req, res) {
        if (req.query.id) {
            fetch('http://127.0.0.1:3000/api/category/get?id=' + req.query.id)
                .then(function(res) {
                    return res.json()
                }).then(function(json) {
                    if (!isEmptyObject(json)) {
                        res.render('pages/category-get', {
                            title: json.name,
                            pageUrl: 'category',
                            news: json.news,
                            category: json
                        })
                    } else {
                        res.redirect('/category')
                    }

                })
        } else {
            res.redirect('/category')
        }
    })

    app.get('/api/category', function(req, res) {
        Category.find({}).
        exec(callback)

        function callback(err, data) {
            if (err) throw err
            res.json(data)
        }
    })

    app.get('/api/category/get', function(req, res) {
        Category.findOne({
            _id: req.query.id
        }).
        populate('news').
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
