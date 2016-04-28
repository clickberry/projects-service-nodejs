var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var counterSchema = new Schema({
    id: String,
    name: String
});

var projectsSchema = new Schema({
    userId: String,
    videoId: String,
    name: String,
    nameSort: String,
    description: String,
    imageUri: String,
    created: Date,
    isPrivate: Boolean,
    isHidden: Boolean,
    deleted: Date,
    viewsCounter: counterSchema,
    resharesCounter: counterSchema,
    videos: [new Schema({
        contentType: String,
        uri: String,
        width: Number,
        height: Number
    }, {_id: false})]
});

module.exports = mongoose.model('Project', projectsSchema);