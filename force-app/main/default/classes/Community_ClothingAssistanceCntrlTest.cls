/*--------------------------------------------------------------------------
@author: Alishba
@date: July/17/2021
@purpose: test class for Community_ClothingAssistanceController
---------------------------------------------------------------------------*/
@istest
public class Community_ClothingAssistanceCntrlTest
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
        
        system.runAs(userForTesting)
        {
            test.startTest();
            Community_ClothingAssistanceController.getData('Case','Physical_Countries__c','Physical_States__c');
            Community_ClothingAssistanceController.validateApplicantEligibility();
            Community_ClothingAssistanceController.getStates();
            Community_ClothingAssistanceController.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            
            Community_ClothingAssistanceController.validateStudentsList(StudentsListToInsert);
            Community_ClothingAssistanceController.validateStudentsList(StudentsListInsert2);
            Community_ClothingAssistanceController.sendOTP(acc.Id, '9876543210');
            Community_ClothingAssistanceController.validateEnteredOTP(acc.Id, '543216');
            Community_ClothingAssistanceController.saveCARequest(StudentsListToInsert, 'Street: 123 ', 'Murrieta', 'United States', 'California', 'Other St', '97232',
                                                    '2234567891', '', '', '123 Murrieta California United States 97232', true, false,
                                                    'Lilly', 'Murdock', '2931124110', 'Friend', 'Murdock', 'Moore', '2931124110');
            
            test.stopTest(); 
        }
    }
}