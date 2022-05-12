/**
 * @fileName        : SLProcessEHRObsTest
 * @description     : Test class for SLProcessEHRObs & SL_PopulateResultLinkOnEhrObs
 * @author          : Vikash Agarwal
 * @createdOn       : 
 * @lastModifiedBy  : Vikash Agarwal
 * @lastModifiedOn  : 
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0         Initial Version
**/
@IsTest
public class SLProcessEHRObsTest {
    
    public static Id ermPatientRtId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();

    @TestSetup
    static void createTestData() {
        List<Account> lstErmPatients = new List<Account>();
        for(Integer i=1; i<=100; i++) {
            lstErmPatients.add(new Account(
                MRN__c 						= 'TEST000'+i,
                LastName 					= 'Patient_'+i,
                Firstname 					= 'Test',
                RecordTypeId 				= ermPatientRtId,
                Date_of_Birth__c 			= Date.newInstance(1990, 10, 10),
                PersonMobilePhone 			= '11234567890',
                Process_EHR_Records__c 		= true,
                Test_Type_Generic__c 		= 'Covid',
                Test_Result_Generic__c 		= 'Negative',
                Test_Date_Generic__c 		= Date.today().addDays(-10),
                Test_Site_Type_Generic__c 	= 'Cherokee Nation Health Services',
                Test_Site_Generic__c 		= 'CNHS: AMO Health Center/Salina',
                Other_Test_Site_Generic__c 	= 'Test other',
                When_do_you_think_you_were_exposed__c = Date.today().addDays(-9)
            ));
        }
        insert lstErmPatients;
    }
    
    @IsTest
    static void validate_SLProcessEHRObs() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new BitlyMockHttpResponseGenerator());
        Database.executeBatch(new SLProcessEHRObs(), 200);
        Test.stopTest();
    }
}