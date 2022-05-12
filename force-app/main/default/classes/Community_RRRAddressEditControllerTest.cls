/*--------------------------------------------------------------------------
@author: Alishba
@date: July/14/2021
@purpose: test class for Community_RRRAddressEditController
---------------------------------------------------------------------------*/
@istest
public  class Community_RRRAddressEditControllerTest
{
     @istest
    public static void runTest()
    {
        
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
	 	
        Account HMAcc1 = Community_TestDataFactory.createAccountWithGen('Leo','Rogger','leo@test.com','987432',dDate2, 'Male');
        Account HMAcc2 = Community_TestDataFactory.createAccountWithGen('Clara','Rogger','clara@test.com','76541',dDate2, 'Female');
        Account HMAcc3 = Community_TestDataFactory.createAccountWithGen('Smith','Murdock','smith@test.com','44511',dDate, 'Male');
        
        Account acc = Community_TestDataFactory.createAccountWithGen('Martha','David','nike@g.com','14124', dDate, 'Female');
     	User usr = Community_TestDataFactory.createUser('Martha','David','barin@g.com',acc.id);   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        
         //get RRR Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        
          system.runAs(userForTesting)
        {
            test.startTest();
            Case cse = new Case();
            cse.RecordTypeId 			=		caseRecordTypeId;
            cse.AccountId				=		acc.Id;
            cse.Status					=		'New';
            cse.Origin					=		'Portal';
            cse.Priority				=		'Medium';
            cse.Request_Reason__c		=		'RRR';
            cse.Primary_Contact_First_Name__c			=		'Martha';
            cse.Primary_Contact_Last_Name__c			=		'David';
            insert cse;
            
            List<Household_Member__c> householdMembersListToInsert = new List<Household_Member__c>();
            Household_Member__c HM1 = new  Household_Member__c (First_Name__c = 'Leo', Last_Name__c = 'Rogger', Citizen_Id__c = '987432', Date_of_Birth__c = dDate2 , Request__c = cse.Id);
            Household_Member__c HM2 = new Household_Member__c (First_Name__c = 'Clara', Last_Name__c = 'Rogger', Citizen_Id__c = '76541', Date_of_Birth__c =dDate2 , Request__c = cse.Id);
            householdMembersListToInsert.add(HM1);   
            householdMembersListToInsert.add(HM2);
            insert  householdMembersListToInsert;
            
            HM1.Status__c = 'NAME CORRECTION REQUIRED';
            update HM1;
            Community_RRRAddressEditController.getData('Case','Physical_Countries__c','Physical_States__c', true, cse.id);
            Community_RRRAddressEditController.getStates();
            Community_RRRAddressEditController.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            Community_RRRAddressEditController.updateAddress(cse.Id, 'Street 402', 'XYZ', 'United States', 'California', '', '90450', 'suit 2', '',
                                                             'Street 402 California United States 90450 suit 2', true, false );
            Community_RRRAddressEditController.updateName(cse.Id, householdMembersListToInsert, 'LN Test' , acc.Tribe__c ,false);
            
            test.stopTest();
        }
    }
    

}