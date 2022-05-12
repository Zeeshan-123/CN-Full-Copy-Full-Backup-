/*--------------------------------------------------------------------------------------------------------------
@Author: Zeeshan Haider
@Date:Aug/05/2021
@Purpose: This class is used as a test class for Community_VaccineLotteryController class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_VaccineLotteryControllerTest {
    @isTest
    static void newCase() {
        String caseId = '';
        Date youthdDate = Date.newInstance(2002, 12, 14);
        Date elderdDate = Date.newInstance(1956, 12, 14);
        Date veterandDate = Date.newInstance(1990, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',elderdDate);
        User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   

        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];

        system.runAs(userForTesting)
        {
            test.startTest();
            Community_VaccineLotteryWrapper wrapperObj = new Community_VaccineLotteryWrapper();

            wrapperObj = Community_VaccineLotteryController.getApplicantInfo();

            String todate = '12/27/2013';  
            Date dt = Date.parse( todate );  
            
            Case cse = new Case();
            cse.Physical_Street__c                      = '37 Street';
            cse.Physical_City__c                        = 'Edmond';
            cse.Physical_ZipPostal_Code__c              = '73003';
            cse.Physical_Countries__c                   = 'United States';
            cse.Physical_States__c                      = 'Oklahoma';
            cse.Other_Physical_State__c                 = '';
            cse.Physical_Suite__c                       = '';
            cse.Physical_Address2__c                    = '';
            cse.Physical_IsManual__c                    = false;
            cse.Physical_Melissa_Address__c             = '';
            cse.VL_Vaccine_Type__c                      = 'Moderna';
            cse.VL_Final_Vaccination_Date__c             = dt;
          
            List<String> fileIds = new List<String>{'0692h000001GgnpAAC'};
            wrapperObj.caseObj = cse;
            wrapperObj.fileids = fileIds;
            

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

            wrapperObj = Community_VaccineLotteryController.createCase(wrapperObj);
            wrapperObj = Community_VaccineLotteryController.createCase(wrapperObj);
            
            test.stopTest();
        }
    }
   
}