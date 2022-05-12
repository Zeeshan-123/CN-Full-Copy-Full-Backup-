/**********************************
@author: Shams
@date: 11/25/2020
@purpose: Test Class for SurveyResponseflagCleanupBatch
***********************************/

@isTest
public class SurveyResponseflagCleanupBatchTest {
	@isTest
    public static void AInsert(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        database.executeBatch(new SurveyResponseflagCleanupBatch());
    }
	
}