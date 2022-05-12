/*================================================================
@author: Alishba
@date: Sept/09/2021
@purpose: update email address on related account of community user
==================================================================*/
global class UpdateCommunityUserAccountBatch implements Database.Batchable<sObject>
{
   
    Profile p = [SELECT Id FROM profile WHERE name='CN Customer Community Plus Login User'];
    String   profileId = p.Id;
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    { 
        if(test.isRunningTest()) 
        {
            return Database.getQueryLocator([SELECT Id, Name, Email, AccountId FROM User WHERE ProfileId =: profileId limit 200]);             
        }
        else
        {
            return Database.getQueryLocator([SELECT Id, Name, Email, AccountId FROM User 
                                             WHERE ProfileId =: profileId AND accountId != null AND
                                             isActive = true AND Account_Email_Update_Required__c = true  ]);
        }
        
    }
    
    global void execute(Database.BatchableContext BC, List<User> CNPortalUsers)
    {
        list<Account> accountsToUpdate 	= new list<Account>();
        map<Id, String> accountsMpToUpdate = new map<Id, String>();
        
        for (User usr: CNPortalUsers) 
        {
            accountsMpToUpdate.put(usr.AccountId, usr.Email);
        }
        
        if(accountsMpToUpdate.size() > 0)
        {
            for (Id accId : accountsMpToUpdate.keySet())
            {
                accountsToUpdate.add(new Account(Id = accId, PersonEmail = accountsMpToUpdate.get(accId)));
            }
            
            database.SaveResult[] myResult=database.update(accountsToUpdate,false);
        }
        
    }
    
    global void finish(Database.BatchableContext BC)
    {
        
    }
}