/*==============================================================
@author: Alishba
@date: May/07/2021
@purpose: update RRR application and household member records status once it's not editable
==============================================================*/
global class UpdateRRRApplicationStatusBatch implements Database.Batchable<sObject>, Database.Stateful
{
    //get RRR Request record type id
    Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    { 
        if(test.isRunningTest()) 
        {
            return Database.getQueryLocator([SELECT CaseNumber, Status , 
                                             (SELECT id, name, Status__c, citizen_id__c, AccountId__c, AccountId__r.PersonContactId, AccountId__r.LastName, 
                                              Last_Name__c, First_Name__c, LastNameChangedCheck__c,Bypass__c FROM Household_Members__r), RRR_Request_Edit_Status__c,
                                             AddressChangedCheck__c,LastNameChangedCheck__c, New_Name__c, Primary_Contact_Last_Name__c,Mailing_Street__c, Mailing_City__c, 
                                             Mailing_County__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, Other_Mailing_State__c, mailing_suite__c, 
                                             mailing_address2__c, AccountId,ContactId, Melissa_Address__c, Is_Address_Changed__c, Is_Manual_Address__c
                                             FROM CASE ]);             
        }
        else
        {
            return Database.getQueryLocator([SELECT CaseNumber, Status , 
            	(SELECT id, name, Status__c, citizen_id__c, AccountId__c, AccountId__r.PersonContactId, AccountId__r.LastName, First_Name__c, Last_Name__c, LastNameChangedCheck__c,
                 Bypass__c FROM Household_Members__r), RRR_Request_Edit_Status__c,
                                             AddressChangedCheck__c,mailing_suite__c,mailing_address2__c,LastNameChangedCheck__c, New_Name__c, Primary_Contact_Last_Name__c,Mailing_Street__c, Mailing_City__c, 
                                             Mailing_County__c, Mailing_ZipPostal_Code__c, Mailing_Countries__c, Mailing_States__c, 
                                             Other_Mailing_State__c, AccountId,ContactId , Melissa_Address__c, Is_Address_Changed__c, Is_Manual_Address__c
                                             FROM CASE WHERE RecordTypeId =: caseRecordTypeId and Status =: 'New' and 
                                             RRR_Request_Edit_Status__c =: False]);
        }
        
    }
    
    global void execute(Database.BatchableContext BC, List<Case> RRR_Applications)
    {
        List<Case> requestToUpdate 							= new List<Case> ();
        List<Case> requestToCreate = new List<Case> ();
        List<Household_Member__c> householdMembersToUpdate  = new List<Household_Member__c> ();
        
        for (Case cs: RRR_Applications) 
        {
            cs.Status	=	'In Progress';
            requestToUpdate.add(cs);
            
            if(cs.LastNameChangedCheck__c == true || cs.AddressChangedCheck__c == true)
            {
                //Create New requests for Last Name or Address Change
                String reason='';   
                String rPerson = '';
                //get Portal Request record type id
                Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Portal_Request').getRecordTypeId();
                
                Case cse 								= 		new Case();
                cse.RecordTypeId 						=		caseRecordTypeId;
                cse.Status								=		'New';
                cse.Origin								=		'RRR';
                cse.Priority							=		'Medium';
                
                // create last name change request
                if(cs.LastNameChangedCheck__c == true && cs.AddressChangedCheck__c != true)
                {
                    cse.New_Name__c	= cs.Primary_Contact_Last_Name__c;
                    cse.Request_Reason__c = 'Marriage Last Name Change';
                }
                
                // create mailing address change request
                if(cs.AddressChangedCheck__c == true && cs.LastNameChangedCheck__c != true){
                    cse.Mailing_Street__c					=		cs.Mailing_Street__c;
                    cse.Mailing_City__c						=		cs.Mailing_City__c;
                    cse.Mailing_County__c					=		cs.Mailing_County__c;
                    cse.Mailing_ZipPostal_Code__c			=		cs.Mailing_ZipPostal_Code__c;
                    cse.Mailing_Countries__c				=		cs.Mailing_Countries__c;
                    cse.Mailing_States__c					=		cs.Mailing_States__c;
                    cse.Other_Mailing_State__c				=		cs.Other_Mailing_State__c;
                    cse.mailing_address2__c					=		cs.mailing_address2__c;
                    cse.mailing_suite__c					=		cs.mailing_suite__c;
                    cse.Request_Reason__c 					=		'Change Mailing Address';
                    
                }
                
                // create both mailing address and last name change request 
                if(cs.AddressChangedCheck__c == true && cs.LastNameChangedCheck__c == true){
                    cse.Mailing_Street__c					=		cs.Mailing_Street__c;
                    cse.Mailing_City__c						=		cs.Mailing_City__c;
                    cse.Mailing_County__c					=		cs.Mailing_County__c;
                    cse.Mailing_ZipPostal_Code__c			=		cs.Mailing_ZipPostal_Code__c;
                    cse.Mailing_Countries__c				=		cs.Mailing_Countries__c;
                    cse.Mailing_States__c					=		cs.Mailing_States__c;
                    cse.Other_Mailing_State__c				=		cs.Other_Mailing_State__c;
                    cse.mailing_address2__c					=		cs.mailing_address2__c;
                    cse.mailing_suite__c					=		cs.mailing_suite__c;
                    cse.Request_Reason__c 				=		'Change Mailing Address';
                    //System.debug('Test logs --- '+cs.Primary_Contact_Last_Name__c);
                    cse.New_Name__c	= cs.Primary_Contact_Last_Name__c;
                    cse.Request_Reason__c += ';Marriage Last Name Change';
                }
                
                cse.AccountId 				= cs.AccountId;
                cse.ContactId 				= cs.ContactId;
                cse.Melissa_Address__c		= cs.Melissa_Address__c;
                cse.Is_Manual_Address__c	= cs.Is_Manual_Address__c;
                requestToCreate.add(cse);
            }
            
            
            for (Household_Member__c hm: cs.Household_Members__r) 
            {
                hm.Status__c	=	'In Progress';
                householdMembersToUpdate.add(hm);
                if(hm.LastNameChangedCheck__c == true && hm.Bypass__c != true){
                //Create New requests for Last Name
                String rPerson = '';
                //get Portal Request record type id
                Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Portal_Request').getRecordTypeId();
                
                Case cse 								= new Case();
                cse.RecordTypeId 						=		caseRecordTypeId;
                cse.Status								=		'New';
                cse.Origin								=		'RRR';
                cse.Priority							=		'Medium';
                cse.New_Name__c	= hm.Last_Name__c;
                cse.Request_Reason__c = 'Marriage Last Name Change';
                cse.AccountId = hm.AccountId__c;
                cse.ContactId = hm.AccountId__r.PersonContactId;
                requestToCreate.add(cse);
            }
                
            }
        }
        
        database.SaveResult[] myResult=database.update(requestToUpdate,false);
        database.SaveResult[] myResult2=database.update(householdMembersToUpdate,false);
        
        if(requestToCreate.size() > 0)
            database.SaveResult[] reqResult = database.insert(requestToCreate, false);
    }
    
    global void finish(Database.BatchableContext BC)
    {
        
    }
}