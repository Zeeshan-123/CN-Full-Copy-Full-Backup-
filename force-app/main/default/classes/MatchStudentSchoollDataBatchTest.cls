/**********************************
    @author: Shams
    @date: 3/25/2020
    @purpose: test class for MatchStudentSchoollDataBatch
***********************************/
@istest
public class MatchStudentSchoollDataBatchTest {
    
    @istest(seealldata=false)
    public static void SurveyBatch() {
        Daily_Followup_Task__mdt DFT = [SELECT AdminID__c, Negative_Test_Symptoms__c, InactiveError__c,
                                        DailyFollowUpTaskSubject__c, AdditionalDays__c, daystoFollowup__c, Exposed__c,
                                        Negative_Test__c, Positive_Test_No_Symptoms__c, Positive_Test_Symptoms__c,
                                        Positive_Test__c 
                                        FROM Daily_Followup_Task__mdt 
                                        LIMIT 1];
        
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
        Account TA1 = TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        
        TA1.FirstName='First';
        TA1.Date_of_Birth__c=system.today()-1000;
        Update TA1;
        
        SEBTC_School_Data__c SD=new SEBTC_School_Data__c();
        SD.Name='test';
        SD.First_Name__c='First';
        SD.Last_Name__c='TestAccount1';
        SD.Date_of_Birth__c=system.today()-1000;
        insert SD;
        
        // Create WIC Request
        Case objCase = new Case();
        objCase.WICS_Form_Submission_Year__c = '2022';
        objCase.Subject = 'Test Case';
        insert objCase;
        
        AccountCaseJunction__c ACJ=new AccountCaseJunction__c();
        ACJ.Account__c=TA1.id;
        ACJ.name=TA1.FirstName+' '+Ta1.LastName;
        ACJ.Request__c = objCase.Id;
        insert ACJ;
        
        Account TA2=TestDataFactory.createTestPersonAccountRecords('TestAccount2',recordTypeId);
        TA2.FirstName='Second';
        TA2.Date_of_Birth__c=system.today()-1000;
        Update TA2;
        
        SD=new SEBTC_School_Data__c();
        SD.Name='test';
        SD.Last_Name__c='TestAccount2';
        SD.Date_of_Birth__c=system.today()-1000;
        insert SD;
        
        ACJ=new AccountCaseJunction__c();
        ACJ.Account__c=TA2.id;
        ACJ.name=Ta2.LastName;
        insert ACJ;
        
        Test.startTest();
        Database.executeBatch(new MatchStudentSchoollDataBatch());
        Test.stopTest();
    }
}