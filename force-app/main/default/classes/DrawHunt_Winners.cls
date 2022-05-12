public with sharing class DrawHunt_Winners{
    public static void getHuntDrawReq(){
        //Getting Hunt_Events__c multiselect picklist values
        String[] events = new List<String>{};
            Schema.sObjectType objType = Schema.getGlobalDescribe().get('Case').newSObject().getSObjectType();
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        for (Schema.PicklistEntry ple : objFieldMap.get('Hunt_Events__c').getDescribe().getPicklistValues()){
            events.add(ple.getValue());
        }
        //RecordType Id
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
        
        List<Case> winnersList = new List<Case>();
        Set<Id> accountIds = new Set<Id>();
        Map<String, Set<Id>> winnersAccIdsPerEvent = new Map<String, Set<Id>>();
        Map<String, List<Case>> winnersListPerEvent = new Map<String, List<Case>>();
        
        //For Winners
        for (String event : events){
            List<Case> eventRecords = [Select AccountId, Account.FirstName, Account.LastName, Account.Tribe_Id__c, Account.Date_of_Birth__c, Account.Age__pc, Account.PersonEmail, Account.PersonContactId, Ebt_Mobile_Phone__c, 
                                       Id, CaseNumber, Status, Origin, Priority, Request_Reason__c, Hunt_Category__c, Hunt_Events__c, Is_Applicant_Under_18__c, Hunting_License_Holder__c, 
                                       Physical_Street__c, Physical_City__c, Physical_ZipPostal_Code__c, Physical_Countries__c, Physical_States__c, Other_Physical_State__c, Physical_Suite__c, Physical_Address2__c, Physical_IsManual__c, Physical_Melissa_Address__c, 
                                       PG_First_Name__c, PG_Middle_Name__c, PG_Last_Name__c, PG_Driver_License__c, PG_Mobile_Phone__c, PG_Physical_Street__c, PG_Physical_City__c, PG_Physical_ZipPostal_Code__c, PG_Physical_Country__c, PG_Physical_State__c, PG_Other_Physical_State__c, PG_Physical_Suite__c, PG_Physical_Address_Line2__c, PG_Physical_Melissa_Address__c, PG_Physical_IsManual__c, 
                                       AA_First_Name__c, AA_Middle_Name__c, AA_Last_Name__c, AA_Driver_License__c, AA_Mobile_Phone__c
                                       From Case
                                       Where RecordTypeId = :caseRecordTypeId AND Request_Reason__c = 'HA' AND Hunt_Events__c includes ( :event)];
            
            // List<Case> eventRecords = [Select AccountId, Account.FirstName, Account.LastName, Account.Tribe_Id__c, Account.Date_of_Birth__c, Account.Age__pc, Account.PersonEmail, Ebt_Mobile_Phone__c, Id, CaseNumber, ContactId, Hunt_Category__c, Hunt_Events__c
            //                            From Case
            //                            Where RecordTypeId = :caseRecordTypeId AND Request_Reason__c = 'HA' AND Hunt_Events__c includes ( :event)];
            
            Integer count = 0;
            Set<Id> tempAccountIds = new Set<Id>();
            List<Case> tempWinnersList = new List<Case>();
            if (eventRecords.size() > 0){
                System.debug(eventRecords[0]);
                for (Integer i = 0; i < eventRecords.size(); i++){
                    
                    if (count == 5){
                        winnersAccIdsPerEvent.put(event, tempAccountIds);
                        winnersListPerEvent.put(event, tempWinnersList);
                        
                        System.debug(winnersAccIdsPerEvent.get(event));
                        System.debug(winnersListPerEvent.get(event));
                        break;
                    }
                    
                    Set<Integer> fiveUniqueNums = getRandomNumbs(eventRecords.size());
                    System.debug('5 Unique Random Numbers : ' + fiveUniqueNums);
                    for (Integer uniqueRandNum : fiveUniqueNums){
                        // Integer randomNumber = Integer.valueof((Math.random() * eventRecords.size() - 1));
                        Integer randomNumber = uniqueRandNum;
                        if (count == 5){
                            break;
                        }
                        if (accountIds.size() > 0){
                            if (!accountIds.contains(eventRecords[randomNumber].AccountId)){
                                //eventRecords[randomNumber].Hunt_Events__c = event;
                                winnersList.add(eventRecords[randomNumber]);
                                tempWinnersList.add(eventRecords[randomNumber]);
                                
                                tempAccountIds.add(eventRecords[randomNumber].AccountId);
                                accountIds.add(eventRecords[randomNumber].AccountId);
                                count++;
                                System.debug('count : ' + count);
                                System.debug('Winners : ' + accountIds);
                            } else{
                                System.debug('Already exists : ' + eventRecords[randomNumber].AccountId);
                            }
                        } else{
                            //eventRecords[randomNumber].Hunt_Events__c = event;
                            winnersList.add(eventRecords[randomNumber]);
                            tempWinnersList.add(eventRecords[randomNumber]);
                            
                            tempAccountIds.add(eventRecords[randomNumber].AccountId);
                            accountIds.add(eventRecords[randomNumber].AccountId);
                            System.debug('Winners : ' + accountIds);
                            count++;
                        }
                    }
                }
            }
            
            
        }
        
        List<Case> backupWinners = new List<Case>();
        Map<String, List<Case>> backupWinnersPerEvent = new Map<String, List<Case>>();
        //For Backup Winners
        for (String event : events){
            List<Case> eventRecords = [Select AccountId, Account.FirstName, Account.LastName, Account.Tribe_Id__c, Account.Date_of_Birth__c, Account.Age__pc, Account.PersonEmail, Account.PersonContactId, Ebt_Mobile_Phone__c, 
                                       Id, CaseNumber, Status, Origin, Priority, Request_Reason__c, Hunt_Category__c, Hunt_Events__c, Is_Applicant_Under_18__c, Hunting_License_Holder__c, 
                                       Physical_Street__c, Physical_City__c, Physical_ZipPostal_Code__c, Physical_Countries__c, Physical_States__c, Other_Physical_State__c, Physical_Suite__c, Physical_Address2__c, Physical_IsManual__c, Physical_Melissa_Address__c, 
                                       PG_First_Name__c, PG_Middle_Name__c, PG_Last_Name__c, PG_Driver_License__c, PG_Mobile_Phone__c, PG_Physical_Street__c, PG_Physical_City__c, PG_Physical_ZipPostal_Code__c, PG_Physical_Country__c, PG_Physical_State__c, PG_Other_Physical_State__c, PG_Physical_Suite__c, PG_Physical_Address_Line2__c, PG_Physical_Melissa_Address__c, PG_Physical_IsManual__c, 
                                       AA_First_Name__c, AA_Middle_Name__c, AA_Last_Name__c, AA_Driver_License__c, AA_Mobile_Phone__c
                                       From Case
                                       Where RecordTypeId = :caseRecordTypeId AND Request_Reason__c = 'HA' AND Hunt_Events__c includes ( :event) AND AccountId NOT IN :accountIds];
            
            System.debug(eventRecords.size());
            
            List<Case> tempList = new List<Case>();			
            Integer count = 0;
            if (eventRecords.size() > 0){
                for (Integer i = 0; i < eventRecords.size(); i++){
                    if (count == 5) {
                        backupWinnersPerEvent.put(event, tempList);
                        break;
                    }
                    Set<Integer> fiveUniqueNums = getRandomNumbs(eventRecords.size());
                    for (Integer randomNum : fiveUniqueNums) {
                        if (count == 5) {
                            break;
                        }
                        tempList.add(eventRecords[randomNum]);
                        backupWinners.add(eventRecords[randomNum]);
                        count++;
                    }
                }
            }
            
            
        }
        
        System.debug('Winners Account Ids: ' + accountIds.size()+'\n' + accountIds);
        // System.debug('Winners per event : ' + winnersPerEvent);
        System.debug('Winners By Event : ' + winnersAccIdsPerEvent);
        
        System.debug('Winners By Event List : ' + winnersListPerEvent);
        
        generateCSV(winnersListPerEvent, 'Winners.csv', 'Controlled Hunt Draw Winners');
        generateCSV(backupWinnersPerEvent, 'Backup Winners.csv', 'Controlled Hunt Draw Backup Winners');
    }
    
    private static Set<Integer> getRandomNumbs(Integer length){
        Set<Integer> uniqueNum = new Set<Integer>();
        for (Integer i = 0; i < length; i ++){
            Integer rand = Integer.valueof((Math.random() * length));
            uniqueNum.add(rand);
            //Integer rand = Math.floor(Math.random() * 10).intValue();
            // Integer rand = Integer.valueof((Math.random() * length));
            // if (uniqueNum.size() == 5){
            //     System.debug('5 unique Number' + uniqueNum);
            //     break;
            // }
            // if (uniqueNum.size() > 0){
            //     uniqueNum.add(rand);
            // } else{
            //     uniqueNum.add(rand);
            // }
        }
        return uniqueNum;
    }
    
    private static void generateCSV(Map<String, List<Case>> winnersMap, String fileName, String subject){
        string header = 'Event ,Winner Name ,Account Id ,Case Number ,Citizen Id ,Date of Birth ,Age ,Email ,Mobile, Physical Street, Physical City ,Physical Country ,Physical State ,Physical Other State ,Physical Zip Code ,PG Name ,PG Driver License No ,PG Mobile ,PG Physical Street ,PG Physical City ,PG Physical Country ,PG Physical State ,PG Physical Other State ,PG Physical Zip Code ,AA Name ,AA Driver License No ,AA Mobile ,Hunt Category ,Hunt Events, Hunting License Holder\n';
        string finalstr = header;
        for (String event : winnersMap.keySet()) {
            List<Case> winnersList = winnersMap.get(event);
            for (Case cse : winnersList){
                // String v = (cse.Other_Physical_State__c != null ? cse.Other_Physical_State__c : ' ');
                // Integer age = Integer.valueOf(cse.Account.Age__pc.split(' ')[0]);
                string recordString = '"' + event + '","' + cse.Account.FirstName + ' ' + cse.Account.LastName + '","' + cse.AccountId + '","' + cse.CaseNumber +  '","' + cse.Account.Tribe_Id__c +  '","' + cse.Account.Date_of_Birth__c +  '","' + cse.Account.Age__pc +  '","' + cse.Account.PersonEmail +  '","' + cse.Ebt_Mobile_Phone__c +  '","' 
                    + cse.Physical_Street__c +  '","' + cse.Physical_City__c +  '","' + cse.Physical_Countries__c +  '","' + cse.Physical_States__c	 +  '","' + (cse.Other_Physical_State__c != null ? cse.Other_Physical_State__c : '') +  '","' + cse.Physical_ZipPostal_Code__c +  '","'
                    + (cse.PG_First_Name__c != null ? cse.PG_First_Name__c : '') + ' ' + (cse.PG_Last_Name__c != null ? cse.PG_Last_Name__c : '') +  '","' + (cse.PG_Driver_License__c != null ? cse.PG_Driver_License__c : '') +  '","' + (cse.PG_Mobile_Phone__c != null ? cse.PG_Mobile_Phone__c : '') +  '","' + (cse.PG_Physical_Street__c != null ? cse.PG_Physical_Street__c : '') +  '","' + (cse.PG_Physical_City__c != null ? cse.PG_Physical_City__c : '') +  '","' + (cse.PG_Physical_Country__c != null ? cse.PG_Physical_Country__c : '') +  '","' + (cse.PG_Physical_State__c != null ? cse.PG_Physical_State__c : '') +  '","' + (cse.PG_Other_Physical_State__c != null ? cse.PG_Other_Physical_State__c : '') +  '","' + (cse.PG_Physical_ZipPostal_Code__c != null ? cse.PG_Physical_ZipPostal_Code__c : '') +  '","'
                    + (cse.AA_First_Name__c != null ? cse.AA_First_Name__c : '') + ' ' + (cse.AA_Last_Name__c != null ? cse.AA_Last_Name__c : '') + '","' + (cse.AA_Driver_License__c != null ? cse.AA_Driver_License__c : '') +  '","' + (cse.AA_Mobile_Phone__c != null ? cse.AA_Mobile_Phone__c : '') +  '","' + cse.Hunt_Category__c +  '","' + cse.Hunt_Events__c +  '","' + cse.Hunting_License_Holder__c +  '"\n';
                
                // if (cse.Hunt_Category__c.contains('Youth') || (cse.Hunt_Category__c.contains('At Large') && age < 18 )) {
                // 	recordString = '"' + event + '","' + cse.Account.FirstName + ' ' + cse.Account.LastName + '","' + cse.AccountId + '","' + cse.CaseNumber +  '","' + cse.Account.Tribe_Id__c +  '","' + cse.Account.Date_of_Birth__c +  '","' + cse.Account.Age__pc +  '","' + cse.Account.PersonEmail +  '","' + cse.Ebt_Mobile_Phone__c +  '","' 
                // 					  + cse.Physical_Street__c +  '","' + cse.Physical_City__c +  '","' + cse.Physical_Countries__c +  '","' + cse.Physical_States__c	 +  '","' + cse.Other_Physical_State__c +  '","' + cse.Physical_ZipPostal_Code__c +  '","'
                // 					  + cse.PG_First_Name__c + ' ' + cse.PG_Last_Name__c +  '","' + cse.PG_Driver_License__c +  '","' + cse.PG_Mobile_Phone__c +  '","' + cse.PG_Physical_Street__c +  '","' + cse.PG_Physical_City__c +  '","' + cse.PG_Physical_Country__c +  '","' + cse.PG_Physical_State__c +  '","' + cse.PG_Other_Physical_State__c +  '","' + cse.PG_Physical_ZipPostal_Code__c +  '","'
                // 					  + cse.AA_First_Name__c + ' ' + cse.AA_Last_Name__c + '","' + cse.AA_Driver_License__c +  '","' + cse.AA_Mobile_Phone__c +  '","' + cse.Hunt_Category__c +  '","' + cse.Hunt_Events__c +  '","' + cse.Hunting_License_Holder__c +  '"\n';
                // } else {
                // 	recordString = '"' + event + '","' + cse.Account.FirstName + ' ' + cse.Account.LastName + '","' + cse.AccountId + '","' + cse.CaseNumber +  '","' + cse.Account.Tribe_Id__c +  '","' + cse.Account.Date_of_Birth__c +  '","' + cse.Account.Age__pc +  '","' + cse.Account.PersonEmail +  '","' + cse.Ebt_Mobile_Phone__c +  '","' 
                // 					  + cse.Physical_Street__c +  '","' + cse.Physical_City__c +  '","' + cse.Physical_Countries__c +  '","' + cse.Physical_States__c	 +  '","' + cse.Other_Physical_State__c +  '","' + cse.Physical_ZipPostal_Code__c +  '","'
                // 					  + ' ' +  '","' + ' '  +  '","' + ' ' +  '","' + ' ' +  '","' + ' ' +  '","' + ' ' +  '","' + ' ' +  '","' + ' ' +  '","' + ' ' +  '","'
                // 					  + ' ' + '","' + ' ' +  '","' + ' ' +  '","' + cse.Hunt_Category__c +  '","' + cse.Hunt_Events__c +  '","' + cse.Hunting_License_Holder__c +  '"\n';
                // }
                finalstr = finalstr + recordString;
            }
        }
        
        System.debug(finalstr);
        Messaging.EmailFileAttachment csvAttc = new Messaging.EmailFileAttachment();
        blob csvBlob = Blob.valueOf(finalstr);
        string csvname = fileName;
        csvAttc.setFileName(csvname);
        csvAttc.setBody(csvBlob);
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        String[] toAddresses = new list<string>{'zeeshan.haider@gettectonic.com'};
        // String subject = subject;
        email.setSubject(subject);
        email.setToAddresses(toAddresses);
        //email.setPlainTextBody('Hunt Draw Winners');
        email.setHtmlBody('Hunt Draw Winners');
        email.setFileAttachments(new Messaging.EmailFileAttachment[]{csvAttc});
        Messaging.SendEmailResult[] results = Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
        if (results[0].success) {
            System.debug('The email was sent successfully.');
        } else {
            System.debug('The email failed to send: '
                         + results[0].errors[0].message);
        }
        
    }
    
    
}