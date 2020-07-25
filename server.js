const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors =  require('cors');



const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));


app.get('/', (req, res) => {res.send('it is working!')})
app.post('/getaudio', (req,res) => {
	const { link } = req.body;
	console.log('processing');
	let stream = ytdl(link, {  filter: 'audioonly' });
	stream.on('info', function (info, format) {
	  console.log('Download started')
	  console.log(info.videoDetails.title)
	  //console.log(format);
	})
	stream.on('progress', function (length, downloaded, total) {
	  //console.log(`length=${total}`);
	});
	stream.on('response', Ytbres => { 
	  console.log(Ytbres.headers)
	});


	stream.pipe(fs.createWriteStream('public/music.mp3'))
	res.send('http://localhost:3000/music.mp3')
})



app.listen(process.env.PORT, () => {
	console.log(`app is running on ${process.env.PORT}`);
})