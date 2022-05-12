/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba
@Date: DEC/05/2021
@Purpose: This is used as a test class for Community_ClothingVoucherCntrl class.
---------------------------------------------------------------------------------------------------------------*/

@isTest
private class Community_ClothingVoucherCntrlTest {

	  @istest
    public static void runTest()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2012, 12, 14);
	 	List<ContentDocument> CDCustodyFiles		=		new List<ContentDocument>();
        
        Account HMAcc1 = Community_TestDataFactory.createAccount('Leo','Rogger','leo@test.com','987432',dDate2);
        Account HMAcc2 = Community_TestDataFactory.createAccount('Clara','Rogger','clara@test.com','76541',dDate2);
        Account HMAcc3 = Community_TestDataFactory.createAccount('Smith','Murdock','smith@test.com','44511',dDate);
        
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User testUser1 = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        List<HH_Member__c> HHMListToInsert = new List<HH_Member__c>();
        HH_Member__c hhm1 = new HH_Member__c (First_Name__c = 'Ben', Last_Name__c = 'Riddle', Date_of_Birth__c =dDate2);
        HHMListToInsert.add(hhm1);
        
        List<CA_Student2__c> StudentsListToInsert = new List<CA_Student2__c>();
        CA_Student2__c St1 = new  CA_Student2__c (First_Name__c = 'Leo', Last_Name__c = 'Rogger', Citizen_Id__c = '987432', Date_of_Birth__c = dDate2, Grade__c = '4th', Category__c = 'Private School');
        CA_Student2__c St2 = new CA_Student2__c (First_Name__c = 'Clara', Last_Name__c = 'Rogger', Citizen_Id__c = '76541', Date_of_Birth__c =dDate2, Grade__c = '5th', Category__c = 'Public School');
        StudentsListToInsert.add(St1);   
        
        Case cse 		=		new Case(Primary_Contact_First_Name__c = 'Barin', Primary_Contact_Last_Name__c = 'David', 
                                         Ebt_Mobile_Phone__c = '9876543211', Mailing_Street__c = 'St. 403', mailing_address2__c = '',
                                         mailing_suite__c = 'Apt C', Mailing_City__c = 'Cusseta', 
                                         Mailing_ZipPostal_Code__c = '98704', Mailing_Countries__c = 'United States',
                                         Mailing_States__c = 'Alabama', Other_Mailing_State__c = '',
                                         Melissa_Address__c = '', Is_Address_Changed__c = false, Is_Manual_Address__c = true,
                                         Physical_Street__c = 'St. 908', Physical_City__c = 'Tulsa', Physical_ZipPostal_Code__c = '90871',
                                         Physical_Countries__c = 'United States', Physical_States__c = 'Oklahoma', Physical_Suite__c = '',
                                         Physical_IsManual__c = true, Physical_Melissa_Address__c = '', Is_Physical_Address_Changed__c = false,
                                         Sec_First_Name__c = 'Franklin', Sec_Last_Name__c = 'Murdock', Sec_Phone__c = '5234567890',
                                         Relation__c = 'Friend', PG_First_Name__c = 'Lilly', PG_Last_Name__c = 'Riddle',
                                         PG_Mobile_Phone__c = '9876543211', Household_Income2__c = 40000, Household_Size2__c = 2);
        
        List<ContentDocument> CDIncomeFiles			=		new List<ContentDocument>();
        ContentVersion cVersion = new ContentVersion();
        cVersion.ContentLocation = 'S'; //S-Document is in Salesforce. E-Document is outside of Salesforce. L-Document is on a Social Netork.
        cVersion.PathOnClient = 'Test';//File name with extention
        cVersion.Origin = 'C';//C-Content Origin. H-Chatter Origin.
        cVersion.Title = 'Test';//Name of the file
        cVersion.VersionData = Blob.valueOf('Test Content'); //File content
        insert cVersion;
        
        ContentDocument Document = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument where LatestPublishedVersionId =: cVersion.Id limit 1];
        CDIncomeFiles.add(Document);
        
        ContentVersion cVersion2 = new ContentVersion();
        cVersion2.ContentLocation = 'S'; //S-Document is in Salesforce. E-Document is outside of Salesforce. L-Document is on a Social Netork.
        cVersion2.PathOnClient = 'Test';//File name with extention
        cVersion2.Origin = 'C';//C-Content Origin. H-Chatter Origin.
        cVersion2.Title = 'Test';//Name of the file
        cVersion2.VersionData = Blob.valueOf('Test Content'); //File content
        insert cVersion2;
        
        ContentDocument Document2 = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument where LatestPublishedVersionId =: cVersion2.Id limit 1];
        CDCustodyFiles.add(Document2);
        
        List<String> fileIdsToDelete	=	new List<String>();
        fileIdsToDelete.add([SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument where LatestPublishedVersionId =: cVersion2.Id limit 1].Id);
        
        system.runAs(testUser1)
        {
            test.startTest();
            Community_ClothingVoucherCntrl.validateApplicantEligibility();
            Community_ClothingVoucherCntrl.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            Community_ClothingVoucherCntrl.validateStudentsList(StudentsListToInsert);
            Community_ClothingVoucherCntrl.saveCARequest(cse, StudentsListToInsert, HHMListToInsert, '', true, false, '', true, false, CDIncomeFiles, CDCustodyFiles);
            Community_ClothingVoucherCntrl.RemoveFile(fileIdsToDelete);
            test.stopTest(); 
        }
}
    
   
}