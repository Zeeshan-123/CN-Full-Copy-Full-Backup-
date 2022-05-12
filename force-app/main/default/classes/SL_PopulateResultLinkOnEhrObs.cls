global with sharing class SL_PopulateResultLinkOnEhrObs implements Database.Batchable<sObject>, Database.AllowsCallouts{
    
    global Database.QueryLocator start(Database.BatchableContext BC) {
        String strQuery = 
            'SELECT Id, Account__c, HealthCloudGA__NameLabel__c, Testing_Status__c, Test_Result_Link_Generic__c, ' +
            'HealthCloudGA__AppliesDateTime__c, Test_Site_Type_1st__c, Test_Site_1st__c, Other_Test_Site__c ' +
            'FROM HealthCloudGA__EhrObservation__c ' +
            'WHERE Account__c != null ' +
            'AND HealthCloudGA__NameLabel__c != null ' + 
            'AND CreatedDate = TODAY';
        return Database.getQueryLocator(strQuery);
    }

    global void execute(Database.BatchableContext BC, List<HealthCloudGA__EhrObservation__c> lstEhrRecs) {
        Map<String, CN_Disease__mdt> mapDiseasesForSMS = new Map<String, CN_Disease__mdt>();
        List<CN_Disease__mdt> lstDiseasesMdt = CN_Disease__mdt.getAll().values();
        for(CN_Disease__mdt cnDisease : lstDiseasesMdt) {
            if(cnDisease.Is_Active__c) {
                String strDiseasesKey = (cnDisease.Name_of_Disease__c + '$$##' + cnDisease.Test_Result__c).toLowerCase();
                mapDiseasesForSMS.put(strDiseasesKey, cnDisease);
            }
        }
        
        List<Daily_Followup_Task__mdt> getAccessToken = [select Access_Token__c from Daily_Followup_Task__mdt];
        List<HealthCloudGA__EhrObservation__c> lstEhrToUpdate = new List<HealthCloudGA__EhrObservation__c>();

        for(HealthCloudGA__EhrObservation__c objEachEhr : lstEhrRecs) {
            String strDiseasesKey = (objEachEhr.HealthCloudGA__NameLabel__c + '$$##' + objEachEhr.Testing_Status__c).toLowerCase();
            
            // Check for Metadata records combination only
            if(String.isBlank(objEachEhr.Test_Result_Link_Generic__c) && mapDiseasesForSMS.containsKey(strDiseasesKey)) {
                // Call Bitly for Shorten link
                String strResultURL = System.Label.CN_HealthBaseURL + '/s/verify-test-results?';
                strResultURL += 'pId=' + EncodingUtil.base64Encode(Blob.valueOf(objEachEhr.Account__c));
                strResultURL += '&ehrId=' + EncodingUtil.base64Encode(Blob.valueOf(objEachEhr.Id));
                strResultURL += mapDiseasesForSMS.get(strDiseasesKey)?.Result_URL_Parameter__c;

                String strEndpointURL = 'callout:Bitly/v3/shorten' +
                    '?access_token=' + getAccessToken[0].Access_Token__c.trim() +
                    '&longUrl=' + EncodingUtil.urlEncode(strResultURL, 'UTF-8' ) +
                    '&format=txt';
                HttpRequest req = new HttpRequest();
                req.setEndpoint(strEndpointURL);
                req.setMethod('GET');
                Http http = new Http();
                HttpResponse res = http.send(req);
                
                objEachEhr.Test_Result_Link_Generic__c = res.getBody();
                lstEhrToUpdate.add(objEachEhr);
            }
        }
        Database.update(lstEhrToUpdate, false);
    }

    global void finish(Database.BatchableContext BC) {}
}