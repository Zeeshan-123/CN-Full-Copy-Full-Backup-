/**********************************
@author: Shams
@date: 3/30/2021
@purpose: For setting the PIN on student records
***********************************/
global class SetStudentPINBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        //CNHPHOMS-69: SL Jonathan Munguia: Oldest_Child_DOB__c added to the query.
        String Query;
        if(test.isRunningTest())  
            Query='select id,Youngest_Child_DOB__c,PIN_Child__c, Oldest_Child_DOB__c from Case where recordtype.developername=\'EBT_Request\' limit 20';
        else
            Query='select id,Youngest_Child_DOB__c,PIN_Child__c, Oldest_Child_DOB__c from Case where recordtype.developername=\'EBT_Request\'';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context)
    {
        Database.executeBatch(this);
    }   
    
    global void execute(Database.BatchableContext BC, List<Case> EBTRequests) {
		//Create EBT Request map
        Map<id,Case> EBTreqMap=new Map<id,Case>();
        for(Case EBTreq:EBTRequests){
            EBTreqMap.put(EBTreq.id, EBTreq);
        }
        //Get all students against the EBT requests
        List<AccountCaseJunction__c> Students=[select id,Date_of_Birth__c,Request__c,name from AccountCaseJunction__c where Request__c=:EBTRequests];
        //Iterate through all student records
        for(AccountCaseJunction__c Student:Students){
            Case Req=EBTreqMap.get(Student.Request__c);
            //set the DOB
            /*if(Req.Youngest_Child_DOB__c==null || Req.Youngest_Child_DOB__c==Student.Date_of_Birth__c)
            {
                Req.Youngest_Child_DOB__c=Student.Date_of_Birth__c;
                Req.PIN_Child__c=Student.Name;
            }
            else if(Req.Youngest_Child_DOB__c<Student.Date_of_Birth__c)
            {
                Req.Youngest_Child_DOB__c=Student.Date_of_Birth__c;
                Req.PIN_Child__c=Student.Name;
            }*/

            //CNHPHOMS-69: SL Jonathan Munguia: mapping Oldest_Child_DOB__c.
            if(Req.Oldest_Child_DOB__c==null || Req.Oldest_Child_DOB__c==Student.Date_of_Birth__c)
            {
              Req.PIN_Child__c=Student.Name;
              Req.Oldest_Child_DOB__c = Student.Date_of_Birth__c;
            }
            else if(Req.Oldest_Child_DOB__c > Student.Date_of_Birth__c){
              Req.PIN_Child__c=Student.Name;
              Req.Oldest_Child_DOB__c = Student.Date_of_Birth__c;
            }

            
            //update the map
            if(EBTreqMap.get(Req.id)!=null)
            	EBTreqMap.remove(Req.id);
            EBTreqMap.put(Req.id,Req);
        }
        //update 
        database.update(EBTreqMap.values(),false);
    }
    global void finish(Database.BatchableContext BC) {
        //database.executeBatch(new SetStudentPINBatch());
    }
}