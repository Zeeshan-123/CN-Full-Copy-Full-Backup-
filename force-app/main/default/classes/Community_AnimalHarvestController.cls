public without sharing class Community_AnimalHarvestController {
    
    private static final Id CONTACT_ID = [SELECT ContactId FROM User WHERE Id =: UserInfo.getUserId()].ContactId; 
    
    
    @AuraEnabled 
    public static case createCase(Case CVCase, DateTime dateTimeValue){
        
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Animal_Harvest').getRecordTypeId();
        Case caseRec = new Case(); 
        caseRec.RecordTypeId = caseRecordTypeId; 
        caseRec.Status = 'New';
        caseRec.Origin = 'Portal'; 
        caseRec.Priority = 'Low'; 
        caseRec.Request_Reason__c = 'Animal Harvest - White Tail Deer'; 
        //caseRec.AccountId = wrapperObj.acnt.Id; 
        //caseRec.ContactId = wrapperObj.acnt.PersonContactId; 
        caseRec.Age_Group_of_Deer__c = CVCase.Age_Group_of_Deer__c;
        caseRec.Date_Time_of_Harvest__c = dateTimeValue; 
        caseRec.Land_Type__c = CVCase.Land_Type__c; 
        caseRec.Method_of_Harvest__c = CVCase.Method_of_Harvest__c; 
        //system.debug('Antler Status: ' + antlerStatus);
        caseRec.Is_the_Deer_Antlered__c = CVCase.Is_the_Deer_Antlered__c; 
        caseRec.Points_Left__c = CVCase.Points_Left__c; 
        caseRec.Points_Right__c = CVCase.Points_Right__c; 
        caseRec.County_of_Harvest__c = CVCase.County_of_Harvest__c; 
        
        system.debug('Animal Harvest Case: ' + caseRec); 
        
        insert caseRec; 
        
        Case newCase = [SELECT ID, CaseNumber, AccountID, Animal_Harvest_Request__c  FROM Case WHERE ID = : caseRec.Id LIMIT 1]; 
        
        system.debug('Case created: ' + newCase); 
        
        return newCase; 
        
        
        
        
        
    }
    // get  case information
    @AuraEnabled 
    public static Community_AnimalHarvestFormWrapper validateApplicantEligibility(){
        //initialize wrapper class
        Community_AnimalHarvestFormWrapper obj;
        Map<String, String> landTypeMap = new Map<String, String>();
        Map<String, String> methodMap = new Map<String, String>();
        Map<String, String> ageGroupMap = new Map<String, String>();
        Map<String, String> countyMap = new Map<String, String>();
        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        
        //    Describe call for Land Type picklist values
        Schema.DescribeFieldResult landTypeResult = Case.Land_Type__c.getDescribe();
        List<Schema.PicklistEntry> landTypeList = landTypeResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : landTypeList) {
            if(s.getValue()=='Tribal' || s.getValue()=='Private'){
                landTypeMap.put(s.getValue(), s.getLabel());
            }
            
        }  
        
        Schema.DescribeFieldResult methodResult = Case.Method_of_Harvest__c.getDescribe();
        List<Schema.PicklistEntry> methodList = methodResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : methodList) {
            methodMap.put(s.getValue(), s.getLabel());
        }  
        
        Schema.DescribeFieldResult ageGroupResult = Case.Age_Group_of_Deer__c.getDescribe();
        List<Schema.PicklistEntry> ageGroupList = ageGroupResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : ageGroupList) {
            ageGroupMap.put(s.getValue(), s.getLabel());
        } 
        
        Schema.DescribeFieldResult countyResult = Case.County_of_Harvest__c.getDescribe();
        List<Schema.PicklistEntry> countyList = countyResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : countyList) {
            countyMap.put(s.getValue(), s.getLabel());
        } 
        
        
        obj 	= 	new Community_AnimalHarvestFormWrapper(accnt, landTypeMap, methodMap, ageGroupMap, countyMap);
        
        
        return obj;
    }    
    @AuraEnabled 
    public static Community_PaddleFishHarvestWrapper getPaddleFishInfo(){
        //initialize wrapper class
        Community_PaddleFishHarvestWrapper obj;
        Map<String, String> riverSystemMap = new Map<String, String>();
        
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        
        //    Describe call for Land Type picklist values
        Schema.DescribeFieldResult riverSystemResult = Case.River_System__c.getDescribe();
        List<Schema.PicklistEntry> riverSystemList = riverSystemResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : riverSystemList) {
            riverSystemMap.put(s.getValue(), s.getLabel());
        }  
        
        
        
        
        obj 	= 	new Community_PaddleFishHarvestWrapper(accnt, riverSystemMap);
        
        
        return obj;
    }    
    @AuraEnabled 
    public static case createPaddlefishCase(Case CVCase, DateTime dateTimeValue){
        system.debug('CV Case Date/Time: ' + dateTimeValue);
        
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Animal_Harvest').getRecordTypeId();
        Case caseRec = new Case(); 
        caseRec.RecordTypeId = caseRecordTypeId; 
        caseRec.Status = 'New';
        caseRec.Origin = 'Portal'; 
        caseRec.Priority = 'Low'; 
        caseRec.Request_Reason__c = 'Animal Harvest - Paddlefish'; 
        system.debug('Resident of US? ' + CVCase.Is_Resident_of_US__c);
        caseRec.Is_Resident_of_US__c = CVCase.Is_Resident_of_US__c;
        caseRec.Date_Time_of_Harvest__c = dateTimeValue; 
        system.debug('Date time of Harvest: ' + CVCase.Date_Time_Of_Harvest__c);
        caseRec.River_System__c = CVCase.River_System__c; 
        caseRec.Was_Paddlefish_Checked__c = CVCase.Was_Paddlefish_Checked__c; 
        caseRec.Did_Paddlefish_Have_Metal_Band__c = CVCase.Did_Paddlefish_Have_Metal_Band__c; 
        caseRec.Metal_Band_Number__c = CVCase.Metal_Band_Number__c; 
        
        system.debug('Animal Harvest Case: ' + caseRec); 
        
        insert caseRec; 
        
        Case newCase = [SELECT ID, CaseNumber, AccountID, Animal_Harvest_Request__c  FROM Case WHERE ID = : caseRec.Id LIMIT 1]; 
        
        system.debug('Case created: ' + newCase); 
        
        return newCase; 
        
        
        
        
        
    }
    
    @AuraEnabled 
    public static Community_TurkeyHarvestWrapper getTurkeyHarvestInfo(){
        //initialize wrapper class
        //
        Community_TurkeyHarvestWrapper obj;
        Map<String, String> landTypeMap = new Map<String, String>();
        Map<String, String> methodMap = new Map<String, String>();
        Map<String, String> beardlength  = new Map<String, String>();
        Map<String, String> spurlength  = new Map<String, String>();
        Map<String, String> countyMap = new Map<String, String>();
        Map<String, String> turkeygender  = new Map<String, String>();
        //get CN Registration account for loggedIn user
        Account accnt = utility.getAccount(CONTACT_ID);
        
        //    Describe call for Land Type picklist values
        Schema.DescribeFieldResult landTypeResult = Case.Land_Type__c.getDescribe();
        List<Schema.PicklistEntry> landTypeList = landTypeResult.getPicklistValues();
        
          Schema.DescribeFieldResult methodResult = Case.Method_of_Harvest__c.getDescribe();
        List<Schema.PicklistEntry> methodList = methodResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : methodList) {
            if(s.getValue()=='Gun' || s.getValue()=='Archery'){
                 methodMap.put(s.getValue(), s.getLabel());
            }
           
        }  
        
        for(Schema.PicklistEntry s : landTypeList) {
            if(s.getValue()=='Tribal' || s.getValue()=='Private' || s.getValue()=='Other'){
            landTypeMap.put(s.getValue(), s.getLabel());
            }
        }  
        
        Schema.DescribeFieldResult beardlengthResult = Case.Beard_Length__c.getDescribe();
        List<Schema.PicklistEntry> beardlengthList = beardlengthResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : beardlengthList) {
            beardlength.put(s.getValue(), s.getLabel());
        }  
        
        Schema.DescribeFieldResult spurlengthResult = Case.Spur_Length__c.getDescribe();
        List<Schema.PicklistEntry> spurlengthList = spurlengthResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : spurlengthList) {
            spurlength.put(s.getValue(), s.getLabel());
        } 
        
        Schema.DescribeFieldResult countyResult = Case.County_of_Harvest__c.getDescribe();
        List<Schema.PicklistEntry> countyList = countyResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : countyList) {
            countyMap.put(s.getValue(), s.getLabel());
        } 
        
        Schema.DescribeFieldResult turkeygenderResult = Case.Animal_Gender__c.getDescribe();
        List<Schema.PicklistEntry> turkeygenderList = turkeygenderResult.getPicklistValues();
        
        for(Schema.PicklistEntry s : turkeygenderList) {
            turkeygender.put(s.getValue(), s.getLabel());
        } 
       
        
        obj 	= 	new Community_TurkeyHarvestWrapper(accnt, landTypeMap, methodMap, beardlength, spurlength, countyMap, turkeygender);
        
        return obj;
    }    
    @AuraEnabled 
    public static case createTurkeyHarvestCase(Case CVCase, DateTime dateTimeValue){
        system.debug('CV Case Date/Time: ' + dateTimeValue);
        
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Animal_Harvest').getRecordTypeId();
        Case caseRec = new Case(); 
        caseRec.RecordTypeId = caseRecordTypeId; 
        caseRec.Status = 'New';
        caseRec.Origin = 'Portal'; 
        caseRec.Priority = 'Low'; 
        caseRec.Request_Reason__c = 'Animal Harvest - Turkey'; 
        caseRec.Date_Time_of_Harvest__c = dateTimeValue; 
        system.debug('Date time of Harvest: ' + CVCase.Date_Time_Of_Harvest__c);
        caseRec.Animal_Gender__c = CVCase.Animal_Gender__c; 
        caseRec.Spur_Length__c = CVCase.Spur_Length__c; 
        caseRec.Beard_Length__c = CVCase.Beard_Length__c; 
        caseRec.Method_of_Harvest__c = CVCase.Method_of_Harvest__c; 
        caseRec.Land_Type__c = CVCase.Land_Type__c; 
        caseRec.County_of_Harvest__c = CVCase.County_of_Harvest__c; 
        caseRec.Other_Land_Type__c = CVCase.Other_Land_Type__c; 
       
        
        system.debug('Animal Harvest Case: ' + caseRec); 
        
        insert caseRec; 
        
        Case newCase = [SELECT ID, CaseNumber, AccountID, Animal_Harvest_Request__c  FROM Case WHERE ID = : caseRec.Id LIMIT 1]; 
        
        system.debug('Case created: ' + newCase); 
        
        return newCase; 
        
        
        
        
        
    }
    
}