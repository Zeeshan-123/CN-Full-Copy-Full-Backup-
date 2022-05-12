/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 23/02/2021
@Purpose: This class is used as controller for Community_profileSettings aura component.
---------------------------------------------------------------------------------------------------------------*/


public without sharing class Community_profileSettingsController 
{
    // get  picklist values
       @AuraEnabled
    public static Community_profileSettingWrapper getPicklistValuesForLocation()
    {
        Community_profileSettingWrapper objList = new Community_profileSettingWrapper();
        objList.LanguageList 		= 	new Map<String, String>();
        objList.LocaleSidKeyList 	= 	new Map<String, String>();
        objList.TimeZoneSidKeyList 	= 	new Map<String, String>();
        objList.Language 		 = 	'';
        objList.LocaleSidKey	 = 	'';
        objList.TimeZoneSidKey	 = 	'';
        
      //    Describe call for picklist values
        Schema.DescribeFieldResult fieldResult = User.LanguageLocaleKey.getDescribe();
        List<Schema.PicklistEntry> picklist = fieldResult.getPicklistValues();
        
       for(Schema.PicklistEntry s:picklist)
         {
            objList.LanguageList.put(s.getValue(), s.getLabel());
        }  

        //    Describe call for picklist values
        Schema.DescribeFieldResult fieldResult2 = User.LocaleSidKey.getDescribe();
        List<Schema.PicklistEntry> picklist2 = fieldResult2.getPicklistValues();
        
       for(Schema.PicklistEntry s : picklist2)
         {
            objList.LocaleSidKeyList.put(s.getValue(), s.getLabel());
        }  

        //    Describe call for picklist values
        Schema.DescribeFieldResult fieldResult3 = User.TimeZoneSidKey.getDescribe();
        List<Schema.PicklistEntry> picklist3 = fieldResult3.getPicklistValues();
        
         for(Schema.PicklistEntry s : picklist3)
         {
            objList.TimeZoneSidKeyList.put(s.getValue(), s.getLabel());
        }  
        
            
          //get user info
    	 User usr = [SELECT Id, Name, LocaleSidKey, LanguageLocaleKey, TimeZoneSidKey 
                    FROM User WHERE Id =: UserInfo.getUserId()];
        
        objList.Language = usr.LanguageLocaleKey;
        objList.LocaleSidKey = usr.LocaleSidKey;
        objList.TimeZoneSidKey = usr.TimeZoneSidKey;
         
       return objList;
    }

		// save updates
       @AuraEnabled
    public static void saveUpdates(String userLocale, String userTimeZone)
    {    
        User u	 			= 	new User();
        u.Id	 			=	UserInfo.getUserId();
        u.LocaleSidKey		=	userLocale;
        u.TimeZoneSidKey	=	userTimeZone;
        
        update u;
    }
}