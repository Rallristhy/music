/* Localizar a aplicação angular.module.('app')
 * [] é utilizado para importar componentes para dentro da controller criada
 * se tivesse mais diretivas em [] é necessário colocar como parâmetros na function
*/
angular.module('app', []);

/* Criando uma controller e adicionando na app */
angular.module('app').controller('Controller', ['$http', '$scope',

	function($http, $scope){

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

		}

		var progresso, velocidade;
		socket.on("progresso", function(data){

			/* O socket não conhece o ciclo de vida do Angular, por isso é necessário injetar o $scope */
			$scope.$apply(function () {
                ctr.progresso = data.progresso;

                if(data.velocidade >= 1024){
                	ctr.velocidade = Math.floor((data.velocidade/1024))+" Mbps";
                }
                else {
                	ctr.velocidade = data.velocidade+" Kbps";
                }
            });

		});



	}



]);