/*--------------------------------------------------------------------------
@author: Usama Abdul Haque
@date: April/26/2021
@purpose: Used to call the Melissa Express Entry API to get the address results
---------------------------------------------------------------------------*/
public without sharing class MelissaDataController 
{
    public static String SendRequest(String ffVal, String country)
    {
        try{
     
            //Get Customer ID from Custom Metadata
            melissaApi__mdt customerKey=[Select MasterLabel from melissaApi__mdt where DeveloperName = 'Customer_Key'];
            String key=customerKey.MasterLabel;
          	HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:MelissaDataAPI?format=json&id='+key+'&ff='+ffVal.replace(' ', '+')+'&maxrecords=20&country='+country.replace(' ', '+'));
            system.debug(request.getEndpoint());
            request.setMethod('GET');
            
            
            // Create a new http object to send the request object
            // A response object is generated as a result of the request  
            
            Http http = new Http();
            HTTPResponse response = http.send(request);
            system.debug(response.getBody());
            //melissaDataResponse melissaResponse = (melissaDataResponse)JSON.deserialize(response.getBody(), melissaDataResponse.class);
            //system.debug(melissaResponse);
            //return melissaResponse;
            return response.getBody();
        }
        
        catch(Exception ex)
        {
            system.debug(ex.getMessage());
            return ex.getMessage();
        }
    }
}