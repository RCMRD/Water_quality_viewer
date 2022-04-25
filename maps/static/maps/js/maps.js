  const app_control = (function() {
    /*
    VARIABLES INITIALIZATIONS
    */
    // function variables
    var init_map, init_navs, init_events, init_all, update_options, load_map, map_request;
    // local variables
    var public_interface, map, update_options, m_option1, m_option2, m_option3,
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
          $(".date").hide();

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
          $(".date").show();
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
      // $(document).on({ 
      //   ajaxStart: function(){ 
      //     const $loadgif = this.getElementById('loadergif');
      //     $loadgif.css("display", "inline-block"); 
      //   },
      //   ajaxStop: function(){ 
      //     const $loadgif = this.getElementById('loadergif');
      //     $loadgif.css("display", "none"); 
      //   },
      // });
      // //   ajaxStart: function() { $(loadgif).css("display": "inline-block"); },
      // //   ajaxStop: function() { $(loadgif).css("display": "none"); }
      // // 
      //
      $('[data-toggle="tooltip"]').tooltip();
          load_map = function(data, layer, which) {
            which.getLayers().forEach(layer => {
              if (layer.get('name') != undefined & layer.get('name') === 'workinglayer') {
                which.removeLayer(layer);
              };
            });
            layer.getSource().setUrl(data.url);
            which.addLayer(layer);
            return;
          };

          map_request = function(data_dict, layer, which){
            var xhr = $.ajax({
                type: "POST",
                url: "get_map/",
                data: data_dict,
                cache: data_dict
              });
            xhr.done(function(data) {
                  if ("success" in data) {
                        load_map(data, layer, which);
                      $('#loader').css("display", "none");
                  } else if ("error" in data){
                    $('#loader').css("display", "none");
                    alert('Oops! There was an error processing your request " \n \
                      '+ data.error+'". \n \
                      1. Re-check your selections \n \
                      2. Make sure data is available');
                }
              });
            return;
          };
        }
    
    /*
    Initialize Functions
    */
    
    init_map = function(target){
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });
      raster.set('name', 'baselayer')

      // const attributions = '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
      // const mousePositionControl = new ol.control.MousePosition({
      //   coordinateFormat: ol.coordinate.createStringXY(4),
      //   projection: 'EPSG:4326',
      //   className: 'custom-mouse-position',
      //   target: document.getElementById('mouse-position'),
      // });
      const scaleline = new ol.control.ScaleLine({units: 'metric'});
      const fullscreen = new ol.control.FullScreen();
      let controls = [fullscreen, scaleline];
      return new ol.Map({
        controls: ol.control.defaults().extend(controls),
        layers: [raster],
        target: target,
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 8,
          minZoom: 7
        })
      });
    }

    init_all = function(){
      map = init_map("map");
      update_options();
      init_events();
    }

    /*
    PUBLIC INTERFACE
    */
    public_interface = {};

    function getWqImage(which) {
      console.log(which);
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

    function syncViews(event, view) {
      let newValue = event.target.get(event.key);
      view.set(event.key, newValue);
    }

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
      m_option1 = $('#option1').val();
      m_option2 = $('#option2').val();
      m_option3 = $('#option3').val();
      // interaction1 = $('#type').val();
      $('#loadmap').on('click', function(e){
           e.preventDefault(); 
            $('#loader').css("display", "inline-block");
           console.log("hey");
           getWqImage(map);
      });
      // interaction1.onchange = function(){
      //   map.removeInteraction(draw);
      //   const typeval = $('#type').val();
      //   addInteraction(typeval, map);
      // };
      const splits = document.querySelector('.splits');

      // $('#splitter').on('select', function(e){
        splits.addEventListener('change', function(e) {
        let split = $('#splitter').val();
        if (split == 2) {
          document.getElementById("map").style.display = "none";
          document.getElementById("loadmap").style.display ="none";
          document.getElementById("maps4").style.display = "none";
          document.getElementById("screen4btns").style.display = "none";
          $(".ol-viewport").remove();
          document.getElementById("maps2").style.display = "inline-block";
          // document.getElementById("map22").style.display = "inline-block";
          document.getElementById("screen2btns").style.display = "inline-block";
          let map1 = init_map("map21");
          let map2 = init_map("map22");
          let view1 = map1.getView();
          let view2 = map2.getView();

          view1.on('change:resolution', function(event) {
            syncViews(event,map2.getView());
          });
          view1.on('change:center', function(event) {
            syncViews(event,map2.getView());
          });

          view2.on('change:resolution', function(event) {
            syncViews(event,map1.getView());
          });
          view2.on('change:center', function(event) {
            syncViews(event,map1.getView());
          });
          $('#loadmap1').on('click', function(e){
           e.preventDefault(); 
           getWqImage(map1);
            $('#loader').css("display", "inline-block");
          });
          $('#loadmap2').on('click', function(e){
           e.preventDefault();     
            $('#loader').css("display", "inline-block");
           getWqImage(map2);
          });
        } else if (split == 4) {
          document.getElementById("map").style.display = "none";
          document.getElementById("loadmap").style.display ="none";
          document.getElementById("screen2btns").style.display = "none";
          document.getElementById("maps2").style.display = "none";
          $(".ol-viewport").remove();
          document.getElementById("maps4").style.display = "inline-block";
          document.getElementById("screen4btns").style.display = "inline-block";
          let map1 = init_map("map41");
          let map2 = init_map("map42");
          let map3 = init_map("map43");
          let map4 = init_map("map44");
          let view1 = map1.getView();
          let view2 = map2.getView();
          let view3 = map3.getView();
          let view4 = map4.getView();
          view1.on('change:resolution', function(event) {
            syncViews(event,map2.getView());
            syncViews(event,map3.getView());
            syncViews(event,map4.getView());
          });
          view1.on('change:center', function(event) {
            syncViews(event,map2.getView());
            syncViews(event,map3.getView());
            syncViews(event,map4.getView());
          });

          view2.on('change:resolution', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map3.getView());
            syncViews(event,map4.getView());
          });
          view2.on('change:center', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map3.getView());
            syncViews(event,map4.getView());
          });

          view3.on('change:resolution', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map2.getView());
            syncViews(event,map4.getView());
          });
          view3.on('change:center', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map2.getView());
            syncViews(event,map4.getView());
          });

          view4.on('change:resolution', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map2.getView());
            syncViews(event,map3.getView());
          });
          view4.on('change:center', function(event) {
            syncViews(event,map1.getView());
            syncViews(event,map2.getView());
            syncViews(event,map3.getView());
          });

          $('#loadmap41').on('click', function(e){
           e.preventDefault();
            $('#loader').css("display", "inline-block"); 
           getWqImage(map1);
          });
          $('#loadmap42').on('click', function(e){
           e.preventDefault(); 
            $('#loader').css("display", "inline-block");
           getWqImage(map2);
          });
          $('#loadmap43').on('click', function(e){
           e.preventDefault(); 
            $('#loader').css("display", "inline-block");
           getWqImage(map3);
          });
          $('#loadmap44').on('click', function(e){
           e.preventDefault(); 
            $('#loader').css("display", "inline-block");
           getWqImage(map4);
          });
        } else {
          if (document.getElementById("maps2").style.display != "none") {
            console.log("two maps detected");
            document.getElementById("maps2").style.display = "none";
            document.getElementById("screen2btns").style.display = "none";
            $(".ol-viewport").remove();
          } else if (document.getElementById("maps4").style.display != "none") {
            console.log("Four maps detected");
            document.getElementById("maps4").style.display = "none";
            document.getElementById("screen4btns").style.display = "none";
            $(".ol-viewport").remove();
          }
          document.getElementById("map").style.display = "inline-block";
          document.getElementById("loadmap").style.display ="inline-block";
          $(".ol-viewport").remove();
          init_map("map");
        }
      });

      init_all();

    });
    return public_interface;
  }());