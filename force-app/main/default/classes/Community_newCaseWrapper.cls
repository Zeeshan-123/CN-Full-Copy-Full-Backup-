/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: June/09/2021
@Purpose: This class is used as a wrapper  for Community_newCaseController class.
---------------------------------------------------------------------------------------------------------------*/
public class Community_newCaseWrapper 
{
        
    @AuraEnabled
    public Map<String, String> requestReasons {get;set;}
    
    @AuraEnabled
    public Map<String, String> IsUnderEighteen {get;set;}
    
     @AuraEnabled
    public Map<String, String> requestingPerson {get;set;}

	@AuraEnabled
    public Account acnt {get;set;}
    
     public Community_newCaseWrapper(Account acnt, Map<String, String> requestReasons, Map<String, String> IsUnderEighteen, Map<String, String> requestingPerson)
    {
        this.acnt = acnt;
        this.requestReasons = requestReasons;
        this.IsUnderEighteen = IsUnderEighteen;
        this.requestingPerson = requestingPerson;
    }
}