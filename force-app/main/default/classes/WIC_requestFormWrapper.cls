/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 03/03/2021
@Purpose: This class is used as a wrapper  for WIC_requestFormController class.
---------------------------------------------------------------------------------------------------------------*/

public class WIC_requestFormWrapper {

    @AuraEnabled
    public Map<String, String> gender {get;set;}

    @AuraEnabled
    public Map<String, String> ethnicity {get;set;}

    @AuraEnabled
    public Map<String, String> tribe {get;set;}

    // CNHPHOMS-16, CNHPHOMS-32: Vikash: Added Low-Lactose Option Required?
    @AuraEnabled
    public Map<String, String> lowLactoseOptionRequired {get;set;}

    @AuraEnabled
    public Map<String, String> grade {get;set;}

    @AuraEnabled
    public Map<String, String> school {get;set;}

    @AuraEnabled
    public Map<String, String> fosterChild {get;set;}

    @AuraEnabled
    public Map<String, String> migrant {get;set;}

    @AuraEnabled
    public Map<String, String> homeLanguage {get;set;}

    @AuraEnabled
    public Map<String, String> incomeFrequency {get;set;}

    @AuraEnabled
    public Map<String, List<String>> pickListMap;
     
    public WIC_requestFormWrapper() {
        
    }
}