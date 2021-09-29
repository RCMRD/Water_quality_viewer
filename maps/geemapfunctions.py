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

tablename = 'users/kimlotte423/LV_Basin'                        
table = ee.FeatureCollection(tablename)

def imageToMapId(img, visParams={}):
	try:
		eeImage = ee.Image(img)
		mapId = eeImage.getMapId(visParams)

		return {
			'url': mapId['tile_fetcher'].url_format
		}
	except EEException as e:
		logger.error("******* Image to Map ID Error ********", sys.exc_info()[0])
		print("******* Image to Map ID Error ********", sys.exc_info()[0])
	return {
		'errMsg': str(sys.exc_info()[0])
	}

def getImage(collectionName, product, visParams, mtype=None, dateStart=None, dateEnd=None):
	try:
		values = None
		print (product)
		if mtype =='lulc':
			print(collectionName+product)
			eeImage = ee.Image(collectionName+product)
			values = eeImage.getMapId(visParams)
		else:
			eeCollection = ee.ImageCollection(collectionName).select(product)
			images = eeCollection.filterDate(dateStart,dateEnd).filterBounds(table) 
			values = images.max().getMapId(visParams)
	except EEException as e:
		print("*******Get Image Error******", sys.exc_info()[0])

	return values['tile_fetcher'].url_format