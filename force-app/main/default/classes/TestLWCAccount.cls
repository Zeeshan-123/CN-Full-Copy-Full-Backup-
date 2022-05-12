public class TestLWCAccount {
    @AuraEnabled
    public static List<Contact> getContactList() {
        return [SELECT Id, Name FROM Contact limit 10];
    }
}