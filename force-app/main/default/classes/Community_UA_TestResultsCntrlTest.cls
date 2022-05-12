@isTest
private class Community_UA_TestResultsCntrlTest {

 @isTest    
    static void testM1(){
        Test.startTest();
        Date dDate = Date.newInstance(2002, 12, 14);
        Date fDate = Date.newInstance(2004, 12, 14);
        Date testDate = Date.newInstance(2021, 08, 23);
        Date exposedDate = Date.newInstance(2022, 01, 24);

        Account accntToInsert = new Account();
        accntToInsert.firstName = 'John';
        accntToInsert.LastName = 'Smith';
        accntToInsert.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();// Cerner Account RecordType id
        accntToInsert.PersonEmail= 'Smith@test.com';
        accntToInsert.Date_of_Birth__c=dDate;
        accntToInsert.Test_Date__c = testDate;
        accntToInsert.When_do_you_think_you_were_exposed__c = exposedDate;
        insert accntToInsert;
        
         HealthCloudGA__Clinical_Assessment_Response__c CA_ToInsert = new   HealthCloudGA__Clinical_Assessment_Response__c( HealthCloudGA__Patient__c = accntToInsert.Id ,HealthCloudGA__SubjectiveFever__c = 'true',
                             HealthCloudGA__Chills__c =  'true' , HealthCloudGA__Cough__c = 'true', HealthCloudGA__ShortnessOfBreath__c = 'true',
                             Fatigue__c = 'true', HealthCloudGA__MuscleAches__c = 'true', HealthCloudGA__Headache__c = 'true',
                             New_Lost_of_Taste_Smell__c = 'true', HealthCloudGA__SoreThroat__c = 'true', HealthCloudGA__RunnyNose__c = 'true',
                             HealthCloudGA__NauseaOrVomiting__c = 'true', HealthCloudGA__Diarrhoea__c = 'true',
                             HealthCloudGA__OtherSymptoms__c = 'true');

        Account accntToUpdate = new Account(Id = accntToInsert.Id , Send_Survey_via_SMS__c = false);
		
        Community_UA_TestResultsCntrl.updateAttemptCount(EncodingUtil.base64Encode(Blob.valueOf(accntToInsert.Id)));
        Community_UA_TestResultsCntrl.getUserInfo(EncodingUtil.base64Encode(Blob.valueOf(accntToInsert.Id)), dDate);
        Community_UA_TestResultsCntrl.getUserInfo(EncodingUtil.base64Encode(Blob.valueOf(accntToInsert.Id)), fDate);
        Community_UA_TestResultsCntrl.getUserInfo(null, fDate);
        Community_UA_TestResultsCntrl.udpdateAccountEmail(accntToInsert.Id, 'John@test.com');
        Community_UA_TestResultsCntrl.TestResult_Wrapper TW = Community_UA_TestResultsCntrl.insertCAssUpdateAccnt(accntToInsert.Id, CA_ToInsert, accntToUpdate);
        HealthCloudGA__Clinical_Assessment_Response__c CA_ToUpdate = [SELECT Id, Previously_diagnosed_with_COVID_19__c, How_long_ago_did_you_have_COVID_19__c,
                                                                      Recieved_COVID19_vaccination__c, COVID19_vaccination_type__c, How_many_doses_recieved__c,
                                                                      Last_COVID_19_Vaccination_Date__c FROM HealthCloudGA__Clinical_Assessment_Response__c WHERE Id =: TW.clincalAssessment.Id limit 1];        
        Community_UA_TestResultsCntrl.updateData(accntToInsert.Id, CA_ToUpdate, true);
        blob pdfBlob = blob.valueOf('Unit.Test');
        Attachment a = new Attachment(parentId = accntToUpdate.PersonContactId, name='Isolation Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        Community_UA_TestResultsCntrl.sendemail('Isolation_Note', a, accntToUpdate);
        Community_UA_TestResultsCntrl.sendIsolationNote(accntToInsert.Id, 'John@test.com');
        
        Test.stopTest();
    }
    
}