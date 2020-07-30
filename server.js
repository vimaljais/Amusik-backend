const bodyParser = require('body-parser');
const fs = require('fs');
const cors =  require('cors');
const fetch = require('node-fetch');
var cmd=require('node-cmd');
const yts = require( 'yt-search' );
const youtubedl = require('youtube-dl')
const ytdl = require('ytdl-core');

const express = require('express');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

const API_KEY_LAST_FM = '7d4f3bdab1f65cad5f3204b2fa02e301';

app.get('/', (req, res) => {res.send('it is working!')})


app.post('/link', (req,res) => {
	const { link } = req.body;
	cmd.get(
 			`ytdl ${link} --filter audioonly --print-url --quality highestaudio`
        ,
        function(err, data, stderr){

            res.json(data);
        }
    );	
})


app.post('/linknew', (req,res) => {
	const { link } = req.body; 
 
	 
	youtubedl.getInfo(link,  ['-x', '--audio-format', 'mp3'] , function(err, info) {
	  if (err) throw err
	  	res.json(info.url)
	})
})





app.post('/geturl', (req, res) => {
	const {name} = req.body;
		yts( name , function ( err, r ) {
		  const videos = r.videos[0].url;
		  res.json(videos)
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
			url600 = url.replace("100x100bb", "70x70bb");
			res.json(url600)
		})
})


app.get('/gettop50artists', (req,res) => {
	fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY_LAST_FM}&format=json`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})

})


app.get('/gettop50', (req,res) => {
	fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY_LAST_FM}&format=json`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})

})


app.get('/gettracksearch/:quary', (req,res) => {
	const {quary} = req.params;
	fetch(`https://itunes.apple.com/search?term=${quary}&entity=song`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})
		.catch(err => res.status(400).json('an error occured'));
	})
/*
app.get('/gettracksearch/:quary', (req,res) => {
	const {quary} = req.params;
	fetch(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${quary}&api_key=${API_KEY_LAST_FM}&format=json`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})
})*/

app.get('/getartistsearch/:quary', (req,res) => {
	const {quary} = req.params;
	fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${quary}&api_key=${API_KEY_LAST_FM}&format=json`)
	.then(response=> response.json())
		.then(response => {
			res.json(response)
		})

})





app.listen(process.env.PORT, () => {
	console.log(`the port is ${process.env.PORT}`);
})