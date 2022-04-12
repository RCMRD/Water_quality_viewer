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

def getTimeSeriesByCollectionAndIndex(collectionName, indexName, scale, coords=[], dateFrom=None, dateTo=None, reducer=None):
    """  """
    try:
        geometry = None
        indexCollection = None
        geometry = ee.Geometry.Point(coords)
        if(dateFrom != None):
            if indexName != None:
                indexCollection = ee.ImageCollection(collectionName).filterDate(dateFrom, dateTo).select(indexName)
            else:
                indexCollection = ee.ImageCollection(collectionName).filterDate(dateFrom, dateTo)
        else:
            indexCollection = ee.ImageCollection(collectionName)
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
            indexImage = ee.Image().set('indexValue', [ee.Number(date), indexValue])
            return indexImage
        indexCollection1 = indexCollection.map(getIndex)
        indexCollection2 = indexCollection1.aggregate_array('indexValue')
        values = indexCollection2.getInfo()
        print("I have values")
    except Exception as e:
        print(str(e))
        raise Exception(sys.exc_info()[0])
    return values