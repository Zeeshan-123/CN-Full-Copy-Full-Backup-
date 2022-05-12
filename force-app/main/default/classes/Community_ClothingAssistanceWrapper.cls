/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_RRRFormController class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_ClothingAssistanceWrapper {
 	 @AuraEnabled
    public Case ClothingApplication  {get;set;}
    
      @AuraEnabled
    public String userClothingApplication {get;set;}
            
    @AuraEnabled
    public String Hotspot_Eligible {get;set;}
    
    @AuraEnabled
    public String noClothingApplicationSubmitted  {get;set;}
            
    @AuraEnabled
    public String IsMinor {get;set;}
    
    @AuraEnabled
    public list<String> InvalidCitizenIds {get;set;}
     
    @AuraEnabled
    public list<String> CitizenIdsOfAccntsWithDoDNN {get;set;}
    
    @AuraEnabled
    public list<String> CitizenIdsOfRelinquishedAccounts {get;set;}
    
     @AuraEnabled
    public list<Account> accList {get;set;}
    
     @AuraEnabled
    public Community_ClothingAssistanceDataWrapper wrp {get;set;}
    
     @AuraEnabled
    public Map<string, string> statesMap {get;set;}
    
}