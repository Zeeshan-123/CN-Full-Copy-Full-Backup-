global class UpdateAccontLookUpBatch implements Database.Batchable<sObject>, Database.Stateful
 {
	
    
    global Database.QueryLocator start(Database.BatchableContext BC)
    { 
       return Database.getQueryLocator([SELECT  id, accountId, name, username from user where id = '0057e00000QxvhHAAR']);
    }
    
    global void execute(Database.BatchableContext BC, List<User> usersList)
    {
        List<User> userToUpdate = new List<User> ();
        for (User us: usersList) 
        {
           us.FirstName = 'Ben';
           us.LastName = 'R. Riddle';
           us.ContactId = '0017e00001RhCO7AAN';
           userToUpdate.add(us); 
        }
                 database.SaveResult[] myResult=database.update(userToUpdate,false);

    }
    
    global void finish(Database.BatchableContext BC)
    {
        
    }
}