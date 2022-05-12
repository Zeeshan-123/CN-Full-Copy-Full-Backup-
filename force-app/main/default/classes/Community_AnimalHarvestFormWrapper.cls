/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date: July/15/2021
 @Purpose: This class is used as a wrapper  for Community_HuntingDrawAppController class.
 ---------------------------------------------------------------------------------------------------------------*/

public class Community_AnimalHarvestFormWrapper {
    @AuraEnabled
	public Account acnt{ get; set; }
	

    @AuraEnabled
	public String exceptionMsg{ get; set; }
    
    @AuraEnabled 
    public Map<String, String> landTypeMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> methodMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> ageGroupMap {get;set;}
    
    @AuraEnabled
    public Map<String, String> countyMap {get;set;}
    
        
    public Community_AnimalHarvestFormWrapper(Account acnt, Map<String, String> landTypeMap, Map<String, String> methodMap, Map<String, String> ageGroupMap, Map<String, String> countyMap){
     this.landTypeMap = landTypeMap; 
     this.methodMap = methodMap; 
     this.ageGroupMap = ageGroupMap; 
     this.countyMap = countyMap; 
     this.acnt = acnt; 
                   
    }


}