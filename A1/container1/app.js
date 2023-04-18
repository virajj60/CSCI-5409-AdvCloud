var express = require('express');

var app = express();

var axios = require('axios');

var fs = require('fs');

app.use(express.json());

app.post('/checksum', async function(request, response){
  const fileName = request.body.file;
  if(!fileName) {
    return response.status(400).send({"file":null,
        "error": "Invalid JSON input."
     });
  }else if(!fs.existsSync("../shared-volume/" + fileName)){
    return response.status(400).send({"file":fileName,
      "error": "File not found."
    });
  }else{
    const resp = await axios.post('http://container2:6000',request.body);
    return response.send(resp.data);
  }
});
app.listen(5000);