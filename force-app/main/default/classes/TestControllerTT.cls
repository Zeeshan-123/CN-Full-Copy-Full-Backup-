/*--------------------------------------------------------------------------
@author: Alishba
@date: April/23/2021
@purpose: test class for TestController
---------------------------------------------------------------------------*/
@istest
public class TestControllerTT 
{
     private class RRR_Exception extends Exception{}
	  @istest
    public static void runTest()
    {
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
	 	
        Account HMAcc1 = Community_TestDataFactory.createAccountWithGen('Leo','Rogger','leo@test.com','987432',dDate2, 'Female');
        Account HMAcc2 = Community_TestDataFactory.createAccountWithGen('Clara','Rogger','clara@test.com','76541',dDate2, 'Female');
        Account HMAcc3 = Community_TestDataFactory.createAccountWithGen('Smith','Murdock','smith@test.com','44511',dDate,'Male');
        Account HMAcc4 = Community_TestDataFactory.createAccountWithGen('James','Riddle','mark@test.com','98421',dDate,'Male');
        
       
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        Household_Member__c HM1 = new  Household_Member__c (First_Name__c = 'Leo', Last_Name__c = 'Rogger', Citizen_Id__c = '987432', Date_of_Birth__c = dDate2);
        Household_Member__c HM2 = new Household_Member__c (First_Name__c = 'Clara', Last_Name__c = 'Rogger', Citizen_Id__c = '76541', Date_of_Birth__c =dDate2);
        Household_Member__c HM3 = new  Household_Member__c (First_Name__c = 'Mack', Last_Name__c = 'Paul', Citizen_Id__c = '51243', Date_of_Birth__c = dDate2);
        Household_Member__c HM4 = new  Household_Member__c (First_Name__c = 'Smith', Last_Name__c = 'Murdock', Citizen_Id__c = '44511', Date_of_Birth__c = dDate2);
        Household_Member__c HM5 = new Household_Member__c (First_Name__c = 'James', Last_Name__c = '', Citizen_Id__c = '98421', Date_of_Birth__c = dDate2);
        
        List<Household_Member__c> householdMembersListToInsert = new List<Household_Member__c>();
        householdMembersListToInsert.add(HM1);   
        
        List<Household_Member__c> householdMembersListToInsert2 = new List<Household_Member__c>();
    	householdMembersListToInsert2.add(HM3);   
        householdMembersListToInsert2.add(HM4);   
        
        List<Household_Member__c> householdMembersList3 = new List<Household_Member__c>();
        householdMembersList3.add(HM2);
        
        List<Household_Member__c> householdMembersListEmp = new List<Household_Member__c>();        
        
        String covidImpacts ='Job loss or loss/reduction of income;';

        Case RRR_Request 		=		new Case(Primary_Contact_First_Name__c = 'Barin', Primary_Contact_Last_Name__c = 'David',  COVID19_Impact_on_the_Household__c = covidImpacts,
                                                 Ebt_Mobile_Phone__c = '9876543211', Mailing_Street__c = 'St. 403', mailing_address2__c = '',
                                                 mailing_suite__c = 'Apt C', Mailing_City__c = 'Cusseta', 
                                                 Mailing_ZipPostal_Code__c = '98704', Mailing_Countries__c = 'United States',
                                                 Mailing_States__c = 'Alabama', Other_Mailing_State__c = '',
                                                 Melissa_Address__c = '123 Murrieta California United States 97232', Is_Address_Changed__c = false, Is_Manual_Address__c = true);
        
        Case RRR_Request2 		=		new Case(Primary_Contact_First_Name__c = 'Barin', Primary_Contact_Last_Name__c = 'David',  COVID19_Impact_on_the_Household__c = covidImpacts,
                                                 Ebt_Mobile_Phone__c = '', Mailing_Street__c = 'St. 403', mailing_address2__c = '',
                                                 mailing_suite__c = 'Apt C', Mailing_City__c = 'Cusseta', 
                                                 Mailing_ZipPostal_Code__c = '', Mailing_Countries__c = 'United States',
                                                 Mailing_States__c = 'Alabama', Other_Mailing_State__c = '',
                                                 Melissa_Address__c = '123 Murrieta California United States 97232', Is_Address_Changed__c = false, Is_Manual_Address__c = true);
        
        
        system.runAs(userForTesting)  {
            test.startTest();
            
            TestController.validateApplicantEligibility();
            TestController.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            TestController.validateHMList(householdMembersListToInsert);
            TestController.validateHMList(householdMembersListToInsert2);
            
            Case cs = TestController.saveRequest(householdMembersListToInsert, RRR_Request);
            Case  caseCreated = [SELECT Id, Request_Reason__c, Add_on__c, RRR_Request_Edit_Status__c, CaseNumber, Status, 
                                 mailing_suite__c, mailing_address2__c, Account.Name , COVID19_Impact_on_the_Household__c, Ebt_Mobile_Phone__c,
                                 Mailing_Street__c, Mailing_City__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c,
                                 Ebt_Email__c,Is_Address_Changed__c,Is_Manual_Address__c,Melissa_Address__c, Primary_Contact_First_Name__c, Primary_Contact_Last_Name__c,
                                 (SELECT Id, First_Name__c, Last_Name__c, AccountId__r.HealthCloudGA__Gender__pc, Gender__c, Date_of_Birth__c, Citizen_Id__c FROM Household_Members__r
                                  WHERE Citizen_id__c !=: acc.Tribe_Id__c) FROM Case
                                 WHERE Id =: cs.Id];
            TestController.validateApplicantEligibility();
            TestController.updateRequest(caseCreated.Id, householdMembersList3, householdMembersListEmp, caseCreated);  
            TestController.updateRequest(caseCreated.Id, householdMembersListEmp, householdMembersList3, caseCreated);  
            TestController.dltHouseholdMember(HM1.Id, caseCreated.Id);
            try  { 
                TestController.saveRequest(householdMembersListEmp, RRR_Request2);
            }
            catch(exception  e) {
           //     System.assertEquals(e.getMessage(),'Please enter a valid Last Name for primary applicant.');
            }
            test.stopTest();
        }
    }
    
}