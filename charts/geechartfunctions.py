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
		indexName = product
		if(dateStart != None):
			if indexName != None:
				indexCollection = ee.ImageCollection(collectionName).filterDate(dateStart, dateEnd).select(indexName)
			else:
				indexCollection = ee.ImageCollection(collectionName).filterDate(dateStart, dateEnd)
		else:
			indexCollection = ee.ImageCollection(collectionName)
		
		geometry = None

		if isinstance(coords[0], list):
			geometry = ee.Geometry.Polygon(coords)
		else:
			geometry = ee.Geometry.Point(coords[0],coords[1])
		print(coords)
		print(geometry)
		def getIndex(image):
			"""  """
			theReducer = None
			indexValue = None
			if(reducer == 'min'):
				theReducer = ee.Reducer.min()
			elif (reducer == 'max'):
				theReducer = ee.Reducer.max()
			elif (reducer == 'mosaic'):
				theReducer = ee.Reducer.mosaic()
			else:
				print("reducer was mean")
				theReducer = ee.Reducer.mean()
			if indexName != None:
				indexValue = image.reduceRegion(theReducer, geometry, scale).get(indexName)
			else:
				indexValue = image.reduceRegion(theReducer, geometry, scale)
			date = image.get('system:time_start')
			if (indexValue == None):
				indexImage = ee.Image().set('indexValue', [ee.Number(date), -9999])
			else:
				indexImage = ee.Image().set('indexValue', [ee.Number(date), indexValue])
			return indexImage		

		indexCollection1 = indexCollection.map(getIndex)
		indexCollection2 = indexCollection1.aggregate_array('indexValue')
		values = indexCollection2.getInfo()
		print("I have values")

	except Exception as e:
		print("There is a problem getting Chart Values: "+str(e))
		raise Exception(sys.exc_info()[0])
	return values
	