/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: June/28/2021
@Purpose: This class is used as a wrapper  for Community_ClothingAssistanceController class.
---------------------------------------------------------------------------------------------------------------*/
public class Community_ClothingAssistanceDataWrapper
{
    
    @AuraEnabled
    public Account acnt {get;set;}
    
    @AuraEnabled
    public String userEmail {get;set;}
    
    @AuraEnabled
    public Map<String, List<String>> pickListMap;
    
    @AuraEnabled
    public Map<String, String> grade {get;set;}
    
    @AuraEnabled
    public Map<String, String> category {get;set;} 
    
    @AuraEnabled
    public Map<String, String> relation {get;set;}
    
}