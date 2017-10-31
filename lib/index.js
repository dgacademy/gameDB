#!/usr/bin/env node
'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

var _good = require('good');

var _good2 = _interopRequireDefault(_good);

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _vision = require('vision');

var _vision2 = _interopRequireDefault(_vision);

var _hapiSwagger = require('hapi-swagger');

var _hapiSwagger2 = _interopRequireDefault(_hapiSwagger);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _hapiMongodb = require('hapi-mongodb');

var _hapiMongodb2 = _interopRequireDefault(_hapiMongodb);

var _dbconfig = require('../dbconfig.json');

var _dbconfig2 = _interopRequireDefault(_dbconfig);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _hapi2.default.Server();
server.connection({ port: 5333 });

server.route({
    method: 'GET',
    path: '/help',
    handler: function handler(request, reply) {
        var helps = [];
        _lodash2.default.forEach(server.table()[0].table, function (o) {
            helps.push(('' + o.path).underline.green.inverse + '\n' + (' ' + o.settings.description));
        });
        reply(helps);
    },
    config: {
        description: '현재 보고 있는 도움말이지 말입니다.',
        notes: '도움말',
        tags: ['api']
    }
});

server.route({
    method: 'GET',
    path: '/user/{email*}',
    handler: function handler(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').findOne({ 'email': request.params.email }, function (err, ret) {
            if (err) return reply(_boom2.default.internal('Internal Database Error', err));
            if (ret == null) return reply(_boom2.default.notFound('Not found'));
            var user = {
                email: ret.email,
                userName: ret.userName,
                nickName: ret.nickName
            };
            reply(user);
        });
    },
    config: {
        description: '특정 유저 정보를 보냅니다.',
        notes: '유저',
        tags: ['api']
    }
});

server.route({
    method: 'GET',
    path: '/users',
    handler: function handler(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').find().toArray(function (err, ret) {
            if (err) return reply(_boom2.default.internal('Internal Database Error', err));
            var users = [];
            for (var i in ret) {
                var user = {
                    email: ret[i].email,
                    userName: ret[i].userName,
                    nickName: ret[i].nickName
                };
                users.push(user);
            }
            reply(users);
        });
    },
    config: {
        description: '모든 유저 정보를 보냅니다.',
        notes: '유저',
        tags: ['api']
    }
});

server.route({
    method: 'POST',
    path: '/user/add',
    handler: function handler(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').findOne({ 'email': request.payload.email }, function (err, ret) {
            if (err) return reply(_boom2.default.internal('Internal Database Error', err));
            if (ret) return reply(_boom2.default.conflict('Duplicated Resource Error', err));
            var user = {
                email: request.payload.email,
                userName: request.payload.userName,
                nickName: request.payload.nickName
            };
            db.collection('users').insert(user, { w: 1 }, function (err) {
                if (err) return reply(_boom2.default.internal('Internal Database Error', err));else reply();
            });
        });
    },
    config: {
        description: '유저를 추가합니다.',
        notes: '유저',
        tags: ['api']
    }
});

server.route({
    method: 'POST', // 'PATCH', not supported in Unity!
    path: '/user/update',
    handler: function handler(request, reply) {
        var user = {
            email: request.payload.email,
            userName: request.payload.userName,
            nickName: request.payload.nickName
        };

        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').update({ 'email': request.payload.email }, user, function (err, ret) {
            if (err) return reply(_boom2.default.internal('Internal Database error', err));
            reply();
        });
    },
    config: {
        description: '특정 유저 정보를 갱신합니다.',
        notes: '유저',
        tags: ['api']
    }
});

server.route({
    method: 'POST', // 'DELETE', , not supported in Unity!
    path: '/user/remove',
    handler: function handler(request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('users').remove({ 'email': request.payload.email }, function (err, ret) {
            if (err) return reply(_boom2.default.internal('Internal Database error', err));
            reply();
        });
    },
    config: {
        description: '특정 유저 정보를 삭제합니다.',
        notes: '유저',
        tags: ['api']
    }
});

// https://egghead.io/forums/lesson-discussion/topics/hapi-js-logging-with-good-and-good-console
var goodOptions = {
    reporters: {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                log: ['error', 'warn'],
                response: '*'
            }]
        }, {
            module: 'good-console',
            args: [{ log: '*', response: '*' }]
        }, 'stdout']
    }

    // https://objectpartners.com/2016/11/16/adding-logging-and-swagger-to-a-hapi-node-server/
};server.register([{
    register: _good2.default,
    options: goodOptions
}, {
    register: _inert2.default
}, {
    register: _vision2.default
}, {
    register: _hapiSwagger2.default,
    options: {
        info: {
            'title': 'API Documentation',
            'version': '1.0.0'
        }
    }
}, {
    register: _hapiMongodb2.default,
    options: _dbconfig2.default
}], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start(function (err) {

        if (err) {
            throw err;
        }
        console.log('Server started !');
        server.log('info', 'Server running at: ' + server.info.uri);

        // mainLoop.addTask(arbitor);
        // mainLoop.start();
    });
});