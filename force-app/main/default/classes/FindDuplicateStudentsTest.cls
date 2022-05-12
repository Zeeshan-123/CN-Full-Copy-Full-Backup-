/**********************************
@author: Shams
@date: 4/12/2020
@purpose: test class for FindDuplicateStudents
***********************************/
@istest
public class FindDuplicateStudentsTest {
    @istest(seealldata=false)
    public static void TestRun(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.FirstName='First';
        TA1.Date_of_Birth__c=system.today()-1000;
        TA1.School__c='Tahlequah Public Schools';
        Update TA1;
        
        //get EBT Request record type id
        Id caseEBTRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
        Case case1 = new Case();
        case1.RecordTypeId 		=		caseEBTRecordTypeId;
        case1.Status				=		'New';
        case1.Origin				=		'Portal';
        case1.Priority				=		'Medium';
        case1.Request_Reason__c	=		'Summer EBT';
        insert case1;
        
        AccountCaseJunction__c ACJ=new AccountCaseJunction__c();
        ACJ.Account__c=TA1.id;
        ACJ.name=TA1.FirstName+' '+Ta1.LastName;
        ACJ.Request__c=case1.id;       
        insert ACJ;
        ACJ=new AccountCaseJunction__c();
        ACJ.Account__c=TA1.id;
        ACJ.name=TA1.FirstName+' '+Ta1.LastName;
        ACJ.Request__c=case1.id;       
        insert ACJ;
        
        Test.startTest();
        Database.executeBatch(new FindDuplicateStudents());
        Test.stopTest();
    }
}