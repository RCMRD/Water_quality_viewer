import ee, logging 
import sys
from ee.ee_exception import EEException

service_account = '' #your google service account
privateKey = '' # path to the json private key for the service account
logger = logging.getLogger(__name__)
if service_account:
    try:
        credentials = ee.ServiceAccountCredentials(service_account, privateKey)
        ee.Initialize(credentials)
    except EEException as e:
        print(str(e))
else:
    try:
         ee.Initialize()
    except EEException as e:
        from oauth2client.service_account import ServiceAccountCredentials 
        credentials = ServiceAccountCredentials.from_p12_keyfile(
        service_account_email='',
        filename='',
        private_key_password='notasecret',
        scopes=ee.oauth.SCOPE + ' https://www.googleapis.com/auth/drive ')
        ee.Initialize(credentials)
def getChart(collectionName, product, dateStart, dateEnd, coords, scale=None, reducer=None):
	try:
		eeCollection = ee.ImageCollection(collectionName).select(product)
		filtered = eeCollection.filterDate(dateStart, dateEnd)
		geometry = None

		if isinstance(coords[0], list):
			geometry = ee.Geometry.Polygon(coords)
		else:
			geometry = ee.Geometry.Point([coords])
		print(coords)
		print(geometry)

		def getIndex(img):
			if (reducer == 'min'):
				theReducer = ee.Reducer.min()
			elif (reducer == 'max'):
				theReducer == ee.Reducer.max()
			elif (reducer == 'mosaic'):
				theReducer == ee.Reducer.mosaic()
			else:
				theReducer = ee.Reducer.mean()

			indexValue = img.reduceRegion(theReducer, geometry, scale)
			date = img.get('system:time_start')
			indexImg = ee.Image().set('indexValue', [ee.Number(date), indexValue])

			return indexImg
		indexCollection = eeCollection.map(getIndex)
		indexedCollection = indexCollection.aggregate_array('indexValue')
		values = indexedCollection.getInfo()

	except Exception as e:
		print("There is a problem getting Chart Values: "+str(e))
		raise Exception(sys.exc_info()[0])
	return values
	