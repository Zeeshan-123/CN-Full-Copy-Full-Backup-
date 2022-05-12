/**********************************
@author: Shams
@date: 17/10/2020
@purpose: Controller Class for jQueryDataTable
***********************************/

public with sharing class CT_RecordsFollowedByMonth {
    
    static Date startdate;
    static Date enddate;
    @AuraEnabled
    public static Datetime startdate(){
        if(startdate==null)
        { 
            startdate=system.today();
            startdate=Datetime.newInstance(startdate.year(),startdate.month(), startdate.day()-1).date();
        }
        return startdate;
    }
    @AuraEnabled
    public static Datetime enddate(){
        if(enddate==null)
        {
            enddate=system.today();
        }
        return enddate;
    }
    
    @AuraEnabled
    public static list <PersonLifeEvent> fetchPLA(Date startdateNew,Date EnddateNew,String ContactOrCase) {
        if(startdateNew==null)
        {
            startdateNew=system.today();
            startdateNew=Datetime.newInstance(startdateNew.year(),startdateNew.month(), startdateNew.day()-1).date();
        }
        if(EnddateNew==null)
        {
            EnddateNew=system.today();
        }
        
        //quer records that meet filter criteria
        List<PLEWrapper> PLElistnew=New List<PLEWrapper>();
        List<PersonLifeEvent> PLElist;
        if(ContactOrCase=='Case')
        	PLElist = [SELECT Custom_ID__c,PrimaryPerson.Account.Converted_Date__c,PrimaryPerson.Account.id,Account_Name__c,Active_or_Inactive__c,Contactor_Case__c,Contact_ID__c,Case_ID__c,Date__c,PrimaryPerson.Account.Contact_or_Case_new__c,EventDate,ExpirationDate,PrimaryPerson.Account.Name,PrimaryPerson.Account.Case_Status__c,Name,EventType,PrimaryPerson.Account.Legacy_Case_ID__c,PrimaryPerson.Account.Legacy_Case_Number__c  FROM PersonLifeEvent
                                        where ((eventtype='Isolated' and PrimaryPerson.Account.Contact_or_Case_new__c='Case'))
                                        and ((DAY_ONLY(EventDate)>=:startdateNew and DAY_ONLY(EventDate)<=:EnddateNew) OR (DAY_ONLY(ExpirationDate)>=:startdateNew and DAY_ONLY(ExpirationDate)<=:EnddateNew)) and PrimaryPersonId!=null order by EventDate limit 50000
                                       ];
        if(ContactOrCase=='Contact')
        	PLElist = [SELECT Custom_ID__c,PrimaryPerson.Account.Converted_Date__c,PrimaryPerson.Account.id,Account_Name__c,Active_or_Inactive__c,Contactor_Case__c,Contact_ID__c,Case_ID__c,Date__c,PrimaryPerson.Account.Contact_or_Case_new__c,EventDate,ExpirationDate,PrimaryPerson.Account.Name,PrimaryPerson.Account.Case_Status__c,Name,EventType,PrimaryPerson.Account.Legacy_Case_ID__c,PrimaryPerson.Account.Legacy_Case_Number__c  FROM PersonLifeEvent
                                        where ((eventtype='Quarantined' and PrimaryPerson.Account.Contact_or_Case_new__c='Contact') or (eventtype='Quarantined' and PrimaryPerson.Account.Contact_or_Case_new__c='Case' and PrimaryPerson.Account.Converted_Date__c!=null))
                                        and ((DAY_ONLY(EventDate)>=:startdateNew and DAY_ONLY(EventDate)<=:EnddateNew) OR (DAY_ONLY(ExpirationDate)>=:startdateNew and DAY_ONLY(ExpirationDate)<=:EnddateNew)) and PrimaryPersonId!=null order by EventDate limit 50000
                                       ];
        
        for(PersonLifeEvent PLE:PLElist){
            DateTime ConvertedDate;
            if(ple.PrimaryPerson.Account.Converted_Date__c!=null){
                Integer offsetCD = UserInfo.getTimezone().getOffset(ple.PrimaryPerson.Account.Converted_Date__c);
                ConvertedDate=ple.PrimaryPerson.Account.Converted_Date__c.addSeconds(offsetCD/1000);
            }
            //check if expiration date is different then the event start date
            if(PLE.ExpirationDate!=null){
                Integer offset = UserInfo.getTimezone().getOffset(PLE.EventDate);
				PLE.EventDate=PLE.EventDate.addSeconds(offset/1000);
                Integer offsete = UserInfo.getTimezone().getOffset(PLE.ExpirationDate);
				PLE.ExpirationDate=PLE.ExpirationDate.addSeconds(offsete/1000);
                
                String EventDate=PLE.EventDate.format('MMMM')+'/'+PLE.EventDate.format('yyyy');
                String ExpDate=PLE.ExpirationDate.format('MMMM')+'/'+PLE.ExpirationDate.format('yyyy');
                //System.debug(ple.PrimaryPersonId);
                if(EventDate!=ExpDate)
                {
                    if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew)){
                        PLE.Date__c=PLE.EventDate.format('MMMM/yyyy');
                        PLE.Date2__c=PLE.EventDate;
                        PLE=SetExPLE(PLE);
                        PLElistnew.add(new PLEWrapper(PLE));
                    }
                       //System.debug(PLE.PrimaryPerson.Account.name);
                    if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew){
                           PersonLifeEvent PLEnew=new PersonLifeEvent();
                           PLEnew.Date__c=PLE.ExpirationDate.format('MMMM/yyyy');
                           PLEnew.Date2__c=PLE.ExpirationDate;
                           PLEnew=SetNewPLE(PLEnew,PLE);
                           PLEnew.PrimaryPersonId=PLE.PrimaryPersonId;
                           PLElistnew.add(new PLEWrapper(PLEnew));
                    }
                    if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                        //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                        if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year())
                        {
                            if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                           		PLElistnew.add(new PLEWrapper(SetConvertedPLE(PLE)));
                        }
                    }
                    //System.debug(PLE.PrimaryPerson.Account.name);
                    //System.debug(PLE.Date__c+':'+PLETemp.Date__c);
                }else{
                    if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew)){
                    PLE.Date__c=PLE.EventDate.format('MMMM/yyyy');
                    PLE.Date2__c=PLE.EventDate;
                    PLE=SetExPLE(PLE);
                    PLElistnew.add(new PLEWrapper(PLE));
                    if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                        //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                        if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year())
                        {
                            if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                           		PLElistnew.add(new PLEWrapper(SetConvertedPLE(PLE)));
                        }
                    }
                    }
                    
                    //System.debug(PLE.PrimaryPerson.Account.name);
                }
            }else{
                
                Integer offset = UserInfo.getTimezone().getOffset(PLE.EventDate);
				PLE.EventDate=PLE.EventDate.addSeconds(offset/1000);
                if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew)){
                PLE.Date__c=PLE.EventDate.format('MMMM/yyyy');
                PLE.Date2__c=PLE.EventDate;
                PLE=SetExPLE(PLE);
                PLElistnew.add(new PLEWrapper(PLE));
                    
                    if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                        PLE.ExpirationDate=ple.EventDate;
                        //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                        if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year())
                        {
                            if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                           		PLElistnew.add(new PLEWrapper(SetConvertedPLE(PLE)));
                        }
                    }
                }
                //System.debug(PLE.PrimaryPerson.Account.name);
            }
            //if(PLE.Date__c!=null){
            //system.debug(PLE.Date__c);
            //system.debug(PLE.EventDate.format('MMMM')+'/'+PLE.EventDate.format('yyyy'));
            //system.debug(PLE.EventDate.format('MMMM/YYYY'));
            //    system.debug('-------');
            //}
        }
        PLElistnew.sort();
        List<PersonLifeEvent> PLEupdate=new List<PersonLifeEvent>();
        for(PLEWrapper PLE:PLElistnew){
            //system.debug(PLE.PLE.Date__c);
            if(ContactORCase=='Case' && PLE.PLE.Contactor_Case__c=='Case')
           		PLEupdate.add(PLE.PLE);
            else if(ContactORCase=='Contact' && PLE.PLE.Contactor_Case__c=='Contact')
                PLEupdate.add(PLE.PLE);
            system.debug(PLE.PLE.Account_Name__c+PLE.PLE.Contactor_Case__c);
        }
        return PLEupdate;
    }
    //set account values
    private static PersonLifeEvent SetExPLE(PersonLifeEvent PLE){
        ple.Custom_ID__c=ple.id;
        PLE.Account_Name__c=PLE.PrimaryPerson.Account.Name;
        PLE.Active_or_Inactive__c=PLE.PrimaryPerson.Account.Case_Status__c;
        PLE.Contactor_Case__c=PLE.PrimaryPerson.Account.Contact_or_Case_new__c;
        PLE.Contact_ID__c=PLE.PrimaryPerson.Account.Legacy_Case_ID__c;
        PLE.Case_ID__c=PLE.PrimaryPerson.Account.Legacy_Case_Number__c;
        return PLE; 
    }
    //set new life event if contact converted into a case
    private static PersonLifeEvent SetConvertedPLE(PersonLifeEvent PLE){
        PersonLifeEvent PLEnew=new PersonLifeEvent();
        //PLE.Contactor_Case__c='Contact';
        PLE.Date__c=PLE.ExpirationDate.format('MMMM/yyyy');
        PLE.Date2__c=PLE.ExpirationDate;
        PLEnew=SetNewPLE(PLEnew,PLE);
        PLEnew.Date__c=PLE.ExpirationDate.format('MMMM/yyyy');
        PLEnew.Date2__c=PLE.ExpirationDate;
        PLEnew.Contactor_Case__c='Contact';
        PLEnew.PrimaryPersonId=PLE.PrimaryPersonId;
        return PLEnew;
    }
    //set life event and account values
    private static PersonLifeEvent SetNewPLE(PersonLifeEvent PLENew,PersonLifeEvent PLEold){
        PLEnew.Account_Name__c=PLEold.PrimaryPerson.Account.Name;
        PLEnew.Custom_ID__c=PLEold.id;
        PLEnew.Active_or_Inactive__c=PLEold.PrimaryPerson.Account.Case_Status__c;
        PLEnew.Contactor_Case__c=PLEold.PrimaryPerson.Account.Contact_or_Case_new__c;
        PLEnew.Contact_ID__c=PLEold.PrimaryPerson.Account.Legacy_Case_ID__c;
        PLEnew.Case_ID__c=PLEold.PrimaryPerson.Account.Legacy_Case_Number__c;
        PLEnew.EventDate=PLEold.EventDate;
        PLEnew.ExpirationDate=PLEold.ExpirationDate;
        PLEnew.name=PLEold.name;
        PLEnew.EventType=pleold.EventType;
        return PLEnew;
    }
    public class PLEWrapper implements Comparable {
        
        public personlifeevent PLE;
        
        // Constructor
        public PLEWrapper(personlifeevent op) {
            PLE = op;
        }
        
        // Compare lifeEvent based on the personlifeevent amount.
        public Integer compareTo(Object compareTo) {
            // Cast argument to PLEWrapper
            PLEWrapper compareToPLE = (PLEWrapper)compareTo;
            
            // The return value of 0 indicates that both elements are equal.
            Integer returnValue = 0;
            if (PLE.Date2__c > compareToPLE.PLE.Date2__c) {
                // Set return value to a positive value.
                returnValue = 1;
            } else if (PLE.Date2__c < compareToPLE.PLE.Date2__c) {
                // Set return value to a negative value.
                returnValue = -1;
            }
            
            return returnValue;       
        }
    }
}