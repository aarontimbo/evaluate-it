Ext.define('EvaluateIt.controller.GeolocationMaster', {
	extend : 'Ext.app.Controller',
	requires: ['Ext.Toolbar'],

	config: {
		profile: Ext.os.deviceType.toLowerCase(),
  		stores : ['SiteEvaluations'],
  		models : ['SiteEvaluation'],
  		refs: {
   			myGeolocationList: 'geolocationList'
  		},
		control: {
			'geolocationList': {
				activate: 'onActivate',
				itemtap: 'onSelectGeolocation'
			},
			'geolocationEdit button[itemId=save]' : {
				tap : 'onSaveGeolocation' 
			}

		}	  

 	},

	onActivate: function() {
  		console.log('Main container is active');
 	},

//	onSelectGeolocation: function() {
//		getCurrentPosition();
//	},

	// spawns a new form panel with Google map centered on current location 
	onSelectGeolocation: function(view, index, target, record, event) {

		console.log('Selected a Geolocation from the list');

		// grab geolocation coordinates from device API

		// Google maps API stuff here
		var latitude = sessionStorage.latitude, //44.9616164; 
		    longitude = sessionStorage.longitude; //-93.33539329999999,

		//get_location();
		//getCurrentPosition();
		console.log('latitude/longitude ...' + sessionStorage.latitude + ' ' + sessionStorage.longitude);

		//alert('Coords ' +  + sessionStorage.latitude + ' ' + sessionStorage.longitude);


		
		

		var	position = new google.maps.LatLng(latitude, longitude),  

			infowindow = new google.maps.InfoWindow({
				content: 'EvaluateIt!'
			}),

			//Tracking Marker Image
			image = new google.maps.MarkerImage(
				'resources/images/point.png',
				new google.maps.Size(32, 31),
				new google.maps.Point(0, 0),
				new google.maps.Point(16, 31)
			),

			shadow = new google.maps.MarkerImage(
				'resources/images/shadow.png',
				new google.maps.Size(64, 52),
				new google.maps.Point(0, 0),
				new google.maps.Point(-5, 42)
			),

			trackingButton = Ext.create('Ext.Button', {
				iconMask: true,
				iconCls: 'locate'
			}),

			trafficButton = Ext.create('Ext.Button', {
				iconMask: true,
				pressed: false,
				iconCls: 'maps'
			}),
			
			toolbar = Ext.create('Ext.Toolbar', {
				docked: 'top',
				alias : 'widget.geolocationToolbar',
				ui: 'light',
				defaults: {
					iconMask: true
				},
				items: [
					{
						xtype: 'button',
         				ui: 'back',
         				text: 'Back',
						// destroy form.Panel overlay to return to tree store view 
						handler: function() {
							geo_panel.destroy();						
						}
            		},
					{
						iconCls: 'home',
						handler: function() {
							//disable tracking
							//var // segmented = Ext.getCmp('segmented'),
								//pressedButtons = segmented.getPressedButtons();
								//trafficIndex = pressedButtons.indexOf(trafficButton),
								//newPressed = (trafficIndex != -1) ? [trafficButton] : [];
							//segmented.setPressedButtons(newPressed);
							google_map.getMap().panTo(position);
						}
					},
				/*	{
						id: 'segmented',
						xtype: 'segmentedbutton',
						allowMultiple: true,
						listeners: {
							toggle: function(buttons, button, active) {
								if (button == trafficButton) {
									google_map.getPlugins()[1].setHidden(!active);
								}
								else if (button == trackingButton) {
									var tracker = google_map.getPlugins()[0],
										marker = tracker.getMarker();
									marker.setVisible(active);
									if (active) {
										tracker.setTrackSuspended(false);
										Ext.defer(function() {
											tracker.getHost().on('centerchange', function() {
												marker.setVisible(false);
												tracker.setTrackSuspended(true);
												var segmented = Ext.getCmp('segmented'),
													pressedButtons = segmented.getPressedButtons(),
													trafficIndex = pressedButtons.indexOf(trafficButton),
													newPressed = (trafficIndex != -1) ? [trafficButton] : [];
												segmented.setPressedButtons(newPressed);
											}, this, {single: true});
										}, 50, this);
									}
								}
							}
						},
						items: [
							trackingButton, trafficButton
						]
					},*/
					// display selected address
					/*{	
						xtype: 'textfield', 
						name: 'address',
						itemId: 'address',
						readOnly: true
					},*/
					// save geolocation data
					{
						xtype: 'button',
						itemId: 'save',
						text: 'Save location',
						handler: function() {
						
							// get record associated with model bound to form 	
							var record = geo_panel.getRecord();
				
							// set geolocation values			
							record.set('latitude',sessionStorage.latitude);
							record.set('longitude',sessionStorage.longitude);
							record.set('accuracy',sessionStorage.accuracy);

							// update store with new values	
							Ext.getStore('SiteEvaluations').sync();
							alert('Location was aved successfully!');

						}
					}

				]
			});

		var google_map = Ext.create('Ext.Map', {
			alias : 'widget.whereAmI',

			mapOptions : {
				center : new google.maps.LatLng(latitude, longitude),
				zoom : 12,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				navigationControl: true,
				navigationControlOptions: {
					style: google.maps.NavigationControlStyle.DEFAULT
				}
			},

			plugins : [
				new Ext.plugin.google.Tracker({
					trackSuspended: true,   //suspend tracking initially
					allowHighAccuracy: false,
					marker: new google.maps.Marker({
						position: position,
						title: 'My Current Location',
						shadow: shadow,
						icon: image
					})
				}),
				new Ext.plugin.google.Traffic()
			],

			//useCurrentLocation: true,

			listeners: {
				maprender: function(comp, map) {
					var marker = new google.maps.Marker({
						position: map.center,
						title : 'Weeeee!',
						map: map
					});

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map, marker);
					});

					setTimeout(function() {
						map.panTo(position);
					}, 100);
				}

			}
		});

		var geo_panel = new Ext.form.Panel({
			useCurrentLocation: true,
			//config: {
			//	width: Ext.os.deviceType == 'Phone' ?  screen.width : 300,
			//	height: Ext.os.deviceType == 'Phone' ?  screen.height : 500,

				fullscreen: true,
				layout: 'fit',
				items: [toolbar, google_map]
			//}

		});
		geo_panel.setRecord(record);
		geo_panel.show();

	}

});

// Sencha implementation: buggy in Safari desktop, 5.1.9: works when it feels like it!
/*
function get_location() {
	Ext.device.Geolocation.getCurrentPosition({

		maximumAge: 30, 
		timeout: 5000,
		enableHighAccuracy: true,
		frequency: 3000,

		success: function(position) {
			var coordinates = position.coords,
				location = 'Longitude ' + coordinates.longitude + ' Latitude ' + coordinates.latitude + ' Accuracy ' + coordinates.accuracy,
				latitude = coordinates.latitude,
				longitude =  coordinates.longitude,
				accuracy = coordinates.accuracy;
				
			//alert('util coords ' + location);
			//alert('Got coords!' + location);


			// initialize sessionStorage
			//sessionStorage.clear();
			// add data to sessionStorage 
			sessionStorage.latitude = latitude;
			sessionStorage.longitude = longitude;
			sessionStorage.accuracy = accuracy;	
			sessionStorage.position = position;
		
			console.log('latitude ' + sessionStorage.latitude);
		},
		failure: function() {
			console.log('something went wrong!');
		}
	});
};
*/
/*

var geo = Ext.create('Ext.util.Geolocation', {
    autoUpdate: false,
	enableHighAccuracy: true,
	//allowHighAccuracy: true,
    listeners: {
        locationupdate: function(geo) {
            //alert('device: ' + geo.getAccuracy());
			sessionStorage.latitude = geo.getLatitude();
			sessionStorage.longitude = geo.getLongitude();
			sessionStorage.accuracy = geo.getAccuracy();	

        },
        locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
            if(bTimeout){
                alert('Timeout occurred.');
            } else {
                alert('Error occurred.');
            }
        }
    }
});
geo.updateLocation();

Ext.device.Geolocation.watchPosition({
    frequency: 10000, // Update every 3 seconds
	enableHighAccuracy: true,
    callback: function(position) {
        alert('Position updated!' + position.coords.accuracy);
    },
    failure: function() {
        console.log('something went wrong!');
    }
});
*/


function getCurrentPosition() {
	//navigator.geolocation.getAccurateCurrentPosition(onSuccess, onError, {desiredAccuracy:30, maxWait:15000});

	navigator.geolocation.getCurrentPosition(geo_success, geo_error, { maximumAge: 30, timeout: 5000, enableHighAccuracy: true });
}

function geo_success(position) {
	var coordinates = position.coords,
		location = 'Longitude ' + coordinates.longitude + ' Latitude ' + coordinates.latitude + ' Accuracy ' + coordinates.accuracy,
		timeStamp = new Date(position.timestamp),
		latitude = coordinates.latitude,
		longitude =  coordinates.longitude,
		accuracy = coordinates.accuracy;
		
	alert('success! geoLocation is ready to use!' + ' accuracy ' + accuracy);

	//element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />'
	//	+ 'Longitude: ' + position.coords.longitude + '<br />'
	//	+ 'Altitude: ' + position.coords.altitude + '<br />' 
	//	+ 'Accuracy: ' + position.coords.accuracy + '<br />'
	//	+ 'Timestamp: ' + new Date(position.timestamp) + '<br />';


	// initialize
	//sessionStorage.clear();
	// add data to localStorage 
	sessionStorage.latitude = latitude;
	sessionStorage.longitude = longitude;
	sessionStorage.accuracy = accuracy;
	sessionStorage.timeStamp = timeStamp;

}

// onError Callback receives a PositionError object
function geo_error(error) {
	alert('error!' );
}



