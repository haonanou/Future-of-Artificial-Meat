var map_7ac2f4fcec1f4a72a5ec4b4e6645af8e = L.map(
    "map_7ac2f4fcec1f4a72a5ec4b4e6645af8e",
    {
        center: [0.0, 0.0],
        crs: L.CRS.EPSG3857,
        zoom: 2,
        zoomControl: true,
        preferCanvas: false,
    }
);

var tile_layer_9e0cf55b5abd46e6a9a040a1a87af15a = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {"attribution": "Data by \u0026copy; \u003ca href=\"http://openstreetmap.org\"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href=\"http://www.openstreetmap.org/copyright\"\u003eODbL\u003c/a\u003e.", "detectRetina": false, "maxNativeZoom": 18, "maxZoom": 18, "minZoom": 0, "noWrap": false, "opacity": 1, "subdomains": "abc", "tms": false}
).addTo(map_7ac2f4fcec1f4a72a5ec4b4e6645af8e);

var markerLayer = L.layerGroup().addTo(map_7ac2f4fcec1f4a72a5ec4b4e6645af8e);
// var markerLayer = L.layerGroup().addTo(map_7ac2f4fcec1f4a72a5ec4b4e6645af8e);

function createMap (data) {
    if (markerLayer) {
        markerLayer.clearLayers();
    }
    const pointsArr = [];
    for (let index = 0; index < data.length; index++) {
        const point = data[index];
        const marker = createMarker(point, markerLayer);   
        pointsArr.push(marker);
        if (index === (data.length - 1)) {
            const heatmap = L.heatLayer(pointsArr, {
                blur: 15,
                max: 1.0,
                maxZoom: 18,
                minOpacity: 0.5,
                radius: 25
            }).addTo(markerLayer);
        }
    }

}
var count = 0;
function createMarker(point, map) {
    const q12 = /yes/i.test(point.Q12);
    const q9 = /yes/i.test(point.Q9);
    if (count < 10) {
        console.log(point);
        console.log(q12, q9)
        ++ count;
    }
    
    var marker = L.marker(
        [point.LocationLatitude, point.LocationLongitude],
        {}
    ).addTo(map);


    var icon = L.AwesomeMarkers.icon({
        "extraClasses": "fa-rotate-0",
        "icon": "info-sign",
        "iconColor": "white",
        "markerColor": q12 && q9 ? "green" : 
                       !q12 && q9 ? 'blue':
                       q12 && !q9 ? 'red' : 'orange',
        "prefix": "glyphicon"
    });
    marker.setIcon(icon);


    var popup = L.popup({"maxWidth": "100%"});


    var html = $(`<div id="html_4a71a83248314fb191e9b8fd6e6670bc" style="width: 100.0%; height: 100.0%;">
        <strong>Latitude: ${point.LocationLatitude}<br>Longtiude:${point.LocationLongitude}<br>
        Heard: ${point.Q9}<br>Tried:${point.Q12}</strong></div>`)[0];
    popup.setContent(html);


    marker.bindPopup(popup);

    marker.bindTooltip(
        `<div>
             Click me!
         </div>`,
        {"sticky": true}
    );
    return [point.LocationLatitude, point.LocationLongitude];
}