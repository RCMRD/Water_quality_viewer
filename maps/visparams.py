lulcPalette = '#939393,#ffffbc,#d4ffff,#ff0000,#00eeee, \
               #0000ff,#ff9bbe,#ff82ff,#267300,#ffff00, \
               #cdcd00,#cd6839,#7c2800,#009600,#ffffff'
vis={'chlor_a': {'min': 0, 'max': 60, 'palette': 'darkblue,blue,limegreen,yellow,orange,orangered,darkred'},
'SD': {'min': 0, 'max': 2, 'palette': 'red,orangered,orange,yellow,limegreen,blue,darkblue'},
'TSI': {'min': 0, 'max': 2, 'palette': 'red,orangered,orange,yellow,limegreen,blue,darkblue'},
'TSI_R': {'min': 0, 'max': 2, 'palette': 'red,orangered,orange,yellow,limegreen,blue,darkblue'},
'lulc': {'min': 0, 'max': 14, 'palette': lulcPalette}}

prefix = 'projects/servir-e-sa/water_quality/'
links = {
	'lulc' : {
		'all': {
			'addr': prefix+'lv_lulc/'
		}
	},
	'sentinel': {
		'1': {
			'addr': prefix+'sentinel_1'
		},
		'2' : {
			'addr': prefix+'sentinel_2'
		}
	},
	'landsat': {
		'8': {
			'addr': prefix+'ls82'
		}
	},
	'modis': {
		'aqua': {
			'addr': prefix+'modis/aqua'
		},
		'terra': {
			'addr': prefix+'modis/terra'
		} 
	}
}