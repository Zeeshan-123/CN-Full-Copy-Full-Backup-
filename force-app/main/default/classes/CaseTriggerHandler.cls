/*--------------------------------------------------------------------------
@author: Alishba
@date: March/15/2021
@purpose: Handler for CaseTrigger
---------------------------------------------------------------------------*/

public class CaseTriggerHandler

{
    bypass_validation__c bypassStatus = bypass_validation__c.getInstance();
    public void handleBeforeInsert(List<Case> cse)
    {
        //get RRR request record type id
        id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        id caseCARecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA').getRecordTypeId();
        id caseCA2RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId();
        id housingStipendRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Housing_Stipend').getRecordTypeId();
		//id emergencyAssistanceRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Emergency_Assistance').getRecordTypeId();

        List<String> Cid=new list<String>();
        list<case> RRRcases=new list<case>();
        //Clothing Assistance
        List<String> CACid=new list<String>();
        list<case> CAcases=new list<case>();
        //Clothing Assistance 2 (CA2)
        List<String> CA2Cid=new list<String>();
        list<case> CA2cases=new list<case>();
        //Housing Stipend
        List<String> housingStipendId=new list<String>();
        list<case> housingStipendCases=new list<case>();
        //Emergency Assistance
        List<String> emergencyAssistanceId=new list<String>();
        list<case> emergencyAssistanceCsaes=new list<case>();
        //get Portal Request record type id
        Id caseRegRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Portal_Request').getRecordTypeId();

        for(Case cs : cse) {
            //filter out RRR cases
            if(cs.RecordTypeId==caseRRRRecordTypeId && cs.Citizen_ID__c!=null && !cs.Add_on__c){
                Cid.add(cs.Citizen_ID__c);
                RRRcases.add(cs);
            }
            //filter out CA cases
            else if(cs.RecordTypeId==caseCARecordTypeId && cs.Citizen_ID__c!=null){
                CACid.add(cs.Citizen_ID__c);
                CAcases.add(cs);
            }
            //filter out CA2 cases
            else if(cs.RecordTypeId==caseCA2RecordTypeId && cs.Citizen_ID__c!=null){
                CA2Cid.add(cs.Citizen_ID__c);
                CA2cases.add(cs);
            }
            else if(cs.RecordTypeId==housingStipendRecordTypeId && cs.Citizen_ID__c!=null){
                housingStipendId.add(cs.Citizen_ID__c);
                housingStipendCases.add(cs);
            }
          /* else if(cs.RecordTypeId==emergencyAssistanceRecordTypeId && cs.Citizen_ID__c!=null){
                emergencyAssistanceId.add(cs.Citizen_ID__c);
                emergencyAssistanceCsaes.add(cs);
            }*/
        }
        //For RRR
        if(RRRcases.size()>0){
            //query requests and Household Members if Citizen id already exists
            List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :Cid and id not in :cse  and recordtype.developername='RRR' ];
            List<Household_Member__c> HMlist=[select id,Citizen_Id__c from Household_Member__c where Citizen_Id__c in :Cid ];
            Map<id,Account> AcMap=new Map<id,Account>([select id,PersonMailingCity,PersonMailingCountry,PersonMailingState,PersonMailingStreet,PersonMailingPostalCode,
                                                       PersonOtherCity,PersonOtherCountry,PersonOtherPostalCode,PersonOtherState,PersonOtherStreet,
                                                       Mailing_Suite__c,Physical_Suite__c from account where Tribe_Id__c=:Cid]);
            Map<String,Case> Cmap=new Map<String,Case>();
            Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
            //create maps
            for(Case C:Clist){
                Cmap.put(C.Citizen_ID__c,C);
            }
            for(Household_Member__c HM:HMlist){
                HMmap.put(HM.Citizen_Id__c,HM);
            }
            for(case c:RRRcases){
                //if already exists through error
                if(Cmap.get(c.Citizen_ID__c)!=null || HMmap.get(c.Citizen_ID__c)!=null){
                    c.addError(Label.RRR_Citizen_id_Duplicate_error);
                }
                //update address if missing
                if(String.isBlank(c.Mailing_Street__c) && AcMap.get(c.AccountId)!=null){
                    Account CitiAc=AcMap.get(c.AccountId);
                    if(CitiAc.PersonMailingStreet!=null){
                        c.Mailing_City__c=CitiAc.PersonMailingCity;
                        c.Mailing_Countries__c=CitiAc.PersonMailingCountry;
                        c.Mailing_Street__c=CitiAc.PersonMailingStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonMailingPostalCode;
                        c.Mailing_States__c=CitiAc.PersonMailingState;
                        c.mailing_suite__c=CitiAc.Mailing_Suite__c;
                    }
                    else{
                        c.Mailing_City__c=CitiAc.PersonOtherCity;
                        c.Mailing_Countries__c=CitiAc.PersonOtherCountry;
                        c.Mailing_Street__c=CitiAc.PersonOtherStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonOtherPostalCode;
                        c.Mailing_States__c=CitiAc.PersonOtherState;
                        c.mailing_suite__c=CitiAc.Physical_Suite__c;
                    }
                }
            }
        }
        //For Cothing Assistance
        if(CAcases.size()>0){
            //query requests and Household Members if Citizen id already exists
            List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :CACid and id not in :cse  and recordtype.developername='CA' ];
            Map<id,Account> AcMap=new Map<id,Account>([select id,PersonMailingCity,PersonMailingCountry,PersonMailingState,PersonMailingStreet,PersonMailingPostalCode,
                                                       PersonOtherCity,PersonOtherCountry,PersonOtherPostalCode,PersonOtherState,PersonOtherStreet,
                                                       Mailing_Suite__c,Physical_Suite__c from account where Tribe_Id__c=:CACid]);
            Map<String,Case> Cmap=new Map<String,Case>();
            Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
            //create maps
            for(Case C:Clist){
                Cmap.put(C.Citizen_ID__c,C);
            }
            for(case c:CAcases){
                //if already exists through error
                if(Cmap.get(c.Citizen_ID__c)!=null){
                    c.addError(Label.RRR_Citizen_id_Duplicate_error);
                }
                //update address if missing
                if(String.isBlank(c.Mailing_Street__c) && AcMap.get(c.AccountId)!=null){
                    Account CitiAc=AcMap.get(c.AccountId);
                    if(CitiAc.PersonMailingStreet!=null){
                        c.Mailing_City__c=CitiAc.PersonMailingCity;
                        c.Mailing_Countries__c=CitiAc.PersonMailingCountry;
                        c.Mailing_Street__c=CitiAc.PersonMailingStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonMailingPostalCode;
                        c.Mailing_States__c=CitiAc.PersonMailingState;
                        c.mailing_suite__c=CitiAc.Mailing_Suite__c;
                    }
                    else{
                        c.Mailing_City__c=CitiAc.PersonOtherCity;
                        c.Mailing_Countries__c=CitiAc.PersonOtherCountry;
                        c.Mailing_Street__c=CitiAc.PersonOtherStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonOtherPostalCode;
                        c.Mailing_States__c=CitiAc.PersonOtherState;
                        c.mailing_suite__c=CitiAc.Physical_Suite__c;
                    }
                }
            }
        }
        
        //For Cothing Assistance 2
        if(CA2cases.size()>0){
            //query requests and Household Members if Citizen id already exists
            List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :CA2Cid and id not in :cse  and recordtype.developername='CA2' ];
            Map<id,Account> AcMap=new Map<id,Account>([select id,PersonMailingCity,PersonMailingCountry,PersonMailingState,PersonMailingStreet,PersonMailingPostalCode,
                                                       PersonOtherCity,PersonOtherCountry,PersonOtherPostalCode,PersonOtherState,PersonOtherStreet,
                                                       Mailing_Suite__c,Physical_Suite__c from account where Tribe_Id__c=:CA2Cid]);
            Map<String,Case> Cmap=new Map<String,Case>();
            //Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
            //create maps
            for(Case C:Clist){
                Cmap.put(C.Citizen_ID__c,C);
            }
            for(case c:CA2cases){
                //if already exists through error
                if(Cmap.get(c.Citizen_ID__c)!=null){
                    c.addError(Label.RRR_Citizen_id_Duplicate_error);
                }
                //update address if missing
                if(String.isBlank(c.Mailing_Street__c) && AcMap.get(c.AccountId)!=null){
                    Account CitiAc=AcMap.get(c.AccountId);
                    if(CitiAc.PersonMailingStreet!=null && CitiAc.PersonMailingStreet != 'BAD ADDRESS'){
                        c.Mailing_City__c=CitiAc.PersonMailingCity;
                        c.Mailing_Countries__c=CitiAc.PersonMailingCountry;
                        c.Mailing_Street__c=CitiAc.PersonMailingStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonMailingPostalCode;
                        c.Mailing_States__c=CitiAc.PersonMailingState;
                        c.mailing_suite__c=CitiAc.Mailing_Suite__c;
                    }
                    if(CitiAc.PersonOtherStreet!=null && CitiAc.PersonOtherStreet != 'BAD ADDRESS'){
                        c.Physical_City__c=CitiAc.PersonOtherCity;
                        c.Physical_Countries__c=CitiAc.PersonOtherCountry;
                        c.Physical_Street__c=CitiAc.PersonOtherStreet;
                        c.Physical_ZipPostal_Code__c=CitiAc.PersonOtherPostalCode;
                        c.Physical_States__c=CitiAc.PersonOtherState;
                        c.Physical_Suite__c=CitiAc.Physical_Suite__c;
                    }
                }
            }
        }
        //For Housing Stipend Cases
        if(housingStipendCases.size()>0){
            //query requests and Household Members if Citizen id already exists
            List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :housingStipendId and id not in :cse  and recordtype.developername='Housing_Stipend' and Request_Reason__c excludes ('FA21 College Housing Assistance') ];
            Map<id,Account> AcMap=new Map<id,Account>([select id,PersonMailingCity,PersonMailingCountry,PersonMailingState,PersonMailingStreet,PersonMailingPostalCode,
                                                       PersonOtherCity,PersonOtherCountry,PersonOtherPostalCode,PersonOtherState,PersonOtherStreet,
                                                       Mailing_Suite__c,Physical_Suite__c from account where Tribe_Id__c=:housingStipendId]);
            Map<String,Case> Cmap=new Map<String,Case>();
            //create maps
            for(Case C:Clist){
                Cmap.put(C.Citizen_ID__c,C);
            }
            for(case c:housingStipendCases){
                //if already exists through error
                if(Cmap.get(c.Citizen_ID__c)!=null){
                    c.addError(Label.RRR_Citizen_id_Duplicate_error);
                }
                //update address if missing
                if(String.isBlank(c.Mailing_Street__c) && AcMap.get(c.AccountId)!=null){
                    Account CitiAc=AcMap.get(c.AccountId);
                    if(CitiAc.PersonMailingStreet!=null && CitiAc.PersonMailingStreet != 'BAD ADDRESS'){
                        c.Mailing_City__c=CitiAc.PersonMailingCity;
                        c.Mailing_Countries__c=CitiAc.PersonMailingCountry;
                        c.Mailing_Street__c=CitiAc.PersonMailingStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonMailingPostalCode;
                        c.Mailing_States__c=CitiAc.PersonMailingState;
                        c.mailing_suite__c=CitiAc.Mailing_Suite__c;
                    }
                    if(CitiAc.PersonOtherStreet!=null && CitiAc.PersonOtherStreet != 'BAD ADDRESS'){
                        c.Physical_City__c=CitiAc.PersonOtherCity;
                        c.Physical_Countries__c=CitiAc.PersonOtherCountry;
                        c.Physical_Street__c=CitiAc.PersonOtherStreet;
                        c.Physical_ZipPostal_Code__c=CitiAc.PersonOtherPostalCode;
                        c.Physical_States__c=CitiAc.PersonOtherState;
                        c.Physical_Suite__c=CitiAc.Physical_Suite__c;
                    }
                }
            }
        }
        //For Emergency Assistance
      /*  if(emergencyAssistanceCsaes.size()>0){
            system.debug('Run EA');

            //query requests and Household Members if Citizen id already exists
            List<Household_Member__c> HMlist=[select id,Citizen_Id__c from Household_Member__c where Citizen_Id__c in :emergencyAssistanceId ];
            Map<id,Account> AcMap=new Map<id,Account>([select id,PersonMailingCity,PersonMailingCountry,PersonMailingState,PersonMailingStreet,PersonMailingPostalCode,
                                                       PersonOtherCity,PersonOtherCountry,PersonOtherPostalCode,PersonOtherState,PersonOtherStreet,
                                                       Mailing_Suite__c,Physical_Suite__c from account where Tribe_Id__c=:emergencyAssistanceId]);
            Map<String,Case> Cmap=new Map<String,Case>();
            Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
            //create maps
           
            for(Household_Member__c HM:HMlist){
                HMmap.put(HM.Citizen_Id__c,HM);
            }
            for(case c:emergencyAssistanceCsaes){
				system.debug('Update address');
                system.debug(c.Mailing_Street__c); 
                system.debug(AcMap.get(c.AccountId));
                //update address if missing
                if(String.isBlank(c.Mailing_Street__c) && AcMap.get(c.AccountId)!=null){
                    system.debug('Update mailing');
                    Account CitiAc=AcMap.get(c.AccountId);
                    system.debug(CitiAc);
                    system.debug(CitiAc.PersonMailingStreet);
                    system.debug(CitiAc.PersonOtherStreet);
                    if(CitiAc.PersonMailingStreet!=null && CitiAc.PersonMailingStreet != 'BAD ADDRESS'){
                        c.Mailing_City__c=CitiAc.PersonMailingCity;
                        c.Mailing_Countries__c=CitiAc.PersonMailingCountry;
                        c.Mailing_Street__c=CitiAc.PersonMailingStreet;
                        c.Mailing_ZipPostal_Code__c=CitiAc.PersonMailingPostalCode;
                        c.Mailing_States__c=CitiAc.PersonMailingState;
                        c.mailing_suite__c=CitiAc.Mailing_Suite__c;
                    }
                    if(CitiAc.PersonOtherStreet!=null && CitiAc.PersonOtherStreet != 'BAD ADDRESS'){
                        system.debug('Update physical');
                        c.Physical_City__c=CitiAc.PersonOtherCity;
                        c.Physical_Countries__c=CitiAc.PersonOtherCountry;
                        c.Physical_Street__c=CitiAc.PersonOtherStreet;
                        c.Physical_ZipPostal_Code__c=CitiAc.PersonOtherPostalCode;
                        c.Physical_States__c=CitiAc.PersonOtherState;
                        c.Physical_Suite__c=CitiAc.Physical_Suite__c;
                    }
                }
            }
        }*/
    }
    public void handleAfterInsert(List<Case> cse)
    {
        //for RRR
        list<case> RRRcases=new list<case>();
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        //filter out RRR requests
        for(case c:cse){
            if(c.RecordTypeId==caseRRRRecordTypeId && !c.Add_on__c){
                RRRcases.add(c);
            }
        }
        if(RRRcases.size()>0){
            list<Household_Member__c> HMtoinsert=new List<Household_Member__c>();
            for(case c:RRRcases){
                //create primary HH member records
                Household_Member__c HM=new Household_Member__c();
                HM.AccountId__c=c.AccountId;
                HM.Request__c=c.id;
                HM.Bypass__c=true;
                HM.Citizen_Id__c=c.Citizen_ID__c;
                HM.Date_of_Birth__c=c.Account_DOB__c;
                HM.First_Name__c=c.Account_First_Name__c;
                HM.Last_Name__c=c.Primary_Contact_Last_Name__c;
                HMtoinsert.add(HM);
            }
            //Insert Primary HH member records
            if(HMtoinsert.size()>0)
              insert HMtoinsert;
        }
    }
    public void handleBeforeUpdate(List<Case> cse,Map<id,Case> oldCse)
    {
        //For CA2 status change
        //get user logged id
	/*	String userId = UserInfo.getUserId();
        Id ca2RecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('CA2').getRecordTypeId(); 
        User userDetails =[SELECT Id, Name, Email, Profile.Name, UserRole.Name FROM User where Id=:userId ];
        for(Case cs : cse){
            if(oldCse.get(cs.id).Status != cs.Status){
                if(cs.RecordTypeId == ca2RecordTypeId && userDetails.Profile.Name == 'RRR Team Member'){
                    if((oldCse.get(cs.id).Status == 'Ineligible - Out of Jurisdiction' || oldCse.get(cs.id).Status == 'Ineligible - Income Requirements')
                        && cs.Status != null){
                       cs.Status.addError('The status field cannot be updated.');
                    } 
                    if(oldCse.get(cs.id).Status != null && cs.Status == 'Ineligible - Income Requirements'){
                       cs.Status.addError('The status field cannot be updated.');
                    } 
                    
                }
            }
        }  */
       
        
        //For RRR 
        system.debug('Bypass Status: ' + bypassStatus.Bypass__c);
        list<case> RRRcases=new list<case>();
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        
        //For Hunt Draw 
        list<case> HuntCases=new list<case>();
        Id caseHuntReqRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
        
        //filter out requests
        for(case c:cse){
          // RRR  Requests
            if(c.RecordTypeId == caseRRRRecordTypeId){
                RRRcases.add(c);
            }
            
             // Hunt  Requests
            if(c.RecordTypeId == caseHuntReqRecordTypeId) {
                HuntCases.add(c);
            }
        }
        if(RRRcases.size()>0){
            List<US_States__c> USS = US_States__c.getall().values();
            Map<string,String> statesmap=new Map<String,String>();
            Map<id,boolean> nameNotupdated=new Map<id,boolean>();
            List<String> Cid=new list<String>();
            List<id> Reqid=new list<id>();
            //create state map
            for(US_States__c state:USS){
                statesmap.put(state.ISO_Code__c,state.name);
            }
            //create citizen id map
            for(case c:RRRcases){
                if(c.Citizen_ID__c!=null){
                    Cid.add(c.Citizen_ID__c);
                    Reqid.add(c.id);
                }
            }
            //query requests and Household Members if Citizen id already exists
            List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :Cid and id not in :RRRcases and recordtype.developername='RRR'];
            List<Household_Member__c> HMlist=[select id,Citizen_Id__c from Household_Member__c where Citizen_Id__c in :Cid and bypass__c=false ];
            List<Household_Member__c> AllpendingHMlist=[select id,request__c from Household_Member__c where request__c in :Reqid and status__c='NAME CORRECTION REQUIRED'];// and bypass__c=false  ];
            Map<String,Case> Cmap=new Map<String,Case>();
            Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
            //create maps
            for(Case C:Clist){
                Cmap.put(C.Citizen_ID__c,C);
            }
            for(Household_Member__c HM:HMlist){
                HMmap.put(HM.Citizen_Id__c,HM);
            }
            for(Household_Member__c HM:AllpendingHMlist){
                if(nameNotupdated.get(HM.Request__c)==null){
                    nameNotupdated.put(HM.Request__c,true);
                }
            }
            for(case c:RRRcases){
                //Capture Melissa address update dates
                if(c.Address_Update_Date__c==null && c.Mailing_Street__c!=null)
                    c.Address_Update_Date__c=system.now();
                else if(c.Mailing_Street__c==null)
                    c.Address_Update_Date__c=null;
                //if already exists through error
                if(!bypassStatus.bypass__c && (Cmap.get(c.Citizen_ID__c)!=null || HMmap.get(c.Citizen_ID__c)!=null) && !c.Add_on__c ){
                    c.addError(Label.RRR_Citizen_id_Duplicate_error);
                    System.debug('Error on existing record!');
                }
                //Set State 
                Case oldc=oldCse.get(c.id);
                if(c.Mailing_State__c!=oldc.Mailing_State__c){
                    if(statesmap.get(c.Mailing_State__c)!=null)
                      {c.Mailing_States__c=statesmap.get(c.Mailing_State__c);}
                }
                if(c.Status!=oldc.Status && oldc.Status=='NAME CORRECTION REQUIRED' && c.Status=='In Progress'){
                    c.Name_Fixed__c=true;
                    if(nameNotupdated.get(c.id)!=null){
                        c.addError(Label.Community_RRR_Name_Not_fixed);
                    }
                }
                if(c.Status!=oldc.Status && oldc.Status=='ADDRESS CORRECTION REQUIRED' && c.Status=='In Progress'){
                    c.Address_Fixed__c=true;
                }
            }
        }

        //for hunt applications
        if( HuntCases.size() > 0 ) {
            for(case cs : HuntCases) {
                //make to multi-select picklist(Hunt_Category__c and Hunt_Events__c) dependent
                if(cs.Hunt_Category__c != null) {
                    // for Youth               
                    if (cs.Hunt_Category__c.contains('Youth') ){
                        if( !cs.Hunt_Events__c.contains('Youth'))
                            cs.addError('Youth event missing.');
                    }
                    
                    if (cs.Hunt_Events__c.contains('Youth') ) {
                        if( !cs.Hunt_Category__c.contains('Youth'))
                            cs.addError('Youth category missing.');
                    }
                    
                    // for At Large
                    if (cs.Hunt_Category__c.contains('At Large') ) {
                        if( !cs.Hunt_Events__c.contains('At-Large') )
                            cs.addError('At Large event missing.');
                    }
                    
                    if (cs.Hunt_Events__c.contains('At-Large') )  {
                        if( !cs.Hunt_Category__c.contains('At Large'))
                            cs.addError('At Large category missing.');
                    }
                    
                    // for Veteran
                    if (cs.Hunt_Category__c.contains('Veteran') )  {
                        if( !cs.Hunt_Events__c.contains('Veteran') )
                            cs.addError('Veteran event missing.');
                    }
                    
                    if (cs.Hunt_Events__c.contains('Veteran') ) {
                        if( !cs.Hunt_Category__c.contains('Veteran'))
                            cs.addError('Veteran category missing.');
                    }
                    
                    //for Elder
                    if (cs.Hunt_Category__c.contains('Elder') ){
                        if( !cs.Hunt_Events__c.contains('Elder') )
                            cs.addError('Elder event missing.');
                    }
                    
                    if (cs.Hunt_Events__c.contains('Elder') ) {
                        if( !cs.Hunt_Category__c.contains('Elder'))
                            cs.addError('Elder category missing.');
                    }
                }
            }
        }
    }
    
    public void handleAfterUpdate(List<Case> cse,Map<id,Case> oldCse)
    {
        //for RRR
        list<case> RRRcases=new list<case>();
        Id caseRRRRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('RRR').getRecordTypeId();
        //filter out RRR requests
        for(case c:cse){
            if(c.RecordTypeId==caseRRRRecordTypeId && !c.Add_on__c){
                RRRcases.add(c);
            }
        }
        if(RRRcases.size()>0){
            Map<id,Household_Member__c> GMmap=new map<id,Household_Member__c>();
            list<Household_Member__c> HMtoUpdate=new List<Household_Member__c>();
            //query RRR primary household members
            list<Household_Member__c> HMlist=[select id,First_Name__c,status__c,Request__c,last_name__c from Household_Member__c where bypass__c=true and request__c=:RRRcases];
            for(Household_Member__c HM:HMlist){
                GMmap.put(HM.Request__c,HM);
            }
            for(case c:RRRcases){
                //get old values of RRR case 
                Case oldc=oldCse.get(c.id);
                //fetch primary HH member record
                Household_Member__c PrimaryHM=GMmap.get(c.id);
                //check if last name was updated
                //system.debug(c.Primary_Contact_Last_Name__c+':equals:'+oldc.Primary_Contact_Last_Name__c+'='+c.Primary_Contact_Last_Name__c.equals(oldc.Primary_Contact_Last_Name__c));
                try{
                    if(!c.Primary_Contact_Last_Name__c.equals(PrimaryHM.Last_Name__c) || !c.Primary_Contact_First_Name__c.equals(PrimaryHM.First_Name__c)){
                        PrimaryHM.Last_Name__c=c.Primary_Contact_Last_Name__c;
                        PrimaryHM.First_Name__c=c.Primary_Contact_First_Name__c;
                        HMtoUpdate.add(PrimaryHM);
                    } 
                }catch(Exception e){
                    if(c.Primary_Contact_Last_Name__c!=PrimaryHM.Last_Name__c || c.Primary_Contact_First_Name__c!=PrimaryHM.First_Name__c){
                        PrimaryHM.Last_Name__c=c.Primary_Contact_Last_Name__c;
                        PrimaryHM.First_Name__c=c.Primary_Contact_First_Name__c;
                        HMtoUpdate.add(PrimaryHM);
                    } 
                }/*
                if(oldc.Primary_Contact_Last_Name__c!=null && c.Primary_Contact_Last_Name__c!=null && PrimaryHM.Last_Name__c!=null){
                    if((!c.Primary_Contact_Last_Name__c.equals(oldc.Primary_Contact_Last_Name__c))&& PrimaryHM!=null){
                        if(!PrimaryHM.Last_Name__c.equals(c.Primary_Contact_Last_Name__c)){// || PrimaryHM.Status__c!=c.Status){
                            PrimaryHM.Last_Name__c=c.Primary_Contact_Last_Name__c;
                            HMtoUpdate.add(PrimaryHM);
                        }
                    }
                }
                if(oldc.Primary_Contact_First_Name__c!=null && c.Primary_Contact_First_Name__c!=null && PrimaryHM.First_Name__c!=null){
                    if((!c.Primary_Contact_First_Name__c.equals(oldc.Primary_Contact_First_Name__c)) && PrimaryHM!=null){
                        if(!PrimaryHM.First_Name__c.equals(c.Primary_Contact_First_Name__c)){// || PrimaryHM.Status__c!=c.Status){
                            PrimaryHM.First_Name__c=c.Primary_Contact_First_Name__c;
                            HMtoUpdate.add(PrimaryHM);
                        }
                    }
                }*/
            }
            //update HH member records
            if(HMtoUpdate.size()>0)
              update HMtoUpdate;
        }
    }
}