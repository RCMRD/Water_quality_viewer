const app_control = (function() {
    var chcks, map, product,series,dateS, dateInt, products, chart;
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

    // function update_control(which, val, value_type) {
    //         const control = $('#' + which);
    //         if (!control.val() || control.val() != chcks[val][value_type]) {
    //             control.append($('<option>', {
    //                 value: chcks[val][value_type],
    //                 text: chcks[val][value_type]
    //             }));
    //         }
    //     }

    //     function update_options(control, val, value_type) {
    //         const all_checked = $('input:checkbox:checked');
    //         let cleared = false;
    //         all_checked.each((i, element) => {
    //             if (chcks[element.value]['platform'] === val) {
    //                 if (!cleared) {
    //                     $('#sensorSs').empty();
    //                     $('#productSs').empty();
    //                     cleared = true;
    //                 }
    //                 update_control('sensorSs', element.value, 'sensor');
    //                 update_control('productSs', element.value, 'index');
    //             }
    //         });
    //     }

    //     function add_product(product_id) {
    //         for (const key in chcks) {
    //             if (key === product_id) {
    //                 const platform_control = $('#platformSs');
    //                 const need_update = $('#platformSs option').length === 0 || platform_control.val() === chcks[product_id]['platform'];
    //                 if ($("#platformSs option:contains(" + chcks[product_id]['platform'] + ")").length === 0) {
    //                     update_control('platformSs', product_id, 'platform');
    //                 }

    //                 if (need_update) {
    //                     update_control('sensorSs', product_id, 'sensor');
    //                     update_control('productSs', product_id, 'index');
    //                 }
    //             }
    //         }
    //     }

    init_events = function(){
        map.on('click', function(evt){
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {

                // plot point data
                $('#pntplt').on('click', function(e){
                    e.preventDefault();
                    const platform = $('#platformSs').val();
                    const sensor = $('#sensorSs').val();
                    const product = $('#productSs').val();
                    const compiledData = [];

                    qdata.forEach((d) => {
                        if ( product === d.product && sensor === d.sensor && platform === d.platform && feature.get('name') === d.geom_id ){
                            const darray = [];
                            darray.push(d.time);
                            if (d.value === -9999){
                                darray.push(null); 
                            } else {
                                darray.push(d.value);
                            }
                            compiledData.push(darray);
                        }
                    });
                    const labels = getLabels(product, sensor);
                    create_chart(labels, compiledData);

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


    function init_chart(){
        var options = {
        chart: {
            renderTo: 'chart',
            type: 'scatter'
        },    
        xAxis: {
            type: 'datetime',
            tooltip: {
                    xDateFormat: '%Y-%m-%d',
                }
        },    
        title: {
            text: "Queried Point Time Series Chart"
        },    
        yAxis: [],
        series: [],
        lang : {
            noData: "Data not Available for Display"
        }
        };

        chart = new Highcharts.Chart(options);
    }
    function getLabels(product,mission){
        const label = {};
        if (product === "chlor_a") {
            label["ptext"] = "Chlorophyll A";
            label["pformat"] = "mg/m3";
        } else if ( product === 'SD' ){
            label["ptext"] = "Secchi Depth";
            label["pformat"] = "m";
        } else if ( product === 'TSI' ){
            label["ptext"] = "Trophic State Index";
            label["pformat"] = "%";
        } else if ( product === 'TSI_R' ){
            label["ptext"] = "Trophic State Index Reclassified";
            label["pformat"] = "%";
        }
        if (mission === "8") {
            label["mtext"] = "Landsat 8";
        } else if (mission === "2") {
            label["mtext"] = "Sentinel 2";
        } else if (mission === "aqua") {
            label["mtext"] = "Modis Aqua";
        } else if (mission === "terra") {
            label["mtext"] = "Modis Terra";
        }
        return label;
    }

    function create_chart(labels, series) {
        init_chart();
        chart.addAxis({id:1}, false);
        chart.addSeries({
            name: labels.mtext + ' ' + labels.ptext,
            yAxis: 1,
            data: series,
            tooltip: {
                    valueDecimals: 2,
                    valueSuffix: labels.pformat
                },
            label: labels.mtext,
        });
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
            $('#loader').css("display", "inline-block");
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
                    console.log(features);
                    source.clear();
                    const sourceobject = createSourceForFeatures(features);

                    // Add source as layer in the map object
                    map.addLayer(sourceobject);
                    $('#loader').css("display", "none");
                } else if ("error" in data ) {
                    $('#loader').css("display", "none");
                    alert("Oops!! Try Again. Make sure your selections are valid")
                }
            });
            $('#qfile').on('click', function(e) {
                e.preventDefault();
                $('#loader').css("display", "inline-block");
                init_chart();
                // Query CSV Data
                products["filetitle"] = Object.values(csvtitle)[0];
                queryData(products);
                $('#downloadAll').show(); 
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
            $('#loader').css("display", "none");
            $('#downloadAll').on('click', function(e){
                e.preventDefault();
                exportJSONToCSV(qdata);
            });
           return qdata 
        });
    }
    String.prototype.padLeft = function (length, character) {
        return new Array(length - this.length + 1).join(character || ' ') + this;
    };
    Date.prototype.toFormattedString = function () {
        return [String(this.getMonth()+1).padLeft(2, '0'),
        String(this.getDate()).padLeft(2, '0'),
        String(this.getFullYear()).substr(2, 2)].join("/") //+ " " +
        // [String(this.getHours()).padLeft(2, '0'),
        // String(this.getMinutes()).padLeft(2, '0')].join(":");
    };

    function exportJSONToCSV(objArray) {
        var origArr = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        var arr = []
        origArr.forEach((d) => {
            const fixedArr = [];
            const wd = new Date(d.time);
            fixedArr.push(wd.toFormattedString());
            fixedArr.push(d.value);
            fixedArr.push(d.product);
            fixedArr.push(d.sensor);
            fixedArr.push(d.platform)
            fixedArr.push(d.geom_id);
            arr.push(fixedArr);
        });
        var str =
          `${Object.keys(origArr[0])
            .map((value) => `"${value}"`)
            .join(',')}` + '\r\n';
        var csvContent = arr.reduce((st, next) => {
          st +=
            `${Object.values(next)
              .map((value) => `"${value}"`)
              .join(',')}` + '\r\n';
          return st;
        }, str);
        var element = document.createElement('a');
        element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        element.target = '_blank';
        element.download = 'export.csv';
        element.click();
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
        // $("input[type='checkbox']").click(function (e) {
        //         if ($(this).prop("checked")) {
        //             add_product(e.target.id);
        //         } else {
        //             $('#platformSs').empty();
        //             $('#sensorSs').empty();
        //             $('#productSs').empty();
        //             const all_checked = $('input:checkbox:checked');

        //             all_checked.each((i, element) => {
        //                 const needs_update = $('#platformSs option').length === 0 || $('#platformSs').val() === chcks[element.value]['platform'];
        //                 if ($("#platformSs option:contains(" + chcks[element.value]['platform'] + ")").length === 0) {
        //                     update_control('platformSs', element.value, 'platform');
        //                 }
        //                 if (needs_update) {
        //                     update_control('sensorSs', element.value, 'sensor');
        //                     update_control('productSs', element.value, 'index');
        //                 }

        //             });
        //         }
        //     });
    });
    return public_interface;
}());