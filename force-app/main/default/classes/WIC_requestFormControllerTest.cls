/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 23/02/2021
@Purpose: This class is used as test class for WIC_requestFormController class..
---------------------------------------------------------------------------------------------------------------*/
@isTest
private class WIC_requestFormControllerTest {
    
    @isTest
    static void tstMethod() {
        Date dDate = Date.newInstance(2002, 12, 14);
        
        List<Account> childsAccountListToInsert = new List<Account>();
        Account childAccount1 = new Account(firstName = 'Leo', 		LastName = 'Rogger', PersonEmail = 'leo@test.com', 		Date_of_Birth__c = dDate);
        Account childAccount2 = new Account(firstName = 'Clara', 	LastName = 'Rogger', PersonEmail = 'clara@test.com', 	Date_of_Birth__c = dDate);
        Account childAccount3 = new Account(firstName = 'Murdock', 	LastName = 'Rogger', PersonEmail = 'murdock@test.com', 	Date_of_Birth__c = dDate);
        
        childsAccountListToInsert.add(childAccount1);
        childsAccountListToInsert.add(childAccount2);
        childsAccountListToInsert.add(childAccount3);
        
        List<String> programs = new List<String>();
        programs.add('SNAP');
        
        test.startTest();
        WIC_requestFormController.getPicklistValues('Case', 'Physical_Countries__c', 'Physical_States__c');  
        
        Map<String, Object> mapWicsFormData = new Map<String, Object>();
        mapWicsFormData.put('isCNCitizen', false);
        mapWicsFormData.put('deviceType', 'Desktop');
        mapWicsFormData.put('abtAssociateConsent', true);
        WIC_requestFormController.saveAccounts(childsAccountListToInsert, 'Other', 'Chinees', programs, '1000$', 'Monthly', '3',
                                               'Eva', 'J.' ,'Rogger',  '.Sr', dDate, '',
                                               '123', 'Murrieta', 'United States', 'California', '97232',
                                               '9862 St', 'Temecula', 'United States', 'California', '92592',
                                               'eva@test.com', '192412144', '192412144', '192412144' , 
                                               'George', 
                                               'Rogger', 
                                               '19523525', 
                                               'george@test.com',
                                               mapWicsFormData);
        test.stopTest();
    }
}