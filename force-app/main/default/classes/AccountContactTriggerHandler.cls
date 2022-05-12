/**********************************
@author: Shams
@date: 12/9/2020
@purpose: Remove household from account AccountContactTrigger handler
***********************************/
public class AccountContactTriggerHandler {
    public void handleDelete(List<AccountContactRelation> ACR){
        List<id> Accid=new List<id>();
        List<Account> Aupdate=new List<Account>();
        //Create Account List
        for(AccountContactRelation ACRitem:ACR)
            Accid.add(ACRitem.ContactID);
        //Fetch Accounts
        Map<id,Account> AcMapT=new Map<id,Account>([select id,household_1__c,household_2__c,PersonContactId from Account where PersonContactId =: ACCid]);
        Map<id,Account> AcMap=new Map<id,Account>();
        //Create Account Map
        for(Account A:AcMapT.values())
            AcMap.put(A.PersonContactId,A);
        
        id uRoleId = UserInfo.getUserRoleId();
        //system.debug(uRoleId);
		Userrole GRole=[select id,developername from Userrole where id=:uRoleId];
        //system.debug(GRole.DeveloperName+':'+Label.Admin);
        //Iterate over the deleted relationship records
        for(AccountContactRelation ACRitem:ACR){
            if(GRole.DeveloperName==Label.Admin || GRole.DeveloperName==Label.IT_admin || GRole.DeveloperName==Label.Lead_Case_Investigator)
            {
                Account A=AcMap.get(ACRitem.ContactID);
                //Remove household 1 from account
                if(A.Household_1__c==ACRitem.AccountId){
                    A.Household_1__c=A.Household_2__c;
                    A.Household_2__c=null;
                    Aupdate.add(A);
                }
                //Remove household 2 from account
                if(A.Household_2__c==ACRitem.AccountId){
                    A.Household_2__c=null;
                    Aupdate.add(A);
                }  
            }
            else
            {
                ACRitem.addError('Please reach out to Case Investigator - Team Lead, to have a Household member removed.');
            }
        }
        //Update Accounts
        if(Aupdate.size()>0)
        	Database.update(Aupdate,false);
    }
}