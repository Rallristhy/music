/* Importando express */
const express = require('express');
const app = express();

/* Importando bodyParser que é um middleware que faz o parser da body vinda do front end */
const bodyParser = require('body-parser');

/* Criando um server express */
const server = require('http').createServer(app);

const io = require('socket.io')(server);

const YoutubeMp3Downloader = require("youtube-mp3-downloader");

/* 
* Middleware para qualquer URL
* server.use - Toda requisição vindas para o backend passará pelo urlencoded
* urlencoded é o formato dos dados vindos do frondend
*/
app.use(bodyParser.urlencoded({ extended: true }));

/* 
* Middleware
* Se o body vindas do front end for um json, passará por esse middleware para fazer a interpretação
*/
app.use(bodyParser.json());

/* Mapeando caminhos para visibilidade nas views */
app.use("/node_modules",  express.static(__dirname + '/node_modules'));
app.use("/view",  express.static(__dirname + '/view'));
app.use("/resources",  express.static(__dirname + '/resources'));
app.use("/core",  express.static(__dirname + '/core'));


//console.log(video);

//video.download("fK27wdZA6og&list=PL_Q15fKxrBb5r3VmBvh7TVNMLx_F1sxfa"/*, "Rallristhy.mp3"*/);// 2BuhVYVbD2g

/* Estabelecendo comunicação socketIO */
io.on('connection', function(socket){
    connection = socket;
    var video = new YoutubeMp3Downloader({
        "ffmpegPath": "resources/ffmpeg/bin/ffmpeg.exe",        // Where is the FFmpeg binary located? 
        "outputPath": "resources/output",    // Where should the downloaded and encoded files be stored? 
        "youtubeVideoQuality": "highest",       // What video quality should be used? 
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started? 
        "progressTimeout": 2000                 // How long should be the interval of the progress reports 
    });

    /* Informa ao servidor o IP que conectou na aplicação */
    console.log(socket.handshake.address.substring(7, 20)+" ID: "+socket.id+" entrou...");

    video.on("finished", function(err, data) {
        console.log(JSON.stringify(data));
    });
     
    video.on("error", function(error) {
        console.log("error "+error);
    });
     
    video.on("progress", function(progresso) {
        //console.log(JSON.stringify(progresso));
        connection.emit("progresso", {progresso: Math.floor(progresso.progress.percentage),
                              velocidade: Math.floor((progresso.progress.speed/1024))
                            });
        console.log("Progresso: "+Math.floor(progresso.progress.percentage)+"% Velocidade: "+Math.floor((progresso.progress.speed/1024))+" kbps");
    });

    /* Rotas Data para Front */
    app.post('/teste', function(request, response){
        console.log(request.body.data);
        video.download(request.body.data/*, "Rallristhy.mp3"*/);
        response.send(video);
    });
    
    /* Fechando Conexão entre Cliente-Servidor */
    socket.on('disconnect', function(){

        /* Informa ao servidor o IP que desconectou na aplicação */
        console.log(socket.handshake.address.substring(7, 20)+" ID: "+socket.id+' saiu...');
    });    
});



/* Rota Padrão */
app.get ('/', function (request, response){
	response.sendFile(__dirname + '/view/index.html');
});

/* Criar uma constante para porta que será executada */
const port = 5000;

server.listen(port, function() {
	console.log("Server running on port: "+port);
});