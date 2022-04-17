const app_control = (function(){

	/*
		PUBLIC & GLOBAL VARIABLES & FUNCTIONS
	*/
	var public_interface;

	var draw, map, geometry, m_option1, m_option2, m_option3,
	dataR, productQ;
	var init_events, init_all, init_map, update_options;


	/*
		INITIALIZE VARIABLES
	*/
	const source = new ol.source.Vector({wrapX: false});
	const vector = new ol.layer.Vector({source: source,});

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
			}),
		});
	}

	init_events = function(){

		// Add Interaction
		$('#type').on('change', function(evt){
			map.removeInteraction(draw);
			vector.getSource().clear();
			const typeVal = $('#type').val();
			if (typeVal !== 'None') {
				draw = iDraw(typeVal);
				map.addInteraction(draw);
			}
		});

		// Handle Added Features
		source.on('addfeature', function(evt){
			geometry = getAddFeature(evt);
		});

		// Ajax Call for the chart
		$('#loadchart').on('click', function(e){
			e.preventDefault();
			let qvalues = getQValues();
			qvalues["coordinates"] = JSON.stringify(JSON.parse(geometry)["coordinates"]);
			productQ = qvalues["product"]
			getQData(qvalues);
			// dataR = getQData(qvalues);
			// console.log(dataR);

			// Plot the Data
			// const plotData = [];
			// dataR.forEach((d)=> {
			// 	const parray = [];
			// 	parray.push(d[0]);
			// 	if (d[1] === "None") {
			// 		parray.push(null)
			// 	} else {
			// 		parray.push(d[1]);
			// 	}
			// 	plotData.push(parray)
			// });
			// create_chart(productQ, plotData);
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
		const feature = evt.feature;
		const featType = feature.getGeometry().getType();
		let geoJson = new ol.format.GeoJSON();

		if (featType === 'Point' || featType === 'Polygon') {
			const featTransformed = feature.getGeometry().transform('EPSG:3857', 'EPSG:4326');
			geoJson = geoJson.writeGeometry(featTransformed);
		}
		return geoJson;
	}

	function getQData(data) {
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
				create_chart(productQ, plotData);
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
			}]
		};

		var chart = new Highcharts.Chart(options);
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