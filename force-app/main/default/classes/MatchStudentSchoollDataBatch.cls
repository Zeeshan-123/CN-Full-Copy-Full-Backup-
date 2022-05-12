/**********************************
@author: Shams
@date: 3/25/2021
@purpose: For matching the student and SEBTC School data
***********************************/
global class MatchStudentSchoollDataBatch implements Schedulable,Database.Batchable<sObject>  {
    
    Map<id,id> AIDmap;
    global Database.QueryLocator start(Database.BatchableContext BC) {
        //query creation
        String Query;
        if(test.isRunningTest()) {
            Query='SELECT Criteria_1__c, Criteria_2__c, Criteria_3__c, Criteria_4__c, SEBTC_School_Data_ID__c FROM SEBTC_School_Data__c limit 20';
        }
        else {
            Query = 'SELECT Criteria_1__c, Criteria_2__c, Criteria_3__c, Criteria_4__c, SEBTC_School_Data_ID__c FROM SEBTC_School_Data__c ';
            Query += 'WHERE WIC_Summer_Eligibility_Year__c = \'2022\'';
        }
        //Execute the query and return the results
        return Database.getQueryLocator(query);
    }
    
    public void execute(SchedulableContext context) {
        Database.executeBatch(this);
    }
    
    global void execute(Database.BatchableContext BC, List<SEBTC_School_Data__c> SchooldData) {
        Map<id, AccountCaseJunction__c> studentUpdate = new Map<id, AccountCaseJunction__c>();
        Map<String, SEBTC_School_Data__c> SchooldataC1 = new Map<String, SEBTC_School_Data__c>();
        Map<String, SEBTC_School_Data__c> SchooldataC2 = new Map<String, SEBTC_School_Data__c>();
        Map<String, SEBTC_School_Data__c> SchooldataC3 = new Map<String, SEBTC_School_Data__c>();
        Map<String, SEBTC_School_Data__c> SchooldataC4 = new Map<String, SEBTC_School_Data__c>();
        
        //Create maps for both Ceriteria used for matching
        for(SEBTC_School_Data__c SD:SchooldData) {
            if(SchooldataC1.get(SD.Criteria_1__c)==null) SchooldataC1.put(SD.Criteria_1__c,SD);
            if(SchooldataC2.get(SD.Criteria_2__c)==null) SchooldataC2.put(SD.Criteria_2__c,SD);
            if(SchooldataC3.get(SD.Criteria_3__c)==null) SchooldataC3.put(SD.Criteria_3__c,SD);
            if(SchooldataC4.get(SD.Criteria_4__c)==null) SchooldataC4.put(SD.Criteria_4__c,SD);
        }
        
        // Fetch matching accounts - Vikash: Added year filter criteria on parent Case
        /**
         * Filter Student based on 
         * If "Is Matching Processed" = FALSE
         * If "Is Matching Processed" = TRUE && Application Matched ? = "Match Not Found"
         */
        List<AccountCaseJunction__c> matchingResult=[SELECT Criteria_1__c,Criteria_2__c,Criteria_3__c,Criteria_4__c,
                                                    Match_Found_based_on_Criteria_1__c, Match_Found_based_on_Criteria_2__c,
                                                    Match_Found_based_on_Criteria_3__c, Match_Found_based_on_Criteria_4__c,
                                                    SEBTC_School_Data_ID__c, SEBTC_School_Data__c,
                                                    Is_Matching_Processed__c, Application_Matched__c
                                                    FROM AccountCaseJunction__c 
                                                    where (Criteria_1__c =: SchooldataC1.keySet() 
                                                            OR Criteria_2__c =: SchooldataC2.keySet()
                                                            OR Criteria_3__c =: SchooldataC3.keySet() 
                                                            OR Criteria_4__c =: SchooldataC4.keySet())
                                                    AND Request__r.WICS_Form_Submission_Year__c = '2022'
                                                    AND (Is_Matching_Processed__c = FALSE OR
                                                            (Is_Matching_Processed__c = TRUE AND Application_Matched__c = 'Match Not Found'))
                                                    ];
        
        //Compare results
        for(AccountCaseJunction__c Student : matchingResult) {
            SEBTC_School_Data__c SDataC1 = SchooldataC1.get(Student.Criteria_1__c);
            SEBTC_School_Data__c SDataC2 = SchooldataC2.get(Student.Criteria_2__c);
            SEBTC_School_Data__c SDataC3 = SchooldataC3.get(Student.Criteria_3__c);
            SEBTC_School_Data__c SDataC4 = SchooldataC4.get(Student.Criteria_4__c);
            
            //If Criteria 4 match found
            if(SDataC4!=null) {
                if(SDataC4.Criteria_4__c == Student.Criteria_4__c) {
                    Student.Match_Found_based_on_Criteria_4__c=true;
                    Student.Match_Found_based_on_Criteria_1__c=false;
                    Student.Match_Found_based_on_Criteria_2__c=false;
                    Student.Match_Found_based_on_Criteria_3__c=false;
                    Student.SEBTC_School_Data__c=SDataC4.id; 
                    Student.SEBTC_School_Data_ID__c=SDataC4.SEBTC_School_Data_ID__c;
                    Student.Is_Matching_Processed__c = true;    // CNHPHOMS-34: Added to update the processed checkbox
                    studentUpdate.put(Student.id,Student);
                }
            }
            
            //If Criteria 3 match found
            if(SDataC2!=null) {
                if(SDataC2.Criteria_2__c == Student.Criteria_2__c) {
                    Student.Match_Found_based_on_Criteria_2__c=true;
                    Student.Match_Found_based_on_Criteria_1__c=false;
                    Student.Match_Found_based_on_Criteria_3__c=false;
                    Student.Match_Found_based_on_Criteria_4__c=false;
                    Student.SEBTC_School_Data__c=SDataC2.id;
                    Student.SEBTC_School_Data_ID__c=SDataC2.SEBTC_School_Data_ID__c;
                    Student.Is_Matching_Processed__c = true;    // CNHPHOMS-34: Added to update the processed checkbox
                    studentUpdate.put(Student.id,Student);
                }
            }
            
            //If Criteria 2 match found
            if(SDataC3!=null) {
                if(SDataC3.Criteria_3__c == Student.Criteria_3__c) {
                    Student.Match_Found_based_on_Criteria_3__c=true;
                    Student.Match_Found_based_on_Criteria_1__c=false;
                    Student.Match_Found_based_on_Criteria_2__c=false;
                    Student.Match_Found_based_on_Criteria_4__c=false;
                    Student.SEBTC_School_Data__c=SDataC3.id;
                    Student.SEBTC_School_Data_ID__c=SDataC3.SEBTC_School_Data_ID__c;
                    Student.Is_Matching_Processed__c = true;    // CNHPHOMS-34: Added to update the processed checkbox
                    studentUpdate.put(Student.id,Student);
                }
            }
            //If Criteria 1 match found
            if(SDataC1!=null) {
                if(SDataC1.Criteria_1__c == Student.Criteria_1__c) {
                    Student.Match_Found_based_on_Criteria_1__c=true;
                    Student.Match_Found_based_on_Criteria_2__c=false;
                    Student.Match_Found_based_on_Criteria_3__c=false;
                    Student.Match_Found_based_on_Criteria_4__c=false;
                    Student.SEBTC_School_Data__c=SDataC1.id;
                    Student.SEBTC_School_Data_ID__c=SDataC1.SEBTC_School_Data_ID__c;
                    Student.Is_Matching_Processed__c = true;    // CNHPHOMS-34: Added to update the processed checkbox
                    if(studentUpdate.get(Student.Id)!=null) studentUpdate.remove(Student.id);
                    studentUpdate.put(Student.id,Student);
                }
            }
        }
        //update Student records
        update studentUpdate.values();
    }
    
    global void finish(Database.BatchableContext BC) {
        //database.executeBatch(new MatchStudentSchoollDataBatch());
    }
}