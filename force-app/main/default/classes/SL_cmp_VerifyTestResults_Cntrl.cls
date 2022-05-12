/**
 * @fileName        : SL_cmp_VerifyTestResults_Cntrl
 * @description     : Controller class for SL_cmp_VerifyTestResults aura component
 * @author          : Vikash Agarwal
 * @createdOn       : 7th Jan 2022
 * @lastModifiedBy  : Vikash Agarwal
 * @lastModifiedOn  : 
 * Modifications Log
 * Ver   Date         Author   Modification
 * 1.0   01-07-2022      Initial Version
**/
public without sharing class SL_cmp_VerifyTestResults_Cntrl {

    @AuraEnabled
    public static Map<String, Object> updateAttemptCount(String strAccId, String resultType, String ehrId) {
        Map<String, Object> mapRst = new Map<String, Object>();
        try {
            Blob  decodedId =  EncodingUtil.base64Decode(strAccId);
            String decodedAccId = decodedId.toString();
            List<Account> lstAccs = [SELECT Id, Attempts_Counter__c, RecordType.DeveloperName, PersonContactId
                                     FROM Account
                                     WHERE Id = :decodedAccId
                                     LIMIT 1];
            mapRst.put('isSuccess', true);
            mapRst.put('currentPatientAcc', lstAccs[0]);
            mapRst.put('lstCnDiseaseMdt', CN_Disease__mdt.getAll().values());
            return mapRst;
        } catch(Exception ex) {
            mapRst.put('isSuccess', false);
            mapRst.put('errorMsg', ex.getMessage());
            return mapRst;
        }
    }

    @AuraEnabled
    public static Map<String, Object> getDuplicatePatients(String strAccId, String ehrId, Date Dob, String resultType) {
        Map<String, Object> mapRst = new Map<String, Object>();
        try {
            Id ermAccRTId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();

            String strDiseaseName = '';
            String strTestResult = '';
            List<CN_Disease__mdt> lstDisMdts = CN_Disease__mdt.getAll().values();
            for(CN_Disease__mdt cnD : lstDisMdts) {
                if((cnD.Result_URL_Parameter__c).containsIgnoreCase(resultType) ) {
                    strDiseaseName = cnD.Name_of_Disease__c;
                    strTestResult = cnD.Test_Result__c;
                }
            }

            Account patientAcc = [SELECT Id, Date_of_Birth__c, Attempts_Counter__c, PersonMobilePhone
                                  FROM Account 
                                  WHERE Id =: strAccId LIMIT 1];

            // Reset the Attempt counter to 3
            patientAcc.Attempts_Counter__c = 3;
            update patientAcc;

            String patientId = patientAcc.Id;
            String strPatientPhone = patientAcc.PersonMobilePhone;
            String strMatchingRecQuery = 'SELECT Id, Name, PersonMobilePhone, Date_of_Birth__c, ' +
                                         '(Select id, HealthCloudGA__NameLabel__c FROM EHR_Observations__r ' +
                                         'WHERE HealthCloudGA__NameLabel__c =: strDiseaseName AND Testing_Status__c =: strTestResult) ' + 
                                         'FROM Account ' + 
                                         'WHERE PersonMobilePhone =: strPatientPhone '+ 
                                         'AND Date_of_Birth__c =: Dob ' +
                                         'AND RecordTypeId =: ermAccRTId ORDER BY Name';
            List<Account> lstOtherMatchingPatients = Database.query(strMatchingRecQuery);
            List<Account> lstFilteredMatchingPatients = new List<Account>();
            for(Account acc : lstOtherMatchingPatients) {
                if(acc.EHR_Observations__r.size() > 0) lstFilteredMatchingPatients.add(acc);
            }

            List<Account> lstMatchingPatients = new List<Account>();
            if(!lstFilteredMatchingPatients.isEmpty() && lstFilteredMatchingPatients.size() > 1) {
                Map<String, String> mapAccIdToEncodedId = new Map<String, String>();
                for(Account acc : lstFilteredMatchingPatients) {
                    if(acc.EHR_Observations__r.size() > 0) {
                        mapAccIdToEncodedId.put(acc.Id, EncodingUtil.base64Encode(Blob.valueof(acc.Id)));
                        lstMatchingPatients.add(acc);
                    }
                }
                mapRst.put('isSuccess', true);
                mapRst.put('isDuplicatePatientFound', true);
                mapRst.put('lstMatchingPatients', lstMatchingPatients);
                mapRst.put('mapAccIdToEncodedId', mapAccIdToEncodedId);
            } else {
                mapRst.put('isDuplicatePatientFound', false);
                lstMatchingPatients.add(patientAcc);

                if(patientAcc.Attempts_Counter__c > 0 && patientAcc.Date_of_Birth__c == Dob) {
                    // Update counter on Patient record
                    patientAcc.Attempts_Counter__c = patientAcc.Attempts_Counter__c - 1;
                    update patientAcc;

                    // Update Test Result Viewed checkbox on EHR
                    Blob decodedId =  EncodingUtil.base64Decode(ehrId);
                    String decodedEhrIdId = decodedId.toString();
                    HealthCloudGA__EhrObservation__c objEhr = new HealthCloudGA__EhrObservation__c(Id = decodedEhrIdId, Test_Result_Viewed__c = true);
                    update objEhr;

                    mapRst.put('isSuccess', true);
                    List<Account> lstTempAccs = [SELECT Id, Name, Date_of_Birth__c, Test_Date__c FROM Account WHERE Id =: patientAcc.Id ORDER BY Name];
                    mapRst.put('lstMatchingPatients', lstTempAccs);

                    Map<String, String> mapAccIdToEncodedId = new Map<String, String>();
                    for(Account acc : lstTempAccs) {
                        mapAccIdToEncodedId.put(acc.Id, EncodingUtil.base64Encode(Blob.valueof(acc.Id)));
                    }
                    mapRst.put('mapAccIdToEncodedId', mapAccIdToEncodedId);
                }
                else if(patientAcc.Attempts_Counter__c < 1) {
                    mapRst.put('isSuccess', false);
                    mapRst.put('rtnMsg', 'MaxAttemptsReached');
                }
                else {
                    mapRst.put('isSuccess', false);
                    mapRst.put('rtnMsg', 'Failed');
                }
            }
            return mapRst;
        }
        catch(AuraHandledException ex) {
            mapRst.put('isSuccess', false);
            mapRst.put('rtnMsg', ex.getMessage());
            return mapRst;
        }
    }
    
    // this method fetches username
    @AuraEnabled
    public static Object getUserInfo(String strAccId, String ehrId, Date Dob) {
        try {
            if(!String.isBlank(strAccId) && Dob != null) {
                Account patientAcc = [SELECT Id, Date_of_Birth__c, Attempts_Counter__c, PersonMobilePhone, PersonContactId
                                      FROM Account WHERE Id =: strAccId LIMIT 1];

                // Reset the Attempt counter to 3
                patientAcc.Attempts_Counter__c = 3;
                update patientAcc;

                if(patientAcc.Attempts_Counter__c > 0 && patientAcc.Date_of_Birth__c == Dob) {
                    // Update counter on Patient record
                    patientAcc.Attempts_Counter__c = patientAcc.Attempts_Counter__c - 1;
                    update patientAcc;

                    // Update Test Result Viewed checkbox on EHR
                    Blob decodedId =  EncodingUtil.base64Decode(ehrId);
                    String decodedEhrIdId = decodedId.toString();
                    HealthCloudGA__EhrObservation__c objEhr = new HealthCloudGA__EhrObservation__c(Id = decodedEhrIdId, Test_Result_Viewed__c = true);
                    update objEhr;

                    return [SELECT Id, Name, PersonContactId, Date_of_Birth__c, Test_Date__c FROM Account WHERE Id =: patientAcc.Id][0];
                } else if(patientAcc.Attempts_Counter__c < 1) {
                    return 'MaxAttemptsReached';
                } else {
                    return 'Failed';
                }
            }
        }
        catch(AuraHandledException ex) {
            throw new AuraHandledException(ex.getMessage());
        }
        return  null;
    }

    @AuraEnabled
    public static Map<String, Object> getPatientDetailForHeader(String strAccId, String ehrId) {
        Map<String, Object> mapRst = new Map<String, Object>();
        try {
            Blob  decodedId =  EncodingUtil.base64Decode(strAccId);
            String decodedAccId = decodedId.toString();
            List<Account> lstAccs = [SELECT Id, Name, PersonContactId FROM Account WHERE Id = :decodedAccId LIMIT 1];

            Blob  blobDecodedEHRId =  EncodingUtil.base64Decode(ehrId);
            String decodedEHRId = blobDecodedEHRId.toString();
            List<HealthCloudGA__EhrObservation__c> lstEhrs = [SELECT Id, Testing_Status__c, HealthCloudGA__AppliesDateTime__c
                                                              FROM HealthCloudGA__EhrObservation__c 
                                                              WHERE Id = :decodedEHRId LIMIT 1];

            mapRst.put('isSuccess', true);
            mapRst.put('currentPatientAcc', lstAccs[0]);
            if(!lstEhrs.isEmpty()) {
                mapRst.put(
                    'currentEhr', 
                    new Map<String, Object>{
                        'ehrId'             => lstEhrs[0].Id,
                        'ehrTestingStatus'  => lstEhrs[0].Testing_Status__c,
                        'ehrResultDateTime' => lstEhrs[0].HealthCloudGA__AppliesDateTime__c.format('MMM dd, YYYY')
                    }
                );
            }
            return mapRst;
        } catch(Exception ex) {
            mapRst.put('isSuccess', false);
            mapRst.put('errorMsg', ex.getMessage());
            return mapRst;
        }
    }
}