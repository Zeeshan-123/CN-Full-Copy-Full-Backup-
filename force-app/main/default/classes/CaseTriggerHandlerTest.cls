/*--------------------------------------------------------------------------
@author: Alishba
@date: March/16/2021
@purpose: test class for CaseTriggerHandler
---------------------------------------------------------------------------*/
@istest
public class CaseTriggerHandlerTest 
{
    
    @istest
    public static void runTest()
    {
        //get Portal Request record type id
        Id caseRegRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Portal_Request').getRecordTypeId();
        //get EBT Request record type id
        Id caseEBTRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('EBT_Request').getRecordTypeId();
        //get RRR Request record type id
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        //get CA Request record type id
        Id caseCARecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        //get CA2 Request record type id
        Id caseCA2RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId();
        
        id housingStipendRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Housing_Stipend').getRecordTypeId();
        
        Case caseT1 = new Case();
        caseT1.RecordTypeId 						=		caseEBTRecordTypeId;
        caseT1.Status								=		'New';
        caseT1.Origin								=		'Portal';
        caseT1.Priority							=		'Medium';
        caseT1.Numeric_EBT_Confirmation_Number__c	=		00000001;
        insert caseT1;
        
        Case caseT2 = new Case();
        caseT2.RecordTypeId 						=		caseRegRecordTypeId;
        caseT2.Status								=		'New';
        caseT2.Origin								=		'Portal';
        caseT2.Priority							=		'Medium';
        caseT2.Numeric_Reg_Confirmation_Number__c	=		101-00000001;
        insert caseT2;
        
        Case case1 = new Case();
        case1.RecordTypeId 		=		caseEBTRecordTypeId;
        case1.Status				=		'New';
        case1.Origin				=		'Portal';
        case1.Priority				=		'Medium';
        case1.Request_Reason__c	=		'Summer EBT';
        insert case1;
        
        Case case2 = new Case();
        case2.RecordTypeId 		=		caseRegRecordTypeId;
        case2.Status				=		'New';
        case2.Origin				=		'Portal';
        case2.Priority				=		'Medium';
        case2.Request_Reason__c	=		'Other';
        insert case2;
        
        Account acc 		=	 new Account();
        acc.firstName 		=	 'A';
        acc.LastName 		= 	'Kelly';
        acc.RecordTypeId 	= 	Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        acc.Tribe_Id__c		=	'76542';
        acc.If_CN_Citizen__c='Yes';
        
        acc.PersonMailingStreet = '333 street a';
        acc.PersonOtherStreet = '333 street a';
        insert acc;
        
        Case case3 = new Case();
        case3.RecordTypeId 		=		caseRRRRecordTypeId;
        case3.Status				=		'New';
        case3.Origin				=		'Portal';
        case3.Priority				=		'Medium';
        case3.Request_Reason__c	=		'RRR';
        case3.Primary_Contact_First_Name__c='Test first name';
        case3.Primary_Contact_Last_Name__c=	'Kelly';
        case3.AccountId				=		acc.id;
        case3.ContactId				=		acc.PersonContactId;
        insert case3;
        update case3;
        
        case3 = new Case();
        case3.RecordTypeId 		=		caseCARecordTypeId;
        case3.Status				=		'New';
        case3.Origin				=		'Portal';
        case3.Priority				=		'Medium';
        //case3.Request_Reason__c	=		'CA';
        case3.Primary_Contact_First_Name__c='Test first name';
        case3.Primary_Contact_Last_Name__c=	'Kelly';
        case3.AccountId				=		acc.id;
        case3.ContactId				=		acc.PersonContactId;
        insert case3;
        
        //For CA2
         case3 = new Case();
        case3.RecordTypeId 		=		caseCA2RecordTypeId;
        case3.Status				=		'New';
        case3.Origin				=		'Portal';
        case3.Priority				=		'Medium';
        //case3.Request_Reason__c	=		'CA';
        case3.Primary_Contact_First_Name__c='Test first name';
        case3.Primary_Contact_Last_Name__c=	'Kelly';
        case3.AccountId				=		acc.id;
        case3.ContactId				=		acc.PersonContactId;
        insert case3;
        
        Date dDate = Date.newInstance(2012, 12, 14);
        Account a = Community_TestDataFactory.createAccount('Riddle', 'Test', 'riddle@test.com', '63422', dDate);
        
        // hunt request
        Case case4 = new Case();
        case4.RecordTypeId 			=	  Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
        case4.Status				=		'New';
        case4.Origin				=		'Phone';
        case4.Priority				=		'Medium';
        case4.Request_Reason__c		=		'HA';
        case4.AccountId				=		a.Id;
        case4.ContactId				=		a.PersonContactId;
        case4.Hunt_Category__c		=		'Fish and Wildlife Controlled Hunt Youth App';
        case4.Hunt_Events__c		= 		'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)';
        insert case4;
        
        a.Date_of_Birth__c = Date.newInstance(2002, 12, 14);
        update a;
        case4.Hunt_Category__c		=		'Fish and Wildlife Controlled Hunt Veteran App';
        case4.Hunt_Events__c		= 		'Cherokee Veteran, (Gun) November 27-28 (5 Either Sex)';
        update case4;
        
        a.Date_of_Birth__c = Date.newInstance(1957, 12, 14);
        update a;
        case4.Hunt_Category__c		=		'Fish and Wildlife Controlled Hunt Elder App';
        case4.Hunt_Events__c		= 		'Cherokee Elder, (Muzzleloader) October 30-31 (5 Either Sex)';
        update case4;
        
         //For Housing Stipend
         case3 = new Case();
        case3.RecordTypeId 		=		housingStipendRecordTypeId;
        case3.Status				=		'New';
        case3.Origin				=		'Portal';
        case3.Priority				=		'Medium';
        //case3.Request_Reason__c	=		'CA';
        case3.Primary_Contact_First_Name__c='Test first name';
        case3.Primary_Contact_Last_Name__c=	'Kelly';
        case3.AccountId				=		acc.id;
        case3.ContactId				=		acc.PersonContactId;
        insert case3;
    }
}