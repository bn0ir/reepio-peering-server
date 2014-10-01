/**
 * Created by andre (http://korve.github.io/) on 24.06.2014
 */

var cli = require('cli'),
	path = require('path'),
	fs = require('fs'),
	logger = require('./logger');

cli.parse({
	env:   ['e', 'The active environment', 'string', process.NODE_ENV || 'dev']
});

cli.main(function(args, options) {

	for(var i = 0; i < args.length; i++)
	{
		switch(args[i])
		{
			case 'compile:js':
				var closureCompiler = require('closurecompiler'),
					loader = require('./config'),
					clientConfigPath = path.resolve(__dirname, '../public/config.js'),
					peeringServerConfig = loader.loadSync('peering-server.json');

				var compileJsConfig = peeringServerConfig.compile.js || null;

				if( ! compileJsConfig)
					return;

				var destinationDir = path.resolve(__dirname, '../public/scripts/compiled/');

				if( ! fs.existsSync(destinationDir))
					fs.mkdirSync(destinationDir);

				for(var name in compileJsConfig){
					if( ! compileJsConfig.hasOwnProperty(name))
						continue;

					var files = compileJsConfig[name];

					closureCompiler.compile(files,
						{
							compilation_level: "SIMPLE_OPTIMIZATIONS"
						},
						function (err, result) {
							if(result)
							{
								var file = path.resolve(this.dir, this.name + '.js');

								fs.writeFile(file, result, { flag: 'w+' }, function (err) {
									if(err)
									{
										logger.error(err);
										return;
									}

									console.info('Compiled "%s" into "%s"', this.name, file);
								}.bind(this));
							}
							else
							{
								logger.error(err);
							}

						}.bind({name: name, dir: destinationDir}));
				}




				break;

			case 'config:dump':
				/**
				 * Dumps client config for the frontend app to use
				 */
				var loader = require('./config'),
					clientConfigPath = path.resolve(__dirname, '../public/config.js'),
					peeringServerConfig = loader.loadSync('peering-server.json');

				var clientConfig = {
					host: peeringServerConfig.host,
					path: peeringServerConfig.path,
					port: peeringServerConfig.port,
					key: peeringServerConfig.key,
					limit: peeringServerConfig.ipLimit
				};

				var configJSONData = JSON.stringify(clientConfig),
					data = "angular.module('config', []).value('config', " + configJSONData + ")";

				fs.writeFile(clientConfigPath, data, { flag: 'w+' }, function (err) {
					if(err)
					{
						logger.error('Could not dump client config into %s', clientConfigPath, err);
						return;
					}
					logger.info('Dumped client configuration into %s', clientConfigPath);
				});

				break;
		}
	}

});
