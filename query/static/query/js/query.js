const app_control = (function() {
    var chcks, map, product,series,dateS, dateInt, products;
    var update_chcks, init_all, init_events, public_interface, add_table_column,
    read_csv_file, init_map, init_table_upload, create_chart, loadCsv,
    get_query_opts, qdata;

    /*
    VARIABLES INITIALIZATIONS
    */
    const source = new ol.source.Vector({wrapX: false});   
    const vector = new ol.layer.Vector({
      source: source
    });
    const popelement = document.getElementById('popup');

    const popup = new ol.Overlay({
        element: popelement,
        positioning: 'bottom-center',
        stopEvent: false
    });

    var products = ['chlorophyll', 'Trophic State'];
    var pnt1series = [[12, 15,18],[30,41,45]];
    var pnt2series = [[10, 11,19],[13,14,24]];
    var pnt3series = [[24, 65,88],[31,41,45]];

    /*
    DEFINE THE FUNCTIONS
    */  
    update_chcks = function(){
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

    init_map = function(target){
      let raster = new ol.layer.Tile({
        source: new ol.source.OSM()
      });

      const csvlyr = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'toner',
        }),
      })

      raster.set('name', 'baselayer')
      const scaleline = new ol.control.ScaleLine({units: 'us'});
      const fullscreen = new ol.control.FullScreen();

      let controls = [fullscreen, scaleline];

      return new ol.Map({
        controls: ol.control.defaults().extend(controls),
        interactions: ol.interaction.defaults(),
        // .extend([
        //     new ol.interaction.Select({
        //         condition: function(evt) {
        //             return evt.type == 'pointermove' || evt.type == 'singleclick';
        //         },
        //     })
            // ]),
        layers: [raster],
        target: target,
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 8,
          // minZoom: 7
        })
      });
    }

    get_query_opts = function(){
        products = {};
        $("input[type='checkbox']").click(function(e){
            if ($(this).prop("checked")) {
                if (typeof products[e.target.id] === 'undefined'){
                    products[e.target.id] = e.target.id;
                    for (const key in chcks ) {
                        if (key == this.id ){
                            const strO = JSON.stringify(this.id);
                            const pltfms = $('#platformSs').val();
                            if (!pltfms || pltfms != chcks[this.id]['platform']) {
                                $('#platformSs').append($('<option>', {
                                    value: chcks[strO],
                                    text: chcks[this.id]['platform']
                                }));
                            }
                            const snsrs = $('#sensorSs').val();
                            if (!snsrs || snsrs != chcks[this.id]['sensor']) {
                                $('#sensorSs').append($('<option>', {
                                    value: chcks[strO],
                                    text: chcks[this.id]['sensor']
                                }));
                            }
                            const prdcts = $('#productSs').val();
                            if (!prdcts || prdcts != chcks[this.id]['index']) {
                                $('#productSs').append($('<option>', {
                                    value: chcks[strO],
                                    text: chcks[this.id]['index']
                                }));
                            }
                        }
                    }
                }
            } else if ($(this).prop("checked") == false) {
                delete products[this.id];
                // const strD = JSON.stringify(this.id);
                // $("#platformSs option[value="+strD+"]").remove();
                // $("#sensorSs option[value="+strD+"]").remove();
                // $("#productSs option[value="+strD+"]").remove();
            } 
        });
        $('#start_date').on('change',function(e){
            products["startDate"] = $('#start_date').val();
        });
        $('#end_date').on('change',function(e){
            products["endDate"] = $('#end_date').val();
        });

        return products;
    }

    init_events = function(){
        map.on('click', function(evt){
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {

                // plot point data
                $('#pntplt').on('click', function(e){
                    e.preventDefault();
                    const platform = $('platformSs').val();
                    const sensor = $('sensorSs').val();
                    const product = $('productSs').val();
                    const compiledData = [];
                    console.log(qdata);

                    JSON.parse(qdata).dataframe.forEach((d) => {
                        if (product === d.product && sensor === d.sensor && platform === d.platform && feature.get('name')) {
                            const darray = [];
                            darray.push(parseInt(d.time) * 1000);
                            darray.push(d.value);
                            compiledData.push(darray);
                        }
                    });
                    console.log(compiledData);

                });

                // Show PnG
                popup.setPosition(evt.coordinate);
                $(popelement).popover({
                    placement:'top',
                    html: true,
                    content: feature.get('name'),
                });
                $(popelement).popover('show');
            } else {
                $(popelement).popover('dispose');
            }
        });
    }


    function create_chart(product,series, dateS,dateInt){
        var options = {
        chart: {
            renderTo: 'chart',
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
            pointStart: Date.UTC(2010, 0, 0),
            pointInterval: 3600 * 1000 * dateInt 
        }]
        };

        var chart = new Highcharts.Chart(options);
    }

    function removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }

    function loadCsvToMap(){
        $('.fileget').on('click', function(e){
            e.preventDefault();
            var csvtitle = $(this).data();
            var xhr = $.ajax({
                type: "POST",
                url: "get_csv",
                dataType: 'json',
                data: csvtitle,
                cache: csvtitle,
            });
            xhr.done(function (data){
                if ("success" in data) {
                    const vals = data.data;
                    const features = [];
                    for (let x=0; x < vals.length; x++) {
                        features.push(createPointFeature(vals[x]));
                    }
                    source.clear();
                    const sourceobject = createSourceForFeatures(features);

                    // Add source as layer in the map object
                    map.addLayer(sourceobject);
                }
            });
            $('#qfile').on('click', function(e) {
                e.preventDefault();
                // Query CSV Data
                products["filetitle"] = Object.values(csvtitle)[0];
                // ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')
                queryData(products);
            });
        });
    }

    function createPointFeature(latlonarr){
        let lonval = latlonarr.lon;
        let latval = latlonarr.lat;
        let point = [lonval, latval];
        let feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(point)),
            labelPoint: new ol.geom.Point(ol.proj.fromLonLat(point)),
            name: latlonarr.id
        });
        const iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            size: [715, 715],
            src: static_url + 'query/imgs/loc.png',
            scale: 0.1,
          }),
        });
        feature.setStyle(iconStyle);

        return feature
    }

    function createSourceForFeatures(features){
        source.addFeatures(features);
        const csvpoints = new ol.layer.Vector({
            source: source,
        });
        return csvpoints
    }

    function queryData(query_dict){
        var xhr = $.ajax({
                type: "POST",
                url: "query_csv",
                dataType: 'json',
                data: query_dict,
                cache: query_dict,
        });
        xhr.done(function (data){
            qdata = data['dataframe'];
           return qdata 
        });
    }

    /*
    Initialize Functions
    */
    init_all = function(){
        map = init_map("map");
        update_chcks();
        loadCsvToMap();
        get_query_opts();
        init_events();
    }
    /*
    PUBLIC INTERFACE
    */
    public_interface = {};

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
        chcks = $('#chckpanel').data('checks');
        init_all();
        map.addOverlay(popup);
        create_chart(products[0],pnt1series[0],'2010,01,01',24);
    });
    return public_interface;
}());