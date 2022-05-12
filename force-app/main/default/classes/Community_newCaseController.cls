/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: Nov/11/2020
@Purpose: This class is used as controller for Community_newCase aura component.
---------------------------------------------------------------------------------------------------------------*/

public  with sharing class Community_newCaseController
{
    //get contact id of user
    private static final Id CONTACT_ID = [Select ContactId from User where Id =: Userinfo.getUserId()].ContactId;
    
    @AuraEnabled 
    public static Community_newCaseWrapper getData() 
    {
        //    Describe call for request reason picklist values
        Schema.DescribeFieldResult fieldResult1 = Case.Request_Reason__c.getDescribe();
        List<Schema.PicklistEntry> picklist1 = fieldResult1.getPicklistValues();
        Map<String, String> requestReasons = new Map<String, String>();
        for(Schema.PicklistEntry s : picklist1){
            requestReasons.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for requesting person picklist values
        Schema.DescribeFieldResult fieldResult2 = Case.Requesting_Person__c.getDescribe();
        List<Schema.PicklistEntry> picklist2 = fieldResult2.getPicklistValues();
        Map<String, String> requestingPerson = new Map<String, String>();
        for(Schema.PicklistEntry s : picklist2){
            requestingPerson.put(s.getValue(), s.getLabel());
        }  
        
        //    Describe call for is under 18 picklist values
        Schema.DescribeFieldResult fieldResult3 = Case.Is_Applicant_Under_18__c.getDescribe();
        List<Schema.PicklistEntry> picklist3 = fieldResult3.getPicklistValues();
        Map<String, String> IsUnderEighteen = new Map<String, String>();
        for(Schema.PicklistEntry s : picklist3){
           IsUnderEighteen.put(s.getValue(), s.getLabel());
        }  
        
         //query logged in user account information
        Account acc = [SELECT Id, FirstName, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c,
                       PersonEmail, PersonMobilePhone , HealthCloudGA__Gender__pc 
                       FROM Account WHERE PersonContactId =: CONTACT_ID limit 1];
        
        Community_newCaseWrapper objList = new Community_newCaseWrapper(acc, requestReasons, IsUnderEighteen, requestingPerson);
        return objList;
    }
    
    // create case
    @AuraEnabled
    public static String createCase(String[] caseType, String newEmail, String otherReason, String yesNo, String rPerson){
        try{
            String reason='';   
            
            //get Portal Request record type id
            Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Portal_Request').getRecordTypeId();
            Case cse 						= 	new Case();
            cse.ContactId					=	CONTACT_ID;
            cse.RecordTypeId 				=	caseRecordTypeId;
            cse.Status						=	'New';
            cse.Origin						=	'Portal';
            cse.Priority					=	'Medium';
            cse.New_Email__c				=	newEmail;
            cse.Other_Reason__c				=	otherReason;
            cse.Is_Applicant_Under_18__c	=	yesNo;
            cse.Requesting_Person__c		=	rPerson;


            // iterate case/request type values and create a semicolon seperated string
            // so we can store it in multi select picklist
            for(integer i=0 ; i < caseType.size() ; i++) {
                reason += caseType[i]+ ';';
            }
            
            cse.Request_Reason__c	=	reason;
           
        insert cse; 
        return cse.id;
        }
        
       catch (Exception ex)
        {
            return ex.getMessage();            
        }
    }
}