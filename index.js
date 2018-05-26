const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const app = express(); 
const PORT = process.env.PORT || 8080; 
const Promise = require('bluebird'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname + '/views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});


app.post('/upload', function(req, res) {
  // Uploaded files:
  console.log(req.files);
  let sampleFile = req.files.sampleFile;
  let name = sampleFile.name.split(' ').join('_'); 
  fs.appendFile('mediaTitles.txt', `${name}\n`, function(err){
    if (err){
      return res.send(err);
    }
    fs.writeFile(`./imagesAndVideos/${name}`, new Buffer(sampleFile.data, "base 7"), (err) => {
      if (err) {
        return err; 
      } 
      console.log('saved!');
      res.redirect('/');
    });
  });
});

app.get('/getVideos', function(req, res){
  fs.readFile('mediaTitles.txt', function(err, data){
    if (err){
      res.status(403);
      res.end();
    } else {
      res.status(200);
      res.send(data); 
    }
  })
});


var server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`); 
})