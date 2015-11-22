(function() {
        var locations = function() {
            var self = this;
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 40.7577, lng: -73.9857},
                zoom: 14
            });
            
            
            
            this.createLocation = function( title, latitude, longitude ) {
                return {
                    position: new google.maps.LatLng(latitude, longitude),
                    title:title,
                    visable: true
                };
            };
            
            this.showLocations = function() {
                coordinates.forEach( function(location) {
                    if (location.visable === true) {
                        var marker = new google.maps.Marker(location);
                        marker.setMap(self.map);
                    }
                    
                }); 
            };
            var coordinates = [
                new this.createLocation('Guitar Center', 40.757,-73.987),
                new this.createLocation('Sam Ash', 40.753, -73.994 ),
                new this.createLocation('Rudy\'s Music (Closed)', 40.759, -73.983),
                new this.createLocation('Birdland Jazz Club', 40.759194, -73.989800),
                new this.createLocation('Colony Music (Closed)', 40.761061, -73.984740),
                new this.createLocation('Museum of Modern Art', 40.761417, -73.977120),
                new this.createLocation('Dizzy\'s Jazz Club', 40.768425, -73.982)
            ];
            
            
        };
        
        var ViewModel = function() {
            var location = new locations;
            location.showLocations();
        };
        
        ko.applyBindings(ViewModel);
        
        
}());
    

    

