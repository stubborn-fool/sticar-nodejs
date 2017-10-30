var mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
    name: String,
    news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }]
})

module.exports = mongoose.model('Category', categorySchema)
