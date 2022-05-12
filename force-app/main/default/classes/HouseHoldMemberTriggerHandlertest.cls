/*--------------------------------------------------------------------------
@author: Shams
@date: 4/19/2021
@purpose: test class for HouseHoldMemberTriggerHandler
---------------------------------------------------------------------------*/
@istest
public class HouseHoldMemberTriggerHandlertest 
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
        ta2.Date_of_Birth__c=system.today();
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
        Household_Member__c HM=new Household_Member__c();
        HM.Citizen_Id__c='321';
        HM.Request__c=case3.id;
        HM.Last_Name__c='LN-1';
        HM.Date_of_Birth__c=system.today()-5;
        try{
            insert HM;
        }catch(Exception e){
            try{
                HM.Citizen_Id__c='123';
                HM.Date_of_Birth__c=system.today();
                insert HM;
            }
            catch(Exception ee){
                
                HM.Citizen_Id__c='321';
                HM.Date_of_Birth__c=system.today();
                insert HM;
                update HM;
                delete HM;
                
                Household_Member__c newHM=[select id,Last_Name__c,AccountId__c,AccountId__r.HealthCloudGA__Gender__pc from Household_Member__c where bypass__c=true];
                newHM.Last_Name__c=newHM.Last_Name__c+'LN-2';
                database.update( newHM,false);
            }
        }
        
    }
}