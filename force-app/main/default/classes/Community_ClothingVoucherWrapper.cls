/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_ClothingVoucher class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_ClothingVoucherWrapper {
 	 @AuraEnabled
    public Case ClothingVoucherApp  {get;set;}
    
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
    public Map<String, String> gradeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> categoryMap {get;set;} 
    
    @AuraEnabled
    public Map<String, String> relationMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> HHMRelationMap {get;set;}
    
    
     public Community_ClothingVoucherWrapper( Account acnt, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL,
                                             Map<String, String> gradeMap, Map<String, String> categoryMap, Map<String, String> relationMap
                                            , Map<String, String> HHMRelationMap){
        this.acnt = acnt;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
        this.gradeMap = gradeMap;
        this.categoryMap = categoryMap;
        this.relationMap = relationMap;
        this.HHMRelationMap = HHMRelationMap;                                        
    }
    
    public Community_ClothingVoucherWrapper(Case ClothingVoucherApp){
        this.ClothingVoucherApp = ClothingVoucherApp;
    }
    
    public Community_ClothingVoucherWrapper(list<String> NonVerifiedStudentIds, list<Account> legitStudentsAccounts){
        this.NonVerifiedStudentIds = NonVerifiedStudentIds;
        this.legitStudentsAccounts = legitStudentsAccounts;
    }
    
}