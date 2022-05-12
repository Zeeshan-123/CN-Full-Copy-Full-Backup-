global class SLProcessEHRObs implements Database.Batchable<sObject>, Database.AllowsCallouts  {
    
    // Batch methods
    global Id ermPatientRtId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // Process only when Test_Type_Generic__c, Test_Date_Generic__c, Test_Result_Generic__c are not blank
        Date startDate = Date.newInstance(2022, 3, 1);
        String strQuery = 'SELECT Id, FirstName, LastName, PersonMobilePhone, MRN__c, Test_Type_Generic__c, ' + 
            'Test_Result_Generic__c, Test_Date_Generic__c, Test_Site_Type_Generic__c, Test_Site_Generic__c, Other_Test_Site_Generic__c ' +
            'FROM Account ' + 
            'WHERE RecordTypeId = :ermPatientRtId ' +
            'AND Process_EHR_Records__c = true ' + 
            'AND Test_Type_Generic__c != null ' + 
            'AND Test_Date_Generic__c != null ' + 
            'AND Test_Result_Generic__c != null';
        return Database.getQueryLocator(strQuery);
    }
    
    global void execute(Database.BatchableContext BC, List<Account> lstAccounts) {
        System.debug('===BATCH lstAccounts===>'+ lstAccounts);
        
        Set<String> setDiseasesForSMS = new Set<String>();
        List<CN_Disease__mdt> lstDiseasesMdt = CN_Disease__mdt.getAll().values();
        for(CN_Disease__mdt cnDisease : lstDiseasesMdt) {
            if(cnDisease.Is_Active__c) {
                String strDiseasesKey = (cnDisease.Name_of_Disease__c + '$$##' + cnDisease.Test_Result__c).toLowerCase();
                setDiseasesForSMS.add(strDiseasesKey);
            }
        }
        
        List<HealthCloudGA__EhrObservation__c> lstEHRObservationToInsert = new List<HealthCloudGA__EhrObservation__c>();
        for(Account objAcc : lstAccounts) {
            String strDiseasesKey = (objAcc.Test_Type_Generic__c + '$$##' + objAcc.Test_Result_Generic__c).toLowerCase();
            if(setDiseasesForSMS.contains(strDiseasesKey)) {
                HealthCloudGA__EhrObservation__c objEhr 	= 	new HealthCloudGA__EhrObservation__c();
                objEhr.Account__c 							=	objAcc.Id;
                objEhr.HealthCloudGA__AppliesDateTime__c	=	objAcc.Test_Date_Generic__c;
                objEhr.HealthCloudGA__NameLabel__c          =   objAcc.Test_Type_Generic__c;
                objEhr.Testing_Status__c					=	objAcc.Test_Result_Generic__c;
                objEhr.Test_Site_Type_1st__c                =	objAcc.Test_Site_Type_Generic__c;
                objEhr.Test_Site_1st__c					    =	objAcc.Test_Site_Generic__c;
                objEhr.Other_Test_Site__c					=	objAcc.Other_Test_Site_Generic__c;
                lstEHRObservationToInsert.add(objEhr);
            }
        }
        
        Map<Id, Account> mapAccsToReset = new Map<Id, Account>();
        if(!lstEHRObservationToInsert.isEmpty()) {
            List<Database.SaveResult> insertedEHRObResults = Database.insert(lstEHRObservationToInsert, false);
            for(Integer i=0; i < insertedEHRObResults.size(); i++) {
                // Update the "Process_EHR_Records__c" checkbox to unchecked for processed records
                if(insertedEHRObResults[i].isSuccess()) {
                    mapAccsToReset.put(lstEHRObservationToInsert[i].Account__c,
                                       new Account(Id = lstEHRObservationToInsert[i].Account__c, 
                                                   Process_EHR_Records__c = false, 
                                                   Test_Type_Generic__c = null,
                                                   Test_Date_Generic__c = null, 
                                                   Test_Result_Generic__c = null,
                                                   Test_Site_Type_Generic__c = null,
                                                   Test_Site_Generic__c = null,
                                                   Other_Test_Site_Generic__c = null));
                }
            }
            if(!mapAccsToReset.isEmpty()) update mapAccsToReset.values();
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        Database.executeBatch(new SL_PopulateResultLinkOnEhrObs(), 100);
    }
}