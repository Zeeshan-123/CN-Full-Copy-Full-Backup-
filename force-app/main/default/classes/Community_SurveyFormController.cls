public without sharing class Community_SurveyFormController{

    @AuraEnabled
	public static Community_SurveyFormWrapper getApplicantInfo(){
		try{
			Community_SurveyFormWrapper objList = new Community_SurveyFormWrapper();
			//get user logged id
			String UserId = UserInfo.getUserId();
			//get contact id against user id
			String contactId = utility.getUserContactId(UserId);

			Id cn_RecTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();
			//query logged in user account information
			Account acc = [SELECT Id, FirstName, Tribe_Id__c, Middle_Name__c, LastName, Date_of_Birth__c, Age__pc, PersonContactId, PersonEmail, PersonMobilePhone, HealthCloudGA__Gender__pc, PersonMailingStreet, PersonMailingCity, PersonMailingState, PersonMailingCountry, PersonMailingPostalCode, Mailing_Suite__c, PersonOtherStreet, PersonOtherCity, PersonOtherState, PersonOtherCountry, PersonOtherPostalCode, Physical_Suite__c
			               FROM Account
			               WHERE PersonContactId = :contactId AND RecordTypeId = :cn_RecTypeId
			               limit 1];

			Case cseExists = isCaseExists();
			if (cseExists != null){
				objList.caseObj = cseExists;
				objList.caseExists = true;
			} else{
				objList.caseObj = new Case();
				objList.caseExists = false;
			}
			objList.acnt = acc;

			return objList;

		} catch (Exception e){
			System.debug(e.getMessage());
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static Case isCaseExists(){
		//check for case existance
		//get user logged id
		String UserId = UserInfo.getUserId();
		//get contact id against user id
		String contactId = utility.getUserContactId(UserId);
		//get Hunt Draw Request record type id
		Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Survey_Request').getRecordTypeId();
		List<Case> hCase = [SELECT Id, Request_Reason__c, CaseNumber, Status
		                    FROM Case
		                    WHERE ContactId = :contactId and Request_Reason__c = 'Survey' and RecordTypeId = :caseRecordTypeId
		                    limit 1];
		if (hCase.size() > 0){
			return hCase[0];
		}
		return null;
	}

	//new create case
	@AuraEnabled
	public static Community_SurveyFormWrapper createCase(Community_SurveyFormWrapper wrapperObj){
		Community_SurveyFormWrapper objWrapper = new Community_SurveyFormWrapper();
		try{
			Case cseExists = isCaseExists();
			if (cseExists != null){
				// objWrapper.exceptionMsg = 'You have already applied for Hunt Application. Your Confirmation Number is : ' + cseExists.CaseNumber;
				// return objWrapper;
			}

			System.debug('------------Wrapper Case Object---------------' + '\n' + wrapperObj.caseObj);

			//get Hunt Draw Request record type id
			Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Survey_Request').getRecordTypeId();
			// system.debug('Akk '+PG_PhysicalIsManual);

			Case cse = wrapperObj.caseObj;
			cse.RecordTypeId = caseRecordTypeId;
			cse.Status = 'New';
			cse.Origin = 'Portal';
			cse.Priority = 'Medium';
			cse.Request_Reason__c = 'Survey';
			cse.AccountId = wrapperObj.acnt.Id;
			cse.ContactId = wrapperObj.acnt.PersonContactId;


			System.debug('------------SURVEY REQUEST---------------' + '\n' + cse);

			insert cse;

			List<Case> insertedCase = [Select Id, CaseNumber, AccountId
			                     From Case
			                     Where Id = :cse.Id
			                     limit 1];
            
            System.debug('------------INSERTED CASE---------------' + '\n' + insertedCase[0]);
            
            if(insertedCase.size() > 0){
                setInterestedInSurveyField(insertedCase[0].AccountId);
                objWrapper.caseObj = insertedCase[0];
            }
			


			return objWrapper;

		} catch (Exception ex){
			System.debug('------------SURVEY REQUEST---------------' + '\n' + ex.getMessage());
			objWrapper.exceptionMsg = ex.getMessage();
			return objWrapper;
		}
	}
    
     @AuraEnabled
    public static void setInterestedInSurveyField(String accId){
        Account acc = [Select Id, Interested_in_Survey__c from Account
                      Where Id = :accId];
        acc.Interested_in_Survey__c = 'Interested';
        update acc;
    }
}