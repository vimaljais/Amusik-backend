const bodyParser = require('body-parser');
const fs = require('fs');
const cors =  require('cors');
const fetch = require('node-fetch');
var cmd=require('node-cmd');
const yts = require( 'yt-search' );
const youtubedl = require('youtube-dl')
const ytdl = require('ytdl-core');
var ytt = require("ytt")

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
 			`ytdl ${link} --filter audioonly --print-url --no-cache --quality highestaudio`
        ,
        function(err, data, stderr){

            res.json(data);
        }
    );	
})

app.post('/linknew', (req,res) => {
	const { link } = req.body; 	 
	console.log(req.connection.remoteAddress)
	console.log(req.connection.remotePort)
	var proxy = `http://${req.connection.remoteAddress}:${req.connection.remotePort}`
	console.log(proxy)

	youtubedl.getInfo(link,  ['-x', '--audio-format', 'mp3'], ['--proxy', proxy], function(err, info) {
	  if (err) throw err
	  	res.json(info.formats[0].url)
	})
})






app.post('/linknewnew', (req,res) => {
	const { link } = req.body;
	getInfo(link).then(info => {
  	// info.items[0] should contain the output of youtube-dl --dump-json
 	res.json(info.items[0].url)
})
})

app.post('/linknewnewnew', (req,res) => {
	var { link } = req.body;
	link=link.replace('https://youtube.com/watch?v=','')
	ytt.download(link)
	.then(response => res.send(response.formats[response.formats.length-1].url))
	// { info: YoutubeVideo, formats: YoutubeFormats }
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
	console.log(process.env.PORT);
})