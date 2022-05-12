/*--------------------------------------------------------------------------
@author: Alishba
@date: April/26/2021
@purpose: test class for Community_RRREditController
---------------------------------------------------------------------------*/
@istest
public  class Community_RRREditControllerTest
{
     @istest
    public static void runTest()
    {
        
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
	 	
        Account HMAcc1 = Community_TestDataFactory.createAccount('Leo','Rogger','leo@test.com','987432',dDate2);
        Account HMAcc2 = Community_TestDataFactory.createAccount('Clara','Rogger','clara@test.com','76541',dDate2);
        Account HMAcc3 = Community_TestDataFactory.createAccount('Smith','Murdock','smith@test.com','44511',dDate);
        
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
     	User usr2 = Community_TestDataFactory.createUser('Barin2','David2','barin2@g.com',HMAcc1.id);   
        
        
        
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        User userForTesting2 = [SELECT Id FROM User WHERE Id =: usr2.Id LIMIT 1];
        
        List<Household_Member__c> householdMembersListToInsert = new List<Household_Member__c>();
        Household_Member__c HM1 = new  Household_Member__c (First_Name__c = 'Leo', Last_Name__c = 'Rogger', Citizen_Id__c = '987432', Date_of_Birth__c = dDate2);
        Household_Member__c HM2 = new Household_Member__c (First_Name__c = 'Clara', Last_Name__c = 'Rogger', Citizen_Id__c = '76541', Date_of_Birth__c =dDate2);
    	householdMembersListToInsert.add(HM1);   
        householdMembersListToInsert.add(HM2);
        
        List<Household_Member__c> householdMembersListToInsert2 = new List<Household_Member__c>();
        Household_Member__c HM3 = new  Household_Member__c (First_Name__c = 'Mack', Last_Name__c = 'Paul', Citizen_Id__c = '51243', Date_of_Birth__c = dDate2);
        Household_Member__c HM4 = new  Household_Member__c (First_Name__c = 'Smith', Last_Name__c = 'Murdock', Citizen_Id__c = '44511', Date_of_Birth__c = dDate2);
    	householdMembersListToInsert2.add(HM3);   
        householdMembersListToInsert2.add(HM4);   
        
        List<Household_Member__c> householdMembersListToInsert3 = new List<Household_Member__c>();
        
        List<Household_Member__c> householdMembersListEmp = new List<Household_Member__c>();
        
        List<String> covidImpacts = new List<String>();
        covidImpacts.add('Job loss or loss/reduction of income');

         //get RRR Request record type id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();

            test.startTest();
          system.runAs(userForTesting)
        {        
            Case cse = new Case();
            cse.RecordTypeId 			=		caseRecordTypeId;
            cse.AccountId				=		acc.Id;
            cse.Status					=		'New';
            cse.Origin					=		'Portal';
            cse.Priority				=		'Medium';
            cse.Request_Reason__c		=		'RRR';
        	cse.Primary_Contact_First_Name__c			=		'Barin';
            cse.Primary_Contact_Last_Name__c			=		'David';
            insert cse;
            
            Community_RRREditController.getPicklistValues('Case','Physical_Countries__c','Physical_States__c');
            Community_RRREditController.getStates();
            Community_RRREditController.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            
            Community_RRREditController.validateHMList(householdMembersListToInsert);
            Community_RRREditController.validateHMList(householdMembersListToInsert2);
       		Community_RRREditController.updateRequest(cse.Id, householdMembersListToInsert, householdMembersListEmp, covidImpacts, '123', 'Murrieta', 'United States', 'California', '', '97232',
                                                   '1234567891', 'test@t.com', 'test user', '', '', '123 Murrieta California United States 97232', true, false);
            Community_RRREditController.updateRequest(cse.Id, householdMembersListToInsert3, householdMembersListEmp, covidImpacts, '123', 'Murrieta', 'United States', 'California', '', '97232',
                                                   '1234567891', 'test@t.com', 'test user', '', '', '123 Murrieta California United States 97232', true, false);
         	
            try{
            Community_RRREditController.updateRequest(cse.Id, householdMembersListToInsert, householdMembersListEmp, covidImpacts, '123', '', 'United States', '', '', '97232',
                                                   '1234567891', 'test@t.com', '', '', '', '123 Murrieta California United States 97232', true, false);
                Community_RRREditController.updateRequest(cse.Id, householdMembersListToInsert, householdMembersListEmp, covidImpacts, '123', '', 'United States', '', '', '97232',
                                                   '1234567891', 'test@t.com', '', '', '', '123 Murrieta California United States 97232', true, false);
            }
            Catch(Exception ex){
                System.debug(ex.getMessage());
            }
            Community_RRREditController.dltHouseholdMember(HM1.Id);
            
        }
        
        system.runAs(userForTesting2)
        {        
        Case cse2 = new Case();
            cse2.RecordTypeId 			=		caseRecordTypeId;
            cse2.AccountId				=		HMAcc1.Id;
            cse2.Status					=		'New';
            cse2.Origin					=		'Portal';
            cse2.Priority				=		'Medium';
            cse2.Request_Reason__c		=		'RRR';
        	cse2.Primary_Contact_First_Name__c			=		'Barin';
            cse2.Primary_Contact_Last_Name__c			=		'Rogger';
            insert cse2;
        Community_RRREditController.updateRequest(cse2.Id, householdMembersListToInsert3, householdMembersListToInsert, covidImpacts, '123', 'Murrieta', 'United States', 'California', '', '97232',
                                                   '1234567891', 'test@t.com', 'test user', '', '', '123 Murrieta California United States 97232', true, false);
        
        try{
            Community_RRREditController.updateRequest(cse2.Id, householdMembersListToInsert3, householdMembersListToInsert, covidImpacts, '123', '', 'United States', '', '', '97232',
                                                   '1234567891', 'test@t.com', 'test user', '', '', '123 Murrieta California United States 97232', true, false);
        }
        Catch(Exception ex){
            System.debug(ex.getMessage());
        }
            
        }
            test.stopTest();
        
    }
    
    

}