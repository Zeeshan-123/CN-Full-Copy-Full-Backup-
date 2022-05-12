public class Community_CreateVetRecWrapper 
{
    
     @AuraEnabled
    public list<String> BranchServicePlValues {get;set;}
    
    @AuraEnabled
    public list<String> EnlistmentMonth {get;set;}
    
    @AuraEnabled
    public list<String> EnlistmentYear {get;set;}
    
    
    @AuraEnabled
    public list<String> NumOfServiceYears {get;set;}
    
    @AuraEnabled
    public list<String> NumOfServiceMonths {get;set;}
    
    public Community_CreateVetRecWrapper()
    {
        
    }

}