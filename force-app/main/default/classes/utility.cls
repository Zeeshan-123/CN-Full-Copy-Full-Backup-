/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: Oct/11/2020
---------------------------------------------------------------------------------------------------------------*/

public class utility 
{
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    //get CN Registration RecordTypeId
    private static final Id CNREG_RECORDTYPEID = utility.getRT(AppConstants.OBJ_ACCOUNT,AppConstants.RT_CNREGISTRATION);
    
    private static final String GET_ALPHACHARS = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    public static String  getUserContactId(String userId)
    {
        List<user> userContactId = [SELECT u.ContactId from User u WHERE id=:userId] ;
        String contactId=userContactId[0].ContactId;
        return contactId;
    }
    
     public static Account  getAccount(Id CONTACT_ID)
    {
        return [SELECT Id, If_CN_Citizen__c, Suffix__c, Prefix__c, Name, Maiden_Name__c, FirstName, LastName, Date_of_Birth__c, PersonOtherPhone, Phone, PersonMobilePhone, Interested_in_Survey__c,
                Tribe_Id__c, HealthCloudGA__Gender__pc, Marital_Status__c, Driver_License__c, Mailing_Add_Melissa_Verified__c, Physical_Add_Melissa_Verified__c,
                PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Other_Mailing_State__c, Mailing_Suite__c, Mailing_Address_Line_2__c,
                PersonOtherCountry,  PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherPostalCode, Other_Physical_State__c, Physical_Suite__c,Physical_Address_Line_2__c, Eligible_For_Housing_Stipend__c, 
                Opt_In_to_Email__c, Opt_In_to_SMS__c, Opt_In_Initially_Shown__c, Social_Security__c, Tribe__c,Hotspot_Eligible__c, Gender__c,
                (SELECT Id, Email from Users Limit 1)  FROM Account WHERE PersonContactId =: CONTACT_ID AND RecordTypeId =: CNREG_RECORDTYPEID LIMIT 1];
    }
    
    //get record type
    public static Id getRT(String objName, String rtName){
        return Schema.getGlobalDescribe().get(objName).getDescribe().getRecordTypeInfosByDeveloperName().get(rtName).getRecordTypeId();
    }
    
    //get states code map
    public static Map<string, string> getStates()
    {
        Map<string, US_States__c> mapCodes = US_States__c.getAll();
        Map<string, string> mapStateCodes = new Map<string, string>();
        
        for(string key:mapCodes.keySet())
        {
            mapStateCodes.put(mapCodes.get(key).ISO_Code__c, key);
        }
        
        return mapStateCodes;
    }
    
    //get dependent picklists
    public static Map<String,List<String>> getPicklistValues(String strObjectName, string strparentField, string strchildField)
    {
        
        Map<String,List<String>> pickListMap 	= 		new Map<String,List<String>>();
        
        Schema.sObjectType objType = Schema.getGlobalDescribe().get(strObjectName).newSObject().getSObjectType();
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        
        List<customPicklistEntryWrapper> depEntriesList = (List<customPicklistEntryWrapper>)JSON.deserialize(JSON.serialize(objFieldMap.get(strChildField).getDescribe().getPicklistValues()), List<customPicklistEntryWrapper>.class);
        List<String> controllingValues = new List<String>();
        
        for (Schema.PicklistEntry ple : objFieldMap.get(strparentField).getDescribe().getPicklistValues()) 
        {
            pickListMap.put(ple.getLabel(), new List<String>());
            controllingValues.add(ple.getLabel());
        }
        
        for (customPicklistEntryWrapper plew : depEntriesList) 
        {
            String validForBits = alphaBaseToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) 
            {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') 
                {
                    pickListMap.get(controllingValues.get(i)).add(plew.label);
                }
            }
        }
        
        return pickListMap;
    } 
    
    
    // private methods for dependent picklist
    private static String decimalToBinary(Integer val) 
    {
        String bits = '';
        while (val > 0) 
        {
            Integer remainder = Math.mod(val, 2);
            val = Integer.valueOf(Math.floor(val / 2));
            bits = String.valueOf(remainder) + bits;
        }
        return bits;
    }
    
    private static String alphaBaseToBits(String validFor) 
    {
        if (String.isEmpty(validFor)) return '';
        
        String validForBits = '';
        
        for (Integer i = 0; i < validFor.length(); i++)
        {
            String thisChar = validFor.mid(i, 1);
            Integer val = GET_ALPHACHARS.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    
    private class customPicklistEntryWrapper
    {
        public String label;
        public String value;
        public String validFor;
        
    }
}