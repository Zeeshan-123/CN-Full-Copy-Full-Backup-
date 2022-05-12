/*--------------------------------------------------------------------------------------------------------------
@Author: Zeeshan Haider
@Date:Aug/05/2021
@Purpose: This class is used as a test class for Community_HuntingDrawAppController class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_HuntingDrawAppControllerTest {
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
            Community_HuntingDrawAppWrapper wrapperObj = new Community_HuntingDrawAppWrapper();

            wrapperObj = Community_HuntingDrawAppController.getApplicantInfo();

            
            Case cse = new Case();
            cse.PG_First_Name__c                        = 'abc';
            cse.PG_Middle_Name__c                       = '';
            cse.PG_Last_Name__c                         = 'efg';
            cse.PG_Driver_License__c                    = 'TRY7655899';
            cse.PG_Mobile_Phone__c                      = '7654567898';
            cse.PG_Physical_Street__c                   = '37 Street';
            cse.PG_Physical_City__c                     = 'Edmond';
            cse.PG_Physical_ZipPostal_Code__c           = '73003';
            cse.PG_Physical_Country__c                  = 'United States';
            cse.PG_Physical_State__c                    = 'Oklahoma';
            cse.PG_Other_Physical_State__c              = '';
            cse.PG_Physical_Suite__c                    = '';
            cse.PG_Physical_Address_Line2__c            = '';
            cse.PG_Physical_Melissa_Address__c          = '';
            cse.PG_Physical_IsManual__c                 = false;
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
            cse.Is_Applicant_Under_18__c                = 'Yes';
            cse.Hunting_License_Holder__c               = 'Yes';
            cse.AA_First_Name__c                        = 'Check';
            cse.AA_Middle_Name__c                       = '';
            cse.AA_Last_Name__c                         = 'Check2';
            cse.AA_Driver_License__c                    = 'TYU987654456';
            cse.AA_Mobile_Phone__c                      = '1234567890';

            String[] huntCat = new String[] {'Fish and Wildlife Controlled Hunt Youth App'};
            String[] huntEvnts = new String[] {'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)',
                                                'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)'};
            wrapperObj.caseObj = cse;
            wrapperObj.huntCategories = huntCat;
            wrapperObj.huntEvents = huntEvnts;
            wrapperObj.filename = 'Testing';
            wrapperObj.fileid = '0692h000001GgnpAAC';
            

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

            wrapperObj = Community_HuntingDrawAppController.createCase(wrapperObj);
            wrapperObj = Community_HuntingDrawAppController.createCase(wrapperObj);
            
            test.stopTest();
        }
    }
    
    @isTest
    static void serverValTest2() {
        String caseId = '';
        Date under18 = Date.newInstance(2002, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Alexander','Arnold','arnold@g.com','14124',under18);
        acc.PersonMobilePhone = '3211231231';
        update acc;
        User usr = Community_TestDataFactory.createUser('Alexander','Arnold','alex@g.com',acc.id);   

        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];

        system.runAs(userForTesting)
        {
            test.startTest();
            Community_HuntingDrawAppWrapper wrapperObj = new Community_HuntingDrawAppWrapper();

            wrapperObj = Community_HuntingDrawAppController.getApplicantInfo();

			wrapperObj.acnt.PersonMobilePhone = '3211231231';
            
            Case cse = new Case();
            cse.PG_First_Name__c                        = 'test';
            cse.PG_Middle_Name__c                       = '';
            cse.PG_Last_Name__c                         = 'test last name';
            cse.PG_Driver_License__c                    = 'TRY7655899';
            cse.PG_Mobile_Phone__c                      = '7654567898';
            cse.PG_Physical_Street__c                   = '37 Street';
            cse.PG_Physical_City__c                     = 'Edmond';
            cse.PG_Physical_ZipPostal_Code__c           = '73003';
            cse.PG_Physical_Country__c                  = 'United States';
            cse.PG_Physical_State__c                    = 'Oklahoma';
            cse.PG_Other_Physical_State__c              = '';
            cse.PG_Physical_Suite__c                    = '';
            cse.PG_Physical_Address_Line2__c            = '';
            cse.PG_Physical_Melissa_Address__c          = '';
            cse.PG_Physical_IsManual__c                 = false;
            cse.Physical_Street__c                      = '37 Street';
            cse.Physical_City__c                        = '';
            cse.Physical_ZipPostal_Code__c              = '73003';
            cse.Physical_Countries__c                   = 'United States';
            cse.Physical_States__c                      = '';
            cse.Other_Physical_State__c                 = '';
            cse.Physical_Suite__c                       = '';
            cse.Physical_Address2__c                    = '';
            cse.Physical_IsManual__c                    = false;
            cse.Physical_Melissa_Address__c             = '';
            cse.Is_Applicant_Under_18__c                = 'Yes';
            cse.Hunting_License_Holder__c               = 'Yes';
            cse.AA_First_Name__c                        = 'Check';
            cse.AA_Middle_Name__c                       = '';
            cse.AA_Last_Name__c                         = 'Check2';
            cse.AA_Driver_License__c                    = 'TYU987654456';
            cse.AA_Mobile_Phone__c                      = '1234567890';

            String[] huntCat = new String[] {'Fish and Wildlife Controlled Hunt Youth App'};
            String[] huntEvnts = new String[] {'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)',
                                                'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)'};
            wrapperObj.caseObj = cse;
            wrapperObj.huntCategories = huntCat;
            wrapperObj.huntEvents = huntEvnts;
            wrapperObj.filename = 'Testing';
            wrapperObj.fileid = '0692h000001GgnpAAC';
            
            wrapperObj = Community_HuntingDrawAppController.createCase(wrapperObj);
            
            test.stopTest();
        }
    }
    
    @isTest
    static void serverValTest() {
        String caseId = '';
        Date under18 = Date.newInstance(2002, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Hernandez','David','david@g.com','14124',under18);
        acc.PersonMobilePhone = '3211231231';
        update acc;
        User usr = Community_TestDataFactory.createUser('Hernandez','David','hernandez@g.com',acc.id);   

        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];

        system.runAs(userForTesting)
        {
            test.startTest();
            Community_HuntingDrawAppWrapper wrapperObj = new Community_HuntingDrawAppWrapper();

            wrapperObj = Community_HuntingDrawAppController.getApplicantInfo();
			wrapperObj.acnt.PersonMobilePhone = '3211231231';
            
            Case cse = new Case();
            cse.PG_First_Name__c                        = 'test2';
            cse.PG_Middle_Name__c                       = '';
            cse.PG_Last_Name__c                         = '';
            cse.PG_Driver_License__c                    = '';
            cse.PG_Mobile_Phone__c                      = '';
            cse.PG_Physical_Street__c                   = '';
            cse.PG_Physical_City__c                     = '';
            cse.PG_Physical_ZipPostal_Code__c           = '';
            cse.PG_Physical_Country__c                  = 'United States';
            cse.PG_Physical_State__c                    = '';
            cse.PG_Other_Physical_State__c              = '';
            cse.PG_Physical_Suite__c                    = '';
            cse.PG_Physical_Address_Line2__c            = '';
            cse.PG_Physical_Melissa_Address__c          = '';
            cse.PG_Physical_IsManual__c                 = false;
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
            cse.Is_Applicant_Under_18__c                = 'Yes';
            cse.Hunting_License_Holder__c               = 'Yes';
            cse.AA_First_Name__c                        = 'Check';
            cse.AA_Middle_Name__c                       = '';
            cse.AA_Last_Name__c                         = 'Check2';
            cse.AA_Driver_License__c                    = 'TYU987654456';
            cse.AA_Mobile_Phone__c                      = '1234567890';

            String[] huntCat = new String[] {'Fish and Wildlife Controlled Hunt Youth App'};
            String[] huntEvnts = new String[] {'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)',
                                                'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)'};
            wrapperObj.caseObj = cse;
            wrapperObj.huntCategories = huntCat;
            wrapperObj.huntEvents = huntEvnts;
            wrapperObj.filename = 'Testing';
            wrapperObj.fileid = '0692h000001GgnpAAC';
            
            wrapperObj = Community_HuntingDrawAppController.createCase(wrapperObj);
            
            test.stopTest();
        }
    }
    
}