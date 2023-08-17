// Global Variables
let draw;
const source = new ol.source.Vector({wrapX: false});
const vector = new ol.layer.Vector({source: source,});
let chart;
// Classes
class Point {
      constructor(lat, lon, id, parentFileName) {
            this.lat = parseFloat(lon);
            this.lon = parseFloat(lat);
            this.id = parseInt(id);
            this.parentFileName = parentFileName;
      }
      // static displayName = "Point";

      geometry() {
            let op = new ol.geom.Point(ol.proj.fromLonLat([this.lat, this.lon]));
            return op;
      }
      feature() {
            return new ol.Feature({
                  geometry: this.geometry(),
                  labelPoint: this.geometry(),
                  name: {id:this.id, filename: this.parentFileName}
            });
      }
      iconStyle() {
             return new ol.style.Style({
                  image: this.iconMarker(),
            });
      }
      iconMarker(){
            return new ol.style.Icon({
                  anchor: [0.5, 46],
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'pixels',
                  opacity: 0.75,
                  size: [715, 715],
                  src: static_url + 'maps/imgs/loc.png',
                  scale: 0.1,
            });
      }
      addPointMarker() {
            let feat = this.feature();
            let style = this.iconStyle();
            feat.setStyle(style);

            return feat
      }
      getSeries() {
            return 
      }
}

class Polygon {
      constructor(){

      }
}
class csvFile {
      constructor(file, sourceObj, mapObj) {
            this.file = file;
            this.sourceObj = sourceObj;
            this.mapObj = mapObj;
      }
      createCSV(){
            const delElement = document.getElementById(this.file.name+'delcsvbtn');
            if (delElement === null){
                  var csvElement = uploadCsvsToLayers(this.file);
                  return csvElement;
            } 
      }
      saveCsv(){
            if (sessionStorage.getItem(this.file.name) === null) {
                  return sessionStorage.setItem(this.file.name, this.file.name);
            }
      }

      readCsv(){
            var fileMetadata = {};

      }
      loadCsv(){
            var pntLayers = readCsv(this.file, this.sourceObj, this.mapObj);
            console.log(pntLayers);
            return pntLayers;
      }
      unloadCsv(){
            this.sourceObj.clear();
      }
      deleteCsv(){
            this.unloadCsv();
            sessionStorage.removeItem(this.file.name);
      }
}


// Global Functions
function getLake(){
      const lake_obj = {}
      const lakeVal = $('lake_select').val();
      if (lakeVal === 'Select a Lake'){
            return lake_obj.lake = lakeVal;
      } else {
            return lake.error = "Select a Lake";
      }
      return lake_obj
}
function initMap(element) {
      let raster = new ol.layer.Tile({
            source: new ol.source.OSM()
      });
      raster.set('name', 'baselayer');
      const scaleline = new ol.control.ScaleLine({units: 'metric'});
      const fullscreen = new ol.control.FullScreen();
      let controls = [fullscreen, scaleline];
      return new ol.Map({
        controls: ol.control.defaults().extend(controls),
        interactions: ol.interaction.defaults(),
        layers: [raster, vector],
        target: element,
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 7,
          // minZoom: 9
        })
      });
}
function initChart(plottype){
      var options = {
      chart: {
                  renderTo: 'chartContainer',
                  type: plottype,
      },    
      xAxis: {
                  type: 'datetime'
      },    
      title: {
                  text: "Time Series View of WQ Products"
      },    
      yAxis: [],
      series: [],
      lang: {
            noData: "No Data to Display",
      },
      exporting: {
            csv: {
                  itemDelimeter: ','
            }
      }
      };

      chart = new Highcharts.Chart(options);
}
function addMapCanvas(id){
      var mapId = id + '_id';
      var legendurl = '';
      var mapDiv = document.createElement('div');
      mapDiv.className = 'col';
      mapDiv.classList.add('mapcanvas');
      mapDiv.setAttribute('id', id);
      var mapSpan = document.createElement('span');
      mapSpan.className = 'close';
      mapSpan.innerHTML = 'x';
      mapSpan.addEventListener('click', function() {
            const mapcanvases = document.getElementsByClassName('mapcanvas').length;
            if (mapcanvases <= 4) {
                  console.log($('#addCanvas').hasClass('hidden'));
                  if ($('#addCanvas').hasClass('hidden')) {
                        $('#addCanvas').removeClass('hidden');
                  }
            }
            const selectDiv = document.getElementById('mapcanvas');
            selectDiv.removeChild(selectDiv.querySelector('option[value="'+id+'"]'));
            this.parentElement.remove();
      });
      var mapLoaderdiv = document.createElement('div');
      mapLoaderdiv.className ='loader';
      mapLoaderdiv.setAttribute('id', id+'_loader');
      var maploaderimg = document.createElement('img');
      maploaderimg.setAttribute('id', id+'_loaderimg');
      maploaderimg.setAttribute('src', static_url + 'maps/imgs/loading.gif');
      var maploaderp = document.createElement('p');
      maploaderp.setAttribute('style','text-align:center');
      maploaderp.innerHTML = "Loading Data";
      mapLoaderdiv.append(maploaderimg);
      mapLoaderdiv.append(maploaderp);
      var mapTitle = document.createElement('div');
      mapTitle.className = 'mapTitle';
      var mapDivContainer = document.createElement('div');
      mapDivContainer.setAttribute('id', mapId);
      mapDivContainer.className = 'mapdiv';
      var mapPopup = document.createElement('div');
      mapPopup.setAttribute('id', mapId+'_popup');
      var mapLegendDiv = document.createElement('div');
      mapLegendDiv.className ='legend';
      var mapLegendImgDiv = document.createElement('img');
      mapLegendImgDiv.setAttribute('src', static_url+legendurl);
      mapLegendImgDiv.className = 'height100';
      mapLegendImgDiv.classList.add('width100');
      mapDiv.append(mapLoaderdiv);
      mapDiv.append(mapSpan);
      mapDiv.append(mapTitle);
      mapDivContainer.append(mapPopup);
      mapDiv.append(mapDivContainer);
      mapLegendDiv.append(mapLegendImgDiv);
      mapDiv.append(mapLegendDiv);
      $('#mapContainer').append(mapDiv);
      //initMap(mapId);
      const popid = mapId+'_popup';
      const popelement = document.getElementById(popid);
      const popup = new ol.Overlay({
            element: popelement,
            positioning: 'bottom-center',
            stopEvent: false,
      });
      var mapId_m = initMap(mapId);
      mapId_m.addOverlay(popup);
      var mapE = '#' + mapId
      $(mapE).data('map', mapId_m);

      // Display Popup
      mapId_m.on('click', function(evt){
            const feature = mapId_m.forEachFeatureAtPixel(evt.pixel, function (feature){
                  return feature;
            });
            if (feature) {
                  popup.setPosition(evt.coordinate);
                  const featHeader = feature.get('name');
                  $(popelement).popover({
                        placement: 'top',
                        html: true,
                        // title: "File Name is " + featHeader.filename + " Point "+ featHeader.id,
                        content: popoverContent(),
                        trigger: 'focus',
                  });
                  $(popelement).popover('show');
            } else {
                  $(popelement).popover('dispose');
            }
      });
}
function popoverContent() {
      var btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#queryPntModal');
      btn.className = 'btn' ;
      btn.classList.add('btn-primary');
      btn.innerHTML = 'Query' ;
      return btn;
}
function validateAddCanvas(){
      var x = document.forms["addcanvas"]["mcname"].value;
      if (x == "") {
            alert("name must be filled out");
            return false;
      } else {
            if ($('#'+x).hasClass('mapcanvas')){
                  alert('Map Canvas with this ID exists. Use another ID');
                  $('#addMapCanvasModal').modal('show');

            } else {
                  addMapCanvas(x);
                  $('#mapcanvas').append($('<option>', {
                        value: x,
                        text: x
                      }));
            }
      }
}
function readCsv(file, sourceObj, mapObj) {

      const csvread = new FileReader();
      csvread.addEventListener('loadend', (event) => {
            const list = event.target.result;
            // const list_rows = list.split(/[\r,\n]+/);
            const list_rows = list.split(/\r?\n/);
            const pointFeatures = []
            for (const lines in list_rows){
                  if (lines != 0) {
                        const ids = list_rows[lines];
                        if (ids !== "") {
                              const ids_split = ids.split(',');
                              const id = ids_split[0];
                              const x = ids_split[1];
                              const y = ids_split[2];
                              const point = new Point(x, y, id, file.name);
                              pointFeatures.push(point.addPointMarker());
                        }
                  }
            }
            sourceObj.addFeatures(pointFeatures);
            const pointLayer = addVectorLayer(sourceObj);
            mapObj.addLayer(pointLayer);
      });
      csvread.readAsText(file);
}
function addMapSource() {
      return new ol.source.Vector({wrapX: false});
}
function addVectorLayer (sourceObj) {
      return new ol.layer.Vector({
            source: sourceObj
    });
}
function addVectorLayerStyle(sourceObj){
      const style = new ol.style.Style({
            image: new ol.style.Icon({
                  anchor: [0.5, 46],
                  anchorXUnits: 'fraction',
                  anchorYUnits: 'pixels',
                  opacity: 0.75,
                  size: [715, 715],
                  src: static_url + 'maps/imgs/loc.png',
                  scale: 0.1,
            })
      });
      return style;
}
function uploadCsvsToLayers(file){
      // File Name 
      var frow = document.createElement('tr');
      var fname = document.createElement('td');
      fname.textContent = file.name;
      // View File
      var fread = document.createElement('td');
      var freadbtn = document.createElement('button');
      freadbtn.setAttribute('type','button');
      freadbtn.setAttribute('id',file.name+'readcsvbtn');
      freadbtn.className = 'btn';
      freadbtn.classList.add('btn-success');
      freadbtn.classList.add('btn-sm');
      freadbtn.textContent = 'View File';
      fread.append(freadbtn);
      // Delete Button
      var fdelete = document.createElement('td');
      var fdeletebtn = document.createElement('button');
      fdeletebtn.setAttribute('type','button');
      fdeletebtn.setAttribute('id',file.name+'delcsvbtn');
      fdeletebtn.className = 'btn';
      fdeletebtn.classList.add('btn-danger');
      fdeletebtn.classList.add('btn-sm');
      fdeletebtn.textContent = 'Delete';
      fdelete.append(fdeletebtn);
      // Load Button
      var fload = document.createElement('td');
      var floadbtn = document.createElement('button');
      floadbtn.setAttribute('type','button');
      floadbtn.setAttribute('id',file.name+'loadcsvbtn');
      floadbtn.className = 'btn';
      floadbtn.classList.add('btn-primary');
      floadbtn.classList.add('btn-sm');
      floadbtn.textContent = 'Load Points';
      floadbtn.addEventListener('click', function(e){
            this.classList.add('hidden');
            var unloadbtn = document.getElementById(file.name+'unloadcsvbtn');
            unloadbtn.classList.remove("hidden");
      });
      var fmapdeletebtn = document.createElement('button');
      fmapdeletebtn.setAttribute('type','button');
      fmapdeletebtn.setAttribute('id', file.name+'unloadcsvbtn');
      fmapdeletebtn.className = 'btn';
      fmapdeletebtn.classList.add('btn-danger');
      fmapdeletebtn.classList.add('btn-sm');
      fmapdeletebtn.classList.add('hidden');
      fmapdeletebtn.textContent = 'Clear Points';
      fmapdeletebtn.addEventListener('click', function(e){
            this.classList.add('hidden');
            var loadbtn = document.getElementById(file.name+'loadcsvbtn');
            loadbtn.classList.remove("hidden");
      });
      fload.append(floadbtn);
      fload.append(fmapdeletebtn);
      frow.append(fname);
      frow.append(fread);
      frow.append(fload);
      frow.append(fdelete);

      // Append to Table
      $('tbody').append(frow);
}
function updateChecks(){
      const chcks = $('#chckpanel').data('checks');
      for (const value in chcks) {
            $('#chckpanel').append($('<div class="form-check">').append(
                  ($('<input>', {
                        class:"form-check-input",
                        type:"checkbox",
                        value: value,
                        id: value
                  })),
                  ($('<label>', {
                        class:"form-check-label",
                        for: value,
                        text: chcks[value]['display']
                  }))
                  )
            )
      }
}

function updateMapOptions(){
      var options = $('#navpanel').data('datasets');
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
        const m_option1 = $('#option1').val();
        console.log(m_option1);
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
          const m_option2 = $('#option2').val();
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
            const m_option3 = $('#option3').val();
            console.log(m_option1, m_option2, m_option3);
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

function getMapSelectors(){
      const map_dict = {};

      return map_dict;
}

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

      const m_option1 = $('#option1').val();
      const m_option4 = $('#option4').val();
      const options = $('#navpanel').data('datasets');
      const chcks = $('#chckpanel').data('checks');
      if (m_option1 == 'lulc') {
            $('#landcoverlegend').css('display', 'inline-block');
        getMap({
         "type": $('#option1').val(),
         "product": $('#option2').val(),
         "id": $('#mapcanvas').val()
        }, workinglayer, which);
        const mapelement = $('#'+$('#mapcanvas').val());
        const product = $('#option2').val();
        mapelement[0].childNodes[2].innerHTML = options[m_option1]['options'][$('#option2').val()]['display'];
      } else {
            $('#landcoverlegend').css('display', 'none');
      getMap({
         "type": $('#option1').val(),
         "mission": $('#option2').val(),
         "sensor": $('#option3').val(),
         "product": $('#option4').val(),
         "startDate": $('#start_date').val(),
         "endDate": $('#end_date').val(),
         "id": $('#mapcanvas').val()
            }, workinglayer, which);
      const mapelement = $('#'+$('#mapcanvas').val());
      const mission = $('#option2').val();
      const product = $('#option4').val();
      const sensor = $('#option3').val();
      for (const key in chcks) {
            const opt1 = chcks[key]['index'];
            const opt2 = chcks[key]['platform'];
            const opt3 = chcks[key]['sensor'];
            if ( opt1  === product && opt2 === mission && opt3 === sensor ){
                        mapelement[0].childNodes[2].innerHTML = chcks[key]['display'];
            }
            // for ( const vals in chcks[key]) {
                  
            // }
      }
      // chcks.forEach((d)=> {
      //       if (d['index'] === product && d['platform'] === mission) {
      //             mapelement[0].childNodes[2].innerHTML = d['display'];
      //       }
      // });
      if (product === 'chlor_a') {
            console.log(mapelement[0].childNodes[4]);
            mapelement[0].childNodes[4].childNodes[0].src = static_url + 'maps/imgs/chlor_a_1.png';
      }
      }
}

// Main Functions
function getMap(dict, layer, which){
      let xhr = $.ajax({
                type: "POST",
                url: "get_map/",
                dataType: 'json',
                data: dict,
                cache: dict,
        });
      xhr.done(function(data){
            if ("success" in data) {
                  loadMapLayer(data, layer, which);
                  $('#'+dict.id+'_loader').css("display", "none");
            } else if ("error" in data){
                  $('#loader').css("display", "none");
                  alert('Oops! There was an error processing your request " \n \
                        '+ data.error+'". \n \
                        1. Re-check your selections \n \
                        2. Make sure data is available');
            }
      });
      return ;
}
function loadMapLayer(data, layer, which) {
      which.getLayers().forEach(layer => {
            if (layer.get('name') != undefined & layer.get('name') === 'workinglayer') {
                  which.removeLayer(layer);
            };
      });
      layer.getSource().setUrl(data.url);
      which.addLayer(layer);
      return;
}
function getHTMLMapObj(id){
      return $('#'+id).data('map');
}
function getFilterVal(){
      const queryDict = {};
            queryDict["mission"] = $('#option2').val();
            queryDict["sensor"] = $('#option3').val();
            queryDict["product"] = $('#option4').val();
            queryDict["startDate"] = $('#start_date').val();
            queryDict["endDate"] = $('#end_date').val();
      return queryDict;
}
function getSeriesFromPoint(query_dict){
      let xhr = $.ajax({
                type: "POST",
                url: "seriesPoint",
                dataType: 'json',
                data: query_dict,
                cache: query_dict,
        });
      xhr.done(function(data){
            // Do something here
      });
}
function loadSeriesToChart(series){
      // Do something here
}
function iDraw(type, sourceObj) {
      const drawObj = new ol.interaction.Draw({
            source: sourceObj,
            type: type
      });
      return drawObj;
}
function addInteraction(mapObj, drawObj){
      return mapObj.addInteraction(drawObj);
}
function addPntInter(){
      const mapObj = getHTMLMapObj('random1');
      const sourceObj = addMapSource();
            mapObj.removeInteraction(draw);
            vector.getSource().clear();
            const drawObj = iDraw('Point', source);
            drawObj.on('drawend', event => {
                  mapObj.removeInteraction(drawObj);
            });
            mapObj.addInteraction(drawObj);
            sourceObj.on('addfeature', function(evt){
                  const feature = evt.feature;
                  const featType = feature.getGeometry().getType();
                  if (featType === 'Point') {
                        const featTransformed = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326')
                        const coords = featTransformed.flatCoordinates;
                        $('#addPointModal').modal('show');
                        $('#latvalue').val(coords[1]);
                        $('#lonvalue').val(coords[0]);
                        // document.getElementById('latvalue') = coords[1];
                        // document.getElementById('lonvalue') = coords[0];
                        // form.innerHTML = '';
                        // var inputElem = document.createElement('input');
                        // inputElem.type = 'hidden';
                        // inputElem.name = 'csrfmiddlewaretoken';
                        // inputElem.value = $( "input[name='csrfmiddlewaretoken']" ).val();
                        // form.append(inputElem);
                        // const latText = document.createElement('label');
                        // latText.setAttribute('for', 'latvalue');
                        // latText.innerHTML = "Latitude Value is:";
                        // form.append(latText);
                        // const latinput = document.createElement('input');
                        // latinput.setAttribute('min', '-90');
                        // latinput.setAttribute('max', '90');
                        // latinput.setAttribute('step', '.01');
                        // latinput.setAttribute('value', coords[1]);
                        // latinput.setAttribute('id', 'latvalue');
                        // form.append(latinput);
                        // const lonText = document.createElement('label');
                        // lonText.setAttribute('for', 'lonvalue');
                        // lonText.innerHTML = "Longitude Value is:";
                        // form.append(lonText);
                        // const loninput = document.createElement('input');
                        // loninput.setAttribute('min', '-180');
                        // loninput.setAttribute('max', '180');
                        // loninput.setAttribute('step', '.01');
                        // loninput.setAttribute('value', coords[0]);
                        // loninput.setAttribute('id', 'lonvalue');
                        // form.append(loninput);
                        // const revise = document.createElement('small');
                        // const reviseA = document.createElement('a');
                        // reviseA.setAttribute('id', "addpnttomap");
                        // reviseA.setAttribute('data-bs-dismiss', 'modal');
                        // reviseA.setAttribute('href', "#");
                        // reviseA.innerHTML = "Change Your Point";
                        // revise.append(reviseA);
                        // form.append(revise);
                        // const btn = document.createElement('button');
                        // btn.setAttribute('type', 'submit');
                        // btn.setAttribute('id', 'addpntbtn');
                        // btn.setAttribute('data-bs-dismiss', 'modal');
                        // btn.className = 'btn';
                        // btn.classList.add('btn-primary');
                        // btn.classList.add('btn-block');
                        // btn.innerHTML = "Add Point";
                        // form.append(btn);
                        // Add Interaction
                        const addpnt = document.getElementById('addpntbtn');
                        addpnt.addEventListener('click', function(evt){
                              evt.preventDefault();
                              sourceObj.clear();
                              const pnt = new Point(coords[1], coords[0], 2,'random point');
                              const pntfeat = []
                              pntfeat.push(pnt.addPointMarker());
                              sourceObj.addFeatures(pntfeat);
                              const pointLayer = addVectorLayer(sourceObj);
                              mapObj.addLayer(pointLayer);
                        });
                  }
      });
}
function addPolInter(){
      const mapObj = getHTMLMapObj('random1');
      mapObj.removeInteraction(draw);
      vector.getSource().clear();
      const drawObj = iDraw('Polygon', source);
      mapObj.addInteraction(drawObj);
      source.on('addfeature', function(evt){
                  const feature = evt.feature;
                  const featType = feature.getGeometry().getType();
                  console.log(featType);
                  console.log(feature);
                  if (featType === 'Polygon') {
                        const featTransformed = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326')
                        const coords = featTransformed.flatCoordinates;
                        const coordspairs = [];
                        while (coords.length) coordspairs.push(coords.splice(0,2));
                        $('#addPolyModal').modal('show');
                  }
      });
}
$(function(){
      // Prevent all inputs from having spaces
      initChart('scatter');
      addMapCanvas('one');
      // addMapCanvas()
      $("input[type!='file']").on({
            keydown: function(e) {
                  if (e.which === 32)
                        return false;
                  },
            change: function() {
                  this.value = this.value.replace(/\s/g,"");
            }
      });
      // Display Query Check List
      updateChecks();

      // Update Map Select Options
      updateMapOptions();
      // Add Canvas
      // addMapCanvas('random', 'random1', 'maps/imgs/chlor_a_1.png');

      // initMap('random1');
      
      $('#mc_name').on('click', function(e){
            // $('#mc_name').on('submit', function(e){
            e.preventDefault();
            const mapcanvases = document.getElementsByClassName('mapcanvas').length;
            const addCanBtn = document.getElementById('addCanvas');
            if (mapcanvases >= 4) {
                  addCanBtn.classList.add('hidden');
            } else {
                  if ($('#addCanvas').hasClass('hidden')) {
                        $('#addCanvas').removeClass('hidden');
                  }
                  var mapString = validateAddCanvas();

            }
      });

      /* Handle Csv */
      // Upload Csv to Layer
      const uploadcsvid = document.getElementById('select_csv');
      uploadcsvid.addEventListener('input', (event) => {
            $('#uploadcsvform').on('click', function(e) {
                  e.preventDefault();
                  const csvFileList = event.target.files;
                  for (var i=0; i<csvFileList.length; i++){
                        const newFile = csvFileList[i];
                        const sourceObj = addMapSource();
                        const mapObj = $('#random1').data('map');
                        const newFileObj = new csvFile(newFile, sourceObj, mapObj);
                        // Add File to Session Storage
                        // Create CSV element
                        newFileObj.createCSV();

                        // Save CSV to Session
                        newFileObj.saveCsv();

                        // Display Csv Metadata
                        // const readcsvmet = document.getElementById(newFile.name+'readcsvbtn');
                        // $(newFile.name+'readcsvbtn').on('click', function(e){
                        //       newFileObj.readCsv();
                        // });

                        // Delete Csv to Oblivion
                        const delcsvid = document.getElementById(newFile.name+'delcsvbtn');
                        delcsvid.addEventListener('click', function(e){
                              const index = e.target.parentNode.parentNode.rowIndex;
                              console.log(index);
                              if (index === 'undefined' || index === -1) {
                                    console.log(this);
                              } else {
                                    newFileObj.deleteCsv();
                                    document.getElementById('csvlayers').deleteRow(index);
                              }
                        });

                        // Load CSV to Map
                        const ldcsvid = document.getElementById(newFile.name+'loadcsvbtn');
                        const unldcsvid = document.getElementById(newFile.name+'unloadcsvbtn');
                        ldcsvid.addEventListener('click', function(e){
                              newFileObj.loadCsv();
                        });
                        unldcsvid.addEventListener('click', function(e){
                              newFileObj.unloadCsv();
                        });
                  }
            });
      });

      $('#loadmap').on('click', function(e){
           e.preventDefault();
           const id = $('#mapcanvas').val();
           $('#'+id+'_loader').css("display", "inline-block");
           const mapObj = getHTMLMapObj(id+'_id');
           getWqImage(mapObj);
     })

      // // Add Interaction
      $('#addpnttomap').on('click', function(){
            addPntInter();
            // const addpnt = document.getElementById('addpntbtn');
            // addpnt.addEventListener('click', function(evt){
            //       evt.preventDefault();
            //       console.log(evt);
            //       vector.setStyle(addVectorLayerStyle());
            // });
      });

      $('#drawPolygon').on('click', function(){
            addPolInter();
      })

      $('[data-target="#collapseMap"]').on('click', function(){
            var state = $(this);
            console.log(state);
      });

      $("#addPointModal").on("hidden.bs.modal", function(e){
            $(this).find('input').val('').end();
      });
      
      // Ensure close buttons closes elements
      var closebtns = document.getElementsByClassName("close");
      var i;
      for (i = 0; i < closebtns.length; i++) {
        closebtns[i].addEventListener("click", function() {
          this.parentElement.style.display = 'none';
        });
      }
});