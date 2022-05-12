/*--------------------------------------------------------------------------------------------------------------
@Author: Sami Haroon
@Date: 04/14/2021
@Purpose: Class definition for throwing custom exceptions via Apex actions in Flows.
---------------------------------------------------------------------------------------------------------------*/

public class FlowCustomError {
    
    public class CustomException extends Exception {}
    
    @InvocableMethod(label='Throw Custom Flow Exception')
    public static void throwCustomFlowException(Inputs[] input){
         throw createCustomException(input[0].message);
     /*   List<Sub_Applicant__c> records = new List<Sub_Applicant__c>();
        records.add(input[0].SubApprecord);
        for (Sub_Applicant__c record : records)
        {
            record.addError(input[0].message);
        }*/
    
    }
    
    public class Inputs{
        @InvocableVariable(label='Error message')
        public string message;
         @InvocableVariable(label='Sub Applicant Record')
        public Sub_Applicant__c SubApprecord;
    }  

    static CustomException createCustomException(String message) {
        CustomException ex = new CustomException(message);
        ex.setMessage(message);
        return ex;
    }
}