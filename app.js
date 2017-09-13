/* Importando bodyParser que é um middleware que faz o parser da body vinda do front end */
const bodyParser = require('body-parser');

/* Importando express */
const express = require('express');

/* Criando um server express */
const server = express();

const YoutubeMp3Downloader = require("youtube-mp3-downloader");

/* 
* Middleware para qualquer URL
* server.use - Toda requisição vindas para o backend passará pelo urlencoded
* urlencoded é o formato dos dados vindos do frondend
*/
server.use(bodyParser.urlencoded({ extended: true }));

/* 
* Middleware
* Se o body vindas do front end for um json, passará por esse middleware para fazer a interpretação
*/
server.use(bodyParser.json());

/* Mapeando caminhos para visibilidade nas views */
server.use("/node_modules",  express.static(__dirname + '/node_modules'));
server.use("/view",  express.static(__dirname + '/view'));
server.use("/resources",  express.static(__dirname + '/resources'));

var video = new YoutubeMp3Downloader({
    "ffmpegPath": "resources/ffmpeg/bin/ffmpeg.exe",        // Where is the FFmpeg binary located? 
    "outputPath": "resources/output",    // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "highest",       // What video quality should be used? 
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started? 
    "progressTimeout": 2000                 // How long should be the interval of the progress reports 
});

//console.log(video);

//video.download("2BuhVYVbD2g", "Rallristhy.mp3");// 2BuhVYVbD2g


video.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
});
 
video.on("error", function(error) {
    console.log("error "+error);
});
 
video.on("progress", function(progresso) {
    //console.log(JSON.stringify(progresso));
    console.log("Progresso: "+Math.floor(progresso.progress.percentage)+"% Velocidade: "+Math.floor((progresso.progress.speed/1024))+" kbps");
});

/* Rota Padrão */
server.use ('/', function (request, response){
	response.sendFile(__dirname + '/view/index.html');
});

/* Criar uma constante para porta que será executada */
const port = 5000;

server.listen(port, function() {
	console.log("Server running on port: "+port);
});