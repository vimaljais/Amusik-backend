

const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');
const cors =  require('cors');
const fetch = require('node-fetch');
const findRemoveSync = require('find-remove')



setInterval(() => {
	const result = findRemoveSync('public', {age: {seconds: 3600}, extensions: ['.mp3', '.log']})
	console.log(result);
	}, 360000);



const express = require('express');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const API_KEY_GOOGLE = 'AIzaSyDVPd9RdXnQ_0mhFWzGzvAKwAfUEXIfj7s';
const API_KEY_LAST_FM = '7d4f3bdab1f65cad5f3204b2fa02e301';


app.get('/', (req, res) => {res.send('it is working!')})
app.post('/getaudio', (req,res) => {
	var completed = 0
	const { link } = req.body;
	console.log(link)
		console.log('processing');
		let stream = ytdl(link, {  filter: 'audioonly' });
		stream.on('info', function (info, format) {
		  console.log('Download started')
		  console.log(info.videoDetails.title)
		  //console.log(format);
		})
		stream.on('progress', function (length, downloaded, total) {
			completed= (downloaded/total)*100
		  console.log(`completed=${completed}`);
		  if(downloaded === total)
		  {
		  	console.log('give back the response')
		  	res.json('success')
		  }
		});
		stream.on('response', Ytbres => { 
		  console.log(Ytbres.headers)
		});

		stream.pipe(fs.createWriteStream('public/music.mp3'))

		console.log('workingdsadsadsadasdsadsa')	
	
})

app.post('/geturl', (req, res) => {
	const {name} = req.body;
	console.log(name);
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

app.get('/getart/:name', (req,res) => {
	var {name} = req.params;

	name = name.replace(/ \([\s\S]*?\)/g, '');

	var url = '';
	var url600= '';
	fetch(`https://itunes.apple.com/search?term=${name}`)
	.then(response=> response.json())
		.then(response => {
			url = response.results[0].artworkUrl100;
			url600 = url.replace("100x100bb", "200x200bb");
			res.json(url600)
		})
})

app.get('/gettop50', (req,res) => {
	fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY_LAST_FM}&format=json`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})

})

app.listen(process.env.PORT, () => {
	console.log(`the port is ${process.env.PORT}`);
})