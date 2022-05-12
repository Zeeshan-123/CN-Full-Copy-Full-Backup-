/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_ClothingVoucher class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_UtilityAssistanceWrapper {
 	 @AuraEnabled
    public Case caseRec  {get;set;}
    
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
    public Map<String, String> employmentStatusMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> subAppEmploymentStatusMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> subAppRelationshipStatusMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> utilityTypeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> covidImpactMap {get;set;}
    
    
    

    public Community_UtilityAssistanceWrapper(Account acnt, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL,
                                         Map<String, String> employmentStatusMap, Map<String, String> subAppEmploymentStatusMap, Map<String, String> subAppRelationshipStatusMap,
                                             Map<String, String> utilityTypeMap, Map<String, String> covidImpactMap){
        
        this.caseRec = caseRec; 
                                                 this.acnt = acnt;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
        this.employmentStatusMap = employmentStatusMap;
        this.subAppEmploymentStatusMap = subAppEmploymentStatusMap; 
        this.subAppRelationshipStatusMap = subAppRelationshipStatusMap; 
        this.utilityTypeMap = utilityTypeMap;
        this.covidImpactMap = covidImpactMap; 
        
                                                      
    }
    
    
    public Community_UtilityAssistanceWrapper(Case caseRec){
        this.caseRec = caseRec;
    }
    
    public Community_UtilityAssistanceWrapper(list<String> NonVerifiedStudentIds, list<Account> legitStudentsAccounts){
        this.NonVerifiedStudentIds = NonVerifiedStudentIds;
        this.legitStudentsAccounts = legitStudentsAccounts;
    }
    
}