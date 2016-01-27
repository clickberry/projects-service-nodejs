var mongoose = require('mongoose');
var Schema=mongoose.Schema;

var projectsSchema = new Schema({
    userId: String,
    name: String,
    nameSort: String,
    description: String,
    imageUri: String,
    created: Date,
    isPrivate: Boolean,
    isHidden: Boolean,
    deleted: Date,
    videos: [new Schema({
        contentType: String,
        uri: String,
        width: Number,
        height: Number
    }, {_id: false})]
});

module.exports = mongoose.model('Project', projectsSchema);