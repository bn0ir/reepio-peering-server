/**
 * Created by andre (http://korve.github.io/) on 07.06.2014
 *
 * Handles incoming http requests and serves the peertome.net frontend
 */
var peer = require('peer'),
	loader = require('./config'),
	logger = require('./logger'),
    fs = require('fs');

loader.load('peering-server.json')
	.done(function (config) {
		var numConnections = 0,
			concurrentLimit = config.concurrentLimit === null ? Number.MAX_VALUE : config.concurrentLimit;

        var opts = {
            port: config.port,
            path: config.path,
            key: config.key,
            ip_limit: config.ipLimit,
            concurrent_limit: concurrentLimit
        };

        if(config.ssl){
            opts['ssl'] ={
                key: fs.readFileSync(config.sslKey),
                certificate: fs.readFileSync(config.sslCertificate)
            }
        }

		var server = new peer.PeerServer(opts);

		server.on('connection', function (id) {
			numConnections++;
			logger.info('[%s] connected', id);
		});

		server.on('disconnect', function (id) {
			numConnections--;
			logger.info('[%s] disconnected', id);
		});

		logger.info('Listening on ws://localhost:%d\t[ipLimit: %d]\t[concurrentLimit: %d]',
			config.port, config.ipLimit, concurrentLimit);

		setInterval(printStats, config.statsInterval);

		function printStats(){
			var memUsage = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2) + 'MB';

			logger.info('stats:\t[mem: %s]\t[conns: %d]', memUsage, numConnections);
			return printStats;
		}
	});

