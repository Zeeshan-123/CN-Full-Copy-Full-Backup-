/**********************************
@author: Shams
@date: 21/08/2020
@purpose: TestDataFactory
***********************************/

@isTest
public class TestDataFactory {
    public static Account createTestPersonAccountRecords(String Name,id rt) {
        list<Account_Case_ID__c> ACIlist=[select id,Latest_Case_ID__c from Account_Case_ID__c limit 1];
        if(ACIlist.size()==0)
        {
            Account_Case_ID__c ACI=new Account_Case_ID__c();
            ACI.Latest_Case_ID__c='25000';
            insert ACI;
        }
        List<Account> accts = new List<Account>();
            Account a = new Account();
            a.LastName=Name;
        	a.Case_Status__c='Active';
            a.RecordTypeId = rt;
        	a.HealthCloudGA__Testing_Status__pc='Exposed - Symptomatic';
        	a.When_do_you_think_you_were_exposed__c=system.today();
        	//a.HealthCloudGA__Testing_Status__pc='Exposed';
        insert a;
        return a;
    }
    public static Task createTestTask(Account AC) {
        //Initialize Task object
        Task t=new Task();
        //Get Contact Tracing Record type id for task dynamically
        Id recordTypeId = Schema.SObjectType.Task.getRecordTypeInfosByDeveloperName().get('Contact_Tracing').getRecordTypeId();
        t.RecordTypeId=recordTypeId;
        //Set Owner, Subject, STatus, Assigned to and Due date
        t.OwnerId=UserInfo.getUserId();
        t.Subject='Test'; 
        t.Status='Not Started';
        t.WhatId=AC.id;
        t.ActivityDate=system.today();
        t.Send_Survey_Invite__c=true;
        //Return the Task to be added to the list
        insert t;
        return t;
    }
    
    // creates cerner queue record
    public static Cerner_Queue__c createCQ(String firstName , String middleName, String lastName ,String email ,String mrn ,Date dob, String phone )
    {
       Cerner_Queue__c CQ = new Cerner_Queue__c();
       CQ.First_Name__c=firstName;
       CQ.Middle_Name__c=middleName;
       CQ.Last_Name__c=lastName;
       CQ.Street__c='123 W Main';
       CQ.City__c='Tahlequah';
       CQ.State__c='OK';
       CQ.Postal_Code__c='74464';
       CQ.Country__c='US';
       CQ.MRN__c=mrn;
       CQ.Date_of_Birth__c=dob;
       CQ.Phone__c=phone;
       CQ.Mobile_Phone__c=phone;
       CQ.Email__c=email;
       
       insert CQ;
       return CQ;
    }
    // create community user
    public static User createUser(String firstName,String lastName,String email,String accountID)
    {
        CNPortal_UserName_PostFix__mdt userPostFix=[SELECT MasterLabel FROM CNPortal_UserName_PostFix__mdt 
                                                        WHERE DeveloperName = 'CNPortal_UserName_PostFix'];
        String userNameWithPostfix =email+userPostFix.MasterLabel;
        
        Profile profileID = [SELECT Id, Name FROM Profile WHERE Name= 'CN Customer Community Plus Login User'];
        List<Contact> lstContact = [SELECT Id FROM contact WHERE  accountId   =:  accountID];
        Contact con = lstContact[0];
        
	 	User u = new User();
        u.LastName = lastName;
        u.FirstName = firstName;
        u.Email = email;
   		u.Alias = lastName+'00';
        u.Username = userNameWithPostfix;
        u.CommunityNickname =firstName + ' '+ lastName;
        u.ContactId = con.Id;
        u.LocaleSidKey = 'en_US';
        u.TimeZoneSidKey = 'America/Chicago';
        u.IsActive = true;
        u.ProfileID = profileID.id; // CN Customer Community Plus Login User Profile id
        u.LanguageLocaleKey = 'en_US';
        u.EmailEncodingKey = 'UTF-8';    
                 
		insert u;
        return u;
   }
}