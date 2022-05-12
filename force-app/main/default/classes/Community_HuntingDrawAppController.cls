public with sharing class Community_HuntingDrawAppController{
    
    public class HA_Exception extends Exception 
     {}
    
	private static final String getAlphaChars = '' + 
												'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
												'abcdefghijklmnopqrstuvwxyz' + 
												'0123456789+/';
   
    //Call Melissa Data API
    @AuraEnabled
    public static String getMelissaAddresses(String input, String country){
        System.debug('-------Sending Request to Melissa API-----');
        return MelissaDataController.SendRequest(input, country);
    }

	@AuraEnabled
	public static Community_HuntingDrawAppWrapper getApplicantInfo(){
		try{
			Community_HuntingDrawAppWrapper objList = new Community_HuntingDrawAppWrapper();
			//getting the Country and State Picklist values in map
			Map<String, List<String>> cs_PickListMap = new Map<String, List<String>>();
			objList.cs_PickListMap = cs_PickListMap;
			cs_PickListMap = getCountryStatesPicklistMap('Case', 'Physical_Countries__c', 'Physical_States__c');
			//get user logged id
			String UserId = UserInfo.getUserId();
			//get contact id against user id
			String contactId = utility.getUserContactId(UserId);

			Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
			//query logged in user account information
			Account acc = [SELECT Id, FirstName, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c, Age__pc, PersonContactId, PersonEmail, PersonMobilePhone, HealthCloudGA__Gender__pc, PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Mailing_Suite__c, PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherCountry, PersonOtherPostalCode, Physical_Suite__c
			               FROM Account
			               WHERE PersonContactId = :contactId AND RecordTypeId = :cn_RecTypeId
			               limit 1];

		    Case cseExists = isCaseExists();
			if (cseExists != null) {
				objList.caseObj = cseExists;
				objList.caseExists = true;
			} else {
				objList.caseObj = new Case();
				objList.caseExists = false;
			}
			objList.acnt = acc;
			objList.cs_PickListMap = cs_PickListMap;
            objList.statesMap = getStates();
			
			return objList;

		} catch (Exception e){
			System.debug(e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
	}

	//new create case
	@AuraEnabled
    public static Community_HuntingDrawAppWrapper createCase(Community_HuntingDrawAppWrapper wrapperObj)
    {
		Community_HuntingDrawAppWrapper objWrapper = new Community_HuntingDrawAppWrapper();
        try{
			Case cseExists = isCaseExists();
			 if (cseExists != null) {
			 	 objWrapper.exceptionMsg = 'You have already applied for Hunt Application. Your Confirmation Number is : ' + cseExists.CaseNumber;
			 	 return objWrapper;
			 }

			System.debug('------------Wrapper Case Object---------------' + '\n' +  wrapperObj.caseObj);
			System.debug('------------AA Firstname---------------' + '\n' +  wrapperObj.caseObj.AA_First_Name__c);
			String huntEvents = '';
			String huntCategoriesStr = '';
            
            Integer days = wrapperObj.acnt.Date_of_Birth__c.daysBetween(Date.Today());
        	Integer age = Integer.valueOf(days/365);
            System.debug('-------------Age---------: '+age);
            
            //get Hunt Draw Request record type id
       		Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
           // system.debug('Akk '+PG_PhysicalIsManual);  
           
            if(String.isBlank(wrapperObj.acnt.PersonMobilePhone)){
              throw new HA_Exception('You must fill all of the required Primary Contact information.');
            } 
            else if(String.isBlank(wrapperObj.caseObj.Physical_Street__c) || String.isBlank(wrapperObj.caseObj.Physical_City__c) || 
          String.isBlank(wrapperObj.caseObj.Physical_Countries__c) || String.isBlank(wrapperObj.caseObj.Physical_ZipPostal_Code__c) || ((wrapperObj.caseObj.Physical_Countries__c == 'United States' || wrapperObj.caseObj.Physical_Countries__c == 'Canada') &&
          String.isBlank(wrapperObj.caseObj.Physical_States__c)) || (wrapperObj.caseObj.Physical_Countries__c != 'United States' && wrapperObj.caseObj.Physical_Countries__c != 'Canada' &&
          String.isBlank(wrapperObj.caseObj.Other_Physical_State__c)))
            {
				throw new HA_Exception('Please ensure the address information is complete.');                
            }
            else if(age < 18 && (String.isBlank(wrapperObj.caseObj.PG_First_Name__c) || String.isBlank(wrapperObj.caseObj.PG_Last_Name__c) || 
                                   String.isBlank(wrapperObj.caseObj.PG_Driver_License__c) || String.isBlank(wrapperObj.caseObj.PG_Mobile_Phone__c) ||
                                   String.isBlank(wrapperObj.caseObj.PG_Physical_Street__c) || String.isBlank(wrapperObj.caseObj.PG_Physical_City__c) || 
                                   String.isBlank(wrapperObj.caseObj.PG_Physical_Country__c) || ((wrapperObj.caseObj.PG_Physical_Country__c == 'United States' || wrapperObj.caseObj.PG_Physical_Country__c == 'Canada') &&
          						   String.isBlank(wrapperObj.caseObj.PG_Physical_State__c)) || (wrapperObj.caseObj.PG_Physical_Country__c != 'United States' && wrapperObj.caseObj.PG_Physical_Country__c != 'Canada' &&
          						   String.isBlank(wrapperObj.caseObj.PG_Other_Physical_State__c)))){
                                        throw new HA_Exception('You must fill all of the required Parent Guardian information.');
                                   }
            else if(age < 18 && (String.isBlank(wrapperObj.caseObj.AA_First_Name__c) || 
                                   String.isBlank(wrapperObj.caseObj.AA_Last_Name__c) || String.isBlank(wrapperObj.caseObj.AA_Driver_License__c) ||
                                   String.isBlank(wrapperObj.caseObj.AA_Mobile_Phone__c))){
                                        throw new HA_Exception('You must fill all of the required Accompanying Adult information.');
                                   }
            else{
            Case cse 								= 		wrapperObj.caseObj;
            cse.RecordTypeId 						=		caseRecordTypeId;
            cse.Status								=		'New';
            cse.Origin								=		'Portal';
            cse.Priority							=		'Medium';
			cse.Request_Reason__c					=		'HA';
			cse.Ebt_Mobile_Phone__c					=		wrapperObj.acnt.PersonMobilePhone;
			cse.AccountId							=		wrapperObj.acnt.Id;
        	cse.ContactId							=		wrapperObj.acnt.PersonContactId;
			

			for(integer i=0 ; i < wrapperObj.huntCategories.size() ; i++)
            {
                huntCategoriesStr += wrapperObj.huntCategories[i]+ ';';
            }
			for(integer i=0 ; i < wrapperObj.huntEvents.size() ; i++)
            {
                huntEvents += wrapperObj.huntEvents[i]+ ';';
            }

  			cse.Hunt_Events__c		=	huntEvents;
			cse.Hunt_Category__c	=	huntCategoriesStr;

			System.debug('------------HUNTING REQUEST---------------' + '\n' + cse);
           
        insert cse; 

		Case insertedCase = [Select Id, CaseNumber From Case
							Where Id = :cse.Id limit 1];
		objWrapper.caseObj = insertedCase;

		 //create CDLink
		 if (wrapperObj.fileid != null) {
			ContentDocumentLink CDLink=new ContentDocumentLink();
			CDLink.ContentDocumentId=wrapperObj.fileid;
			CDLink.LinkedEntityId=insertedCase.Id;
			insert CDLink;
		 }
			
        return objWrapper;
            }
        }
        
       catch (Exception ex)
        {
			System.debug('------------HUNTING REQUEST---------------' + '\n' + ex.getMessage());
            objWrapper.exceptionMsg = ex.getMessage();            
			return objWrapper;
        }
    }

	@AuraEnabled
	public static Case isCaseExists(){
		//check for case existance
		//get user logged id
		String UserId = UserInfo.getUserId();
		//get contact id against user id
		String contactId = utility.getUserContactId(UserId);
		//get Hunt Draw Request record type id
		Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
		List<Case> hCase  = [SELECT Id, Request_Reason__c, CaseNumber, Status, Selected_Event__c  FROM Case
		 				WHERE ContactId =:contactId and Request_Reason__c = 'HA' and RecordTypeId = :caseRecordTypeId limit 1];
        if(hCase.size() > 0){
            return hCase[0];
        }
        return null;
	}
	

    
   
    @AuraEnabled
    public static Map<string, string> getStates(){
        Map<string, US_States__c> mapCodes = US_States__c.getAll();
        Map<string, string> mapStateCodes = new Map<string, string>();
        for(string key:mapCodes.keySet()){
            mapStateCodes.put(mapCodes.get(key).ISO_Code__c, key);
        }
        return mapStateCodes;
    }

	public static Map<String, List<String>> getCountryStatesPicklistMap(String strObjectName, String strparentField, String strChildField){
		Map<String, List<String>> country_States_PicklistMap = new Map<String, List<String>>();
		Schema.sObjectType objType = Schema.getGlobalDescribe().get(strObjectName).newSObject().getSObjectType();
		Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();

		List<customPicklistEntryWrapper> depEntriesList = (List<customPicklistEntryWrapper>)JSON.deserialize(JSON.serialize(objFieldMap.get(strChildField).getDescribe().getPicklistValues()), List<customPicklistEntryWrapper>.class);
		List<String> controllingValues = new List<String>();

		for (Schema.PicklistEntry ple : objFieldMap.get(strparentField).getDescribe().getPicklistValues()){
			country_States_PicklistMap.put(ple.getLabel(), new List<String>());
			controllingValues.add(ple.getLabel());
		}

		for (customPicklistEntryWrapper plew : depEntriesList){
			String validForBits = alphaBaseToBits(plew.validFor);
			for (Integer i = 0; i < validForBits.length(); i++){
				String bit = validForBits.mid(i, 1);
				if (bit == '1'){
					country_States_PicklistMap.get(controllingValues.get(i)).add(plew.label);
				}
			}
		}
		return country_States_PicklistMap;
	}

	private static String alphaBaseToBits(String validFor){
		if (String.isEmpty(validFor))
			return '';
		String validForBits = '';

		for (Integer i = 0; i < validFor.length(); i++){
			String thisChar = validFor.mid(i, 1);
			Integer val = getAlphaChars.indexOf(thisChar);
			String bits = decimalToBinary(val).leftPad(6, '0');
			validForBits += bits;
		}

		return validForBits;
	}

	private static String decimalToBinary(Integer val){
		String bits = '';
		while (val > 0){
			Integer remainder = Math.mod(val, 2);
			val = Integer.valueOf(Math.floor(val / 2));
			bits = String.valueOf(remainder)+bits;
		}
		return bits;
	}

	private class customPicklistEntryWrapper{
		public String active;
		public String defaultValue;
		public String label;
		public String value;
		public String validFor;

	}
}