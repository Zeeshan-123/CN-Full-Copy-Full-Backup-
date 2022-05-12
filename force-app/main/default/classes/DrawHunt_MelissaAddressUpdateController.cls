/*--------------------------------------------------------------------------------------------------------------
@Author: Shams
@Date: 8/2/2021
@Purpose: This class is used as controller for DrawHunt_MelissaAddressUpdate aura component.
---------------------------------------------------------------------------------------------------------------*/
public without sharing class DrawHunt_MelissaAddressUpdateController 
{
    private static final String getAlphaChars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        return MelissaDataController.SendRequest(input, country);
    }
    //Map State codes
    @AuraEnabled
    public static Map<string, string> getStates(){
        Map<string, US_States__c> mapCodes = US_States__c.getAll();
        Map<string, string> mapStateCodes = new Map<string, string>();
        for(string key:mapCodes.keySet()){
            mapStateCodes.put(mapCodes.get(key).ISO_Code__c, key);
        }
        return mapStateCodes;
    }
    
    // get  picklist values
    @AuraEnabled
    public static Community_RRRFormWrapper getPicklistValues(String strObjectName, string strparentField, string strchildField,String recordId)
    {
        //get user logged id
        String UserId=UserInfo.getUserId();
        //get contact id against user id
        String contactId=utility.getUserContactId(UserId);  
        
        Community_RRRFormWrapper objList 		= 		new Community_RRRFormWrapper();
        objList.acnt							= 		new Account();
        Map<String,List<String>> pickListMap 	= 		new Map<String,List<String>>();
        objList.pickListMap						= 		pickListMap;
        objList.userEmail						= 		'';
        
        Schema.sObjectType objType = Schema.getGlobalDescribe().get(strObjectName).newSObject().getSObjectType();
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        
        List<customPicklistEntryWrapper> depEntriesList = (List<customPicklistEntryWrapper>)JSON.deserialize(JSON.serialize(objFieldMap.get(strChildField).getDescribe().getPicklistValues()), List<customPicklistEntryWrapper>.class);
        List<String> controllingValues = new List<String>();
        //get dependant picklist maps
        for (Schema.PicklistEntry ple : objFieldMap.get(strparentField).getDescribe().getPicklistValues()) 
        {
            pickListMap.put(ple.getLabel(), new List<String>());
            controllingValues.add(ple.getLabel());
        }
        //get dependant picklist maps
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
        
        objList.pickListMap = pickListMap;
        //get Case record
        objList.RRRCase=[SELECT Id, mailing_suite__c, mailing_address2__c, Request_Reason__c, Accountid,Account.Name,
                         Account.PersonMailingStreet,Account.Age_Numeric__c,Account.PersonMailingCity,Account.PersonMailingState,Account.PersonMailingCountry,Account.PersonMailingPostalCode, 
                         CaseNumber, Status, COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c, Mailing_Street__c, Mailing_City__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c,
                      	 		Ebt_Email__c,Is_Address_Changed__c,Is_Manual_Address__c,Melissa_Address__c, description, (SELECT Id, First_Name__c, Last_Name__c, Date_of_Birth__c, Citizen_id__c FROM Household_Members__r) FROM Case 
                          		WHERE id=:recordId];
        /*set  mailing address
        if(objlist.RRRCase.Mailing_Street__c==null){
            objlist.RRRCase.Mailing_Street__c=objlist.RRRCase.Account.PersonMailingStreet;
            objlist.RRRCase.Mailing_City__c=objlist.RRRCase.Account.PersonMailingCity;
            objlist.RRRCase.Mailing_ZipPostal_Code__c=objlist.RRRCase.Account.PersonMailingPostalCode;
            objlist.RRRCase.Mailing_Countries__c=objlist.RRRCase.Account.PersonMailingCountry;
            objlist.RRRCase.Mailing_States__c=objlist.RRRCase.Account.PersonMailingState;
        }*/
        
        return objList;
    }        
    
    // create parent child accounts and add them in a household account   
    @AuraEnabled
    public static case savePRequest(
        String mailingStreet, String mailingCity, String mailingCountry, String mailingState, String mailingOtherState,
        String mailingZip, String suite, String addressLine2,
        String addressFreeForm, Boolean isManual, Boolean isAddressChanged,String recordId)
    {
        //get case record
        Case cse=[select id,Mailing_Street__c,Mailing_City__c,Mailing_ZipPostal_Code__c,Mailing_Countries__c,
                  Mailing_States__c,Other_Mailing_State__c,mailing_suite__c,mailing_address2__c,Melissa_Address__c,
                  Is_Address_Changed__c,Is_Manual_Address__c from Case where id=:recordId];
        //set new address
        cse.Physical_Street__c 						=		mailingStreet;
        cse.Physical_City__c						=		mailingCity;
        cse.Physical_ZipPostal_Code__c				=		mailingZip;
        cse.Physical_Countries__c					=		mailingCountry;
        cse.Physical_States__c						=		mailingState;
        cse.Other_Physical_State__c					=		mailingOtherState;
        
        cse.Physical_Suite__c 						=		suite;
        cse.Physical_Address2__c					=		addressLine2;
        cse.Melissa_Address__c						=		addressFreeForm;
        cse.Is_Address_Changed__c					=		isAddressChanged;
        cse.Is_Manual_Address__c					=		isManual;
        
        update cse;
        return cse;
    } 
    @AuraEnabled
    public static case saveSRequest(
        String mailingStreet, String mailingCity, String mailingCountry, String mailingState, String mailingOtherState,
        String mailingZip, String suite, String addressLine2,
        String addressFreeForm, Boolean isManual, Boolean isAddressChanged,String recordId)
    {
        //get case record
        Case cse=[select id,Mailing_Street__c,Mailing_City__c,Mailing_ZipPostal_Code__c,Mailing_Countries__c,
                  Mailing_States__c,Other_Mailing_State__c,mailing_suite__c,mailing_address2__c,Melissa_Address__c,
                  Is_Address_Changed__c,Is_Manual_Address__c from Case where id=:recordId];
        //set new address
        cse.PG_Physical_Street__c						=		mailingStreet;
        cse.PG_Physical_City__c							=		mailingCity;
        cse.PG_Physical_ZipPostal_Code__c				=		mailingZip;
        cse.PG_Physical_Country__c						=		mailingCountry;
        cse.PG_Physical_State__c						=		mailingState;
        cse.PG_Other_Physical_State__c					=		mailingOtherState;
        
        cse.PG_Physical_Suite__c 						=		suite;
        cse.PG_Physical_Address_Line2__c				=		addressLine2;
        cse.PG_Physical_Melissa_Address__c				=		addressFreeForm;
        cse.PG_Is_Address_Changed__c					=		isAddressChanged;
        cse.PG_Physical_IsManual__c						=		isManual;
        
        update cse;
        return cse;
    } 
    
    //supportting methods start for dependent picklists
    public static String decimalToBinary(Integer val) 
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
    
    public static String alphaBaseToBits(String validFor) 
    {
        if (String.isEmpty(validFor)) return '';
        String validForBits = '';        
        for (Integer i = 0; i < validFor.length(); i++)
        {
            String thisChar = validFor.mid(i, 1);
            Integer val = getAlphaChars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        return validForBits;
    }
    
    public class customPicklistEntryWrapper
    {
        public String active;
        public String defaultValue;
        public String label;
        public String value;
        public String validFor;
        
    }
    
}