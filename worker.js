var debug = require('debug')('clickberry:projects:worker');
var mongoose = require('mongoose');
var moment = require('moment');
var config = require('clickberry-config');
var Bus = require('./lib/bus-service');
var Project = require('./models/projects');

var bus = new Bus({
    lookupdHTTPAddresses: config.get('nsqlookupd:addresses').split(','),
    maxAttempts: 5
});

var options = {
    server: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    }
};
mongoose.connect(config.get('mongodb:connection'), options);

bus.on('project-delete', function (e) {
    debug(e.project.id);
    Project.remove({_id: e.project.id}, function (err) {
        if (err) {
            debug(err);
            return e.message.requeue(30);
        }

        e.message.finish();
    });
});

bus.on('account-delete', function (e) {
    Project.remove({userId: e.account.id}, function (err) {
        if (err) {
            debug(err);
            return e.message.requeue(30);
        }

        e.message.finish();
    });
});

bus.on('account-create', function (e) {
    var sampleProjectId = config.get('sample:projectid');
    var isPrivate = config.getBool('sample:private', false);
    var isHidden = config.getBool('sample:hidden', true);
    var userId = e.account.id;

    if (!sampleProjectId) {
        debug('Sample Project ID is not set.');
        return e.message.finish();
    }

    Project.findById(sampleProjectId, function (err, project) {
        if (err) {
            debug(err);
            return e.message.requeue(30);
        }

        if (!project) {
            debug('Sample Project not found.');
            return e.message.finish();
        }

        var sampleProject = new Project({
            userId: userId,
            videoId: project.videoId,
            name: project.name,
            nameSort: project.name && project.name.toLowerCase(),
            description: project.description,
            imageUri: project.imageUri,
            isPrivate: isPrivate,
            isHidden: isHidden,
            videos: project.videos,
            created: moment.utc(),
            viewsCounter: {id: 'views', name: 'Views counter'},
            resharesCounter: {id: 'reshares', name: 'Reshares counter'}
        });

        sampleProject.save(function (err) {
            if (err) {
                debug(err);
                return e.message.requeue(30);
            }

            e.message.finish();
        });
    });
});

bus.on('account-merge', function (e) {
    var toUserId = e.account.toUserId;
    var fromUserId = e.account.fromUserId;

    Project.update({userId: fromUserId}, {userId: toUserId}, {multi: true}, function (err) {
        if (err) {
            return e.message.requeue(30);
        }

        e.message.finish();
    });
});

debug('Listening for messages...');