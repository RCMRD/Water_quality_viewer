  const app_control = (function() {
    /*
    VARIABLES INITIALIZATIONS
    */
    // function variables
    var init_map, init_navs, init_events, init_all, update_options, load_map, map_request;
    // local variables
    var public_interace, map, update_options, m_option1, m_option2, m_option3,
    options, draw, interaction1;
    /*

    /*
    DEFINE THE FUNCTIONS
    */   
    update_options = function(){
      options = $('#navpanel').data('datasets');

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
          $("input[type='date'").hide();

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

    init_events = function(){
          load_map = function(data, layer, map) {
            map.getLayers().forEach(layer => {
              if (layer.get('name') != undefined & layer.get('name') === 'workinglayer') {
                map.removeLayer(layer);
              };
            });
            layer.getSource().setUrl(data.url);
            map.addLayer(layer);
            return;
          };

          map_request = function(data_dict, layer, map){
            $.ajax({
                type: "POST",
                url: "get_map/",
                data: data_dict,
                success: function(response){
                console.log(response);
                  load_map(response, layer, map);
                },
                error: function(error) {
                  alert('Oops! There was an error of "'+error+'" while processing your request');
                }
             });
            return;
          };
        }
    /*
    Initialize Functions
    */
    init_map = function(){
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      raster.set('name', 'baselayer')

      // const attributions = '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
      const mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
      });
      const scaleline = new ol.control.ScaleLine({units: 'us'});
      const fullscreen = new ol.control.FullScreen();
      let controls = [mousePositionControl, fullscreen, scaleline];
      map = new ol.Map({
        controls: ol.control.defaults().extend(controls),
        layers: [raster],
        target: "map",
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 8,
          minZoom: 7
        })
      });
    }

    init_all = function(){
      init_map();
      update_options();
      init_events();
    }

    /*
    PUBLIC INTERFACE
    */
    public_interace = {};

    function getWqImage(which) {
      let workinglayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
          url:'',
          crossOrigin:'Anonymous',
          timeLoadFunction: function(tile,src){
            tile.setImage().src = src;
          }
        })
      });
      workinglayer.set('name', 'workinglayer');

      m_option1 = $('#option1').val();

      if (m_option1 == 'lulc') {
        map_request({
         "type": $('#option1').val(),
         "product": $('#option2').val()
        }, workinglayer, which);
      } else {
      map_request({
         "type": $('#option1').val(),
         "mission": $('#option2').val(),
         "sensor": $('#option3').val(),
         "product": $('#option4').val(),
         "startDate": $('#start_date').val(),
         "endDate": $('#end_date').val()
      }, workinglayer, which);
    }
  }


    function addInteraction(value, which) {
      if (value !== 'None') {
        draw = new ol.interaction.Draw({
          source: new ol.source.Vector({wrapX: false}),
          type: value,
        });
        which.addInteraction(draw);
      }
    }

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
      m_option1 = $('#option1').val();
      m_option2 = $('#option2').val();
      m_option3 = $('#option3').val();
      interaction1 = $('#type').val();
      $('#loadmap').on('click', function(e){
           e.preventDefault(); 
           getWqImage(map);
      });
      interaction1.onchange = function(){
        map.removeInteraction(draw);
        const typeval = $('#type').val();
        addInteraction(typeval, map);
      };

      init_all();

    });
    return public_interace;
  }());