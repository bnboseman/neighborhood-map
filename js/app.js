(function() {
        function yelp( businessId ) {
                var auth = { 
                        consumerKey: "oZsD8h9BM0VQtveN7sYvHg", 
                        consumerSecret: "EQhmDrmyjsJH7F5s3SEe516JbGY",
                        accessToken: "N-R-C5cfJXo-4LrgGcpBJUQ6w3Y2_I6_",
                        accessTokenSecret: "H9H8IFqCUxHqXxqJuoM0dEtHiDo",
                        serviceProvider : {
                            signatureMethod : "HMAC-SHA1"
                        }
                };
                var yelp_url = 'https://api.yelp.com/v2/business/' + businessId;

                var parameters = {
                  oauth_consumer_key: auth.consumerKey,
                  oauth_token: auth.accessToken,
                  oauth_nonce: nonce_generate(),
                  oauth_timestamp: Math.floor(Date.now()/1000),
                  oauth_signature_method: 'HMAC-SHA1',
                  oauth_version : '1.0',
                  callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
                };
                
                var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, auth.consumerSecret, auth.accessTokenSecret);
                parameters.oauth_signature = encodedSignature;
                
                
                $.ajax({
                  url: yelp_url,
                  data: parameters,
                  cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                  dataType: 'jsonp',
                  success: function(results) {
                        console(results);
                        return results;
                  },
                  fail: function() {
                    // Do stuff on fail
                  }
                });
        }
        var MapViewModel = function() {
                var self = this;
                
                // Google map to display NYC
                this.map =  new google.maps.Map(document.getElementById('map'), {
                        center: {lat: 40.7577, lng: -73.9857},
                        zoom: 14
                });
                
                this.markers = new ko.observableArray();
                this.searchFilter =  ko.observable('');
                
                /** Funtion to create a locations  for markers array
                 * @param title string the name of the location
                 * @param latitude float the latitute to place the marker
                 * @param longitude float the longitude of the marker
                 * @param detail string TODO the information for the infoWindow
                 * @return an object of the location added
                 */ 
                this.createLocation      = function( title, latitude, longitude, business_id ) {
                        var location = {
                                position: new google.maps.LatLng(latitude, longitude),
                                title:title,
                                visible: true,
                                map: self.map,
                                yelp_id: business_id
                        };
                        
                    // add marker to array of markers
                    self.markers.push(new google.maps.Marker(location));
                    console.log(self.markers()[self.markers().length-1]);       
                    
                    
                    // add click function to the new marker
                    self.markers()[self.markers().length-1].addListener('click', function() {
                                self.selectedLocation = location;
                               
                    });
                    
                    // return the object
                    return location;
                };
                
                this.coordinates = [
                        new self.createLocation('Guitar Center', 40.757, -73.987, 'guitar-center-manhattan-3'),
                        new self.createLocation('Guitar Center', 40.736817, -73.994547, 'guitar-center-manhattan'),
                        new self.createLocation('Jazz Standard', 40.742158, -73.983826, 'jazz-standard-new-york'),
                        new self.createLocation('Iridium', 40.761816, -73.983389, 'the-iridium-new-york'),
                        new self.createLocation('Jazz Gallery', 40.744605, -73.988547, 'the-jazz-gallery-new-york-2'),
                        new self.createLocation('Guitar New York', 40.762517, -73.977761, 'guitar-new-york-new-york'),
                        new self.createLocation('Metropolitan Room', 40.741462, -73.992067, 'metropolitan-room-new-york'),
                        new self.createLocation('Sam Ash', 40.753, -73.994,'sam-ash-music-stores-new-york'),
                        new self.createLocation("Rudy's Music (Closed)", 40.759, -73.983, 'rudys-music-stop-new-york-2'),
                        new self.createLocation('Birdland Jazz Club', 40.759194, -73.989800, 'birdland-new-york'),
                        new self.createLocation('Museum of Modern Art', 40.761417, -73.977120, 'the-museum-of-modern-art-new-york-2'),
                        new self.createLocation("Dizzy's Jazz Club", 40.768425, -73.982, 'dizzys-club-coca-cola-new-york')
                ];
                
                
                
                /**
                 * Function to handle input from search field. Automatically updates the locations based on search text
                 * The function updates the sidelist and the visible markers based up what the user wishes to filter
                 * @param searchValue the newly input text to the search field
                 */
                this.searchFilter.subscribe(function(searchValue) {
                        searchValue = searchValue.toLowerCase();
                        var change = false;
                        ko.utils.arrayForEach( self.markers(), function(marker) {
                                var text = marker.title.toLowerCase();
                                
                                if ( text.search(searchValue) === -1 ) {
                                        if (marker.getVisible() == true) {
                                                change = true;
                                        }
                                       marker.setVisible(false);
                                } else {
                                        if (marker.getVisible() == false) {
                                                change = true;
                                        }
                                        marker.setVisible(true);
                                }
                            
                        });
                        if (change == true) {
                                var data = self.markers().slice(0);
                                self.markers([]);
                                self.markers(data);
                        }
                });
                
        };
        
        // Activate knockout
        mapview = new MapViewModel();
        ko.applyBindings(mapview);
        
}());
    
    
function nonce_generate(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

