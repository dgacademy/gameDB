#!/usr/bin/env node

import _ from 'lodash';
import Hapi from 'hapi';
import good from 'good';
import inert from 'inert';
import vision from 'vision';
import hapiSwagger from 'hapi-swagger';
import colors from 'colors';

const server = new Hapi.Server();
server.connection({port:5333});

server.route( {
    method: 'GET',
    path: '/h',
    handler: (request, reply) => {
        let helps = [];
        _.forEach(server.table()[0].table, o => {
            helps.push(`${o.path}`.underline.green.inverse + `\n` + ` ${o.settings.description}`);
        });
        reply(helps);
    },
    config: {
        description: "현재 보고 있는 도움말이지 말입니다.",
        notes: '도움말',
        tags:['api']
    }
});

server.route( {
    method: 'GET',
    path: '/users/{userid}',
    handler: (request, reply) => {
        reply( {
            'id': 'ctkim',
            'email': 'changtae.kim@gmail.com',
            'username': 'Chang Tae Kim'
        } );
    },
    config: {
        description: "유저 정보를 보냅니다.",
        notes: '유저',
        tags:['api']
    }
});


// https://egghead.io/forums/lesson-discussion/topics/hapi-js-logging-with-good-and-good-console
let goodOptions = {
    reporters: {
        console: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    log: ['error', 'warn'],
                    response: '*'
                }]
            }, 
            {
                module: 'good-console',
                args: [{ log: '*', response: '*' }]
            },
            'stdout'
        ]
    }
}

// https://objectpartners.com/2016/11/16/adding-logging-and-swagger-to-a-hapi-node-server/
server.register(
[ 
    {
        register: good,
        options: goodOptions
    }, 
    {
        register: inert
    },
    {
        register: vision
    },
    {
        register: hapiSwagger,
        options: {
            info: {
                'title': 'API Documentation',
                'version': '1.0.0'
            }
        }
    }
], err => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    server.start( err => {

        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);

        // mainLoop.addTask(arbitor);
        // mainLoop.start();
    });
});