/*--------------------------------------------------------------------------
@author: Alishba
@date: Oct/11/2021
@purpose: test class for Community_UpdateUserInfoCntrl
---------------------------------------------------------------------------*/
@istest
private class Community_UpdateUserInfoCntrlTest {
    @testSetup static void setup() {
        Date dDate = Date.newInstance(2002, 12, 14);
        Date dDate2 = Date.newInstance(2016, 12, 14);
        
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
        acc.PersonMailingStreet = '1234 11th Ave';
        acc.PersonMailingCity = 'California';
        acc.PersonMailingCountry =  'United States';
        acc.PersonMailingPostalCode = '4231';
        acc.PersonMailingState =  'California';
        acc.PersonMobilePhone =  '9832351';
        update acc; 
        
        User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User userForTesting = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];      
    }
    
    static Account getAccount()
    {
        return [SELECT Id, FirstName, LastName, Date_of_Birth__c, PersonOtherPhone, Phone, PersonMobilePhone,
                Tribe_Id__c, HealthCloudGA__Gender__pc, Marital_Status__c, Driver_License__c, Mailing_Add_Melissa_Verified__c, Physical_Add_Melissa_Verified__c,
                PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Mailing_Suite__c, Other_Mailing_State__c,
                PersonOtherCountry,  PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherPostalCode, Other_Physical_State__c, Physical_Suite__c
                FROM Account WHERE firstName='Barin'  LIMIT 1];
    }

    @istest
     static void runTest1() {
        User user = [SELECT Id FROM User WHERE Email='barin@g.com' LIMIT 1];
        Account acct = getAccount();
        
        system.runAs(user) {
            test.startTest();
            Community_UpdateUserInfoCntrl.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            Community_UpdateUserInfoCntrl.UpdateAccnt(acct, 'barin@g.com');
            Community_UpdateUserInfoCntrl.UpdateAccnt(acct, 'David@test.com');
            test.stopTest();
        }
    }
    
     @istest
    private static void runTest2() {
        User user = [SELECT Id FROM User WHERE Email='barin@g.com' LIMIT 1];
        Account acct = getAccount();
        acct.HealthCloudGA__Gender__pc = 'Female';
        update acct;
        
        system.runAs(user) {
            test.startTest();
            Community_UpdateUserInfoCntrl.getMelissaAddresses('1234 11th Ave, Phenix City, AL', 'United States');
            Community_UpdateUserInfoCntrl.UpdateAccnt(acct, 'barin@g.com');
            test.stopTest();
        }
    }
    
}