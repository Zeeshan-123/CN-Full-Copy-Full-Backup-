/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_ClothingVoucher class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_EmergencyAssistanceWrapper {
 	 @AuraEnabled
    public Case ScholarshipApp  {get;set;}
    
     @AuraEnabled
    public Account acnt {get;set;}
          
    @AuraEnabled
    public list<String> NonVerifiedStudentIds {get;set;}
     
    @AuraEnabled
    public list<Account> legitStudentsAccounts {get;set;}
     
     @AuraEnabled
    public Map<String, List<String>> mapOfDependentPL {get;set;}
    
     @AuraEnabled
    public Map<string, string> mapOfStates {get;set;}
    
    @AuraEnabled
    public Map<String, String> eventMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> relationshipMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> employedMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> insuranceMap {get;set;}
    
    

    public Community_EmergencyAssistanceWrapper(Account acnt, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL,
                                         Map<String, String> eventMap, Map<String, String> relationshipMap, Map<String, String> employedMap,
                                               Map<String, String> insuranceMap){
        
        this.acnt = acnt;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
        this.eventMap = eventMap;
        this.relationshipMap = relationshipMap; 
                                             this.employedMap = employedMap; 
                                                   this.insuranceMap = insuranceMap; 
        
                                                      
    }
    
    
    public Community_EmergencyAssistanceWrapper(Case ScholarshipApp){
        this.ScholarshipApp = ScholarshipApp;
    }
    
    public Community_EmergencyAssistanceWrapper(list<String> NonVerifiedStudentIds, list<Account> legitStudentsAccounts){
        this.NonVerifiedStudentIds = NonVerifiedStudentIds;
        this.legitStudentsAccounts = legitStudentsAccounts;
    }
    
}