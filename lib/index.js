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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = new _hapi2.default.Server();
server.connection({ port: 5333 });

server.route({
    method: 'GET',
    path: '/h',
    handler: function handler(request, reply) {
        var helps = [];
        _lodash2.default.forEach(server.table()[0].table, function (o) {
            helps.push(('' + o.path).underline.green.inverse + '\n' + (' ' + o.settings.description));
        });
        reply(helps);
    },
    config: {
        description: "현재 보고 있는 도움말이지 말입니다.",
        notes: '도움말',
        tags: ['api']
    }
});

server.route({
    method: 'GET',
    path: '/users/{userid}',
    handler: function handler(request, reply) {
        reply({
            'id': 'ctkim',
            'email': 'changtae.kim@gmail.com',
            'username': 'Chang Tae Kim'
        });
    },
    config: {
        description: "유저 정보를 보냅니다.",
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
}], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start(function (err) {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);

        // mainLoop.addTask(arbitor);
        // mainLoop.start();
    });
});