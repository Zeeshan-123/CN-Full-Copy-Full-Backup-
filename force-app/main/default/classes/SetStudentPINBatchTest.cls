/**********************************
@author: Shams
@date: 3/30/2020
@purpose: test class for SetStudentPINBatch
***********************************/
@istest
public class SetStudentPINBatchTest {
	@istest(seealldata=false)
    public static void SurveyBatch(){
        Daily_Followup_Task__mdt DFT=[SELECT AdminID__c,Negative_Test_Symptoms__c,InactiveError__c,DailyFollowUpTaskSubject__c,AdditionalDays__c,daystoFollowup__c,Exposed__c,Negative_Test__c,Positive_Test_No_Symptoms__c,Positive_Test_Symptoms__c,Positive_Test__c FROM Daily_Followup_Task__mdt LIMIT 1];
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.FirstName='First';
        TA1.Date_of_Birth__c=system.today()-1000;
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
        
        SEBTC_School_Data__c SD=new SEBTC_School_Data__c();
        SD.Name='test';
        SD.First_Name__c='First';
        SD.Last_Name__c='TestAccount1';
        SD.Date_of_Birth__c=system.today()-1000;
        insert SD;
        AccountCaseJunction__c ACJ=new AccountCaseJunction__c();
        ACJ.Account__c=TA1.id;
        ACJ.name=TA1.FirstName+' '+Ta1.LastName;
        ACJ.Request__c=case1.id;
        insert ACJ;
        
        Test.startTest();
        Database.executeBatch(new SetStudentPINBatch());
        Test.stopTest();
	}

  //CNHPHOMS-69: SL Jonathan Munguia: testing old DOB behavior.
  @istest(seealldata=false)
    public static void testOldDOBAndPin(){
      //get EBT Request record type id
      Id caseEBTRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
      Case case1 = new Case();
      case1.RecordTypeId       =   caseEBTRecordTypeId;
      case1.Status				      =		'New';
      case1.Origin				      =   'Portal';
      case1.Priority				    =		'Medium';
      case1.Request_Reason__c	=		'Summer EBT';
      insert case1;

      Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('Student').getRecordTypeId();
      Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
      TA1.FirstName         = 'First';
      TA1.Date_of_Birth__c  = Date.newInstance(2015, 2, 17);
      Update TA1;
      
      SEBTC_School_Data__c SD=new SEBTC_School_Data__c();
      SD.Name='test';
      SD.First_Name__c='First';
      SD.Last_Name__c='TestAccount1';
      SD.Date_of_Birth__c=Date.newInstance(2015, 2, 17);
      insert SD;

      AccountCaseJunction__c ACJ=new AccountCaseJunction__c();
      ACJ.Account__c=TA1.id;
      ACJ.name=TA1.FirstName+' '+Ta1.LastName;
      ACJ.Request__c=case1.id;
      insert ACJ;

      List<Account> lstAcc =  new List<Account>();
      for(Integer i = 0;  i <  100;  i++){
        Account acc = new Account();
        acc.LastName                              = 'Test SL '+i;
        acc.Case_Status__c                        = 'Active';
        acc.RecordTypeId                          = recordTypeId;
        acc.HealthCloudGA__Testing_Status__pc     = 'Exposed - Symptomatic';
        acc.When_do_you_think_you_were_exposed__c = system.today();
        acc.FirstName                             = 'First';
        acc.Date_of_Birth__c                      = system.today()-1000;
        lstAcc.add(acc);
      }
      
      INSERT lstAcc;

      List<SEBTC_School_Data__c> lstSEBT  = new List<SEBTC_School_Data__c>();
      for(Integer i = 0;  i <  100;  i++){
        SEBTC_School_Data__c SED  = new SEBTC_School_Data__c();
        SED.Name='test SL '+i;
        SED.First_Name__c='First SL' + i;
        SED.Last_Name__c='TestAccount SL' + i;
        SED.Date_of_Birth__c=system.today()-1000;
        lstSEBT.add(SED);
      }

      INSERT lstSEBT;

      List<AccountCaseJunction__c> lstStudent  = new List<AccountCaseJunction__c>();
      for(Integer i = 0;  i <  100;  i++){
        AccountCaseJunction__c ACJrec = new AccountCaseJunction__c();
        ACJrec.Account__c  = lstAcc[i].id;
        ACJrec.name  = lstAcc[i].FirstName+' '+lstAcc[i].LastName;
        ACJrec.Request__c  = case1.id;
        lstStudent.add(ACJrec);
      }

      INSERT lstStudent;


      Test.startTest();
      Database.executeBatch(new SetStudentPINBatch());
      Test.stopTest();

      List<Case> assertRecord = [SELECT Id, Oldest_Child_DOB__c, PIN_Child__c FROM Case WHERE Id = :case1.Id];
      system.assertEquals(Date.newInstance(2015, 2, 17), assertRecord[0].Oldest_Child_DOB__c, 'Expected oldest date must be from the first record created 02/17/2015');
      system.assertEquals(ACJ.Name, assertRecord[0].PIN_Child__c, 'Expected Pin Child must be the first Student.');
	}
}