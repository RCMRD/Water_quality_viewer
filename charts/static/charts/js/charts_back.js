import defaultLineChart, { defaultScatterChart, addSeriesn, removeSeries } from './modules/high_chart_modules.js';
const app_control = (function(){
    
    var draw, map, chart, coords, m_option1, m_option2, m_option3;
    var init_map, init_events, chart_request, geometryFunction, update_options, init_chart;

    const source = new ol.source.Vector({wrapX: false});   
    const vector = new ol.layer.Vector({
      source: source
    });

    init_map = function () {
      const raster = new ol.layer.Tile({
        source: new ol.source.OSM(),
      });

      map = new ol.Map({
        interactions: ol.interaction.defaults(),
        layers: [raster, vector],
        target: 'map',
        view: new ol.View({
          center: [3669401.896473434, -75795.50527694414],
          zoom: 4,
        }),
      });
    }

    update_options = function(){
      let options = $('#navpanel').data('datasets');

      for (const maptype in options) {
        if (maptype !== "...") {
          $('#option1').append($('<option>', {
            value: maptype,
            text: options[maptype]['display']
          }))
        }
      }
      $('#option1').on('click', function(){
        $("#option2 option[value!='...']").remove();
        $("#option3 option[value!='...']").remove();
        $("#option4 option[value!='...']").remove();
        m_option1 = $('#option1').val();
        if (m_option1 == 'lulc') {
          $("#option3").hide();
          $("#option4").hide();
          $("label[class='date']").hide();
          $("input[type='date']").hide();

          for (const lulcs in options[m_option1]['options']) {
            if (lulcs != "...") {
            $('#option2').append($('<option>', {
              value: lulcs,
              text: options[m_option1]['options'][lulcs]['display']
            }));
            }
          }
        } else {
        for (const dataset in options[m_option1]['options']) {
          $("#option3").show();
          $("#option4").show();
          $("label[class='date']").show();
          $("input[type='date'").show();
          if (dataset != "...") {
            $('#option2').append($('<option>', {
              value: dataset,
              text: options[m_option1]['options'][dataset]['display']
            }));
          }
        }

        $('#option2').on('click', function(){
          $("#option3 option[value!='...']").remove();
          $("#option4 option[value!='...']").remove();
          m_option2 = $('#option2').val();
          console.log(m_option2);
          for (const sensor in options[m_option1]['options'][m_option2]['options']){
            if (sensor != "...") {
              $('#option3').append($('<option>', {
                value: sensor,
                text: options[m_option1]['options'][m_option2]['options'][sensor]['display']
              }));
            }
          }

            $('#option3').on('click', function(){
            $("#option4 option[value!='...']").remove();
            m_option3 = $('#option3').val();
            console.log(m_option3);
            for (const product in options[m_option1]['options'][m_option2]['options'][m_option3]['options']){
              if (product != "...") {
                $('#option4').append($('<option>', {
                  value: product,
                  text: options[m_option1]['options'][m_option2]['options'][m_option3]['options'][product]['display']
                }));
              }
            }
          });
        });
        }
      });
      return;
    }

    // show_chart = defaultLineChart('container',
    //         "what a Game",
    //         ["apple","bears","cats"],
    //         "This a y axis title");

    init_events = function(){
        chart_request = function(data_dict){
            $.ajax({
                type: "POST",
                url: "get_chart/",
                type: "json",
                data: data_dict,
                success: function(response){
                  console.log(response);
                  // load_map(response, layer, which);
                },
                error: function(error) {
                  alert('Oops! There was an error of "'+error+'" while processing your request');
                }
             });
            return;
          };
    }

    function addInteractions(value) {
      if (value !== 'None') {
        // if (value === 'Square') {
        //     value = 'Circle';
        //     geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
        // } else if (value === 'Box') {
        //     value = 'Circle';
        //     geometryFunction = ol.interaction.Draw.createBox();
        // }
        // source.refresh();
        // map.removeInteraction(draw);
        // draw = new ol.interaction.Draw({
        //   source: source,
        //   type: value,
        //   geometryFunction: geometryFunction
        // });
        // map.addInteraction(draw);
        // source.on('addfeature', function(evt){
        //     var feature = evt.feature;
        //     var coordsunproj = feature.getGeometry().getCoordinates();
        //     coords = ol.proj.transform(coordsunproj, 'EPSG:3857', 'EPSG:4326');
        //     return coords;
        // });
        //     console.log(coords);
      } else {
        source.refresh();
        map.removeInteraction(draw);
      }
    }

    function drawDefaultChart(ctype) {
        if (ctype !== '...') {
            if (ctype == 'line') {
                chart = defaultLineChart(
                    'container',
                    'Default Title Text for a Line Chart',
                    '[]',
                    'Default Y Axis Title Text');
            } else if (ctype == 'scatter') {
                chart = defaultScatterChart(
                    'container',
                    'Default Title Text for a Scatter Chart',
                    '[]',
                    'Default Y Axis Title Text');
            }
        }
    }

    function getChartData(crds){
        chart_request({
            "coordinates": JSON.stringify(crds),
            "mission": $('#option2').val(),
            "sensor": $('#option3').val(),
            "product": $('#option4').val(),
            "startDate": $('#start_date').val(),
            "endDate": $('#end_date').val()
        });
    }

    $(function(){
        update_options();
        init_map();
        init_events();
        // Initialize a chart instance
        $('#charttype').on('change',function(){
            let ctype = $('#charttype').val();
            drawDefaultChart(ctype);
        //Add series to chart and redraw
        addSeriesn(chart,'series1','Jane',[1, 0, 4]);
        addSeriesn(chart,"series2",'John',[5, 7, 3]);
        chart.redraw();
        });

        // Populate chart with Series Data

        // //Add series to chart and redraw
        // addSeriesn(chart,'series1','Jane',[1, 0, 4]);
        // addSeriesn(chart,"series2",'John',[5, 7, 3]);
        // show_chart.redraw();
        // Remove series
        // $('#loadchart').on('click', function(){
        //     removeSeries('series1', show_chart);
        //     });
        // const typeSelect = document.getElementById('type');
        // const value = $('#type').val();
        // $('#type').on('change', function() {
        //     const value = $('#type').val();
        //     if ( typeof value != "..."){
        //             addInteractions(value);
        //             // console.log(source);
        //     }
        // });
        // addInteractions(value);
        // $('#loadchart').on('click', function(e){
        //     e.preventDefault();
        //     console.log("working properly");
        //     getChartData(coords);
        // });
    });

})();  

const app_control = (function(){
  /*
  PUBLIC VARIABLES
  */
  var update_options, init_all, init_map, init_events;
  var getQData, getCvals;
  var public_interface, map, draw;
  var m_option1, m_option2, m_option3, newJson, qdata;
  const source = new ol.source.Vector({wrapX: false});
  const vector = new ol.layer.Vector({source: source,});
  const type = $('#type').val();

  /*
  INITIALIZE FUNCTIONS
  */
  update_options = function(){
      let options = $('#navpanel').data('datasets');

      for (const maptype in options) {
        if (maptype !== "...") {
          $('#option1').append($('<option>', {
            value: maptype,
            text: options[maptype]['display']
          }))
        }
      }
      $('#option1').on('click', function(){
        $("#option2 option[value!='...']").remove();
        $("#option3 option[value!='...']").remove();
        $("#option4 option[value!='...']").remove();
        m_option1 = $('#option1').val();
        if (m_option1 == 'lulc') {
          $("#option3").hide();
          $("#option4").hide();
          $("label[class='date']").hide();
          $("input[type='date']").hide();

          for (const lulcs in options[m_option1]['options']) {
            if (lulcs != "...") {
              $('#option2').append($('<option>', {
                value: lulcs,
                text: options[m_option1]['options'][lulcs]['display']
              }));
            }
          }
        } else {
        for (const dataset in options[m_option1]['options']) {
          $("#option3").show();
          $("#option4").show();
          $("label[class='date']").show();
          $("input[type='date'").show();
          if (dataset != "...") {
            $('#option2').append($('<option>', {
              value: dataset,
              text: options[m_option1]['options'][dataset]['display']
            }));
          }
        }

        $('#option2').on('click', function(){
          $("#option3 option[value!='...']").remove();
          $("#option4 option[value!='...']").remove();
          m_option2 = $('#option2').val();
          console.log(m_option2);
          for (const sensor in options[m_option1]['options'][m_option2]['options']){
            if (sensor != "...") {
              $('#option3').append($('<option>', {
                value: sensor,
                text: options[m_option1]['options'][m_option2]['options'][sensor]['display']
              }));
            }
          }

            $('#option3').on('click', function(){
            $("#option4 option[value!='...']").remove();
            m_option3 = $('#option3').val();
            console.log(m_option3);
            for (const product in options[m_option1]['options'][m_option2]['options'][m_option3]['options']){
              if (product != "...") {
                $('#option4').append($('<option>', {
                  value: product,
                  text: options[m_option1]['options'][m_option2]['options'][m_option3]['options'][product]['display']
                }));
              }
            }
          });
        });
        }
      });
      return;
    }

  init_map = function(target){
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });

      raster.set('name', 'baselayer')
      const scaleline = new ol.control.ScaleLine({units: 'us'});
      const fullscreen = new ol.control.FullScreen();

      let controls = [fullscreen, scaleline];

      return new ol.Map({
        controls: ol.control.defaults().extend(controls),
        interactions: ol.interaction.defaults(),
        layers: [raster, vector],
        target: target,
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 5,
          minZoom: 4
        })
      });
  }

  getQData = function(){
    const products = [];
    // product["feature"] = feat;

    $('#option2').on('change',function(e){
        products["platform"] = $('#option2').val();
    });
    $('#option3').on('change',function(e){
        products["sensor"] = $('#option3').val();
    });
    $('#option3').on('change',function(e){
        products["product"] = $('#option4').val();
    });
    $('#start_date').on('change',function(e){
        products["startDate"] = $('#start_date').val();
    });
    $('#end_date').on('change',function(e){
        products["endDate"] = $('#end_date').val();
    });
    console.log(products);
    return products;
  }

  init_events = function() {

  }


/*
  OPERATIONAL FUNCTIONS
*/

  function addInteraction(value){
    map.removeInteraction(draw);
    let coords;
    let geoJson = new ol.format.GeoJSON();
    let features = [];
    if (value !== "None") {
      source.refresh();
      draw = new ol.interaction.Draw({
        source: source,
        type: value,
      });
      map.addInteraction(draw);
      source.on('addfeature', function(evt){
        if (this.getFeatures().length > 0) {
          let geom = this.getFeatures()[0].getGeometry().transform('EPSG:3857', 'EPSG:4326');
          let features = geoJson.writeGeometry(geom);
        }
       });
     }
     console.log(features)
     return features
  }

  getCvals = function(data) {
      // var xhr = $.ajax({
      //  type: 'POST',
      //  url:'get_chart',
      //  dataType: 'json',
      //  data: feature,
      //  cache: JSON.parse(feature)
      // });
      // xhr.done(function(data){
      //  if ('success' in data) {
      //    console.log(data)
      //  }
      // });
  }


  function create_chart(product,series){
    var options = {
          chart: {
              renderTo: 'container',
              type: 'line'
          },    
          xAxis: {
              type: 'datetime'
          },    
          title: {
              text: product
          },    
          yAxis: {
              title: {
                  text: product
              }
          },
          series: [{
              name: product,
              data: series,
              // pointStart: Date.UTC(2010, 0, 0),
              // pointInterval: 3600 * 1000 * dateInt 
          }]
        };

     var chart = new Highcharts.Chart(options);
  }



    /*
  PUBLIC INTERFACE
  */
  public_interface = {};
  init_all = function(){
    update_options();
    map = init_map("map");
    getQData();
   }

  /*
  RUN THE FUNCTIONS
  */
  $(function(){
    init_all();
    let feat;
    $('#type').on('change', function(e){
      const val = this.value;
      let feat = addInteraction(val);
      console.log(feat);
      $('#loadchart').on('click', function(e){
        e.preventDefault();
        qdata = getQData();
        console.log(qdata);
      });
    });




  });

  return public_interface

})();