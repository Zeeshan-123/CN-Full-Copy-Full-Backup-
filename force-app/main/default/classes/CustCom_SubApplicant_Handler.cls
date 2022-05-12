public class CustCom_SubApplicant_Handler {
    
    public void BeforeInsertRec(List<Sub_Applicant__c> NewRecList,Map<Id,Sub_Applicant__c> NewRecMap){
        List<Sub_Applicant__c> MobileHotsotRecs = new List<Sub_Applicant__c>();//List of Case Ids
        List<Sub_Applicant__c> Emergency_AssistanceRecs = new List<Sub_Applicant__c>();//List of Case Ids
        for(Sub_Applicant__c rec : NewRecList){
            If(rec.System_Record_Type__c =='Mobile_Hotspot_Connectivity'){
                MobileHotsotRecs.add(rec);
            }
            If(rec.System_Record_Type__c =='Utility_Assistance' || rec.System_Record_Type__c =='Emergency_Assistance'){
                Emergency_AssistanceRecs.add(rec);
            }
        }
        if(MobileHotsotRecs.size() > 0 && MobileHotsotRecs != Null){
            ValidateHotspotCitizen(MobileHotsotRecs);
        }
        if(Emergency_AssistanceRecs.size() > 0 && Emergency_AssistanceRecs != Null){
            ValidateEmergency_AssistanceCitizen(Emergency_AssistanceRecs);
        }
    }
    public void BeforeUpdateRec(List<Sub_Applicant__c> NewRecList,Map<Id,Sub_Applicant__c> NewRecMap){
        List<Sub_Applicant__c> MobileHotsotRecs = new List<Sub_Applicant__c>();//List of Case Ids
        List<Sub_Applicant__c> Emergency_AssistanceRecs = new List<Sub_Applicant__c>();//List of Case Ids
        
        for(Sub_Applicant__c rec : NewRecList){
            If(rec.System_Record_Type__c =='Mobile_Hotspot_Connectivity'){
                MobileHotsotRecs.add(rec);
            }
            If(rec.System_Record_Type__c =='Utility_Assistance' || rec.System_Record_Type__c =='Emergency_Assistance'){
                Emergency_AssistanceRecs.add(rec);
            }
            
        }
        if(MobileHotsotRecs.size() > 0 && MobileHotsotRecs != Null){
            ValidateHotspotCitizen(MobileHotsotRecs);
        }
        if(Emergency_AssistanceRecs.size() > 0 && Emergency_AssistanceRecs != Null){
            ValidateEmergency_AssistanceCitizen(Emergency_AssistanceRecs);
        }
    }
    
    public void ValidateHotspotCitizen (List<Sub_Applicant__c> MobileHotspotRec) { 
        Map<String, Sub_Applicant__c> ChildernMap= new Map<String, Sub_Applicant__c>();
        Map<String, String> CaseMap= new Map<String, String>();
        Map<String, String> CaseMap1= new Map<String, String>();
        Map<String, Decimal> CheckK21Num= new Map<String, Decimal>();
        Map<String, String> SubApplicantCase= new Map<String, String>();
        Map<String, Date> accMap						  = 		new Map<String, Date>();
        List<Sub_Applicant__c> InvalidCitizenIdsList				  = 		new List<Sub_Applicant__c>();
        List<Sub_Applicant__c> InvalidCitizenDOBList				  = 		new List<Sub_Applicant__c>();
        Map<Id,String> ErrorRec = new Map<Id,String> ();//map to store Error records ids with there related error message
        Set<Id> CaseIDs = new Set<Id>();
        
        List<String> ValidCitizenIdsList				  = 		new List<String>();
        List<Sub_Applicant__c> existingStudentsOnCA       = 		new List<Sub_Applicant__c>();
        List<Sub_Applicant__c> ChildernWithAcc       = 		new List<Sub_Applicant__c>();
        List<Account> accntsWithDoDNotNull				  = 		new List<Account>();
        List<Account> RelinquishedAccounts				  = 		new List<Account>();
        List<String> legitAccountsList					  = 		new List<String>();
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        
        
        for(Sub_Applicant__c ChildernIn : MobileHotspotRec)
        {   
            ChildernMap.put(ChildernIn.Citizen_ID__c, ChildernIn); 
        }
        
        if(ChildernMap != null && ChildernMap.size() > 0)
        {
            
            //get legit accounts on basis of citizen id
            for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, Age_Numeric__c FROM Account
                              WHERE Tribe_Id__c IN : ChildernMap.keySet() AND RecordTypeId = :cn_RecTypeId])
            {
                accMap.put(ac.Tribe_Id__c,ac.Date_of_Birth__c);
                Sub_Applicant__c Rec=  ChildernMap.get(ac.Tribe_Id__c);
                Rec.Account__c= ac.Id;
                if(!ChildernMap.containsKey(ac.Tribe_Id__c) ){
                    InvalidCitizenIdsList.add(ChildernMap.get(ac.Tribe_Id__c));
                    ErrorRec.put(ChildernMap.get(ac.Tribe_Id__c).Id,'Citizen Id Not Found');
                    
                }else if(ac.Date_of_Birth__c != Rec.Date_of_Birth__c){
                    InvalidCitizenDOBList.add(ChildernMap.get(ac.Tribe_Id__c));
                    ErrorRec.put(ChildernMap.get(ac.Tribe_Id__c).Id,'Date of birth is incorrect.');
                }else if(ac.Age_Numeric__c >= 18){
                    InvalidCitizenDOBList.add(ChildernMap.get(ac.Tribe_Id__c));
                    ErrorRec.put(ChildernMap.get(ac.Tribe_Id__c).Id,'Children must be under 18 years old.');
                }else{
                    ChildernWithAcc.add(Rec);
                    CaseMap.put(Rec.id,Rec.Request__c);
                    CaseMap1.put(Rec.Citizen_ID__c,Rec.Request__c);
                    CaseIDs.add(Rec.Request__c);
                    
                }
            }
            for(String Subapp:ChildernMap.keySet()){
                if(!accMap.containsKey(Subapp)){
                    ErrorRec.put(ChildernMap.get(Subapp).Id,'Citizen Id Not Found');
                }
                
            }
            List<Sub_Applicant__c> lstCase = new List<Sub_Applicant__c>();
            List<Sub_Applicant__c> lstCaseSubApp = new List<Sub_Applicant__c>();
            lstCase = [SELECT Id, Request__c, Request__r.Children_attending_K_12_school__c, Citizen_ID__c, Date_of_Birth__c FROM Sub_Applicant__c 
                       Where Request__c IN: CaseMap.values() AND Id not IN: CaseMap.keySet()];
            
            for(Sub_Applicant__c Cse : lstCase)
            {
                
                if(CaseMap1.containsKey(Cse.Citizen_ID__c) && (CaseMap1.get(Cse.Citizen_ID__c)==Cse.Request__c)){
                    ErrorRec.put(ChildernMap.get(Cse.Citizen_ID__c).Id,'Citizen Id Duplicate Found');                    
                }else{
                    CheckK21Num.put(Cse.Request__c,Cse.Request__r.Children_attending_K_12_school__c);
                    if(CaseMap1.containsKey(Cse.Citizen_ID__c)){SubApplicantCase.put(Cse.Request__c,Cse.Id);}
                    
                }
                
            }
            
            for (AggregateResult ar : [SELECT Request__c,COUNT(Id) RequestCount FROM Sub_Applicant__c Where Request__c IN: CaseMap.values() GROUP BY Request__c ])  {
                System.debug('Request__c ID: ' + ar.get('Request__c'));
                System.debug('Average amount: ' + ar.get('RequestCount'));
                String RequestId=(Id)(ar.get('Request__c'));
                If(CheckK21Num.get(RequestId) <= (Decimal)(ar.get('RequestCount'))){
                    system.debug('CheckK21Num: ' + CheckK21Num.get(RequestId));
                    ErrorRec.put(SubApplicantCase.get(RequestId),'More child records cannot be added.');                    
                }
                
            }
            system.debug('ErrorRec:: '+ErrorRec);
            if(ErrorRec != null && ErrorRec.size() > 0)
            {
                for(Sub_Applicant__c Sub: ChildernMap.values()){
                    If(ErrorRec.containsKey(Sub.Id)){
                        Sub.addError(ErrorRec.get(Sub.Id));
                    }
                }
            }    
            
        }
        
    }
    
    public void ValidateEmergency_AssistanceCitizen (List<Sub_Applicant__c> Emergency_AssistanceRec) { 
        Map<String, Sub_Applicant__c> CitizenMap= new Map<String, Sub_Applicant__c>();
        Map<Id,String> ErrorRec = new Map<Id,String> ();//map to store Error records ids with there related error message
        Map<String, Sub_Applicant__c> accMap						  = 		new Map<String, Sub_Applicant__c>();
        
        Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
        
        for(Sub_Applicant__c CitizenIn : Emergency_AssistanceRec)
        {  
            if(CitizenIn.Citizen_ID__c == '' || CitizenIn.Citizen_ID__c == null ){
                CitizenMap.put(CitizenIn.Id, CitizenIn); 
            }else{
                CitizenMap.put(CitizenIn.Citizen_ID__c, CitizenIn); 
            }
            
        }
        system.debug('CitizenMap:: '+CitizenMap);
        if(CitizenMap != null && CitizenMap.size() > 0)
        {
            //get legit accounts on basis of citizen id
            for(Account ac : [SELECT Id, FirstName, LastName, Name, Tribe_Id__c, Date_of_Birth__c, DOD__c, Age_Numeric__c FROM Account
                              WHERE Tribe_Id__c IN : CitizenMap.keySet() AND RecordTypeId = :cn_RecTypeId])
            {
                if(ac.Tribe_Id__c == null || ac.Tribe_Id__c == ''){
                    system.debug('ac.Tribe_Id__c:: '+ac.Tribe_Id__c);
                }else{
                    Sub_Applicant__c Rec=  CitizenMap.get(ac.Tribe_Id__c);
                    Rec.Account__c= ac.Id;
                    system.debug('ac.Tribe_Id__c:: '+ac.Tribe_Id__c);  
                    accMap.put(ac.Tribe_Id__c,Rec);
                }
                
            }
             system.debug('accMap:: '+accMap);
            for(String Subapp:CitizenMap.keySet()){
                //if Citizen Id Not Found
                if(!accMap.containsKey(Subapp)){
                    Sub_Applicant__c Rec=  CitizenMap.get(Subapp);
                    Rec.Account__c=null;
                    system.debug('Rec.First_Name_Text__c:: '+Rec.First_Name_Text__c);
                    system.debug('Rec.Citizen_ID__c:: '+Rec.Citizen_ID__c);
                    
                    if(Rec.Citizen_ID__c == null || Rec.Citizen_ID__c == '' ){
                        if(( Rec.First_Name_Text__c == null || Rec.First_Name_Text__c == ''  )|| (Rec.Last_Name_Text__c == null || Rec.Last_Name_Text__c == '' )){
                            system.debug('Enrty Condition');
                            system.debug('CitizenMap.get(Subapp).Id::'+CitizenMap.get(Subapp).Id);
                            //Subapp.addError('Please Enter First Name and Last Name');
                            ErrorRec.put(CitizenMap.get(Subapp).Id,'Please Enter First Name and Last Name');   
                        }  
                    }
                    else{
                        ErrorRec.put(CitizenMap.get(Subapp).Id,'Citizen Id is not correct');   
                    }
                }
                
            }
            system.debug('ErrorRec:: '+ErrorRec);
            if(ErrorRec != null && ErrorRec.size() > 0)
            {
                for(Sub_Applicant__c Sub: CitizenMap.values()){
                    If(ErrorRec.containsKey(Sub.Id)){
                        Sub.addError(ErrorRec.get(Sub.Id));
                    }
                }
                
            }
        }
    }
}