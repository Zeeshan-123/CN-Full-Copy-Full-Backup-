/*--------------------------------------------------------------------------------------------------------------
@Author: Sami Haroon
@Date: March/15/2022
@Purpose: This class is used as a wrapper  for Community_HuntingDrawAppController class.
---------------------------------------------------------------------------------------------------------------*/

public class Community_TurkeyHarvestWrapper {
    
    @AuraEnabled
    public Account acnt{ get; set; }
    
    
    @AuraEnabled
    public String exceptionMsg{ get; set; }
    
    @AuraEnabled 
    public Map<String, String> landTypeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> methodMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> beardlength {get;set;}
    
    @AuraEnabled
    public Map<String, String> spurlength {get;set;}
    
    @AuraEnabled
    public Map<String, String> countyMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> turkeygender {get;set;}
    
    
    public Community_TurkeyHarvestWrapper(Account acnt, Map<String, String> landTypeMap, Map<String, String> methodMap, Map<String, String> beardlength, Map<String, String> spurlength, Map<String, String> countyMap, Map<String, String> turkeygender){
        this.landTypeMap = landTypeMap;
        this.methodMap = methodMap;
        this.beardlength = beardlength; 
        this.spurlength = spurlength; 
        this.countyMap = countyMap;
        this.turkeygender = turkeygender;   
        this.acnt = acnt; 
        
    }
    
    
    
    
    
}