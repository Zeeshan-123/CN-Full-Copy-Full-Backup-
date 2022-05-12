/**********************************
@author: Shams
@date: 4/12/2021
@purpose: For finding duplicate students
***********************************/
global class FindDuplicateStudents implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC)
    {  
        //query creation
        String Query;
        Query='select id,Duplicate__c,DuplicateCriteria__c from AccountCaseJunction__c where DuplicateCriteria__c!=null';// ORDER BY createddate DESC';
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    public void execute(SchedulableContext context)
    {
        Database.executeBatch(this);
    }   
    
    global void execute(Database.BatchableContext BC, List<AccountCaseJunction__c> Students) {
        Map<id,AccountCaseJunction__c> StudentsMap=new map<id,AccountCaseJunction__c>();
        Map<String,AccountCaseJunction__c> DuplicateCriteriaMap=new map<String,AccountCaseJunction__c>();
        Map<id,AccountCaseJunction__c> StudentsUpdate=new Map<id,AccountCaseJunction__c>();
        //Create a map based on the duplicate criteria
        for(AccountCaseJunction__c Student:Students){
            if(DuplicateCriteriaMap.get(Student.DuplicateCriteria__c)==null){
                DuplicateCriteriaMap.put(Student.DuplicateCriteria__c,Student);
                StudentsMap.put(Student.id,Student);
            }
            Student.Duplicate__c=false;
            StudentsUpdate.put(student.id,student);
        }
        update StudentsUpdate.values();
        StudentsUpdate=new Map<id,AccountCaseJunction__c>();
        //Query Duplicate records
        list<AccountCaseJunction__c> DupeStudentList=[select id,Duplicate__c,DuplicateCriteria__c from AccountCaseJunction__c 
                                                      where DuplicateCriteria__c=:DuplicateCriteriaMap.keyset() and id NOT IN :StudentsMap.keyset()];
        //Iterate on the duplicate records
        for(AccountCaseJunction__c Student:DupeStudentList){
            if(DuplicateCriteriaMap.get(Student.DuplicateCriteria__c)!=null){
                //Set duplicate checkbox to true on the duplicate records
                AccountCaseJunction__c MainDupeStudent=DuplicateCriteriaMap.get(Student.DuplicateCriteria__c);
                MainDupeStudent.Duplicate__c=true;
                Student.Duplicate__c=true;
                //Push data into the map for update
                if(StudentsUpdate.get(Student.id)==null)
                    StudentsUpdate.put(Student.id,student);
                if(StudentsUpdate.get(MainDupeStudent.id)==null)
                    StudentsUpdate.put(MainDupeStudent.id,MainDupeStudent);
            }
        }
        //Update call
        update StudentsUpdate.values();
    }
    global void finish(Database.BatchableContext BC) {
        //database.executeBatch(new FindDuplicateStudents());
    }
}