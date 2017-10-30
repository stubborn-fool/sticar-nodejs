var mongoose = require('mongoose')

var newsSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

module.exports = mongoose.model('News', newsSchema)
