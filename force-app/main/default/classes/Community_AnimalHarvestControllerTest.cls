@isTest
public class Community_AnimalHarvestControllerTest {
    @testSetup static void setupMethod(){
        
    }
    
    @isTest static void submitHarvest(){
         Date dDate = Date.newInstance(2002, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User testUser = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        
        Case newCase = new Case();
        newCase.Date_Time_of_Harvest__c = system.Datetime.now(); 
        newCase.Land_Type__c = 'Tribal'; 
        newCase.Method_of_Harvest__c = 'Gun'; 
        newCase.Is_the_Deer_Antlered__c = TRUE; 
        newCase.Points_Left__c = 1; 
        newCase.Points_Right__c = 1; 
        newCase.Age_Group_of_Deer__c = 'Fawn';
        system.runAs(testUser){
        test.startTest(); 
        
        
            
           Community_AnimalHarvestController.validateApplicantEligibility();
           Community_AnimalHarvestController.createCase(newCase, system.Datetime.now()); 
        
      
        test.stopTest();
        }
        List<Case> caseCreated = [SELECT ID FROM Case WHERE Request_Reason__c = 'Animal Harvest - White Tail Deer' AND CreatedById =: testUser.Id]; 
        
		system.assertEquals(1, caseCreated.size());        
    }
    
    @isTest static void submitPaddlefish(){
         Date dDate = Date.newInstance(2002, 12, 14);
        Account acc = Community_TestDataFactory.createAccount('Barin','David','nike@g.com','14124',dDate);
     	User usr = Community_TestDataFactory.createUser('Barin','David','barin@g.com',acc.id);   
        User testUser = [SELECT Id FROM User WHERE Id =: usr.Id LIMIT 1];
        
        
        Case newCase = new Case();
        newCase.Date_Time_of_Harvest__c = system.Datetime.now(); 
        newCase.Is_Resident_of_US__c = true; 
        newCase.River_System__c = 'Arkansas River System including Reservoirs'; 
        newCase.Did_Paddlefish_Have_Metal_Band__c = true; 
        newCase.Was_Paddlefish_Checked__c = true; 
        newCase.Metal_Band_Number__c = 12345;
       
        system.runAs(testUser){
        test.startTest(); 
        
        
            
           Community_AnimalHarvestController.getPaddleFishInfo();
           Community_AnimalHarvestController.createPaddlefishCase(newCase, system.Datetime.now()); 
         Community_AnimalHarvestController.getTurkeyHarvestInfo();
           Community_AnimalHarvestController.createTurkeyHarvestCase(newCase, system.Datetime.now());
      
        test.stopTest();
        }
        List<Case> caseCreated = [SELECT ID FROM Case WHERE Request_Reason__c = 'Animal Harvest - Paddlefish' AND CreatedById =: testUser.Id]; 
        
		system.assertEquals(1, caseCreated.size());        
    }


}