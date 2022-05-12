/**********************************
@author: Alishba
@date: 12/23/2020
@purpose: Controller class for CernerQueue_ShowDuplicateCount
***********************************/

public class CernerQueue_ShowDuplicateCountController 
{    
    // custom exception class
     public class CQ_Exception extends Exception 
     {
         
     }
    
    // shows duplication count for CQ record
      @AuraEnabled
    public static CernerQueue_DuplicateCountWrapper  geDuplicateRecCount(id CQid)
    {
        //initialize  wrapper
        CernerQueue_DuplicateCountWrapper CQWrapper = new CernerQueue_DuplicateCountWrapper();
        CQWrapper.duplicateCount=0;
        CQWrapper.listViewId='';

        //get current record fields data
        Cerner_Queue__c CQ=[select id,MRN__c,First_Name__c,Last_Name__c,Middle_Name__c,Phone_formula__c,Date_of_Birth__c from Cerner_Queue__c where id =: CQid];
        
        //save filter values in variables
      	id recTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        String MRN=CQ.MRN__c;
        Date DOB=CQ.Date_of_Birth__c;
        String Phone=CQ.Phone_formula__c;
        
        //criteria for name, first name + middle name+ last name or first name + last name
        String fullName=CQ.First_Name__c;
        String firstLastName=CQ.First_Name__c;
        if(CQ.Middle_Name__c!=null)
        {
           fullName=fullName+' '+CQ.Middle_Name__c; 
        }
        fullName=fullName+' '+CQ.Last_Name__c;
        firstLastName=firstLastName+' '+CQ.Last_Name__c;
		
        //query to find duplicated
        //criteria MRN or Dob + Name or Phone + Name
        CQWrapper.duplicateCount=[select count() from account where RecordTypeId =: recTypeId and ((MRN__c =: MRN and MRN__c != null)	   or 
                				  (Date_of_Birth__c =: DOB  and (Name =: fullName or Name =: firstLastName) and Date_of_Birth__c != null ) or 
                 				  (Phone_formula__c =: Phone  and Date_of_Birth__c =: DOB and Date_of_Birth__c != null and Phone != null )
                 )];
        
       list<listview> listViewCQ=[SELECT Id FROM ListView WHERE Name = 'All' AND SobjectType = 'Cerner_Queue__c'];
       if(listViewCQ.size()>0)
       {
           CQWrapper.listViewId=listViewCQ[0].id;
       }
       		
      
        return CQWrapper;
    }
    
    // create account , duplicate of CQ in CQA object and also delete CQ after creation account and CAQ records
        @AuraEnabled
    public static Account createAccount(  id CQid)
    {
        //get current record fields data
        Cerner_Queue__c CQ=[select id, First_Name__c, Last_Name__c, Middle_Name__c, MRN__c, Date_of_Birth__c, Gender_Code__c ,Phone__c, Mobile_Phone__c,Email__c,
                               Street__c, City__c, State__c, Postal_Code__c, Country__c,  Applies_Date_Time__c, Test_Site_Type_1st__c, Test_Site_1st__c, Test_Site_Name__c
                               from Cerner_Queue__c where id =: CQid ];
            
       list <Account> lstAccount = [SELECT Id, Name FROM Account where MRN__c =: CQ.MRN__c limit 5];
       
       //if MRN number already exist on an account
      if (lstAccount != null && lstAccount.size() > 0 )
       {
            throw new CQ_Exception(System.Label.CQ_MrnAlreadyExist);
        }
            
        else
        {
        //merging first and middle name of CQ record to save as account's first name
        String fName=CQ.First_Name__c;
        if(CQ.Middle_Name__c!=null)
        {
           fName=fName+' '+CQ.Middle_Name__c; 
        }
            
       // create account
       Account a = new Account();
       a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();// ERM Patient RecordType id
       a.firstName = fName;
       a.LastName = CQ.Last_Name__c;
       a.PersonMailingStreet=CQ.Street__c;
       a.PersonMailingCity=CQ.City__c;
       a.PersonMailingStateCode=CQ.State__c;
       a.PersonMailingPostalCode=CQ.Postal_Code__c;
       a.PersonMailingCountryCode=CQ.Country__c;
       a.MRN__c=CQ.MRN__c;
       a.Date_of_Birth__c=CQ.Date_of_Birth__c;
       a.HealthCloudGA__Gender__pc=CQ.Gender_Code__c;
       a.Phone=CQ.Phone__c;
       a.PersonMobilePhone=CQ.Mobile_Phone__c;
       a.PersonEmail=CQ.Email__c;
       a.HealthCloudGA__Testing_Status__pc='Positive';
       a.Created_by_Cerner__c=true;
        
       insert a;
        
        
       // create EHR Observation record with account id
       HealthCloudGA__EhrObservation__c EHR= new HealthCloudGA__EhrObservation__c();
       EHR.Account__c=a.id;
       EHR.HealthCloudGA__AppliesDateTime__c=CQ.Applies_Date_Time__c;
       EHR.Test_Site_Type_1st__c=CQ.Test_Site_Type_1st__c;
       EHR.Test_Site_1st__c=CQ.Test_Site_Name__c;
       EHR.Testing_Status__c='Positive';

       insert EHR;
            
       // create cerner queue archive record to duplicate cerner queue data
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
       CQA.Test_Site_1st__c=CQ.Test_Site_Name__c; // translated
       CQA.Test_Site__c=CQ.Test_Site_1st__c; //original
       CQA.Applies_Date_Time__c=CQ.Applies_Date_Time__c;
            
       insert CQA;
            
       // delete cerner record     
       delete CQ;     
            
       return a;
    
        }
 
    }
}