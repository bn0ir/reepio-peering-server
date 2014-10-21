/**
 * Created by andre (http://korve.github.io/) on 24.06.2014
 */

(function () {
	"use strict";

	var fs = require('fs'),
		path = require('path'),
		Q = require('q');

	var readFile = Q.denodeify(fs.readFile),
		writeFile = Q.denodeify(fs.writeFile);

	var config = function(env){
		this.env = env || 'dev';
		this.configPath = path.resolve(__dirname, '../config', this.env);
	};

	config.prototype.load = function (file) {
		if(file.slice(-4) !== 'json')
			throw new InvalidArgumentError(file + ' is not a json file');

		var filePath = this.__getConfigPath(file);

		return readFile(filePath, "utf8")
			.then(
				function onSuccess(data) {
					return JSON.parse(data);
				},
				function onError(err) {
					if(err.code === 'ENOENT')
					{
						// file not found. Search for .dist.json config file and copy it
						var distFilePath = filePath.slice(0, filePath.length - 4) + 'dist.json';

 						return readFile(distFilePath)
							.then(function (data) {

								return writeFile(filePath, data);

							}, function onError(err) {
								// no dist file found. Abort loading
								throw err;
							})
							.then(
								function onSuccess() {
									return this.load(file);
								},
								function onError() {
									throw new Error('Config file ' + filePath + ' nor ' + distFilePath + ' found.');
								}
							);
					}

					throw err;
				}
			);
	};

	config.prototype.loadSync = function (file) {
		if(file.slice(-4) !== 'json')
			throw new InvalidArgumentError(file + ' is not a json file');

		var filePath = this.__getConfigPath(file);

		try
		{
			var data = fs.readFileSync(filePath);
		}
		catch(err)
		{
			var distFilePath = filePath.slice(0, filePath.length - 4) + 'dist.json';

			try
			{
				data = fs.readFileSync(distFilePath);
				fs.writeFileSync(filePath, data);
			}
			catch(err)
			{
				throw new Error('Config file ' + filePath + ' nor ' + distFilePath + ' found.');
			}
		}

		return JSON.parse(data);
	};

	config.prototype.__getConfigPath = function (file) {
		return path.resolve(this.configPath, file);
	};

	module.exports = new config();
})();