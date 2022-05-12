/**********************************
@author: Shams
@date: 1/18/2021
@purpose:  TriggerHandler for translating the Site Code to Site Name
***********************************/

public class CernerQueueTriggerHandler{
    public void HandleBeforeInsert(List<Cerner_Queue__c> CQlist){
        list<String> CQMRNList = new list<String>();
        Map<String, DateTime> CQMRNMap = new Map<String, DateTime>();
        list<String> FirstMiddleLastNameDobMatchCriterionList = new list<String>();
        list<String> FirstLastNameDobMatchCriterionList = new list<String>();
        list<String> PhoneDobMatchCriterionList = new list<String>();
        Map<String, String> AccountMRNCriterionMap = new Map<String, String>();
        Map<String, String> AccountMRNAndTestDateCriterionMap = new Map<String, String>();
        Map<String, String> AccDupeGreater91 = new Map<String, String>();
        Map<String, String> AccDupeBetween11_91 = new Map<String, String>();
        Map<String, String> AccDupeLower11 = new Map<String, String>();
        Set<String> AccountNameDobCriterionSet = new Set<String>();
        Set<String> AccountPhoneDobCriterionSet = new Set<String>();
        String emailRegex = '[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,4}[.]{0,1}[a-zA-Z]{0,2}';
        Pattern correctPattern = Pattern.compile(emailRegex);
        
        Map<String,Test_Site_Translation__c> TSTmap=new Map<String,Test_Site_Translation__c>();
        //Get Translation Data
        List<Test_Site_Translation__c> TSTlist=[SELECT Name,Test_Site_Code__c,Test_Site_Type__c FROM Test_Site_Translation__c];
        
        for(Test_Site_Translation__c TST:TSTlist){
            TSTmap.put(TST.Test_Site_Code__c.toLowercase(), TST);
        }
        
        for(Cerner_Queue__c CQ:CQlist){
            CQMRNList.add(CQ.MRN__c);
            CQMRNMap.put(CQ.MRN__c,CQ.Applies_Date_Time__c);
            FirstMiddleLastNameDobMatchCriterionList.add(CQ.FirstMiddleLastNameDobMatchCriterion__c); // dob + FN + MN + LN
            FirstLastNameDobMatchCriterionList.add(CQ.FirstLastNameDobMatchCriterion__c); // dob + FN +LN
            PhoneDobMatchCriterionList.add(CQ.PhoneDobMatchCriterion__c); //Phone + dob
            
            //Set translated values
            if(CQ.Test_Site_1st__c!=null){
                if(TSTmap.get(CQ.Test_Site_1st__c.toLowercase())!=null){
                    Test_Site_Translation__c TST=TSTmap.get(CQ.Test_Site_1st__c.toLowercase());
                    CQ.Test_Site_Name__c=TST.Name;
                    CQ.Test_Site_Type_1st__c=TST.Test_Site_Type__c;
                }
            }
            // Set Email Pattern Flags
            if(CQ.Email__c != null ){
                Matcher emailMatcher = correctPattern.matcher(CQ.Email__c);    
                if (emailMatcher.matches())
                    CQ.Email_Pattern_Format__c = 'Correct';
                else
                    CQ.Email_Pattern_Format__c = 'Incorrect';
            }
        }
        
        //query accounts to find duplicate based on MRN and active test date greater or equal to 91days
        List<Account> MRNAndTestDateDupsAccountList=[SELECT id, MRN__c, NameDobMatchCriterion__c, PhoneDobMatchCriterion__c,Initial_test_date__c FROM ACCOUNT 
                                                     WHERE  recordtype.developername='ERM_Patient' AND MRN__c IN: CQMRNList and Initial_test_date__c != null];
        //query accounts to find duplicate against the criterions
        List<Account> AListforDups=[SELECT id, MRN__c, NameDobMatchCriterion__c, PhoneDobMatchCriterion__c,Initial_test_date__c FROM ACCOUNT 
                                    WHERE  recordtype.developername='ERM_Patient' AND ((MRN__c IN: CQMRNList) OR 
                                                                                       (NameDobMatchCriterion__c IN: FirstMiddleLastNameDobMatchCriterionList OR NameDobMatchCriterion__c IN: FirstLastNameDobMatchCriterionList) OR
                                                                                       (PhoneDobMatchCriterion__c IN: PhoneDobMatchCriterionList )) ];
        
        for(Account acc : AListforDups){
            AccountMRNCriterionMap.put(acc.MRN__c, acc.MRN__c);
            AccountNameDobCriterionSet.add(acc.NameDobMatchCriterion__c);
            AccountPhoneDobCriterionSet.add(acc.PhoneDobMatchCriterion__c);
            system.debug('AccountMRNCriterionMap:: '+AccountMRNCriterionMap);
            system.debug('AccountNameDobCriterionSet:: '+AccountNameDobCriterionSet);
            system.debug('AccountPhoneDobCriterionSet:: '+AccountPhoneDobCriterionSet);
        }
        for(Account acc : MRNAndTestDateDupsAccountList){
            DateTime Applies_DateTime = CQMRNMap.get(acc.MRN__c);
            Date Applies_Date = date.newinstance(Applies_DateTime.year(), Applies_DateTime.month(), Applies_DateTime.day());
            Integer dt1 =(Date.valueOf(acc.Initial_test_date__c)).daysBetween(Applies_Date);
            dt1 = dt1+1;
            system.debug('Initial_test_date__c:: '+acc.Initial_test_date__c);
            system.debug('dt1:: '+dt1);
            
            if(AccountMRNCriterionMap.containsKey(acc.MRN__c)){
                if(dt1 > 10 && dt1 < 91){
                    AccDupeBetween11_91.put(acc.MRN__c, acc.id);    
                }
                if(dt1 < 11){
                    AccDupeLower11.put(acc.MRN__c, acc.id);
                }
                
            }
            if(dt1 > 90){
                AccDupeGreater91.put(acc.MRN__c, acc.id);     
            }    
            
            
        }
        // mark Delete CQR flag true on those Cerner Queue records who has no duplicate in ERM Accounts based on above criterions
        for(Cerner_Queue__c CQ : CQList){
            
            if((AccountMRNCriterionMap.size() > 0 && AccountMRNCriterionMap.get(CQ.MRN__c) != null) || 
               (AccountNameDobCriterionSet != null && AccountNameDobCriterionSet.size() > 0 && (AccountNameDobCriterionSet.contains(CQ.FirstMiddleLastNameDobMatchCriterion__c) || AccountNameDobCriterionSet.contains(CQ.FirstLastNameDobMatchCriterion__c)))
               || (AccountPhoneDobCriterionSet != null && AccountPhoneDobCriterionSet.size() > 0 && AccountPhoneDobCriterionSet.contains(CQ.PhoneDobMatchCriterion__c))){
                   //if duplicate exist
                   system.debug('duplicate exist');
                   CQ.Delete_CQR__c= false;
                   //If MRN match found and active test date is greater/equal then 90days then
                   if(AccDupeGreater91.size() > 0 && AccDupeGreater91.containsKey(CQ.MRN__c)){
                       CQ.System_greater91__c=true;
                       CQ.Account__c = AccDupeGreater91.get(CQ.MRN__c);
                       CQ.Delete_CQR__c= true;
                   }
                   if(AccDupeBetween11_91.size() > 0 && AccDupeBetween11_91.containsKey(CQ.MRN__c)){
                       CQ.System_Between11_91__c=true; 
                       CQ.Account__c = AccDupeBetween11_91.get(CQ.MRN__c);
                       CQ.Delete_CQR__c= false;
                   }
                   if(AccDupeLower11.size() > 0 && AccDupeLower11.containsKey(CQ.MRN__c)){
                       CQ.System_between0_10__c= true;
                       CQ.Account__c = AccDupeLower11.get(CQ.MRN__c);
                       CQ.Delete_CQR__c= true;
                   }
               }
            else{
                 system.debug('no duplicate exist');
                CQ.Delete_CQR__c= true;
            }
            
        }
    }
    
    public void HandleBeforeUpdate(List<Cerner_Queue__c> CQlist){
        String emailRegex = '[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\\.[a-zA-Z]{2,4}[.]{0,1}[a-zA-Z]{0,2}';
        Pattern correctPattern = Pattern.compile(emailRegex);
        
        //check email pattern
        for(Cerner_Queue__c CQ:CQlist){
            
            system.debug('CQ.System_Num_Days__c:: '+CQ.System_Num_Days__c);
            // Integer dt1=CQ.System_Num_Days__c;
            if(CQ.System_Num_Days__c > 10 && CQ.System_Num_Days__c < 91){
                CQ.System_Between11_91__c=true;
                CQ.System_greater91__c=false; 
                CQ.System_between0_10__c= false;
                
                
            }
            if(CQ.System_Num_Days__c < 11){
                CQ.System_between0_10__c= true;
                CQ.System_Between11_91__c=false;
                CQ.System_greater91__c=false; 
               
                
            }
            if(CQ.System_Num_Days__c > 90){
                CQ.System_greater91__c=true; 
                CQ.System_Between11_91__c=false;
                CQ.System_between0_10__c= false;
               
                
            }    
            
            if(CQ.Email__c != null ){
                Matcher emailMatcher = correctPattern.matcher(CQ.Email__c);    
                if (emailMatcher.matches()){
                    // empty flag field
                    CQ.Email_Pattern_Format__c = 'Correct';
                } 
                else{	 // mark flag red to ressemble empty
                    CQ.Email_Pattern_Format__c = 'Incorrect';
                }
            }
            else{
                // mark flag yellow to ressemble empty
                CQ.Email_Pattern_Format__c = '';
            }
        }
    }
    
}