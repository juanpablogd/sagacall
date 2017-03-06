var socket = io.connect('http://saga.cundinamarca.gov.co:3321/mobilemap');

var app = {
    // Application Constructor
    initialize: function() {
    	var myapp = this;
        this.bindEvents();
        var parentElement = document.getElementById("deviceready");
        var parentElement2 = document.getElementById("deviceready2");
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        var listeningElement2 = parentElement2.querySelector('.listening');
        var receivedElement2 = parentElement2.querySelector('.received');
        socket.on('news', function (data) {
            console.log(data);
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
            listeningElement2.setAttribute('style', 'display:none;');
            receivedElement2.setAttribute('style', 'display:block;');
		});
		socket.on('validad_conexion', function (data) {
            console.log(data);
            listeningElement2.setAttribute('style', 'display:none;');
            receivedElement2.setAttribute('style', 'display:block;');
            setTimeout(function(){
                listeningElement2.setAttribute('style','display:block;');
                receivedElement2.setAttribute('style', 'display:none;');
            },29000);
        });
		
		socket.on('connect_error', function() {
            console.log('connect-failed');
            listeningElement.setAttribute('style', 'display:block;');
            receivedElement.setAttribute('style', 'display:none;');
         });
		socket.on('llamada_general', function (llamada) {
			console.log(llamada);
			var now = moment();
			var horaIni = moment(llamada.horaIni,"DD-MM-YYYY HH:mm:ss");
			var horaFin = moment(llamada.horaFin,"DD-MM-YYYY HH:mm:ss");
/*			console.log(horaIni);
			console.log(horaFin);
			console.log(now);	*/
			if(now.isBefore(horaFin)) {
				console.log("Ok");
				myapp.llamar(llamada);
			}else {
				console.log("No");
			}
		    //alert(llamada.numero);
		});
		
	},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		app.revisarPermisos();
		cordova.plugins.backgroundMode.setDefaults({ title:'SAGA-CALL',text:'Marcado rápido para atención de Emergencias' ,icon:'icon.png' });
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.overrideBackButton();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
  	},
  	llamar: function(llamada){
		var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
	        deviceInfo.get(function(result) { //alert(result);
	                       //Obtiene el Número de SIM
	                       var res = result.split("simNo");
	                       res = res[1].split('"');	//alert (res[2]);
	                       serial = res[2]; //alert("SIM / Serial: "+serial);
	                       //Obtiene el IMEI
	                       res = result.split("deviceID");
	                       res = res[1].split('"');
	                       imei = res[2]; console.log("Imei: "+imei);

		  	    console.log(llamada.imei);				//alert("Imei Recibido: "+llamada.imei);
		  	    console.log(llamada.numero_salida);		//console.log(llamada.numero);
		  	    var a = llamada.imei.split(",");
		  	    for (index = 0; index < a.length; ++index) {
			  	    if(a[index]==imei){
						document.location.href = "tel:"+llamada.numero;
/*						window.PhoneCaller.call(llamada.numero.toString(),
							function success() {
								console.log("Llamada Ok");
							}
						);	*/
						break;
					}
				}
			}, function() {
				console.log("error");
			});
	},
	revisarPermisos: function(){
		var permissions = cordova.plugins.permissions;
		permissions.hasPermission(permissions.READ_PHONE_STATE, checkPermissionCallback, null);
		
		function checkPermissionCallback(status) {
		  if(!status.hasPermission) {
			var errorCallback = function() {
			  console.warn('No tiene permisos de Leer el IMEI!');
			}

			permissions.requestPermission(
			  permissions.READ_PHONE_STATE,
			  function(status) {
				if(!status.hasPermission) errorCallback();
			  },
			  errorCallback);
		  }else{
			console.log("Permisos Ok. ");
		  }
		}
	}
};
