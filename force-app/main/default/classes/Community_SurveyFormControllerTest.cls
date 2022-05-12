/*--------------------------------------------------------------------------------------------------------------
@Author: Zeeshan Haider
@Date:Aug/05/2021
@Purpose: This class is used as a test class for Community_SurveyFormController class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_SurveyFormControllerTest {
    @isTest
    static void newCase() {
        String caseId = '';
        Date veterandDate = Date.newInstance(1990, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',veterandDate);
        User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   

        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];

        system.runAs(userForTesting)
        {
            test.startTest();
            Community_SurveyFormWrapper wrapperObj = new Community_SurveyFormWrapper();

            wrapperObj = Community_SurveyFormController.getApplicantInfo();

            
            Case cse = new Case();
            cse.SF_Program1__c				=		1;
            cse.SF_Program2__c				=		4;
            cse.SF_Program3__c				=		7;
            cse.SF_Program4__c				=		9;
            cse.SF_Program5__c              =       3;
            cse.SF_Program6__c				=		10;
            cse.SF_Program7__c	    		=		6;
            cse.SF_Program8__c		        =		1;
            cse.SF_Program9__c				=		2;
            cse.SF_Program10__c				=		9;
            cse.SF_Program11__c			    =		5;
            cse.SF_Program12__c				= 		7;
            cse.SF_Program13__c		        = 		9;
            cse.SF_Comment__c		        = 		'';
            
            wrapperObj.caseObj = cse;
            

             //Insert ContentVersion
		//     ContentVersion cVersion = new ContentVersion();
		//     cVersion.ContentLocation = 'S'; //S-Document is in Salesforce. E-Document is outside of Salesforce. L-Document is on a Social Netork.
		//     cVersion.PathOnClient = 'tectonic.jpg';//File name with extention
		//     cVersion.Origin = 'C';//C-Content Origin. H-Chatter Origin.
    	// 	cVersion.OwnerId = attach.OwnerId;//Owner of the file
	    // 	cVersion.Title = attach.Name;//Name of the file
		//     cVersion.VersionData = attach.Body; //File content
		//     cVersion.FirstPublishLocationId = attach.ParentId;
		 
		//  insert cVersion;

            wrapperObj = Community_SurveyFormController.createCase(wrapperObj);
            wrapperObj = Community_SurveyFormController.createCase(wrapperObj);
            
            test.stopTest();
        }
    }
}