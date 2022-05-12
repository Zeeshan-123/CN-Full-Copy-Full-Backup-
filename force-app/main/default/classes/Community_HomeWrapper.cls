/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date:  23/10/2020
@Purpose: This class is used as a wrapper  for Community_Home class.
---------------------------------------------------------------------------------------------------------------*/
public class Community_HomeWrapper{
    @AuraEnabled
    public Account acnt {get;set;}
    
    @AuraEnabled
    public list<Case> cases {get;set;}
    
  	 @AuraEnabled
    public Map<string, string> mapOfStates {get;set;}
    
     @AuraEnabled
    public Map<String, List<String>> mapOfDependentPL;
    
    public Community_HomeWrapper(Account acnt, list<Case> cases, Map<string, string> mapOfStates, Map<String, List<String>> mapOfDependentPL){
        this.acnt = acnt;
        this.cases = cases;
        this.mapOfStates = mapOfStates;
        this.mapOfDependentPL = mapOfDependentPL;
    }
}