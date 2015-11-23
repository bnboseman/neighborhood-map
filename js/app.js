(function() {
        
        var MapViewModel = function() {
                var self = this;
                self.map =  new google.maps.Map(document.getElementById('map'), {
                        center: {lat: 40.7577, lng: -73.9857},
                        zoom: 14
                });
                this.markers = new ko.observableArray();
                this.searchFilter =  ko.observable('');
                this.createLocation = function( title, latitude, longitude, data ) {
                        var location = {
                                position: new google.maps.LatLng(latitude, longitude),
                                title:title,
                                visible: true,
                                map: self.map
                        };
                    self.markers.push(new google.maps.Marker(location));
                    self.markers()[self.markers().length-1].addListener('click', function() {
                        
                    });
                    return location;
                };
                this.coordinates = [
                        new self.createLocation('Guitar Center', 40.757, -73.987),
                        new self.createLocation('Guitar Center', 40.736817, -73.994547),
                        new self.createLocation('Jazz Standard', 40.742158, -73.983826),
                        new self.createLocation('Decade', 40.761092, -73.960916),
                        new self.createLocation('Iridium', 40.761816, -73.983389),
                        new self.createLocation('Jazz Gallery', 40.744605, -73.988547),
                        new self.createLocation('Guitar New York', 40.762517, -73.977761),
                        new self.createLocation('Metropolitan Room', 40.741462, -73.992067),
                        new self.createLocation('Sam Ash', 40.753, -73.994 ),
                        new self.createLocation("Rudy's Music (Closed)", 40.759, -73.983),
                        new self.createLocation('Birdland Jazz Club', 40.759194, -73.989800),
                        new self.createLocation('Colony Music (Closed)', 40.761061, -73.984740),
                        new self.createLocation('Museum of Modern Art', 40.761417, -73.977120),
                        new self.createLocation("Dizzy's Jazz Club", 40.768425, -73.982)
                ];
        self.searchFilter.subscribe(function(searchValue) {
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
        
        mapview = new MapViewModel();
        
        ko.applyBindings(mapview);
        
}());
    

    

