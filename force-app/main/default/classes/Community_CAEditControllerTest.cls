/*--------------------------------------------------------------------------
@author: Usama
@date: Aug/25/2021
@purpose: test class for Community_CAEditController
---------------------------------------------------------------------------*/
@istest
public class Community_CAEditControllerTest
{
		  @istest
    public static void runTest()
    {
        Community_CAEditController c = new Community_CAEditController();
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
	 	
        Account HMAcc1 = Community_TestDataFactory.createAccount('Leo','Rogger','leo@test.com','987432',dDate2);
        Account HMAcc2 = Community_TestDataFactory.createAccount('Clara','Rogger','clara@test.com','76541',dDate2);
        Account HMAcc3 = Community_TestDataFactory.createAccount('Smith','Murdock','smith@test.com','44511',dDate);
        
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        List<CA_Household_Member__c> StudentsListToInsert = new List<CA_Household_Member__c>();
        CA_Household_Member__c St1 = new  CA_Household_Member__c (First_Name__c = 'Leo', Last_Name__c = 'Rogger', Citizen_Id__c = '987432', Date_of_Birth__c = dDate2, Grade__c = '4th', Sector__c = 'Private School');
        CA_Household_Member__c St2 = new CA_Household_Member__c (First_Name__c = 'Clara', Last_Name__c = 'Rogger', Citizen_Id__c = '76541', Date_of_Birth__c =dDate2, Grade__c = '5th', Sector__c = 'Public School');
    	StudentsListToInsert.add(St1);   
        StudentsListToInsert.add(St2);
        
        List<CA_Household_Member__c> StudentsListInsert2 = new List<CA_Household_Member__c>();
        CA_Household_Member__c St3 = new  CA_Household_Member__c (First_Name__c = 'Mack', Last_Name__c = 'Paul', Citizen_Id__c = '51243', Date_of_Birth__c = dDate2, Grade__c = '6th', Sector__c ='Public School');
        CA_Household_Member__c St4 = new  CA_Household_Member__c (First_Name__c = 'Smith', Last_Name__c = 'Murdock', Citizen_Id__c = '44511', Date_of_Birth__c = dDate2, Grade__c = '3th', Sector__c ='Home School');
    	StudentsListInsert2.add(St3);   
        StudentsListInsert2.add(St4);   
        
        
        ContentVersion content=new ContentVersion(); 
        content.Title='Header_Picture1'; 
        content.PathOnClient='/' + content.Title + '.jpg'; 
        Blob bodyBlob=Blob.valueOf('Unit Test ContentVersion Body'); 
        content.VersionData=bodyBlob; 
        //content.LinkedEntityId=sub.id;
        content.origin = 'H';
        insert content;
        
        List<ContentDocument> documents = [SELECT Id, Title, LatestPublishedVersionId FROM ContentDocument];

        System.debug(documents[0].Id);
        system.runAs(userForTesting)
        {
            test.startTest();
            Community_ClothingAssistanceController.saveCARequest(StudentsListToInsert, 'Street: 123 ', 'Murrieta', 'United States', 'California', 'Other St', '97232',
                                                    '2234567891', '', '', '123 Murrieta California United States 97232', true, false,
                                                    'Lilly', 'Murdock', '2931124110', 'Friend', 'Murdock', 'Moore', '2931124110');
            Case cse = [Select Id FROM Case WHERE RecordType.Name='CA' limit 1];
            System.debug(cse.Id);
            for(CA_Household_Member__c std:StudentsListToInsert){
                std.Duplicate__c = true;
            }
            update StudentsListToInsert;
            Community_CAEditController.checkDuplicates(StudentsListToInsert, '987432,');
            
            
            Community_CAEditController.getFiles(cse.Id);
            Community_CAEditController.getStudents();
            
            List<String> DocIDs = new List<String>();
            DocIDs.add(documents[0].Id);
            for(CA_Household_Member__c std:StudentsListToInsert){
                std.Withdraw__c = true;
            }
            
            cse.Status='UNDER REVIEW';
            update cse;
            Community_CAEditController.saveCA(StudentsListToInsert, DocIDs, cse.Id);
            Community_CAEditController.saveCA(StudentsListInsert2, DocIDs, cse.Id);
            StudentsListInsert2[0].Withdraw__c = true;
            Community_CAEditController.saveCA(StudentsListInsert2, DocIDs, cse.Id);
            //Community_CAEditController.deleteFile(cdl.Id);
            
            test.stopTest(); 
        }
    }
}