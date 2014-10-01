/**
 * Created by andre (http://korve.github.io/) on 24.06.2014
 */

(function () {
	var winston = require('winston'),
		loader = require('./config');

	var env = process.env.NODE_ENV || 'dev',
		config = loader.loadSync('logging.json'),
		transports = [],
		exceptionHandlers = [];

	switch(env)
	{
		case 'prod':
			transports = [
				new winston.transports.File({
					filename: path.resolve(config.logDir, 'debug.log'),
					json: false
				})
			];
			exceptionHandlers = [
				new (winston.transports.File)({
					filename: path.resolve(config.logDir, 'error.log'),
					json: false,
					timestamp: true
				})
			];
			break;

		case 'dev':
		default:
			transports = [
				new (winston.transports.Console)({ json: false, timestamp: true, colorize: true })
			];

			exceptionHandlers = [
				new (winston.transports.Console)({ json: false, timestamp: true, colorize: true })
			];
			break;
	}

	module.exports = new winston.Logger({
		transports: transports,
		exceptionHandlers: exceptionHandlers,
		exitOnError: env === 'dev'
	});
})();