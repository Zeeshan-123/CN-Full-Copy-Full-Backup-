public class Generate_CNPH_Letters_ControllerExt {
    public Account acct;
    public PageReference rtn;
    public boolean IsCase {get;set;}
    public boolean IsContact {get;set;}
    String name;
    public boolean displayPopupQN {get; set;}     
    public boolean displayPopupQRN {get; set;}   
    public boolean displayPopupIN {get; set;}   
    public boolean displayPopupIRN {get; set;}   
    
    public void closePopup() {        
        displayPopupQN = false;  
        displayPopupQRN = false; 
        displayPopupIN = false; 
        displayPopupIRN = false; 
    }     
    public void showPopupQN() {        
        displayPopupQN = true;    
    }
    public void showPopupQRN() {        
        displayPopupQRN = true;    
    }
    public void showPopupIN() {        
        displayPopupIN = true;    
    }
    public void showPopupIRN() {        
        displayPopupIRN = true;    
    }
    public Generate_CNPH_Letters_ControllerExt(){}
    public Generate_CNPH_Letters_ControllerExt(ApexPages.StandardController stdController) {
        IsCase=false;IsContact=false;
        this.acct = (Account)stdController.getRecord();
        acct=[select id,name,PersonEmail,PersonContactId,Contact_OR_Case__pc,Quarantine_End_Date_Contact__pc,Quarantined_End_Date__pc,Isolatied_End_Date__pc from account where id=:acct.id];
        name=acct.name;
        if(acct.Contact_OR_Case__pc=='Case')
            IsCase=true;
        else
            IsContact=true;
        rtn = stdController.view();
        
    }
    public PageReference isolationNote(){
        PageReference pr = new PageReference('/apex/CNPH_IsolationNote?id='+acct.PersonContactId);
        pr.setRedirect(true);
        return pr;
    }
    public PageReference isolationReleaseNote(){
        PageReference pr = new PageReference('/apex/CNPH_IsolationReleaseNote?id='+acct.PersonContactId);
        pr.setRedirect(true);
        return pr;
    }
    public PageReference QuarantineNote(){
        PageReference pr = new PageReference('/apex/CNPH_QuarantineNote?id='+acct.id);
        pr.setRedirect(true);
        return pr;
    }
    public PageReference QuarantineReleaseNote(){
        PageReference pr = new PageReference('/apex/CNPH_QuarantineReleaseNote?id='+acct.PersonContactId);
        pr.setRedirect(true);
        return pr;
    }
    public void AttachisolationNote(){
        displayPopupIN = false; 
        /* Get the page definition */
        PageReference pdfPage = Page.CNPH_IsolationNote;
        pdfPage.getParameters().put('id',acct.PersonContactId);
        /* generate the pdf blob */
        Blob pdfBlob;
        if(Test.isRunningTest()) { 
            pdfBlob = blob.valueOf('Unit.Test');
        } else {
            pdfBlob = pdfPage.getContent();
        }
        /* create the attachment against the offer */
        Attachment a = new Attachment(parentId = acct.PersonContactId, name='Isolation Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        
        if(acct.PersonEmail==null)
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please make sure the email is updated on the Case.'));
        else{
            /* insert the attachment */
        	insert a;
        	sendemail('Isolation_Note',a);
        	ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,' Isolation Note attached and sent.'));
        }
    }
    public void AttachisolationReleaseNote(){
        displayPopupIRN = false; 
        /* Get the page definition */
        PageReference pdfPage = Page.CNPH_IsolationReleaseNote;
        pdfPage.getParameters().put('id',acct.PersonContactId);
        /* generate the pdf blob */
        Blob pdfBlob;
        if(Test.isRunningTest()) { 
            pdfBlob = blob.valueOf('Unit.Test');
        } else {
            pdfBlob = pdfPage.getContent();
        }
        /* create the attachment against the offer */
        Attachment a = new Attachment(parentId = acct.id, name='Isolation Release Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        if(acct.PersonEmail==null)
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please make sure the email is updated on the Case.'));
        else{
            /* insert the attachment */
        	insert a;
        	sendemail('Isolation_Release_Note',a);
        	ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,' Isolation Release Note attached and sent.'));
        }
    }
    public void AttachQuarantineNote(){
        displayPopupQN = false; 
        /* Get the page definition */
        PageReference pdfPage = Page.CNPH_QuarantineNote;
        pdfPage.getParameters().put('id',acct.id);
        /* generate the pdf blob */
        Blob pdfBlob;
        if(Test.isRunningTest()) { 
            pdfBlob = blob.valueOf('Unit.Test');
        } else {
            pdfBlob = pdfPage.getContent();
        }
        /* create the attachment against the offer */
        Attachment a = new Attachment(parentId = acct.id, name='Quarantine Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        if(acct.PersonEmail==null)
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please make sure the email is updated on the Contact'));
        else{
        	/* insert the attachment */
        	insert a;
            sendemail('Contact_Email_Quarantine_Intimation_w_Covid_Packet',a);
        	ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,' Quarantine Note attached and sent.'));
        }
    }    
    public void AttachQuarantineReleaseNote(){
        displayPopupQRN = false; 
        /* Get the page definition */
        PageReference pdfPage = Page.CNPH_QuarantineReleaseNote;
        pdfPage.getParameters().put('id',acct.PersonContactId);
        /* generate the pdf blob */
        Blob pdfBlob;
        if(Test.isRunningTest()) { 
            pdfBlob = blob.valueOf('Unit.Test');
        } else {
            pdfBlob = pdfPage.getContent();
        }
        /* create the attachment against the offer */
        Attachment a = new Attachment(parentId = acct.id, name='Quarantine Release Note '+Datetime.now().format() + '.pdf', body = pdfBlob);
        if(acct.PersonEmail==null)
            ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR,' Please make sure the email is updated on the Contact'));
        else{
            /* insert the attachment */
        	insert a;
        	sendemail('Quarantine_Release_Note',a);
        	ApexPages.addmessage(new ApexPages.message(ApexPages.severity.CONFIRM,' Quarantine Release Note attached and sent.'));
        }
    } 
    public void sendemail(String template,Attachment file){
        Messaging.EmailFileAttachment efa = new Messaging.EmailFileAttachment();
      	efa.setFileName(file.Name);
      	efa.setBody(file.Body);
      	efa.setContentType(file.ContentType);
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.setTargetObjectId(acct.PersonContactId); 
        message.setBccSender(false); 
        OrgWideEmailAddress OWE=[SELECT Id FROM OrgWideEmailAddress WHERE DisplayName = 'No Reply - Cherokee Public Health'];
        message.setOrgWideEmailAddressId(OWE.id);
        message.setUseSignature(false);
        message.setFileAttachments(new Messaging.EmailFileAttachment[] {efa});
        message.bccaddresses= new String[] { UserInfo.getUserEmail()};
        //message.ccaddresses= new String[] { UserInfo.getUserEmail()};
        message.setReplyTo(UserInfo.getUserEmail());
        message.setSaveAsActivity(true); 
        EmailTemplate emailTemplate = [Select Id,Subject,Description,HtmlValue,DeveloperName,Body from EmailTemplate where DeveloperName =:template];
        message.setTemplateID(emailTemplate.Id); 
        message.setWhatId(acct.Id); //This is important for the merge fields in template to work
        message.toAddresses =  new String[] { acct.PersonEmail};
        Messaging.SingleEmailMessage[] messages = new List<Messaging.SingleEmailMessage> {message};
        if(!test.isRunningTest())
        	Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
    }
}