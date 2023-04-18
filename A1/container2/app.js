var express = require('express');

var app = express();

var fs = require('fs');

var crypto = require('crypto');

app.use(express.json());

app.post('/', function(request, response){
  const fileName = request.body.file;
  const fileContents = fs.readFileSync("../shared-volume/" + fileName);
  const hash = crypto.createHash('md5').update(fileContents).digest("hex");
  return response.send({"file":fileName , "checksum":hash});
});
app.listen(6000);