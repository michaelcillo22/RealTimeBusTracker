
mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGFlbGNpbGxvMzMiLCJhIjoiY2wxbnc2b29iMGV2dzNjbW80aDJmZWx6biJ9.rej--E3f8qA75ETOz-bR9g';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.104081,42.365554], //Boston
    zoom: 14
});

// live tracker data
const trackUrl = 'https://api-v3.mbta.com/vehicles?filter[route]=&include=trip';

//write a cod that displays the current number of busses actively reporting (data.length) on the big display

// creating variables from 'data' and 'included

let dataAttributes = [];
let included = [];
let bikes = '';
let headSign = '';
let occupancy = '';
let updated = '';
let stopNumber = '';
let transit = '';
let marker = [];
let WheelchairAccess = '';
let route = '';

//functions to transfer boolean values into language for strings

function wheelchairAccess () {
    if (included[i].attributes.wheelchair_accessible == true) {
        WheelchairAccess = 'Yes';
    } else {
        WheelchairAccess = 'No';
    };
}
function bikeAccess () {
    if (included[i].attributes.bikes_allowed == true) {
        bikes = 'Allowed';
    } else {
        bikes = 'Not Allowed';
    };
}

// the major function that continually runs every 15 seconds and translates the live data visually to the user

async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	console.log(data);
    // console.log(included);
    console.log(`There are ${data.length} busses being shared.`);
    
    // if (marker.length < 1){
        for (i=0; i < data.length; i++){
            // temporarily store data about each bus into the variables for display
            // headSign = included[i].attributes.headsign;
            occupancy = data[i].attributes.occupancy_status;
            updated = data[i].attributes.updated_at;
            stopNumber = data[i].attributes.current_stop_sequence
            transit = data[i].attributes.current_status
            route = data[i].relationships.route.data.id
            // wheelchairAccess();
            // bikeAccess();

            // writes the information to the user via pop ups
            let popup = new mapboxgl.Popup().setText(
                `Bus Number: ${data[i].attributes.label} Wheelchair Access: ${WheelchairAccess} Route: ${route} Headed: ${headSign} ${transit} Stop Number: ${stopNumber} Occupancy: ${occupancy}
                Bikes: ${bikes} Updated at: ${updated}`
                );

            // create DOM element for the marker
            const element = document.createElement('div');
            element.id = 'marker';
            if (marker[i] != null) {marker[i].setLngLat([data[i].attributes.longitude, data[i].attributes.latitude]);
            }else {
            marker[i] = new mapboxgl.Marker(element)
            .setLngLat([data[i].attributes.longitude, data[i].attributes.latitude])
            .setPopup(popup)
            .addTo(map);
            }
        };
    // };

    //updates the markers and their location every 15 seconds
    // for (i=0; i < data.length; i++){
    //     marker[i].setLngLat([data[i].attributes.longitude, data[i].attributes.latitude]);
    // };
    // update timer
    console.log(`There are ${marker.length} markers.`);
	setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
    data = json.data;
    included = json.included;
	return [data,included];
}

run();