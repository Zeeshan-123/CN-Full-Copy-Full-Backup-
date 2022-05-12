public class CernerQueue_DuplicateCountWrapper {

    @AuraEnabled
    public integer duplicateCount {get;set;}
    
    @AuraEnabled
    public String listViewId {get;set;}
    
   public CernerQueue_DuplicateCountWrapper()
   {
       
   }
}