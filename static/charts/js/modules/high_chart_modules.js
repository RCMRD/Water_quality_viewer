export default function defaultLineChart(
	divid = None,
	titleText = None,
	xcategories = None,
	yAxisTitle = None
	){
	let chart = Highcharts.chart(divid, {
		chart : {
			type : 'bar'
		},
		title : {
			text: titleText
		},
		xAxis: {
			categories: xcategories,
		},
		yAxis: {
			title: {
				text: yAxisTitle,
			}
		},
		series: []
	});
	return chart;
}


export function defaultScatterChart(
	divid = None,
	titleText = None,
	xcategories = None,
	yAxisTitle = None
	){
	let chart = Highcharts.chart(divid, {
		chart : {
			type : 'scatter'
		},
		title : {
			text: titleText
		},
		xAxis: {
			categories: xcategories,
		},
		yAxis: {
			title: {
				text: yAxisTitle,
			}
		},
		series: []
	});
	return chart;
}
export function removeSeries(id, chart) {
	chart.get(id).remove();
}
export function addSeriesn(chart, id, name, array) {
	chart.addSeries({
		name: name,
		data: array,
		id: id
	}, false);
}