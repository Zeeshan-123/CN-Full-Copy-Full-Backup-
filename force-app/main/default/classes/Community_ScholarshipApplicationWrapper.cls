/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: March/12/2021
@Purpose: This class is used as a wrapper  for Community_ClothingVoucher class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_ScholarshipApplicationWrapper {
 	 @AuraEnabled
    public List<Case> ScholarshipApp  {get;set;}
    
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
    public Map<String, String> genderMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> maritalMap {get;set;} 
    
    @AuraEnabled
    public Map<String, String> tribeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> districtMap {get;set;}
    @AuraEnabled
    public Map<String, String> semesterMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> classificationMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> monthMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> fieldofStudyMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> degreeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> studentTypeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> applicationTypeMap {get;set;}
    
     @AuraEnabled
    public Map<String, String> relationMap {get;set;}
    
      @AuraEnabled
    public Map<String, String> countyMap {get;set;}
    
    
    public Community_ScholarshipApplicationWrapper( Account acnt, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL,
                                             Map<String, String> genderMap, Map<String, String> maritalMap, Map<String, String> tribeMap
                                            , Map<String, String> districtMap, Map<String, String> semesterMap, Map<String, String> classificationMap,
                                                   Map<String, String> monthMap, Map<String,String> fieldofStudyMap, Map<String, String> degreeMap, Map<String, String> studentTypeMap,  
                                                    Map<String, String> applicationTypeMap, Map<String, String> relationMap, Map<String, String> countyMap){
        
        this.acnt = acnt;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
        this.genderMap = genderMap;
        this.maritalMap = maritalMap;
        this.tribeMap = tribeMap;
        this.districtMap = districtMap;   
        this.semesterMap = semesterMap; 
        this.classificationMap = classificationMap; 
        this.monthMap = monthMap; 
        this.fieldofStudyMap = fieldofStudyMap; 
        this.degreeMap = degreeMap; 
        this.studentTypeMap = studentTypeMap; 
		this.applicationTypeMap = applicationTypeMap; 
		this.relationMap = relationMap; 
        this.countyMap = countyMap;
                                                      
    }
     public Community_ScholarshipApplicationWrapper(List<Case> ScholarshipApp, Account acnt, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL,
                                             Map<String, String> genderMap, Map<String, String> maritalMap, Map<String, String> tribeMap
                                            , Map<String, String> districtMap, Map<String, String> semesterMap, Map<String, String> classificationMap,
                                                   Map<String, String> monthMap, Map<String,String> fieldofStudyMap, Map<String, String> degreeMap, Map<String, String> studentTypeMap,  
                                                    Map<String, String> applicationTypeMap, Map<String, String> relationMap, Map<String, String> countyMap){
        this.ScholarshipApp = ScholarshipApp; 
        this.acnt = acnt;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
        this.genderMap = genderMap;
        this.maritalMap = maritalMap;
        this.tribeMap = tribeMap;
        this.districtMap = districtMap;   
        this.semesterMap = semesterMap; 
        this.classificationMap = classificationMap; 
        this.monthMap = monthMap; 
        this.fieldofStudyMap = fieldofStudyMap; 
        this.degreeMap = degreeMap; 
        this.studentTypeMap = studentTypeMap; 
		this.applicationTypeMap = applicationTypeMap; 
		this.relationMap = relationMap; 
        this.countyMap = countyMap;
                                                      
    }
    
    
    public Community_ScholarshipApplicationWrapper(List<Case> ScholarshipApp){
        this.ScholarshipApp = ScholarshipApp;
    }
    
    public Community_ScholarshipApplicationWrapper(list<String> NonVerifiedStudentIds, list<Account> legitStudentsAccounts){
        this.NonVerifiedStudentIds = NonVerifiedStudentIds;
        this.legitStudentsAccounts = legitStudentsAccounts;
    }
    
}