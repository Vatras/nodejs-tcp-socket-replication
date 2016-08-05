var fs = require('fs');
var net = require('net');
var exec = require('child_process').exec;

var HOST = process.argv[2] || "127.0.0.1"
var PORT = process.argv[3] || 1234;

fs.existsSync("socketOutputs") || fs.mkdirSync("socketOutputs");

function getUUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() +  s4() +  s4() + 
    s4() + s4() + s4() + s4();
}

console.log("HOST: "+HOST+" PORT: "+PORT)
  var server = net.createServer(function(client) {

  function closeFile(){
    outputFile.close(function(){
      exec("tar xvf "+outputFileName+" -C socketOutputs/",function(){
      });
    });
    
  }
  var outputFile;
  var outputFileName="tempFile"+getUUID()+".tar";
  client.on('end', closeFile);

  client.on('data',function (data){
      if(!outputFile)
        outputFile = fs.createWriteStream(outputFileName)
      outputFile.write(new Buffer(data,"binary"))
  });
});

server.on('error', function(err) {
  throw new Error("Socket connection error");
});
server.listen(PORT,HOST, function() {
  console.log('socket server started');
});
