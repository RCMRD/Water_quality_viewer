const app_control = (function(){

	/*
		PUBLIC & GLOBAL VARIABLES & FUNCTIONS
	*/
	var public_interface;

	var draw, map, geometry, m_option1, m_option2, m_option3,
	dataR, productQ, chart;
	var init_events, init_all, init_map, update_options;


	/*
		INITIALIZE VARIABLES
	*/
	const source = new ol.source.Vector({wrapX: false});
	const vector = new ol.layer.Vector({
	  source: source,
	  style: new ol.style.Style({
	    fill: new ol.style.Fill({
	      color: 'rgba(255, 255, 255, 0.2)',
	    }),
	    stroke: new ol.style.Stroke({
	      color: '#ffcc33',
	      width: 2,
	    }),
	    image: new ol.style.Circle({
	      radius: 7,
	      fill: new ol.style.Fill({
	        color: '#ffcc33',
	      }),
	    }),
	  }),
	});

	// const vector = new ol.layer.Vector({source: source,});

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

		raster.set('name', 'baselayer');
		const scaleline = new ol.control.ScaleLine({units: 'metric'});
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
			}),
		});
	}

	init_events = function(){
		// Initialize the Chart
		$('#charttype').on('change', function(e) {
			e.preventDefault();
			$('#loadchart').show();
			const pType = this.value;
			init_chart(pType);
		});

		// Add Interaction
		$('#type').on('change', function(evt){
			map.removeInteraction(draw);
			vector.getSource().clear();
			const typeVal = $('#type').val();
			if (typeVal !== 'None') {
				draw = iDraw(typeVal);
				map.addInteraction(draw);
			}
			// Handle Added Features
			source.on('addfeature', function(evt){
				const num = source.getFeatures();
				if (num.length > 1) {
					source.removeFeature(num[0]);
				}
				const feature = evt.feature;
				geometry = getAddFeature(evt);
				console.log(geometry);
			});
		});

		
		// source.on('addfeature', function(evt){
		// 	geometry = getAddFeature(evt);
		// });

		// Ajax Call for the chart
		$('#loadchart').on('click', function(e){
			e.preventDefault();
			$('#loader').css("display", "inline-block");
			let qvalues = getQValues();
			qvalues["coordinates"] = JSON.stringify(JSON.parse(geometry)["coordinates"]);
			// qvalues["coordinates"] = JSON.parse(geometry);
			productQ = [qvalues["sensor"],qvalues["product"]];
			getQData(qvalues, "initx");
		});

		$('#addSeries').on('click', function(e){
			e.preventDefault();
			$('#loader').css("display", "inline-block");
			let qvalues = getQValues();
			qvalues["coordinates"] = JSON.stringify(JSON.parse(geometry)["coordinates"]);
			productQ = [qvalues["sensor"],qvalues["product"]];
			getQData(qvalues, "addx");
		});

		$('#addXSeries').on('click', function(e){
			e.preventDefault();
			$('#loader').css("display", "inline-block");
			let qvalues = getQValues();
			qvalues["coordinates"] = JSON.stringify(JSON.parse(geometry)["coordinates"]);
			productQ = [qvalues["sensor"],qvalues["product"]];
			getQData(qvalues, "inity");
		});

		$('#resetChart').on('click', function(e){
			e.preventDefault();
			init_chart("scatter");
			$('#seriesAdd').hide();
			$('#loadchart').show();
		});

	}

	init_all = function(){
		update_options();
		map = init_map("map");
		init_events();
	}
	/*
		OPERATIONAL FUNCTIONS
	*/
	function clearSource(){
		map.removeInteraction(draw);
		vector.getSource().clear();
	}
	function init_chart(plottype){
		var options = {
		chart: {
				renderTo: 'container',
				type: plottype,
		},    
		xAxis: {
				type: 'datetime',
				crosshair: true,
				tooltip: {
					xDateFormat: '%Y-%m-%d',
				}
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

	function iDraw(type) {
		const drawObj = new ol.interaction.Draw({
			source: source,
			type: type
		});
		return drawObj;
	}

	function addInteraction(drawObj) {
		map.addInteraction(drawObj);
	}

	function getAddFeature(evt){
		const feature = evt.feature.clone();
		const featType = feature.getGeometry().getType();
		let geoJson = new ol.format.GeoJSON();
		const featTransformed = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
		geoJson = geoJson.writeGeometry(featTransformed);
		return geoJson;
	}

	function getQData(data,add) {
		let values = [];
		var xhr = $.ajax({
			type: 'POST',
			url: 'get_chart',
			data: data,
			dataType: 'json',
			cache: data,
		});
		xhr.done(function(data){
			if ('success' in data) {
				$('#loader').css("display", "none");
				console.log(data["success"]);
				values = data["values"];

				// Plot the Data
				const plotData = [];
				values.forEach((d)=> {
					const parray = [];
					parray.push(d[0]);
					if (d[1] === "None") {
						parray.push(-5)
					} else {
						parray.push(d[1]);
					}
					plotData.push(parray)
				});
				const labelinfo = getLabel(productQ[0],productQ[1]);
				if (add === "initx") {
					var counter = 0;
					addSeries(plotData, labelinfo, 1, true, counter);
					$('#loadchart').hide();
					$('#seriesAdd').show();
				} else if (add === "addx") {
					addSeries(plotData, labelinfo, 1, false, counter+1)
				}
				else if (add === "inity"){
					addSeries(plotData, labelinfo, 2, true, counter);
				}
			} else if ("error" in data) {
				$('#loader').css("display", "none");
				alert("Oops!! Seems there was a problem loading your chart \n \
					Recheck the provided options and rechart" + data.error);
			}
		});
		return values;
	}

	function getQValues(){
		const products = {};
		products["mission"] = $('#option2').val();
		products["sensor"] = $('#option3').val();
		products["product"] = $('#option4').val();
		products["startDate"] = $('#start_date').val();
		products["endDate"] = $('#end_date').val();
		return products;
	}

	function getLabel(mission, product) {
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

	function downloadCsv(){
		chart.downloadCsv();
	}

	function addSeries(data, labels, yaxisnum, bool, counter){
		// let seriesVals = {};
		if (bool === true) {
			if (yaxisnum === 2) {
				chart.yAxis[0].options.opposite = true;
			}
			chart.addAxis({id: yaxisnum}, false)
			chart.addSeries({
				name: labels.mtext + ' ' + labels.ptext,
				yAxis: yaxisnum,
				data: data,
				tooltip: {
					valueDecimals: 2,
					valueSuffix: labels.pformat
				}
			});
		} else {
			chart.addSeries({
				name: labels.mtext + ' ' + labels.ptext,
				yAxis: yaxisnum,
				data: data,
				tooltip: {
					valueDecimals: 2,
					valueSuffix: labels.pformat
				}
			});
		}
	}

	function resetChart(){

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
		});

		return public_interface

})();