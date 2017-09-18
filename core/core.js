/* Localizar a aplicação angular.module.('app')
 * [] é utilizado para importar componentes para dentro da controller criada
 * se tivesse mais diretivas em [] é necessário colocar como parâmetros na function
*/
angular.module('app', []);

/* Criando uma controller e adicionando na app */
angular.module('app').controller('Controller', ['$http',

	function($http){

		/* Instanciando SocketIO */
  		var socket = io();

		/* Garantindo que o ctr é a controller atual */
		const ctr = this;

		/* Criação da função inc dentro da controller */
		ctr.download_convert_mp3 = function(){

			var link = null;

			if (ctr.link_video.split("v=", 2)[1] == undefined){
				link = ctr.link_video;
			}
			else {
				link = ctr.link_video.split("v=", 2)[1];
			}

			$http.post('/teste', {data:link}).
		        then(function(response) {
		            console.log("posted successfully");
		        }).catch(function(response) {
		            console.error("error in posting");
		        });


			/*$http.post({url:'/teste',data:ctr.link_video})
		        .success(function (data) {
		            console.log("Success" + data);
		        })
		        .error(function(data) {
		            console.log("Erro: "+data);
		        })*/
			
		
			//$http({method: 'POST', url: '/teste'}).then(function successCallback(data) {
			/* Recebe o objeto GET por /data */
			/*$scope.dataHeader.bovespaHeaderData = data.data[0];
			$scope.dataCotacao.bovespaCotacaoData = data.data[1];
			$scope.dataTrailer.bovespaTrailerData = data.data[3]; 
			*/
			//console.log(data.data);
		

		//}, function errorCallback(response) {
			//console.log('Erro ao receber arquivo: ' + response);
		//});
		}

		socket.on("progresso", function(data){

		    console.log(data);

		});

	}



]);