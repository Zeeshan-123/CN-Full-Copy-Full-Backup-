//Required to use SeeAllData = TRUE due to the fact that you cannot instantiate test records for any objects related to Survey
@isTest(SeeAllData = TRUE)
public class DrawNINAETC_Winners_Test {
    
    @isTest(SeeAllData = TRUE) public static void sampleSurvey(){
        
        
        List<Survey> survRec = [SELECT ID,Name FROM Survey WHERE Name = 'NINAETC Sample Survey'];
        system.assertEquals('NINAETC Sample Survey', survRec[0].Name);
        
     SurveyQuestion qustion = new SurveyQuestion();
        
        Map<ID, SurveyQuestion> questions = new Map<ID, SurveyQuestion>([select id, name, surveyversion.name, pagename from surveyquestion where surveyversion.name = 'NINAETC Workshop Survey' and pageName = 'Drawing Entry']);
        
        SurveyQuestionResponse q = [SELECT ID, ResponseId FROM SurveyQuestionResponse WHERE QuestionId in : questions.keySet() LIMIT 1];
         
        DrawNINAETC_Winners dw = new DrawNINAETC_Winners();
        dw.surveyName = 'NINAETC Sample Survey';
        dw.selectWinner(); 
    }

     @isTest public static void workshopSurvey(){
        
        
        List<Survey> survRec = [SELECT ID,Name FROM Survey WHERE Name = 'NINAETC Workshop Survey'];
        system.assertEquals('NINAETC Workshop Survey', survRec[0].Name);
        
        Map<ID, SurveyQuestion> questions = new Map<ID, SurveyQuestion>([select id, name, surveyversion.name, pagename from surveyquestion where surveyversion.name = 'NINAETC Workshop Survey' and pageName = 'Drawing Entry']);
        
        SurveyQuestionResponse q = [SELECT ID, ResponseId FROM SurveyQuestionResponse WHERE QuestionId in : questions.keySet() LIMIT 1];
         
        DrawNINAETC_Winners dw = new DrawNINAETC_Winners();
        dw.surveyName = 'NINAETC Workshop Survey';
         dw.selectWinner(); 
        
    }

     @isTest public static void overallSurvey(){
        
        
        List<Survey> survRec = [SELECT ID,Name FROM Survey WHERE Name = 'NINAETC Overall Evaluation'];
        system.assertEquals('NINAETC Overall Evaluation', survRec[0].Name);
        
        Map<ID, SurveyQuestion> questions = new Map<ID, SurveyQuestion>([select id, name, surveyversion.name, pagename from surveyquestion where surveyversion.name = 'NINAETC Overall Evaluation' and pageName = 'Drawing Entry']);
        
        SurveyQuestionResponse q = [SELECT ID, ResponseId FROM SurveyQuestionResponse WHERE QuestionId in : questions.keySet() LIMIT 1];
        DrawNINAETC_Winners dw = new DrawNINAETC_Winners();
        dw.surveyName = 'NINAETC Overall Evaluation';
        dw.selectWinner(); 
        
    }
}