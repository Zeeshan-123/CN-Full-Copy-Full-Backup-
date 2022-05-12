@istest
public class Generate_CNPH_Letters_ControllerExt_test {
    @istest
    public static void test(){
        Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('ERM_Patient').getRecordTypeId();
        Account TA1=TestDataFactory.createTestPersonAccountRecords('TestAccount1',recordTypeId);
        TA1.PersonEmail='Test@test.com';
        update ta1;
        Generate_CNPH_Letters_ControllerExt letter=new Generate_CNPH_Letters_ControllerExt();
        letter.acct=[select id,name,PersonEmail,PersonContactId,Contact_OR_Case__pc,Quarantine_End_Date_Contact__pc from account];
        letter.AttachisolationNote();
        letter.AttachisolationReleaseNote();
        letter.AttachQuarantineNote();
        letter.AttachQuarantineReleaseNote();
        letter.isolationNote();
        letter.isolationReleaseNote();
        letter.QuarantineNote();
        letter.QuarantineReleaseNote();
		letter.showPopupIN();
        letter.showPopupIRN();
        letter.showPopupQN();
        letter.showPopupQRN();
        letter.closePopup();
    }

}