var fs = require('fs');
var exec = require('child_process').exec;
var LLFI_BUILD_ROOT = require('./utils/config').LLFI_BUILD_ROOT;
var execPromise = require('./utils/execPromise').execPromise;

exports.processCompileToIR = function (req, res) {

	var errorStatus = false;
	var fileName = req.body.fileName;

	// Extract filename without extension
	fileName = fileName.replace(/\.[^/.]+$/, "");

	// Cd to the user directory
	var cdDirCmd = "cd ./uploads/" + req.ip +"/";

	// The command to genrate make file
	var generateMakeCmd = LLFI_BUILD_ROOT + "tools/GenerateMakefile --readable --all -o " + fileName + ".ll";


	var commands = [cdDirCmd + " && " + generateMakeCmd, cdDirCmd + " && " + "make"];

	var consoleLog = [];

	// Execute the commands
	commands.reduce(function(p, cmd) {
		return p.then(function(results) {
			return execPromise(cmd).then(function(stdout) {
				if (stdout) results.push(stdout);
				consoleLog = results;
				return results;
			});
		});
	}, Promise.resolve([])).then(function(results) {
		// all done here, all results in the results array

	}, function(err) {
		// error here
		res.status(500);
		res.send({error: err});
		console.log("err in compileToIR process", err);
		errorStatus = true;
	}).then(function() {
		if (errorStatus) return;
		var files = [];
		// Read the compilred IR file
		fs.readFile("./uploads/"+ req.ip+"/" + fileName + ".ll", 'utf8', function(err, data) {
			if (err) {
				res.status(500);
				res.send(err);
				errorStatus = true;
				console.log("err in file reading, ", err);
			}
			if (errorStatus) return;
			var fileObj = {};
			fileObj.fileName = fileName + ".ll";
			fileObj.fileContent = data;
			files.push(fileObj);

			// Load the makefile content
			fs.readFile("./uploads/"+ req.ip+"/Makefile", 'utf8', function(err, data) {
				if (err) {
					res.status(500);
					res.send(err);
					errorStatus = true;
					console.log("err in file reading, ", err);
				}
				if (errorStatus) return;
				var fileObj = {};
				fileObj.fileName = "Makefile";
				fileObj.fileContent = data;
				files.push(fileObj);
				var response = {files: files, consoleLog: consoleLog};
				console.log("CompileToIR success");
				res.send(response);
			});
		});
	});
};