'use strict';

function init() {
	
	var MapViewModel = function() {
		var self = this
		self.infoMarker = null;
		self.reviews = ko.observableArray();
		self.location = ko.observableArray();

		// Google map to display NYC
		self.map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 40.7577,
				lng: -73.9857
			},
			zoom: 14
		});

		self.updateList = function( businessId) {
			self.yelp(businessId, null);
		};

		self.yelp = function(businessId, marker) {
			var auth = {
					consumerKey: "oZsD8h9BM0VQtveN7sYvHg",
					consumerSecret: "EQhmDrmyjsJH7F5s3SEe516JbGY",
					accessToken: "N-R-C5cfJXo-4LrgGcpBJUQ6w3Y2_I6_",
					accessTokenSecret: "H9H8IFqCUxHqXxqJuoM0dEtHiDo",
					serviceProvider: {
						signatureMethod: "HMAC-SHA1"
					}
			};
			var yelp_url = 'https://api.yelp.com/v2/business/' + businessId;

			var parameters = {
					oauth_consumer_key: auth.consumerKey,
					oauth_token: auth.accessToken,
					oauth_nonce: nonce_generate(),
					oauth_timestamp: Math.floor(Date.now() / 1000),
					oauth_signature_method: 'HMAC-SHA1',
					oauth_version: '1.0',
					callback: 'cb' // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
			};

			var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, auth.consumerSecret, auth.accessTokenSecret);
			parameters.oauth_signature = encodedSignature;
<<<<<<< HEAD
			var selectedMarker = null;
			self.markers().forEach(function(currentmarker) {
				if (currentmarker.yelp_id === businessId) {
					selectedMarker = currentmarker;
					currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
				} else {
					currentmarker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
				}
			});

			var errorTimeout = setTimeout(function() {
				alert("Something went wrong");	
			}, 5000);

			$.ajax({
				url: yelp_url,
				data: parameters,
				cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
				dataType: 'jsonp',
				success: function(results) {
					clearTimeout(errorTimeout);
					self.business(results);
					self.location(results.location.display_address);
					self.reviews([]);
					results.reviews.forEach(function(review) {
						self.reviews.push({review: review.excerpt + " - " + review.user.name});
					});

					var contentString = '<div class="content">' +
					'<h1 id="firstHeading" class="firstHeading">' + results.name + '</h1>' +
					'<div id="bodyContent">' +
					'<p>' + results.reviews[results.reviews.length - 1].excerpt + " - " + results.reviews[results.reviews.length - 1].user.name + '</p>' +
					'<p><a href="' + results.url + '">' + results.url + '</a> ' +
					'</div>' +
					'</div>';
					if (self.InfoMarker !== null) {
						self.InfoMarker.close();
					}
					self.InfoMarker = new google.maps.InfoWindow({
						content: contentString
					});
					self.InfoMarker.open(mapview.map, selectedMarker);
				},
				fail: function() {
					alert("Problem occured!");
				}
			});
		};

		self.markers = new ko.observableArray();
		self.searchFilter = ko.observable('');
		self.business = ko.observable('');

		/** Funtion to create a locations  for markers array
		 * @param title string the name of the location
		 * @param latitude float the latitute to place the marker
		 * @param longitude float the longitude of the marker
		 * @param detail string TODO the information for the infoWindow
		 * @return an object of the location added
		 */
		self.createLocation = function(title, latitude, longitude, business_id) {
			var location = {
					position: new google.maps.LatLng(latitude, longitude),
					title: title,
					visible: true,
					map: self.map,
					yelp_id: business_id
			};

			// add marker to array of markers
			self.markers.push(new google.maps.Marker(location));
			self.markers()[self.markers().length - 1].setAnimation(null);
			self.markers()[self.markers().length - 1].setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
			// add click function to the new marker
			self.markers()[self.markers().length - 1].addListener('click', function() {
				var marker = this;
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout( function(){
						marker.setAnimation(null);
					}, 1400 );

				}
				self.yelp(this.yelp_id, this);
			});

			// return the object
			return location;
		};

		self.coordinates = [
		                    new self.createLocation('Guitar Center', 40.7578132, -73.9871857, 'guitar-center-manhattan-3'),
		                    new self.createLocation('Guitar Center', 40.736702, -73.9949493, 'guitar-center-manhattan'),
		                    new self.createLocation('Jazz Standard', 40.7421646118164, -73.9838256835938, 'jazz-standard-new-york'),
		                    new self.createLocation('Iridium', 40.761816, -73.983389, 'the-iridium-new-york'),
		                    new self.createLocation('Jazz Gallery', 40.744605, -73.988547, 'the-jazz-gallery-new-york-2'),
		                    new self.createLocation('Guitar New York', 40.762517, -73.977761, 'guitar-new-york-new-york'),
		                    new self.createLocation('Metropolitan Room', 40.7414627075195, -73.9920654296875, 'metropolitan-room-new-york'),
		                    new self.createLocation('Sam Ash', 40.753, -73.994, 'sam-ash-music-stores-new-york'),
		                    new self.createLocation("Rudy's Music (Closed)", 40.759, -73.983, 'rudys-music-stop-new-york-2'),
		                    new self.createLocation('Birdland Jazz Club', 40.759194, -73.989800, 'birdland-new-york'),
		                    new self.createLocation('Museum of Modern Art', 40.7607243955135, -73.9764585345984, 'the-museum-of-modern-art-new-york-2'),
		                    new self.createLocation("Dizzy's Jazz Club", 40.768425, -73.982, 'dizzys-club-coca-cola-new-york')];



		/**
		 * Function to handle input from search field. Automatically updates the locations based on search text
		 * The function updates the sidelist and the visible markers based up what the user wishes to filter
		 * @param searchValue the newly input text to the search field
		 */
		self.searchFilter.subscribe(function(searchValue) {
			searchValue = searchValue.toLowerCase();
			var change = false;
			ko.utils.arrayForEach(self.markers(), function(marker) {
				var text = marker.title.toLowerCase();

				if (text.search(searchValue) === -1) {
					if (marker.getVisible() === true) {
						change = true;
					}
					marker.setVisible(false);
				} else {
					if (marker.getVisible() === false) {
						change = true;
					}
					marker.setVisible(true);
				}

			});
			if (change === true) {
				var data = self.markers().slice(0);
				self.markers([]);
				self.markers(data);
			}
		});

	};

	// Activate knockout
	var mapview = new MapViewModel();
	ko.applyBindings(mapview);
}
function nonce_generate(length) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}