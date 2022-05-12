/*--------------------------------------------------------------------------------------------------------------
@Author: Zeeshan Haider
@Date: 12/2/2021
@Purpose: This is a test class for MelissaPhysicalAddressUpdateController
---------------------------------------------------------------------------------------------------------------*/
@istest
public without sharing class MelissaPhysicalAddressUpdateTest{
    @istest
    public static void test(){
        Account acc 		=	 new Account();
        acc.firstName 		=	 'A.';
        acc.LastName 		= 	'Kelly';
        acc.RecordTypeId 	= 	Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        acc.Tribe_Id__c		=	'76542';
        acc.If_CN_Citizen__c='Yes';
        insert acc;
		//get RRR Request record type id
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId();
        Case case3 = new Case();
         case3.RecordTypeId 		=		caseRRRRecordTypeId;
         case3.Status				=		'New';
         case3.Origin				=		'Portal';
         case3.Priority				=		'Medium';
         //case3.Request_Reason__c	=		'Hunt';
        case3.ContactId				=		acc.PersonContactId;
        case3.AccountId				=		acc.id;
         //Primary Guardian Information
        case3.PG_First_Name__c					=		'TT';
        case3.PG_Last_Name__c					=		'YY';
        case3.PG_Mobile_Phone__c				=		'2356787654';
         insert case3;
        MelissaPhysicalAddressUpdateController.getMelissaAddresses('1234','US');
        MelissaPhysicalAddressUpdateController.getStates();
        MelissaPhysicalAddressUpdateController.getPicklistValues('Case','Physical_Countries__c','Physical_States__c',case3.id);
        MelissaPhysicalAddressUpdateController.savePRequest('street', 'City', 'United States', 'Oklahoma', '', '', '', '', '', true, true, case3.id);
        MelissaPhysicalAddressUpdateController.decimalToBinary(11);
        MelissaPhysicalAddressUpdateController.alphaBaseToBits('test');
        
    }
}