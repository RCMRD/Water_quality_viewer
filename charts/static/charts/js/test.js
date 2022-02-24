$(document).ready(function(){
const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

const source = new ol.source.Vector({wrapX: false});
const vector = new ol.layer.Vector({
  source: source
});

const map = new ol.Map({
  layers: [raster, vector],
  target: 'map',
  view: new ol.View({
    center: [-11000000, 4600000],
    zoom: 4,
  }),
});

let draw; // global so we can remove them later
const typeSelect = document.getElementById('type');

function addInteractions(value) {
  // const value = typeSelect.value;
  if (value !== 'None') {
    draw = new ol.interaction.Draw({
      source: source,
      type: value,
    });
    map.addInteraction(draw);
  }
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  const value = typeSelect.value;
  map.removeInteraction(draw);
  addInteractions(value);
};

addInteractions(typeSelect.value);
});

/*
/*
    VARIABLES INITIALIZATIONS
    */
    // Variable definitions
    var map, draw;
    // Function definitions
    var public_interface, init_map, init_all;
    /*
    DEFINE THE FUNCTIONS
    */
    // function addInteraction(value){
    //     if (value !== 'None') {
    //         let geometryFunction;
    //         if (value === 'Square') {
    //             value = 'Circle';
    //             geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    //         } else if (value === 'Box') {
    //             value = 'Circle';
    //             geometryFunction = ol.interaction.Draw.createBox();
    //         } else if (value === 'Star') {
    //             value = 'Circle';
    //             geometryFunction = function(coordinates, geometry) {
    //                 const center = coordinates[0];
    //                 const last = coordinates[coordinates.length - 1];
    //                 const dx = center[0] - last[0];
    //                 const dy = center[1] - last[1];
    //                 const radius = Math.sqrt(dx * dy + dy * dy);
    //                 const rotation = Math.atan2(dy, dx);
    //                 const newCoordinates = [];
    //                 const numPoints = 12;
    //                 for (let i = 0; i < numPoints; ++i) {
    //                     const angle = rotation + (i * 2 * Math.PI) / numPoints;
    //                     const fraction = i % 2 === 0 ? 1: 0.5;
    //                     const offsetX = radius * fraction * Math.cos(angle);
    //                     const offsetY = radius * fraction * Math.sin(angle);
    //                     newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
    //                 }
    //                 newCoordinates.push(newCoordinates[0].slice());
    //                 if (!geometry) {
    //                     geometry = new ol.geom.Polygon([newCoordinates]);
    //                 } else {
    //                     geometry.setCoordinates([newCoordinates]);
    //                 }
    //             return geometry;
    //             };
    //         }
    //          draw = new ol.interaction.Draw({
    //             source: new ol.source.Vector({wrapX: false}),
    //             type: value,
    //             geometryFunction: geometryFunction,
    //         });
    //         map.addInteraction(draw);
    //     }
    // }
    
        // } else if (value === 'Star') {
        //     value = 'Circle';
        //     geometryFunction = function(coordinates, geometry) {
        //         const center = coordinates[0];
        //         const last = coordinates[coordinates.length - 1];
        //         const dx = center[0] - last[0];
        //         const dy = center[1] - last[1];
        //         const radius = Math.sqrt(dx * dy + dy * dy);
        //         const rotation = Math.atan2(dy, dx);
        //         const newCoordinates = [];
        //         const numPoints = 12;
        //         for (let i = 0; i < numPoints; ++i) {
        //             const angle = rotation + (i * 2 * Math.PI) / numPoints;
        //             const fraction = i % 2 === 0 ? 1: 0.5;
        //             const offsetX = radius * fraction * Math.cos(angle);
        //             const offsetY = radius * fraction * Math.sin(angle);
        //             newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
        //         }
        //         newCoordinates.push(newCoordinates[0].slice());
        //         if (!geometry) {
        //             geometry = new ol.geom.Polygon([newCoordinates]);
        //         } else {
        //             geometry.setCoordinates([newCoordinates]);
        //         }
        //     return geometry;
        //     };

    function addInteractions() {
      const value = $('#type').val();
      if (value !== 'None') {
        draw = new ol.interaction.Draw({
          source: new ol.source.Vector({wrapX: false}),
          type: value,
        });
        map.addInteraction(draw);
      }
    }

    /*
    Initialize Functions
    */
    init_map = function(target){
      // const raster = new ol.layer.Tile({
      //   source: new ol.source.OSM(),
      // });
      // raster.set('name', 'baselayer')
      // const scaleline = new ol.control.ScaleLine({units: 'us'});
      // const fullscreen = new ol.control.FullScreen();
      // const controls = [fullscreen, scaleline];
      // const source = new ol.source.Vector({wrapX: false});
      // const vector = new ol.layer.Vector({
      //       source: source,
      //       style: new ol.style.Style({
      //           fill: new ol.style.Fill({
      //               color: 'rgba(0, 255, 0, 0.5)'
      //           }),
      //           stroke: new ol.style.Stroke({
      //               color: '#ffcc33',
      //               width: 2
      //           }),
      //           image: new ol.style.Circle({
      //               radius: 7,
      //               fill: new ol.style.Fill({
      //               color: '#ffcc33'
      //               })
      //           })
      //       }),      
      //   });
      const raster = new ol.layer.Tile({
          source: new ol.source.OSM(),
      });

        const source = new ol.source.Vector({wrapX: false});
        const vector = new ol.layer.Vector({
          source: source
        });
      map = new ol.Map({
        //controls: ol.control.defaults().extend(controls),
        layers: [raster, vector],
        target: "map",
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 5,
          minZoom: 2,
        }),
      });
    }

    init_all = function(){
        init_map();
        addInteractions();
    }

    /*
    PUBLIC INTERFACE
    */

    public_interface = {};

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
        const typeSelect = document.getElementById('type');
        typeSelect.onchange = function () {
          const value = typeSelect.value;
          map.removeInteraction(draw);
          addInteractions();
        };
        init_all();
        // $('#type').on('change', function(){
        //     map.removeInteraction(draw);
        //     addInteractions();
        // });
    });

    return public_interface;
    ///