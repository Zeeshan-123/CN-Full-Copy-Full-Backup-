public without sharing class CNHS_SendIsolationNoteController {
    public Contact cont {get; set;}  
    public CNHS_SendIsolationNoteController(){}
    public CNHS_SendIsolationNoteController(ApexPages.StandardController stdController) {
        this.cont = (Contact)stdController.getRecord();
        cont=[SELECT Id, Account.Name, Isolatied_End_Date__c FROM Contact WHERE Id =: cont.Id];
    }
}