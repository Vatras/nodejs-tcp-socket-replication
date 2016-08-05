var multiparty = require('multiparty');
var http = require('http');
var fs = require('fs');
var sys = require('util')
var exec = require('child_process').exec;
var Promise = require('promise');
var net = require('net');

var HOST = process.argv[2] || '127.0.0.1'
var PORT = process.argv[3] || 1234;

fs.existsSync("public") || fs.mkdirSync("public");//create dir if not exists


//function to generate unique filename for concurrent connections to be safe
function getUUID() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() +  s4() +  s4() + 
	s4() + s4() + s4() + s4();
}

http.createServer(function(req, res) {
	

	if (req.url === '/upload' && req.method === 'POST') {
	    // parse a file upload
	    var dirName;
		//create tcp socket
		var client = new net.Socket();

		client.connect(PORT, HOST, function() {
		});

		client.on('close', function() {
		});

		client.on('error', function(err) {
			throw new Error('Socket connection error');
		});

	    var uniqueId = getUUID();
	    return new Promise(function(resolve,reject){
	    	var form = new multiparty.Form();
	    	form.parse(req, function(err, fields, files) {
	    		res.writeHead(200, {'content-type': 'text/plain'});
	    		res.write('received upload:\n\n');
	    		if(fields && fields.title && fields.title.length>0)
	    			dirName='public/'+fields.title[0]
	    		dirName=dirName || 'public/default';
	    		var fileCounter=0;
	    		if(files.upload)
	    		{
	    			fs.existsSync(dirName) || fs.mkdirSync(dirName);
	    			for(file in files.upload)
	    			{
	    				if(files.upload[file].size)
	    				{
	    					var crs = fs.createReadStream(files.upload[file].path);
	    					var wr = fs.createWriteStream(dirName+'/'+files.upload[file].originalFilename);
	    					crs.pipe(wr);
	    					crs.on('end',function(){
	    						fileCounter++;
	    						if(fileCounter==files.upload.length)
	    						{
	    							console.log(2);
	    							resolve(uniqueId);
	    						}
	    					})
	    					res.write(files.upload[file].originalFilename+'\n\n');
	    				}
	    			}
	    		}
	    		res.end();
	    	});
		}).then(function(promiseRes){ 
			return new Promise(function(resolve,reject){
				exec('tar cvzf output'+promiseRes+'.tar '+dirName, function(output){
					resolve(promiseRes);
				});
			})
		}).then(function(promiseRes2){
			fs.createReadStream('output'+promiseRes2+'.tar',
				{'flags': 'r', 
				'encoding': 'binary', 'mode': 0777, 
				'bufferSize': 64})
			.addListener('data', function(chunk){
				client.write(new Buffer(chunk,"binary"));
			})
			.addListener('close',function() {
				client.emit('end');
			})
		});
	}
	if (req.url === '/' && req.method === 'GET')
	{
		res.writeHead(200, {'content-type': 'text/html'});
		res.end(
			'<form action="/upload" enctype="multipart/form-data" method="post">'+
			'<input type="text" name="title"><br>'+
			'<input type="file" name="upload" multiple="multiple"><br>'+
			'<input type="submit" value="Upload">'+
			'</form>'
			);
	}
}).listen(8080);
