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
    var accountMergesReader = new nsq.Reader('account-merges', 'project', {lookupdHTTPAddresses: options.addresses});

    projectDeletesReader.connect();
    projectDeletesReader.on('message', function (message) {
        var e = {
            project: message.json(),
            message: message
        };

        bus.emit('project-delete', e);
    });

    accountDeletesReader.connect();
    accountDeletesReader.on('message', function (message) {
        var e = {
            account: message.json(),
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
            account: message.json(),
            message: message
        };

        bus.emit('account-create', e);
    });

    accountMergesReader.connect();
    accountMergesReader.on('message', function (message) {
        var e = {
            account: message.json(),
            message: message
        };

        bus.emit('account-merge', e);
    });
}

util.inherits(Bus, events.EventEmitter);

module.exports = Bus;