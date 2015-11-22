(function() {
        var map = function() {
            var self = this;
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 40.7577, lng: -73.9857},
                zoom: 14
            });
            
            
            this.createLocation = function( title, latitude, longitude ) {
                return {
                    position: new google.maps.LatLng(latitude, longitude),
                    title:title,
                    visible: true,
                    map: self.map
                };
            };
            
            this.coordinates = ko.observableArray([
                new this.createLocation('Guitar Center', 40.757,-73.987),
                new this.createLocation('Sam Ash', 40.753, -73.994 ),
                new this.createLocation('Rudy\'s Music (Closed)', 40.759, -73.983),
                new this.createLocation('Birdland Jazz Club', 40.759194, -73.989800),
                new this.createLocation('Colony Music (Closed)', 40.761061, -73.984740),
                new this.createLocation('Museum of Modern Art', 40.761417, -73.977120),
                new this.createLocation('Dizzy\'s Jazz Club', 40.768425, -73.982)
            ]);
            
            
        };
        
        var MapViewModel = {
            map: new map(),
            searchFilter: ko.observable(''),
            showLocations: function() {
                 ko.utils.arrayForEach( this.map.coordinates(), function(location) {
                        var marker = new google.maps.Marker(location);
                    
                }); 
            }
        };
        
        MapViewModel.searchFilter.subscribe(function(newValue) {
                console.log(newValue);
        });
        
        ko.applyBindings(MapViewModel);
        MapViewModel.showLocations();
        
}());
    

    

