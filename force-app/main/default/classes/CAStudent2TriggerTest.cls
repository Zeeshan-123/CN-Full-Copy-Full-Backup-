/*--------------------------------------------------------------------------
@author: Zeeshan
@date: 12/01/2021
@purpose: test class for CAStudent2Trigger
---------------------------------------------------------------------------*/
@istest
public class CAStudent2TriggerTest 
{
    
    @istest
    public static void runTest()
    {
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        ta1.Tribe_Id__c='123';
        ta1.FirstName='FN';
        ta1.HealthCloudGA__Gender__pc='Female';
        ta1.Date_of_Birth__c=system.today();
        ta1.If_CN_Citizen__c='Yes';
        Update TA1;
        Account TA2=TestDataFactory.createTestPersonAccountRecords('TestAccount2',recordTypeId);
        ta2.Tribe_Id__c='321';
        ta2.FirstName='FN';
        ta2.HealthCloudGA__Gender__pc='Female';
        ta2.Date_of_Birth__c=system.today().addDays(-2000);
        ta2.If_CN_Citizen__c='Yes';
        Update TA2;
        //get RRR Request record type id
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        
        
        Case case3 = new Case();
        case3.RecordTypeId 			=		caseRRRRecordTypeId;
        case3.Status				=		'New';
        case3.Origin				=		'Portal';
        case3.Primary_Contact_First_Name__c='Test first name';
        case3.Primary_Contact_Last_Name__c=	'TestAccount1';
        case3.Priority				=		'Medium';
        case3.Request_Reason__c		=		'RRR';
        case3.AccountId=ta1.id;
        case3.ContactId=ta1.PersonContactId;
        insert case3;
        update case3;
        CA_Student2__c HM=new CA_Student2__c();
        HM.Citizen_Id__c='321';
        HM.Request__c=case3.id;
        HM.Last_Name__c='LN-1';
        HM.Date_of_Birth__c=system.today()-5;
        System.debug('Before Exception');
        try{
            insert HM;
        }catch(Exception e){
            try{
                HM.Citizen_Id__c='123';
                HM.Date_of_Birth__c=system.today();
                insert HM;
            }
            catch(Exception ee){
                
                System.debug('In Exception');
                HM.Citizen_Id__c='321';
                HM.Date_of_Birth__c=system.today().addDays(-2000);
                insert HM;
                System.debug('In Exception After Insert');
                update HM;
                delete HM;
                
            }
        }
        
        System.debug('After Exception');
        
        //get CA Request record type id
        Id caseCARecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId();
        
        //get CA2 CAStudent2 record type id
        Id caStuCA2RecordTypeId = Schema.SObjectType.CA_Student2__c.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId();
        
        
        Case case4 = new Case();
        case4.RecordTypeId 			=		caseCARecordTypeId;
        case4.Status				=		'New';
        case4.Origin				=		'Portal';
        case4.Primary_Contact_First_Name__c='Test first name';
        case4.Primary_Contact_Last_Name__c=	'TestAccount1';
        case4.Priority				=		'Medium';
        case4.Request_Reason__c		=		'Student Coat Assistance';
        case4.AccountId=ta2.id;
        case4.ContactId=ta2.PersonContactId;
        case4.PG_First_Name__c = 'test';
        case4.PG_Last_Name__c = 'testing';
        case4.PG_Mobile_Phone__c = '4321231231';
        System.debug('Before Case Inserted');
        insert case4;
        System.debug('Case Inserted');
        CA_Student2__c HM1=new CA_Student2__c();
        HM1.Citizen_Id__c='321';
        HM1.Request__c=case4.id;
        HM1.RecordTypeId = caStuCA2RecordTypeId;
        HM1.Last_Name__c='LN-1';
        HM1.Date_of_Birth__c=system.today().addDays(-2000);
        HM1.Duplicate__c = true;
        System.debug('Before HM1');
        insert HM1;
        
        
        HM1.Withdraw__c = true;
        update HM1;
        
    }
}