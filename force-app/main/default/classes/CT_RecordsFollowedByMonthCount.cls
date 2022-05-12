/**********************************
@author: Shams
@date: 12/11/2020
@purpose: Controller Class for CT_RecordsFollowedByMonthCount
***********************************/

public with sharing class CT_RecordsFollowedByMonthCount {
    
    private static Integer ContactCount;
    private static Integer CaseCount;
    private static Map<String,integer> CaseMap;
    private static Map<String,integer> ContactMap;
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
    public static Map<String,Integer> fetchPLA(Date startdateNew,Date EnddateNew,String ContactOrCase) {
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
        List<PersonLifeEvent> PLElist;
        ContactCount=0;
        CaseCount=0;
        CaseMap=new Map<String,integer>();
        ContactMap=new Map<String,integer>();
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
                    if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew))
                        setMap(PLE.EventDate.format('MMMM/yyyy'),PLE.PrimaryPerson.Account.Contact_or_Case_new__c);
                    
                    if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                        setMap(PLE.ExpirationDate.format('MMMM/yyyy'),PLE.PrimaryPerson.Account.Contact_or_Case_new__c);
                    
                    if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                        //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                        if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year()){
                            if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                                setMap(PLE.ExpirationDate.format('MMMM/yyyy'),'Contact');
                        }
                    }
                    
                }else{
                    if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew)){
                        setMap(PLE.EventDate.format('MMMM/yyyy'),PLE.PrimaryPerson.Account.Contact_or_Case_new__c);
                        
                        if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                            //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                            if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year()){
                                if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                                    setMap(PLE.ExpirationDate.format('MMMM/yyyy'),'Contact');
                            }
                        }
                    }
                }
            }else{
                
                Integer offset = UserInfo.getTimezone().getOffset(PLE.EventDate);
                PLE.EventDate=PLE.EventDate.addSeconds(offset/1000);
                if(ple.eventdate.date()>=startdateNew && (ple.eventdate.date()<=EnddateNew)){
                    setMap(PLE.EventDate.format('MMMM/yyyy'),PLE.PrimaryPerson.Account.Contact_or_Case_new__c);
                    if(ConvertedDate!=null && ple.PrimaryPerson.Account.Contact_or_Case_new__c=='Case' && ple.eventtype=='Quarantined'){
                        PLE.ExpirationDate=ple.EventDate;
                        //system.debug('inside case duplicate:'+PLE.EventDate.date().month()+':'+ple.PrimaryPerson.Account.Converted_Date__c.date().month());
                        if(PLE.ExpirationDate.date().month()==ConvertedDate.date().month() && PLE.ExpirationDate.date().year()==ConvertedDate.date().year()){
                            if(ple.ExpirationDate.date()<=EnddateNew && ple.ExpirationDate.date()>=startdateNew)
                                setMap(PLE.ExpirationDate.format('MMMM/yyyy'),'Contact');
                        }
                    }
                }
            }
        }
        if(ContactORCase=='Case')
            return CaseMap;
        else
            return ContactMap;
        
    }
    
    private static void setMap(String Month,String CoC){
        if(CoC=='Case'){
            if(Casemap.get(Month)!=null){
                CaseCount=Casemap.get(Month)+1;
                Casemap.remove(Month);
                Casemap.put(Month, CaseCount);
            }
            else
            	Casemap.put(Month, 1);
        }
        else{
            if(ContactMap.get(Month)!=null){
                ContactCount=ContactMap.get(Month)+1;
                ContactMap.remove(Month);
                ContactMap.put(Month, ContactCount);
            }
            else
            	ContactMap.put(Month, 1);

        }
    }
}