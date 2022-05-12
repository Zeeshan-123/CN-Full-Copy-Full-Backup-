/**********************************
@author: Shams
@date: 12/23/2020
@purpose: Controller class for CernerQueue_DuplicateMerge
***********************************/

public class CernerQueue_DuplicateMergeController {
    @AuraEnabled
    public static list<Account> getDuplicatesCriteria1(id CQid){
        Cerner_Queue__c CQ=[select id,MRN__c,First_Name__c,Middle_Name__c,Last_Name__c,Phone__c,Date_of_Birth__c from Cerner_Queue__c where id=:CQid];
        
        //Create Strings for Dynamic queries
        String MRN=CQ.MRN__c;
        
        //Criteria 1 match MRN
        List<Account> Criteria1=[select id,Test_Date__c,PersonMobilePhone,Days_passed_after_first_test__c,PersonEmail,Updated_by_Cerner__c,Disabled__c,Case_Status__c ,Marked_for_Delete__c,name,Date_of_Birth__c,Contact_OR_Case__pc,HealthCloudGA__Testing_Status__pc,Phone,MRN__c from account 
                                 where MRN__c=:MRN and recordtype.developername='ERM_Patient' and MRN__c!=null];
        List<Account> Aret=new List<Account>();
        for(Account A:Criteria1){
                A.Marked_for_Delete__c='Yes';
            Aret.add(A);
        }
        Return Aret;
    }
    @AuraEnabled
    public static list<Account> getDuplicatesCriteria2(id CQid){
        Cerner_Queue__c CQ=[select id,MRN__c,First_Name__c,Middle_Name__c,Last_Name__c,Phone__c,Date_of_Birth__c from Cerner_Queue__c where id=:CQid];
        
        //Create Strings for Dynamic queries
        Date DOB=CQ.Date_of_Birth__c;
        String MRN=CQ.MRN__c;
        String Name,Name2;
        Name=CQ.First_Name__c;
        if(CQ.Middle_Name__c!=null)
            Name=Name+' '+CQ.Middle_Name__c;
        Name=Name+' '+CQ.Last_Name__c;
        Name2=CQ.First_Name__c;
        Name2=Name2+' '+CQ.Last_Name__c;
        //Criteria 2 match Name and DOB
        List<Account> Criteria2=[select id,Test_Date__c,PersonEmail,PersonMobilePhone,Days_passed_after_first_test__c,Updated_by_Cerner__c,Disabled__c,Case_Status__c ,Marked_for_Delete__c,name,Date_of_Birth__c,Contact_OR_Case__pc,HealthCloudGA__Testing_Status__pc,Phone,MRN__c from account 
                                 where (Name=:Name or Name=:Name2) and Date_of_Birth__c=:DOB and MRN__c!=:MRN and recordtype.developername='ERM_Patient' and Date_of_Birth__c!=null];
        List<Account> Aret=new List<Account>();
        for(Account A:Criteria2){
                A.Marked_for_Delete__c='Yes';
            Aret.add(A);
        }
        Return Aret;
    }
    @AuraEnabled
    public static list<Account> getDuplicatesCriteria3(id CQid){
        Cerner_Queue__c CQ=[select id,MRN__c,First_Name__c,Middle_Name__c,Last_Name__c,Phone_formula__c,Date_of_Birth__c from Cerner_Queue__c where id=:CQid];
        
        //Create Strings for Dynamic queries
        String Phone=CQ.Phone_formula__c;
        Date DOB=CQ.Date_of_Birth__c;
        String MRN=CQ.MRN__c;
        String Name,Name2;
        Name=CQ.First_Name__c;
        if(CQ.Middle_Name__c!=null)
            Name=Name+' '+CQ.Middle_Name__c;
        Name=Name+' '+CQ.Last_Name__c;
        Name2=CQ.First_Name__c;
        Name2=Name2+' '+CQ.Last_Name__c;
        
        //Criteria 3 match Name and Phone
        List<Account> Criteria3=[select id,Test_Date__c,Days_passed_after_first_test__c,PersonMobilePhone,PersonEmail,Updated_by_Cerner__c,Disabled__c,Case_Status__c ,name,Marked_for_Delete__c,Date_of_Birth__c,Contact_OR_Case__pc,HealthCloudGA__Testing_Status__pc,Phone,MRN__c from account 
                                 where Phone_formula__c=:Phone and Date_of_Birth__c=:DOB and MRN__c!=:MRN and recordtype.developername='ERM_Patient' and Phone!=null and  Date_of_Birth__c!=null and (Name!=:Name AND Name!=:Name2)];
        List<Account> Aret=new List<Account>();
        for(Account A:Criteria3){
                A.Marked_for_Delete__c='Yes';
            Aret.add(A);
        }
        Return Aret;
    }
    @AuraEnabled
    public static void UpdateMFD(List<Account> C1,List<Account> C2,List<Account> C3){
        //Update Marked for Delete on Accounts
        List<Account> Aup=new List<Account>();
        Map<id,String> Amap=new map<id,String>();
        for(Account A:C1)
            Amap.put(A.id, A.Marked_for_Delete__c);
        for(Account A:C2)
            Amap.put(A.id, A.Marked_for_Delete__c);
        for(Account A:C3)
            Amap.put(A.id, A.Marked_for_Delete__c);
        List<Account> Aget=[select id,Marked_for_Delete__c from Account where id=:Amap.keySet()];
        for(Account A:Aget){
            String MFD=Amap.get(A.id);
            A.Marked_for_Delete__c=MFD;
            Aup.add(A);
        }
        database.update(Aup,false);
    }
    @AuraEnabled
    public static List<Cerner_Queue__c> GetCQrecordList(Id Recordid)
    {
        //Get Cerner Queue Record
       return [SELECT Applies_Date_Time__c,Email__c,Mobile_Phone__c,Test_Site_Name__c,Test_Site_1st__c,Test_Site_Type_1st__c,City__c,Country__c,Date_of_Birth__c,First_Name__c,Gender_Code__c,Last_Name__c,Middle_Name__c,MRN__c,Name,Phone__c,Postal_Code__c,State__c,Street__c 
               FROM Cerner_Queue__c
              where id=:RecordId];
    }
    @AuraEnabled
    public static Cerner_Queue__c GetCQrecord(Id Recordid)
    {
        //Get Cerner Queue record to show in data table
       return [SELECT Applies_Date_Time__c,Email__c,Mobile_Phone__c,Test_Site_Name__c,Test_Site_1st__c,Test_Site_Type_1st__c,City__c,Country__c,Date_of_Birth__c,First_Name__c,Gender_Code__c,Last_Name__c,Middle_Name__c,MRN__c,Name,Phone__c,Postal_Code__c,State__c,Street__c 
               FROM Cerner_Queue__c
              where id=:RecordId]; 
    }
    @AuraEnabled
    public static Account GetAccountrecord(Id Recordid)
    {
        //Get selected account record
       return [SELECT Date_of_Birth__c,PersonEmail,PersonMobilePhone,Contact_OR_Case__pc,Updated_by_Cerner__c,Case_Status__c,FirstName,HealthCloudGA__Gender__pc,LastName,MRN__c,PersonMailingCity,PersonMailingCountry,PersonMailingCountryCode,PersonMailingPostalCode,PersonMailingState,PersonMailingStateCode,PersonMailingStreet,Phone 
               FROM Account
              where id=:RecordId];
    }
    @AuraEnabled
    public static id getlistview()
    {
       list<listview> lv=[SELECT Id FROM ListView WHERE Name = 'All' AND SobjectType = 'Cerner_Queue__c'];
       if(lv.size()>0)
       		return lv[0].id;
        else
            return null;
    }
    @AuraEnabled
    public static void updateAccount(Account A,Cerner_Queue__c CQ)
    {
       //Update Account, Insert EHR record, Insert Cerner Queue Archive Record, Delete Cerner Queue Record, 
       if(A.Contact_OR_Case__pc =='Contact')
           A.Case_Status__c='Active';
        system.debug('test logs');
        system.debug(A.Contact_or_Case_new__c);
        system.debug(A.Case_Status__c);
        
       //A.HealthCloudGA__Testing_Status__pc='Positive';
       update A;
       HealthCloudGA__EhrObservation__c EHR= new HealthCloudGA__EhrObservation__c();
       EHR.Account__c=a.id;
       EHR.HealthCloudGA__AppliesDateTime__c=CQ.Applies_Date_Time__c;
       EHR.Test_Site_Type_1st__c=CQ.Test_Site_Type_1st__c;
       EHR.Test_Site_1st__c=CQ.Test_Site_Name__c;
       EHR.Testing_Status__c='Positive';
       insert EHR;
       // create cerner queue record duplicate with original data
       Cerner_Queue_Archive__c CQA = new Cerner_Queue_Archive__c();
       CQA.Mapped_Account__c=a.id;
       CQA.First_Name__c=CQ.First_Name__c;
       CQA.Middle_Name__c=CQ.Middle_Name__c;
       CQA.Last_Name__c=CQ.Last_Name__c;
       CQA.Street__c=CQ.Street__c;
       CQA.City__c=CQ.City__c;
       CQA.State__c=CQ.State__c;
       CQA.Postal_Code__c=CQ.Postal_Code__c;
       CQA.Country__c=CQ.Country__c;
       CQA.MRN__c=CQ.MRN__c;
       CQA.Date_of_Birth__c=CQ.Date_of_Birth__c;
       CQA.Gender_Code__c=CQ.Gender_Code__c;
       CQA.Phone__c=CQ.Phone__c;
       CQA.Mobile_Phone__c=CQ.Mobile_Phone__c;
       CQA.Email__c=CQ.Email__c;
       CQA.Test_Site_Type_1st__c=CQ.Test_Site_Type_1st__c;
       CQA.Test_Site_1st__c=CQ.Test_Site_Name__c;
       CQA.Test_Site__c=CQ.Test_Site_1st__c;
       CQA.Applies_Date_Time__c=CQ.Applies_Date_Time__c;
       insert CQA; 
       // delete cerner record     
       delete CQ;     
    }
}