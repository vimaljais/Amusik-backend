const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors =  require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const API_KEY_GOOGLE = 'AIzaSyAWALUfkaVXKlRICN6bGx1Q8Y5TCouFzF4';


app.get('/', (req, res) => {res.send('it is working!')})
app.post('/getaudio', (req,res) => {
	const { link } = req.body;
	const success = false;
	console.log(link)
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
		  success = true;
		});


		stream.pipe(fs.createWriteStream('public/music.mp3'))


	res.json('success');
})

app.post('/geturl', (req, res) => {
	const {name} = req.body;
		fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${name}&type=video&videoDefinition=high&key=${API_KEY_GOOGLE}`, {
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		}).then(response => response.json())
              .then(response => {
              	res.json(response);
              })
})

app.listen(process.env.PORT, () => {
	console.log(`the port is ${process.env.PORT}`);
})