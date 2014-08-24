var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express();


app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static('public'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/public/');
});


//CSV file converted into json and stored at http://127.0.0.1/file
app.get('/file', function  (req, res) {
  var path = './data/uploaded_file.json';
  if(fs.existsSync(path)) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      data = JSON.parse(data);
      res.json(data);
    });
  }
});


app.get('/', function  (req, res) {
  res.render('index', {obj : ''});
});


app.post('/formhandler', function  (req, res) {

  if (req.method == 'POST') {
    console.log("[200] " + req.method + " to " + req.url);

    //Uploading File and Converting it to JSAON format
    fs.readFile(req.files.upload.path, function(err, data) {
      if(err) throw err;
      data = data.toString();
      if(data.indexOf('"')==-1) {
        var lines = data.split(/[\r\n(\r\n)]/);
        var path = './data/uploaded_file.json';
        fs.writeFileSync(path, '[\n');
        for(i=0;i<lines.length-1;i++)
        {
          var f = lines[i].split(',');
       	  fs.appendFileSync(path, '\n');
          fs.appendFileSync(path, '{\n"id": "'+i.toString()+'",\n');
          if(f.length >= 1) 
            fs.appendFileSync(path, '"'+(0).toString()+'": "'+f.length.toString()+'",\n');
          else fs.appendFileSync(path, '"'+(0).toString()+'": "'+f.length.toString()+'"\n');
          for(j=0;j<f.length;j++)
          {
            if(j!=f.length-1)
              fs.appendFileSync(path, '"'+(j+1).toString()+'": "'+f[j]+'",\n');
            else fs.appendFileSync(path, '"'+(j+1).toString()+'": "'+f[j]+'"\n');
          }
      	  if(i!=lines.length-2)
            fs.appendFileSync(path, '},\n');
          else fs.appendFileSync(path, '}\n');
        } 
        fs.appendFileSync(path, ']');

        //If file is empty or not uploaded
        if(data=="") {
          res.render('index', { obj: 'Error : No Data Uploaded' });
        }
        else res.render('index', { obj: '' });
      }
      
      //If File consists of '"'
      else {
        var path = './data/uploaded_file.json';
        fs.writeFileSync(path, '[\n]');
        res.render('index', { obj: 'Error : Remove " from File' });
      }

    });

  }
  else {
    console.log("[405] " + req.method + " to " + req.url);
    res.writeHead(405, "Method not supported", {'Content-Type': 'text/html'});
    res.end(' - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
  }

});


http.createServer(app).listen(8000, function () {
  console.log("Server ready at http://localhost:8000");
});
