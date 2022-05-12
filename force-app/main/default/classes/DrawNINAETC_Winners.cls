public with sharing class DrawNINAETC_Winners{
    public List<SurveyResponse> results{get;set;}
    public string surveyName {get;set;}
    public void selectWinner(){
        //Getting Hunt_Events__c multiselect picklist values
        system.debug(surveyName);
        string attendance = 'Did you attend this workshop virtually or in person?';
        String[] events = new List<String>{};
       	Set<Id> removeID = new Set<Id>();
        List<SurveyResponse> winnersList = new List<SurveyResponse>();
        Set<Id> accountIds = new Set<Id>();
        Map<String, Set<Id>> winnersAccIdsPerEvent = new Map<String, Set<Id>>();
        Map<String, List<Case>> winnersListPerEvent = new Map<String, List<Case>>();
        Set<ID> entries1 = new Set<ID>(); 
        List<SurveyResponse> entries2 = new List<SurveyResponse>(); 
        Map<ID, SurveyQuestion> questions = new Map<ID, SurveyQuestion>([select id, name, surveyversion.name, pagename from surveyquestion where surveyversion.name = : surveyName and pageName = 'Drawing Entry']);
        system.debug('Questions' + questions);
        for( Remove_From_Draw__c  rem : [SELECT ID, Record_ID__c FROM Remove_From_Draw__c]){
            removeId.add(rem.Record_ID__c);
        }
        system.debug(removeId);
        List<SurveyQuestionResponse> q2 = [SELECT ID, ResponseId FROM SurveyQuestionResponse WHERE QuestionId in : questions.keySet()];
        system.debug(q2);
        for(SurveyQuestionResponse q : [SELECT ID, ResponseId FROM SurveyQuestionResponse WHERE QuestionId in : questions.keySet()]){
           system.debug(q);
            entries1.add(q.ResponseId);
        }        
        
        for(SurveyResponse resp : [SELECT ID, Name, SurveyVersion.Name, (Select ID, Question.Name, ResponseValue FROM SurveyQuestionResponses WHERE Question.pageName = 'Drawing Entry' OR Question.Name = : attendance) FROM SurveyResponse WHERE ID in : entries1 AND ID not in : removeId]){
            entries2.add(resp);
           
        }
        List<SurveyResponse> tempList = new List<SurveyResponse>();			
        List<SurveyResponse> backupWinners = new List<SurveyResponse>();

        Integer count = 0;
            if (entries2.size() > 0){
                for (Integer i = 0; i < entries2.size(); i++){
                    if (count == 1) {
                        //backupWinnersPerEvent.put(event, tempList);
                        break;
                    }
                    Set<Integer> uniqueNum = getRandomNumbs(entries2.size());
                    for (Integer randomNum : uniqueNum) {
                        if (count == 1) {
                            break;
                        }
                        tempList.add(entries2[randomNum]);
                        count++;
                    }
                }
            }
        
        
        system.debug(tempList);
        
        
        List<Remove_From_Draw__c> createRemove = new List<Remove_From_Draw__c >(); 
        for(SurveyResponse resp : tempList){
            Remove_From_Draw__c newRem = new Remove_From_Draw__c(); 
            newRem.Record_ID__c = resp.Id; 
            createRemove.add(newRem);
        }
        
        insert createRemove; 
        system.debug(tempList);
        results = tempList;
        system.debug(results);
        
        
    }
    
   
    
    private static Set<Integer> getRandomNumbs(Integer length){
        Set<Integer> uniqueNum = new Set<Integer>();
        for (Integer i = 0; i < length; i ++){
            Integer rand = Integer.valueof((Math.random() * length));
            uniqueNum.add(rand);
            
        }
        return uniqueNum;
    }
}