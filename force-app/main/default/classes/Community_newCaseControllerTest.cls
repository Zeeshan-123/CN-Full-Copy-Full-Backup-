/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: Nov/11/2020
@Purpose: This class is used as a test class for Community_newCaseController class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_newCaseControllerTest
{

@isTest    
static void newCase()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
	 	Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        //create case
        
          system.runAs(userForTesting)
        {
            test.startTest();

             list<String> reasons = new list<string>{'Change Physical Address','Duplicate CDIB'};
             String contactId=utility.getUserContactId(userForTesting.Id);  
             Community_newCaseController.customDependablePicklist('Case','Physical_Countries__c','Physical_States__c');
             Community_newCaseController.customDependablePicklist('Case','Physical_Countries__c','Physical_States__c');
            //Community_newCaseController.getAlphaChars();
             //Community_newCaseController.getCaseTypeValues();
             //Community_newCaseController.getIsUnderEighteenPicklist();
             //Community_newCaseController.getRequestingPersonPicklist();
             Community_newCaseController.createCase(reasons,'Sid','sid@o.com','xyz..','st-22','Chicago', '' ,'Ca','East Chicago',
                                                   '9324','United State','','','',True,'st-33','Chicago', '' , 'Ca','West Chicago',
                                                   '93241','United State','','','',False,'No','AUTHORIZED AGENT','462462253','98521115');
             Community_newCaseController.createCase(reasons,'Sid','sid@o.com','xyz..','st-22','Chicago', '', 'Ca','',
                                                   '9324','United State','','','',True,'st-33','Chicago', '', 'Ca','',
                                                   '93241','United State','','','',False,'No','AUTHORIZED AGENT','462462253','98521115');
             Community_newCaseController.createCase(reasons,'Sid','sid@o.com','xyz..','st-22','', 'Ankara', 'AN','',
                                                   '9324','Turkey','','','',True,'st-33','', 'Ankara', 'AN','',
                                                   '93241','Turkey','','','',False,'No','AUTHORIZED AGENT','462462253','98521115');
             Community_newCaseController.createCase(reasons,'Sid','sid@o.com','xyz..','','','','','','',
                                                   '','','','',True,' ','','','','','','','','','',False,'No','AUTHORIZED AGENT','462462253','98521115');
            
            test.stopTest();

        }
     
    }
        
    
    
}