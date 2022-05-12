/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date:Aug/05/2021
 @Purpose: This class is used as a test class for selecting winners for hunt events class name : DrawHunt_Winners.
 ---------------------------------------------------------------------------------------------------------------*/
@isTest
private class DrawHunt_WinnersTest{
	@isTest
	static void selectWinners(){
		List<Account> accounts = new List<Account>();
		List<Case> cases = new List<Case>();
		String caseId = '';
		Date youthdDate = Date.newInstance(2005, 12, 14);
		Date elderdDate = Date.newInstance(1956, 12, 14);
		Date veterandDate = Date.newInstance(1990, 12, 14);
		Date atLarge = Date.newInstance(1984, 12, 14);

		List<Account> youthAccounts = createAccounts('Barin', 'David', 'nike@g.com', '14124', youthdDate);
		List<Account> veteranAccounts = createAccounts('John', 'Smith', 'smith@g.com', '14125', veterandDate);
		List<Account> atLargeAccounts = createAccounts('Tom', 'Cruise', 'cruise@g.com', '14126', atLarge);
		List<Account> elderAccounts = createAccounts('Harrison', 'Ford', 'ford@g.com', '14127', elderdDate);
		


		String[] youthCat = new String[]{'Fish and Wildlife Controlled Hunt Youth App'};
		String[] veteranCat = new String[]{'Fish and Wildlife Controlled Hunt Veteran App'};
		String[] atlargeCat = new String[]{'Fish and Wildlife Controlled Hunt At Large App'};
		String[] elderCat = new String[]{'Fish and Wildlife Controlled Hunt Elder App'};

		// String[] huntEvents = new String[]{'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Either Sex)', 'Cherokee Youth, 17 and Under (Gun) October 16-17 (5 Antlerless)', 'Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Either Sex)' , 'Cherokee Youth, 17 and Under (Gun) December 4-5 (5 Antlerless)'};
		String[] youthEvents = new List<String>();
		String[] veteranEvents = new List<String>();
		String[] atlargeEvents = new List<String>();
		String[] elderEvents = new List<String>();
		List<String> events = getEvents();
		for (String event : events){
			if (event.contains('Youth')){
				youthEvents.add(event);
			}
			if (event.contains('Veteran')){
				veteranEvents.add(event);
			}
			if (event.contains('At-Large')){
				atlargeEvents.add(event);
			}
			if (event.contains('Elder')){
				elderEvents.add(event);
			}
		}


		User usr = createUser('Barin', 'David', 'barin@g.com', youthAccounts[0].id);

		// List<User> usersForTesting = [Select Id
		//                               From User];
		// User userForTesting = [SELECT Id FROM User WHERE Id = :usr.Id
		//                        LIMIT 1];

		system.runAs(usr){
			test.startTest();


			for (Account acc : youthAccounts){
				cases.add(createCase(acc, youthCat, youthEvents));
			}
			for (Account acc : veteranAccounts) {
				cases.add(createCase(acc, veteranCat, veteranEvents));
			}
			for (Account acc : atLargeAccounts) {
				cases.add(createCase(acc, atlargeCat, atlargeEvents));
			}
			for (Account acc : elderAccounts) {
				cases.add(createCase(acc, elderCat, elderEvents));
			}

			insert cases;

			DrawHunt_Winners.getHuntDrawReq();
			test.stopTest();
		}
	}

	private static Case createCase(Account acc, String[] huntCat, String[] huntEvents){
		Community_HuntingDrawAppWrapper wrapperObj = new Community_HuntingDrawAppWrapper();

		Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Hunt_Request').getRecordTypeId();
		String huntEventsStr = '';
		String huntCategoriesStr = '';

		Case cse = new Case();
		cse.RecordTypeId = caseRecordTypeId;
		cse.Status = 'New';
		cse.Origin = 'Portal';
		cse.Priority = 'Medium';
		cse.Request_Reason__c = 'HA';
		cse.Ebt_Mobile_Phone__c = acc.PersonMobilePhone;
		cse.AccountId = acc.Id;
		cse.ContactId = acc.PersonContactId;

		cse.Ebt_Mobile_Phone__c = '4234567890';
		cse.Physical_Street__c = '37 Street';
		cse.Physical_City__c = 'Edmond';
		cse.Physical_ZipPostal_Code__c = '73003';
		cse.Physical_Countries__c = 'United States';
		cse.Physical_States__c = 'Oklahoma';
		if (huntCat[0].contains('At Large')) {
			cse.Physical_States__c = 'Nevada';
		}
		cse.Other_Physical_State__c = '';
		cse.Physical_Suite__c = '';
		cse.Physical_Address2__c = '';
		cse.Physical_IsManual__c = false;
		cse.Physical_Melissa_Address__c = '';
		cse.Is_Applicant_Under_18__c = 'No';
		cse.Hunting_License_Holder__c = 'Yes';

		cse.PG_First_Name__c = '';
		cse.PG_Middle_Name__c = '';
		cse.PG_Last_Name__c = '';
		cse.PG_Driver_License__c = '';
		cse.PG_Mobile_Phone__c = '';
		cse.PG_Physical_Street__c = '';
		cse.PG_Physical_City__c = '';
		cse.PG_Physical_ZipPostal_Code__c = '';
		cse.PG_Physical_Country__c = '';
		cse.PG_Physical_State__c = '';
		cse.PG_Other_Physical_State__c = '';
		cse.PG_Physical_Suite__c = '';
		cse.PG_Physical_Address_Line2__c = '';
		cse.PG_Physical_Melissa_Address__c = '';
		cse.PG_Physical_IsManual__c = false;
		cse.AA_First_Name__c = '';
		cse.AA_Middle_Name__c = '';
		cse.AA_Last_Name__c = '';
		cse.AA_Driver_License__c = '';
		cse.AA_Mobile_Phone__c = '';

		if (huntCat[0].contains('Youth')) {
			cse.Is_Applicant_Under_18__c = 'Yes';
			cse.PG_First_Name__c = 'abc';
			cse.PG_Middle_Name__c = '';
			cse.PG_Last_Name__c = 'efg';
			cse.PG_Driver_License__c = 'TRY7655899';
			cse.PG_Mobile_Phone__c = '7654567898';
			cse.PG_Physical_Street__c = '37 Street';
			cse.PG_Physical_City__c = 'Edmond';
			cse.PG_Physical_ZipPostal_Code__c = '73003';
			cse.PG_Physical_Country__c = 'United States';
			cse.PG_Physical_State__c = 'Oklahoma';
			cse.PG_Other_Physical_State__c = '';
			cse.PG_Physical_Suite__c = '';
			cse.PG_Physical_Address_Line2__c = '';
			cse.PG_Physical_Melissa_Address__c = '';
			cse.PG_Physical_IsManual__c = false;
			cse.AA_First_Name__c = 'Check';
			cse.AA_Middle_Name__c = '';
			cse.AA_Last_Name__c = 'Check2';
			cse.AA_Driver_License__c = 'TYU987654456';
			cse.AA_Mobile_Phone__c = '1234567890';
		}
		

		for (integer i = 0; i < huntCat.size(); i++){
			huntCategoriesStr += huntCat[i]+';';
		}
		for (integer i = 0; i < huntEvents.size(); i++){
			huntEventsStr += huntEvents[i]+';';
		}

		cse.Hunt_Events__c = huntEventsStr;
		cse.Hunt_Category__c = huntCategoriesStr;

		// wrapperObj.acnt = acc;
		// wrapperObj.caseObj = cse;
		// wrapperObj.huntCategories = huntCat;
		// wrapperObj.huntEvents = huntEvents;
		// wrapperObj.filename = null;
		// wrapperObj.fileid = null;
		// wrapperObj.filename = 'Testing';
		// wrapperObj.fileid = '0692h000001GgnpAAC';
		return cse;
	}

	public static User createUser(String firstName, String lastName, String email, String accountID){

		//UserRole obj = new UserRole(Name = 'ABC');
		//insert obj;

		Profile pf = [Select Id
		              from profile
		              where Name = 'System Administrator'];

		String orgId = UserInfo.getOrganizationId();
		String dateString = String.valueof(Datetime.now()).replace(' ', '').replace(':', '').replace('-', '');
		Integer RandomId = Integer.valueOf(Math.rint(Math.random() * 1000000));
		String uniqueName = orgId + dateString + RandomId;

		User uu = new User(firstname = firstName, lastName = lastName, email = uniqueName + '@test' + orgId + '.org', Username = uniqueName + '@test' + orgId + '.org', EmailEncodingKey = 'ISO-8859-1', Alias = uniqueName.substring(18, 23), TimeZoneSidKey = 'America/Los_Angeles', LocaleSidKey = 'en_US', LanguageLocaleKey = 'en_US', ProfileId = pf.Id);
		insert uu;
		return uu;
	}

	public static Account createAccount(String firstName, String lastName, String email, String tribeID, Date dob){

		Account a = new Account();
		a.firstName = firstName;
		a.LastName = lastName;
		a.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('CN_Registration').getRecordTypeId();// CN Registration RecordType id
		a.PersonEmail = email;
		a.Tribe_Id__c = tribeID;
		a.Date_of_Birth__c = dob;
		a.If_CN_Citizen__c = 'Yes';
		//    insert a;

		return a;
	}

	public static List<Account> createAccounts(String firstName, String lastName, String email, String citizenId, Date dt){
		List<Account> accounts = new List<Account>();
		for (Integer i = 0; i < 40; i++){
			accounts.add(createAccount(firstName + i, lastName + i, email + i, citizenId + i, dt));
		}
		insert accounts;
		return accounts;
	}

	public static List<String> getEvents(){
		List<String> events = new List<String>();
		Schema.sObjectType objType = Schema.getGlobalDescribe().get('Case').newSObject().getSObjectType();
		Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
		for (Schema.PicklistEntry ple : objFieldMap.get('Hunt_Events__c').getDescribe().getPicklistValues()){
			events.add(ple.getValue());
		}
		return events;
	}
}