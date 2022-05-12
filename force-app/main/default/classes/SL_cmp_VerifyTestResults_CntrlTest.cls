/**
 * @fileName        : SL_cmp_VerifyTestResults_CntrlTest
 * @description     : Test class for SL_cmp_VerifyTestResults_Cntrl
 * @author          : Vikash Agarwal
 * @createdOn       : 
 * @lastModifiedBy  : Vikash Agarwal
 * @lastModifiedOn  : 
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   01-07-2022      Initial Version
**/
@IsTest
public class SL_cmp_VerifyTestResults_CntrlTest {

    private static Id ermAccRecordTypeId =  Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();

    @TestSetup
    static void createTestData() {
        List<Account> lstErmPatients = new List<Account>();
        for(Integer i=1; i<=10; i++) {
            lstErmPatients.add(new Account(RecordTypeId = ermAccRecordTypeId,
                                           FirstName = 'Test',
                                           LastName = 'ERM_Flu_Pos_Acc_'+i,
                                           MRN__c = 'ERM_Flu_Pos_Acc_'+i,
                                           Date_of_Birth__c = Date.newInstance(1990, 10, 10),
                                           Process_EHR_Records__c = true,
                                           Test_Date_Generic__c = Date.today().addDays(-14),
                                           Test_Type_Generic__c = 'Flu',
                                           Test_Result_Generic__c = 'Positive',
                                           Test_Site_Type_Generic__c = 'Cherokee Nation Health Services',
                                           Test_Site_Generic__c = 'CNHS: AMO Health Center/Salina',
                                           Other_Test_Site_Generic__c = 'Test other',
                                           When_do_you_think_you_were_exposed__c = Date.today().addDays(-20),
                                           PersonMobilePhone = '1914363792'));
        }
        insert lstErmPatients;
        Test.setMock(HttpCalloutMock.class, new BitlyMockHttpResponseGenerator());
        Database.executeBatch(new SLProcessEHRObs(), 200);
    }

    @IsTest
    static void test_updateAttemptCount() {
        Test.startTest();
        // Get Patient Accounts and related EHR Observation records
        List<Account> lstPatients = [SELECT Id, Name, Date_of_Birth__c,
                                     (SELECT Id, HealthCloudGA__NameLabel__c, Testing_Status__c, HealthCloudGA__AppliesDateTime__c FROM EHR_Observations__r)
                                     FROM Account 
                                     WHERE LastName LIKE '%ERM_Flu_Pos_Acc_%'];
        SL_cmp_VerifyTestResults_Cntrl.updateAttemptCount(
            EncodingUtil.base64Encode(Blob.valueOf(lstPatients[0].Id)), 
            'nCovid', 
            EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id))
        );
        try {
            SL_cmp_VerifyTestResults_Cntrl.updateAttemptCount(
                EncodingUtil.base64Encode(Blob.valueOf(lstPatients[0].Id)) + 'ABC', 
                'nCovid', 
                EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id))
            );
        } catch(Exception ex) {
            System.debug('Handled Exception');
        }
        Test.stopTest();
    }
    
    @IsTest
    static void test_getUserInfo() {
        Test.startTest();
        // Get Patient Accounts and related EHR Observation records
        List<Account> lstPatients = [SELECT Id, Name, Date_of_Birth__c,
                                     (SELECT Id, HealthCloudGA__NameLabel__c, Testing_Status__c, HealthCloudGA__AppliesDateTime__c FROM EHR_Observations__r)
                                     FROM Account 
                                     WHERE LastName LIKE '%ERM_Flu_Pos_Acc_%'];
        SL_cmp_VerifyTestResults_Cntrl.getUserInfo(
            lstPatients[0].Id, 
            EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id)),
            lstPatients[0].Date_of_Birth__c
        );
        try {
            SL_cmp_VerifyTestResults_Cntrl.getUserInfo(
                lstPatients[0].Id + 'ABC', 
                EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id)),
                lstPatients[0].Date_of_Birth__c
            );
        } catch(Exception ex) {
            System.debug('Handled Exception');
        }
        Test.stopTest();
    }
    
    @IsTest
    static void test_getPatientDetailForHeader() {
        Test.startTest();
        // Get Patient Accounts and related EHR Observation records
        List<Account> lstPatients = [SELECT Id, Name, Date_of_Birth__c,
                                     (SELECT Id, HealthCloudGA__NameLabel__c, Testing_Status__c, HealthCloudGA__AppliesDateTime__c FROM EHR_Observations__r)
                                     FROM Account 
                                     WHERE LastName LIKE '%ERM_Flu_Pos_Acc_%'];
        SL_cmp_VerifyTestResults_Cntrl.getPatientDetailForHeader(
            EncodingUtil.base64Encode(Blob.valueOf(lstPatients[0].Id)), 
            EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id))
        );
        try {
            SL_cmp_VerifyTestResults_Cntrl.getPatientDetailForHeader(
            EncodingUtil.base64Encode(Blob.valueOf(lstPatients[0].Id)) + 'ABC', 
            EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id)) + 'ABC'
        );
        } catch(Exception ex) {
            System.debug('Handled Exception');
        }
        Test.stopTest();
    }
    
    @IsTest
    static void test_getDuplicatePatients() {
        Test.startTest();
        // Get Patient Accounts and related EHR Observation records
        List<Account> lstPatients = [SELECT Id, Name, Date_of_Birth__c,
                                     (SELECT Id, HealthCloudGA__NameLabel__c, Testing_Status__c, HealthCloudGA__AppliesDateTime__c FROM EHR_Observations__r)
                                     FROM Account 
                                     WHERE LastName LIKE '%ERM_Flu_Pos_Acc_%'];
        SL_cmp_VerifyTestResults_Cntrl.getDuplicatePatients(
            lstPatients[0].Id,
            EncodingUtil.base64Encode(Blob.valueOf((lstPatients[0].EHR_Observations__r)[0].Id)),
            lstPatients[0].Date_of_Birth__c,
            'nCovid'
        );
        Test.stopTest();
    }
}