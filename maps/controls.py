datasets = {
	'lulc': {
		'display': 'Land Cover',
		'options': {
			'1985_lulc': {
				'display' : 'Land Cover Map 1985'
			},
			'1990_lulc': {
				'display' : 'Land Cover Map 1990'
			},
			'1995_lulc': {
				'display' : 'Land Cover Map 1995'
			},
			'2000_lulc': {
				'display' : 'Land Cover Map 2000'
			},
			'2010_lulc': {
				'display' : 'Land Cover Map 2010'
			},
			'2014_lulc': {
				'display' : 'Land Cover Map 2014'
			},
		}
	},
	'wq': {
		'display': 'WQ Indicators',
		'options': {
			'landsat': {
				'display': 'Landsat',
				'options': {
					'...' : {
						'display': 'Select a Sensor'
						},
					8 : {
						'display': 'Landsat 8 OLI',
						'options' : {
							'...' : {
								'display': 'Select a product'
								},
							'chlor_a' : {
								'display': 'Chlorophyl A'
								},
							'SD' : {
								'display': 'Secchi Depth'
								},
							'TSI' : {
								'display': 'Trophic State Index'
								},
							'TSI_R' : {
								'display': 'Trophic State Index Reclassified'
								}
							}
						}
					}
				},
			'sentinel': {
				'display' : 'Sentinel-Copernicus',
				'options' : {
					'...' : {
						'display' : 'Select a Sensor'
							},
					1 : {
						'display': 'Sentinel 1 SAR GRD',
						'options' : {
							'...': {
								'display' : 'Select a product'
								},
							'vh' : {
								'display': 'VH Polarization'
								}
							}
						},
					2 : {
						'display': 'Sentinel 2 MSI',
						'options' : {
							'...' : {
								'display' : 'Choose a product'
								},
							'chlor_a' : {
								'display': 'Chlorophyl A'
								},
							'SD' : {
								'display': 'Secchi Depth'
								},
							'TSI' : {
								'display': 'Trophic State Index'
								},
							'TSI_R' : {
								'display': 'Trophic State Index Reclassified'
								}
							}
						}
					}
				},
			'modis': {
				'display': 'MODIS Multi-Spectral Instrument',
				'options' : {
					'...' : {
						'display': 'Choose a Platform',
						},
					'aqua': {
						'display': 'AQUA Platform',
						'options' : {
							'...' : {
								'display' : 'Choose a product'
								},
							'chlor_a' : {
								'display': 'Chlorophyl A'
								},
							'SD' : {
								'display': 'Secchi Depth'
								},
							'TSI' : {
								'display': 'Trophic State Index'
								},
							'TSI_R' : {
								'display': 'Trophic State Index Reclassified'
								}
							}
						},
					'terra': {
						'display': 'TERRA Platform',
						'options' : {
							'...' : {
								'display' : 'Choose a product'
								},
							'chlor_a' : {
								'display': 'Chlorophyl A'
								},
							'SD' : {
								'display': 'Secchi Depth'
								},
							'TSI' : {
								'display': 'Trophic State Index'
								},
							'TSI_R' : {
								'display': 'Trophic State Index Reclassified'
								}
							}
						}
					}
				}
			}
		}
	}