@isTest
private class Community_RRRFormControllerBulkTest
{
    //inserting comm slot record with 8000 record count
    static testMethod void bulkInsert()
    {
        Test.startTest();
        List<Account> ls = Test.loadData(Account.sObjectType, 'testAccounts');
        //List<Account> lsAcc21 = Community_TestDataFactory.createAccount2(2000, Date.today(),0);
		
       
         //System.debug([select Id from Account ].size());
        Test.stopTest();
    }

}