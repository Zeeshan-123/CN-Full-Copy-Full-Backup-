/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_RRRFormController class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_RRRFormWrapperReturn 
{
   
    @AuraEnabled
    public Case RRRCase {get;set;}
        
    @AuraEnabled
    public String onExRRRReqCheck {get;set;}
    
    @AuraEnabled
    public String noRRRCase {get;set;}
    
     @AuraEnabled
    public String userRRRCase {get;set;}
        
    @AuraEnabled
    public String IsCitizen {get;set;}
    
    @AuraEnabled
    public String IsMinor {get;set;}
    
    @AuraEnabled
    public list<String> InvalidCitizenIds {get;set;}
    
    @AuraEnabled
    public list<String> CitizenIdsOnExCases {get;set;}
    
    @AuraEnabled
    public list<String> CitizenIdsOfAccntsWithDoDNN {get;set;}
    
    @AuraEnabled
    public list<String> CitizenIdsOfRelinquishedAccounts {get;set;}
    
     @AuraEnabled
    public list<Account> accList {get;set;}
    
     @AuraEnabled
    public Community_RRRFormWrapper wrp {get;set;}
    
     @AuraEnabled
    public Map<string, string> statesMap {get;set;}
}