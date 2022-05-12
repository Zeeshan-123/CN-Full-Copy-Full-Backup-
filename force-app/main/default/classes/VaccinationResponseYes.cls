/**********************************
@author: Shams
@date: 3/1/2020
@purpose: Handle vaccination agreement response Yes on SMS
***********************************/
public without sharing class VaccinationResponseYes {
    //Called from Bot
	@InvocableMethod
    public static void VaccinationResponseYes(list<id> Contacts){
        List<contact> cupdate=new list<contact>();
        List<contact> contactList=[select id,Agreed_to_vaccinate__c from contact where id=:Contacts];
        if(contactList.size()>0){
            for(contact c:contactList){
                c.Agreed_to_vaccinate__c='Yes';
                cupdate.add(c);
            }
            update cupdate;
        }
    }
}