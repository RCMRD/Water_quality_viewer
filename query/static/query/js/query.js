const app_control = (function() {
    var chcks, map, product,series,dateS, dateInt, products;
    var update_chcks, init_all, public_interface, add_table_column,
    read_csv_file, init_map, init_table_upload, create_chart, loadCsv;

    /*
    VARIABLES INITIALIZATIONS
    */

    // var csvsampledata =[
    var point1 = [33,-1];
    var point2 = [32,-2];
    var point3 = [33.3,0];
    // console.log(csvsampledata.indexOf('/n'));
    var products = ['chlorophyll', 'Trophic State'];
    var pnt1series = [[12, 15,18],[30,41,45]];
    var pnt2series = [[10, 11,19],[13,14,24]];
    var pnt3series = [[24, 65,88],[31,41,45]];

    /*
    DEFINE THE FUNCTIONS
    */  
    update_chcks = function(){
        chcks = $('#chckpanel').data('checks');
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
      const features = [];
      let feature1 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(point1)),
        labelPoint: new ol.geom.Point(ol.proj.fromLonLat(point1)),
        name: 'Point1'
        });
      let feature2 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(point2)),
        labelPoint: new ol.geom.Point(ol.proj.fromLonLat(point2)),
        name: 'Point2'
        });
      let feature3 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(point3)),
        labelPoint: new ol.geom.Point(ol.proj.fromLonLat(point3)),
        name: 'Point3'
        });
      const source = new ol.source.Vector();
      features.push(feature1);
      features.push(feature2);
      features.push(feature3);
      source.addFeatures(features);

      const csvpoints = new ol.layer.Vector({
        source: source,
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
        interactions: ol.interaction.defaults().extend([
            new ol.interaction.Select({
                condition: function(evt) {
                    return evt.type == 'pointermove' || evt.type == 'singleclick';
                },
            })
            ]),
        layers: [raster, csvpoints],
        target: target,
        view: new ol.View({
          center: ol.proj.fromLonLat([32.9460, -1.1315]),
          zoom: 8,
          // minZoom: 7
        })
      });
    }

    get_products = function(){
        products = [];
        $("input[type='checkbox']").click(function(e){
            if ($(this).prop("checked")) {
                if (typeof products[e.target.id] === 'undefined'){
                    products.push(e.target.id);
                    console.log(products);
                }
            } else if ($(this).prop("checked") == false) {
                removeA(products, this.id);
                    console.log(products);
            } 
        });
        return products;
    }

    init_table_upload = function () {
        $('#uploadfile').on('submit', function(e){
            // e.preventDefault();

            var Upload = function(file){
                this.file = file
            };
            Upload.prototype.getType = function(){
                return this.file.type
            };
            Upload.prototype.getSize = function(){
                return this.file.size
            };
            Upload.prototype.getName = function(){
                return this.file.name
            };
            Upload.prototype.doUpload = function(){
                var that = this;
                var formData = new FormData();
                formData.append("file", this.file, this.getName());
                formData.append("upload_file", true);
                console.log(formData);
                $.ajax({
                    type: "POST",
                    url: "{% url 'mcfe' %}",
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        console.log(data);
                    }
                });
            }
            
        });
    }

    read_csv_file = function(){
        const datavals = $('#filecontent').data('filecontent');
        console.log(datavals);
        const length = datavals.length;

        for (var i in datavals) {
            $('thead th').append($('<th>', {
                text: i
            }));
            // $('#lat').append($('<td>', {
            //         text: i
            //     }));
            // $('#lon').append($('<td>',{
            //         text: i
            //     }));
        }
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

    function loadCsv(){
        $('.fileget').on('click', function(e){
            e.preventDefault();
            var csvtitle = $(this).data();
            console.log(csvtitle);
            var xhr = $.ajax({
                type: "POST",
                url: "get_csv",
                // async: true,
                dataType: 'json',
                data: csvtitle,
                cache: csvtitle,
                // contentType: false,
                // processData: false,
            });
            xhr.done(function (data){
                if ("success" in data) {
                    console.log("success");
                    console.log(data);
                }
            });
                // success: function (data) {
                //     console.log(data);
                //     }
                // });
            // console.log("{% url 'lcm' file.pk %}");
            // $.get("", function(data,status){
            //     console.log("Data: " + data + "\nStatus: " + status);
            // });
        // });
        // // const connect = new XMLHttpRequest();
        // // connect.open('GET', "{{ file.csv.url }}");
        // // connect.onload = function() {
        // //     const csv = connect.responseText;
        // //     console.log(csv);
        // // }
        // $('#fileget').on('click', function(e){
        //     e.preventDefault();
        //     const connect = new XMLHttpRequest();
        //     connect.open('GET', "{{ file.csv.url }}");
        //     connect.onload = function() {
        //         const csv = connect.responseText;
        //         console.log(csv);
        //     }
        //     // $.get({{ file.csv.url }}, function(data, status){
        //     //     console.log(data + status);
        //     // });
        });
    }

    /*
    Initialize Functions
    */
    init_all = function(){
        map = init_map("map");
        update_chcks();
        get_products();
        loadCsv();
        // add_table_column();
        // init_table_upload();
        // read_csv_file();
    }
    /*
    PUBLIC INTERFACE
    */
    public_interface = {};

    /*
    RUN THE FUNCTIONS
    */
    $(function(){
        init_all();
        $('#qfile').on('click', function(e) {
            e.preventDefault();
            // console.log(e);
            // read_csv_file();
            console.log(products);
        });
        create_chart(products[0],pnt1series[0],'2010,01,01',24);
    });
    return public_interface;
}());