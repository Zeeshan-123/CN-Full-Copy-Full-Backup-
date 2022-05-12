/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: July/12/2021
@Purpose: This class is used as controller for Community_RRRAddressEdit aura component.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class  Community_RRRAddressEditController 
{
	private static final String getAlphaChars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/'; 
    
    
     //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country)
    {
        return MelissaDataController.SendRequest(input, country);
    }
    
 
	// get  initial data
    @AuraEnabled
    public static Community_RRRFormWrapper getData(String strObjectName, string strparentField, string strchildField, Boolean IsAddressCorrectionReq, string caseId)
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
        objList.RRRCase							= 		new Case();
        
        if(IsAddressCorrectionReq == true)
        {
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
            
            objList.pickListMap = pickListMap;
            objList.statesMap = getStates();
        }
        
        //get user account information
            Account acc 	= 	[SELECT Id, FirstName, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c, PersonEmail 
                       			FROM Account WHERE PersonContactId =: contactId limit 1];
        
        list<Case> rCase	=	[SELECT Id, mailing_suite__c, mailing_address2__c, CaseNumber, Ebt_Mobile_Phone__c,
                      	 		Mailing_Street__c, Mailing_City__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c,
                      	 		Ebt_Email__c,Is_Address_Changed__c,Is_Manual_Address__c,Melissa_Address__c, Primary_Contact_Last_Name__c, Citizen_ID__c,
                                (SELECT Id, First_Name__c, Last_Name__c, Status__c, Date_of_Birth__c, Citizen_Id__c FROM Household_Members__r) FROM Case 
                          		WHERE ContactId =:contactId and Request_Reason__c = 'RRR' and id = :caseId limit 1];
        
        //logged in user had submitted an RRR request
        if(rCase.size() > 0)
        {
            objList.RRRCase 	= 	rCase[0];
       }
        
        
        objList.acnt		=	acc;
        User usr 			= 	[SELECT Name, Email FROM User where id =: UserId limit 1];
        objList.userEmail	=	usr.Email;
       
        // return wrapper
        return objList;
    } 
    
        @AuraEnabled
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
   
	 // update mailing address on request record
    @AuraEnabled
    public static void updateAddress( Id requestId,String mailingStreet, String mailingCity, String mailingCountry, String mailingState, 
                                     String mailingOtherState,String mailingZip, String suite, String addressLine2,
                                  	 String addressFreeForm, Boolean isManual, Boolean isAddressChanged)
    {            
            Case cse 							=		new Case();
            cse.Id								=		requestId;
            cse.Mailing_Street__c				=		mailingStreet;
            cse.Mailing_City__c					=		mailingCity;
            cse.Mailing_ZipPostal_Code__c		=		mailingZip;
            cse.Mailing_Countries__c			=		mailingCountry;
            cse.Mailing_States__c				=		mailingState;
            cse.Other_Mailing_State__c			=		mailingOtherState;
            cse.mailing_suite__c 				=		suite;
            cse.mailing_address2__c				=		addressLine2;
            cse.Melissa_Address__c				=		addressFreeForm;
            cse.Is_Address_Changed__c			=		isAddressChanged;
            cse.Is_Manual_Address__c			=		isManual;
            cse.Status							=		'In Progress';	
            update cse;
                    
    }  
    
    	 // update name on request record
    @AuraEnabled
    public static void updateName( Id requestId, List<Household_Member__c> HMlist, String applicantLName, String applicantCitizenId, Boolean IsApplicantLNUpdated)
    {         
        List<Household_Member__c> HMListToUpdate	= 	new List<Household_Member__c>();
        Case cse 			=		new Case(); 
        cse.Id				=		requestId;
        cse.Status			=		'In Progress';	
                    system.debug('AKK HMlist ' + HMlist);

        // update dependents HM records Status if any
        if(HMlist != null && HMlist.size() > 0)
        {
            for(Household_Member__c Member : HMlist)
            {
                if(Member.Status__c == 'NAME CORRECTION REQUIRED')
                {
                    Member.Status__c = 'In Progress';
                    HMListToUpdate.add(Member);
                }
            }
            
            update HMListToUpdate;
            system.debug('AKK HMListToUpdate ' + HMListToUpdate);
        }
        system.debug('AKK IsApplicantLNUpdated ' + IsApplicantLNUpdated);
        if(IsApplicantLNUpdated == true)
        {
            // update applicant HM record Status
            Household_Member__c applicantHHM 	=	[SELECT Id, Last_Name__c, Status__c FROM Household_Member__c where citizen_id__c =: applicantCitizenId];
            applicantHHM.Last_Name__c 			= 	applicantLName;
            applicantHHM.Status__c 				= 	'In Progress';
            update applicantHHM;
        }
      
        update cse;
                    
    }  
       // supportting methods start for dependent picklists
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
            Integer val = getAlphaChars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    
    private class customPicklistEntryWrapper
    {
        public String active;
        public String defaultValue;
        public String label;
        public String value;
        public String validFor;
        
    }

}