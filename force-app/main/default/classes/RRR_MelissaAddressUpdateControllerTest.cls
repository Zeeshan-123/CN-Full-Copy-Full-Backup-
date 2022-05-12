/*--------------------------------------------------------------------------------------------------------------
@Author: Shams
@Date: 4/22/2021
@Purpose: This is a test class for RRR_MelissaAddressUpdateController
---------------------------------------------------------------------------------------------------------------*/
@istest
public without sharing class RRR_MelissaAddressUpdateControllerTest{
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
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        Case case3 = new Case();
         case3.RecordTypeId 		=		caseRRRRecordTypeId;
         case3.Status				=		'New';
         case3.Origin				=		'Portal';
         case3.Priority				=		'Medium';
         case3.Request_Reason__c	=		'RRR';
        case3.ContactId				=		acc.PersonContactId;
        case3.AccountId				=		acc.id;
         insert case3;
        RRR_MelissaAddressUpdateController.getMelissaAddresses('1234','US');
        RRR_MelissaAddressUpdateController.getStates();
        RRR_MelissaAddressUpdateController.getPicklistValues('Case','Physical_Countries__c','Physical_States__c',case3.id);
        RRR_MelissaAddressUpdateController.saveRequest('street', 'City', 'United States', 'Oklahoma', '', '', '', '', '', true, true, case3.id);
        RRR_MelissaAddressUpdateController.decimalToBinary(11);
        RRR_MelissaAddressUpdateController.alphaBaseToBits('test');
        
    }
}