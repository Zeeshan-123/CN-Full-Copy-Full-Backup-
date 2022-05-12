/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: 18/Nov/2020
@Purpose: This class is used as controller for Community_CreateVeteranRec aura component.
---------------------------------------------------------------------------------------------------------------*/

// All methods in this class are linked with each other directly or indirectly
// change in any method can distrub whole class flow
public  without sharing class Community_CreateVeterenRecord 
{ 
    
  // get Branch Service picklist values
       @AuraEnabled
    public static Community_CreateVetRecWrapper getBranchServicePl()
    {
        Community_CreateVetRecWrapper obj = new Community_CreateVetRecWrapper(); 
        obj.BranchServicePlValues=new list<String>(); 
        obj.EnlistmentMonth=new list<String>(); 
        obj.EnlistmentYear=new list<String>(); 
        obj.NumOfServiceMonths=new list<String>(); 
        obj.NumOfServiceYears=new list<String>(); 

        //    Describe call for branch service picklist values
        Schema.DescribeFieldResult fieldResult = Veteran_Service__c.Service_Branch__c.getDescribe();
        List<Schema.PicklistEntry> picklist = fieldResult.getPicklistValues();
        
         for(Schema.PicklistEntry s:picklist)
         {
               obj.BranchServicePlValues.add(s.getLabel());
        }  
        
          //    Describe call for Enlistment Month picklist values
        Schema.DescribeFieldResult EnlistmentMonthfieldResult = Veteran_Service__c.Enlistment_Month__c.getDescribe();
        List<Schema.PicklistEntry> EnlistmentMonthpicklist = EnlistmentMonthfieldResult.getPicklistValues();
        
         for(Schema.PicklistEntry s: EnlistmentMonthpicklist)
         {
               obj.EnlistmentMonth.add(s.getLabel());
        } 
        
        
        //    Describe call for Enlistment Year picklist values
        Schema.DescribeFieldResult EnlistmentYearfieldResult = Veteran_Service__c.Enlistment_Year__c.getDescribe();
        List<Schema.PicklistEntry> EnlistmentYearpicklist = EnlistmentYearfieldResult.getPicklistValues();
        
         for(Schema.PicklistEntry s: EnlistmentYearpicklist)
         {
               obj.EnlistmentYear.add(s.getLabel());
        }
        
        
         //    Describe call for Number of Service Years picklist values
        Schema.DescribeFieldResult NumOfServiceYearsfieldResult = Veteran_Service__c.Number_of_Service_Years__c.getDescribe();
        List<Schema.PicklistEntry> NumOfServiceYearspicklist = NumOfServiceYearsfieldResult.getPicklistValues();
        
         for(Schema.PicklistEntry s: NumOfServiceYearspicklist)
         {
               obj.NumOfServiceYears.add(s.getLabel());
        }
        
         //    Describe call for Number of Service Months picklist values
        Schema.DescribeFieldResult NumOfServiceMonthsfieldResult = Veteran_Service__c.Number_of_Service_Months__c.getDescribe();
        List<Schema.PicklistEntry> NumOfServiceMonthspicklist = NumOfServiceMonthsfieldResult.getPicklistValues();
        
         for(Schema.PicklistEntry s: NumOfServiceMonthspicklist)
         {
               obj.NumOfServiceMonths.add(s.getLabel());
        }
        
       return obj;
    }

       // create veteran record
   @AuraEnabled
        public static String createVeterantRecord(String serviceBranch, String startToEnlistmentYear, String startToEnlistmentMonth,
                                                  String serviceDurationYear, String serviceDurationMonth, Boolean combatVet)
        { 
          //get user id
         String UserId=UserInfo.getUserId();
         //get contact id against user id
         String contactId=utility.getUserContactId(UserId); 
         
         //create veteran record
          try{
            Veteran_Service__c veteran= new Veteran_Service__c();
            
            veteran.Service_Branch__c=serviceBranch;
			veteran.Enlistment_Month__c=startToEnlistmentMonth;
            veteran.Enlistment_Year__c=startToEnlistmentYear;
            veteran.Number_of_Service_Months__c=serviceDurationMonth;
            veteran.Number_of_Service_Years__c=serviceDurationYear;
            veteran.Combat_Veteran__c=combatVet;
            veteran.Veteran_Contact__c = contactId;  
            insert veteran;
            return veteran.Id;                
                }
          
         catch(Exception exc)
         {
		return exc.getMessage();
	}
        }
    
   
}