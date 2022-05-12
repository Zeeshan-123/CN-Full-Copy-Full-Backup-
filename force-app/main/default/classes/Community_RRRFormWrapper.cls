/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/03/2021
@Purpose: This class is used as a wrapper  for Community_RRRFormController class.
---------------------------------------------------------------------------------------------------------------*/
public class Community_RRRFormWrapper 
{
 
    @AuraEnabled
    public Map<String, List<String>> pickListMap;
    
    @AuraEnabled
    public Account acnt {get;set;}
    
     @AuraEnabled
    public String userEmail {get;set;}
    
    @AuraEnabled
    public Case RRRCase {get;set;}
    
    @AuraEnabled
    public Map<string, string> statesMap {get;set;}
     
}