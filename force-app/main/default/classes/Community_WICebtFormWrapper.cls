/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: March/03/2021
@Purpose: This class is used as a wrapper  for Community_WICebtFormController class.
---------------------------------------------------------------------------------------------------------------*/
public class Community_WICebtFormWrapper 
{
        
    @AuraEnabled
    public Map<String, String> gender {get;set;}
    
    @AuraEnabled
    public Map<String, String> ethnicity {get;set;}
    
     @AuraEnabled
    public Map<String, String> tribe {get;set;}
    
     @AuraEnabled
    public Map<String, String> grade {get;set;}
    
     @AuraEnabled
    public Map<String, String> school {get;set;}
    
    @AuraEnabled
    public Map<String, String> fosterChild {get;set;}
    
    @AuraEnabled
    public Map<String, String> migrant {get;set;}
    
    @AuraEnabled
    public Map<String, String> homeLanguage {get;set;}
    
     @AuraEnabled
    public Map<String, String> incomeFrequency {get;set;}
    
    @AuraEnabled
    public Map<String, List<String>> pickListMap;
    
    @AuraEnabled
    public Account acnt {get;set;}
    
     @AuraEnabled
    public String userEmail {get;set;}
     
    
    public Community_WICebtFormWrapper()
    {
        
    }

}