/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 23/02/2021
@Purpose: This class is used as wrapper for Community_profileSettingsController class.
---------------------------------------------------------------------------------------------------------------*/


public class Community_profileSettingWrapper
{
	
    @AuraEnabled
    public String Language {get;set;}
    
    @AuraEnabled
    public String LocaleSidKey {get;set;}
    
    @AuraEnabled
    public String TimeZoneSidKey {get;set;}
    
    @AuraEnabled
    public Map<String, String> LanguageList {get;set;}
    
    @AuraEnabled
    public Map<String, String> LocaleSidKeyList {get;set;}
    
    @AuraEnabled
    public Map<String, String> TimeZoneSidKeyList {get;set;}
    
    
    public Community_profileSettingWrapper()
    {
        
    }

}