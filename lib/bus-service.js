var events = require('events');
var util = require('util');
var nsq = require('nsqjs');
var config = require('../config');

function Bus(options) {
    var bus = this;
    events.EventEmitter.call(this);

    var projectDeletesReader = new nsq.Reader('project-deletes', 'project', {lookupdHTTPAddresses: options.addresses});
    var accountCreatesReader = new nsq.Reader('account-creates', 'project', {lookupdHTTPAddresses: options.addresses});
    var accountDeletesReader = new nsq.Reader('account-deletes', 'project', {lookupdHTTPAddresses: options.addresses});

    projectDeletesReader.connect();
    projectDeletesReader.on('message', function (message) {
        var e = {
            project: JSON.parse(message.body),
            message: message
        };

        bus.emit('project-delete', e);
    });

    console.log(options.addresses);
    projectDeletesReader.on('error', function(err){
        console.log('Event: error');
        console.log(arguments);
    });
    projectDeletesReader.on('discard', function(err){
        console.log('Event: discard');
        console.log(arguments);
    });
    projectDeletesReader.on('nsqd_closed', function(err){
        console.log('Event: nsqd_closed');
        console.log(arguments);
    });
    projectDeletesReader.on('nsqd_connected', function(err){
        console.log('Event: nsqd_connected');
        console.log(arguments);
    });

    accountDeletesReader.connect();
    accountDeletesReader.on('message', function (message) {
        var e = {
            account: JSON.parse(message.body),
            message: message
        };

        bus.emit('account-delete', e);
    });
    accountDeletesReader.on('error', function(err){
       console.log(arguments);
    });

    accountCreatesReader.connect();
    accountCreatesReader.on('message', function (message) {
        var e = {
            account: JSON.parse(message.body),
            message: message
        };

        bus.emit('account-create', e);
    });
}

util.inherits(Bus, events.EventEmitter);

module.exports = Bus;