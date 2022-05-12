/*--------------------------------------------------------------------------
@author: Zeeshan
@date: 29/11/2021
@purpose: Clothing Voucher (CA2) duplicate Student ID validation
---------------------------------------------------------------------------*/
public class CAStudent2TriggerHandler {
    public void handleBeforeDelete(List<CA_Student2__c> HMlist){
       // List<CA_Student_Archive__c> CAarchList=new list<CA_Student_Archive__c>();
        //for(CA_Student2__c HM:HMlist){
          //  CA_Student_Archive__c CAarch=new CA_Student_Archive__c();
            //CAarch.Account__c=HM.Account__c;
            //CAarch.Citizen_ID__c=HM.Citizen_ID__c;
            //CAarch.Date_of_Birth__c=HM.Date_of_Birth__c;
            //CAarch.Request__c=HM.Request__c;
            //CAarch.Sector__c=HM.Sector__c;
            //CAarch.Created_date__c=HM.CreatedDate;
            //CAarch.Deleted_Date__c=system.now();
            //CAarch.Grade__c=HM.Grade__c;
            //CAarchList.add(CAarch);
        //}
        //Database.insert(CAarchList,false);
    }
    public void handleBeforeInsert(List<CA_Student2__c> HMlist){
        List<String> Cid=new list<String>();
        List<String> Reqid=new list<String>();
        //create citizen id map
        for(CA_Student2__c HM:HMlist){
            if(HM.Citizen_ID__c!=null){
                Cid.add(HM.Citizen_ID__c);
                Reqid.add(HM.Request__c);
            }
        }
        //query requests and Household Members if Citizen id already exists
        List<CA_Student2__c> HMmatchinglist=[select id,Request__c,Citizen_Id__c from CA_Student2__c where Citizen_Id__c in :Cid and Request__c in:Reqid and id not in :HMlist];
        List<Account> Alist=[select id,HealthCloudGA__Gender__pc,Is_Void__c,Stop_Flag__c,FirstName,LastName,Date_of_Birth__c,Tribe_Id__c,DOD__c,Finalized_Date_of_Relinquishment__c,If_CN_Citizen__c from Account where Tribe_Id__c in :Cid and recordtype.developername='CN_Registration'];
        Map<String,CA_Student2__c> HMmap=new Map<String,CA_Student2__c>();
        Map<String,Account> Amap=new Map<String,Account>();
        //create maps
        for(Account A:Alist){
            Amap.put(A.Tribe_Id__c,A);
        }
        for(CA_Student2__c HM:HMmatchinglist){
            HMmap.put(HM.Citizen_Id__c,HM);
        }
        for(CA_Student2__c HM:HMlist){
            //if already exists on another request throw error
            if(HMmap.get(HM.Citizen_ID__c)!=null){
                if(HMmap.get(HM.Citizen_ID__c).Request__c == HM.Request__c)
                {HM.addError(Label.RRR_Citizen_id_Duplicate_error);}
            }
            //if no citizen exists throw error
            if(Amap.get(HM.Citizen_ID__c)==null){
                HM.addError(Label.RRR_no_Citizen_found);
            }
            //if Citizen account found
            else if(Amap.get(HM.Citizen_ID__c)!=null){
                Account AC=Amap.get(HM.Citizen_ID__c);
                //if DOD is set
                if(AC.DOD__c!=null)
                {HM.addError(Label.RRR_Deceased_p1+AC.Tribe_Id__c+Label.RRR_Deceased_p2);}
                //if not a citizen
                else if(AC.If_CN_Citizen__c!='Yes')
                {HM.addError(Label.RRR_invalid_citizen);}
                //is void is set
                else if(AC.Is_Void__c=='Yes')
                {HM.addError(Label.RRR_invalid_citizen);}
                //stop flag is set
                //else if(AC.Stop_Flag__c=='Yes')
                //    HM.addError(Label.RRR_invalid_citizen);
                //if DOB wrong throw error
                else if(AC.Date_of_Birth__c!=HM.Date_of_Birth__c){
                    HM.addError(Label.RRR_no_Citizen_found);
                }
                //else if allowed to be created
                else{
                    //set found citizen id
                    HM.Account__c=AC.id;
                    HM.First_Name__c=AC.FirstName;
                    HM.Last_Name__c=AC.LastName;
                }
            }
        }
    }
    public void handleBeforeUpdate(List<CA_Student2__c> HMlist, String userProfile)
    {
            List<String> caseIds = new List<String>();
        if(userProfile != 'CN Customer Community Plus Login User')
        {
            
            List<CA_Student2__c> studentsWithdraw = new List<CA_Student2__c>();
            List<Case> cases = new List<Case>();
            List<String> Cid=new list<String>();
            List<String> Reqid=new list<String>();
            //create citizen id map
            for(CA_Student2__c HM:HMlist){
                if(HM.Citizen_ID__c!=null && HM.Withdraw__c){
                    Cid.add(HM.Citizen_ID__c);
                    Reqid.add(HM.Request__c);
                }
            }
            
            
            CA_Student2__c student = HMlist[0];
            if(student.Withdraw__c){
                List<CA_Student2__c> std = [Select Id, Withdraw__c, Citizen_ID__c, Duplicate__c,Request__r.Id FROM CA_Student2__c 
                                                    WHERE Withdraw__c=false and Citizen_ID__c=:student.Citizen_ID__c and Id!=:student.Id];
                if(std.size() == 1 ){
                    for(CA_Student2__c s:std){
                        s.Duplicate__c = false;
                        caseIds.add(s.Request__r.Id);
                    }
                    update std;
                    List<CA_Student2__c> ss = [Select Id, Withdraw__c, Citizen_ID__c, Duplicate__c,Request__r.Id FROM CA_Student2__c 
                                                       WHERE Withdraw__c=true and Duplicate__c=true and Citizen_ID__c=:student.Citizen_ID__c];
                    for(CA_Student2__c s:ss){
                        s.Duplicate__c = false;
                        caseIds.add(s.Request__r.Id);
                    }
                    update ss;
                }
                if(std.size() <= 1){
                    student.Duplicate__c = false;
                }
            }
            
            List<CA_Student2__c> recipStd = [Select Id FROM CA_Student2__c WHERE Request__r.Id IN:caseIds and Duplicate__c=true];
            if(recipStd.size() < 1){
                List<Case> recipRequests = [Select Id,Status FROM Case WHERE Id IN:caseIds and Status='UNDER REVIEW'];
            
                for(Case c:recipRequests){
                    c.Status = 'In Progress';
                }            
                update recipRequests;
            }
            
        }
    }
    public void handleAfterUpdate(List<CA_Student2__c> HMlist, String userProfile)
    {
        if(userProfile != 'CN Customer Community Plus Login User')
        {
            System.debug('---------------After Update-------------');
            List<CA_Student2__c> studentsWithdraw = new List<CA_Student2__c>();
            List<Case> cases = new List<Case>();
            List<String> Cid=new list<String>();
            List<String> Reqid=new list<String>();
            //create citizen id map
            for(CA_Student2__c HM:HMlist){
                if(HM.Citizen_ID__c!=null && HM.Withdraw__c){
                    Cid.add(HM.Citizen_ID__c);
                    Reqid.add(HM.Request__c);
                }
            }
            if(Reqid.size() > 0){
            studentsWithdraw = [Select Id,Withdraw__c FROM CA_Student2__c WHERE Request__c IN:Reqid and Withdraw__c=false];
            List<ContentDocumentLink> docs = [Select Id FROM ContentDocumentLink WHERE LinkedEntityId IN:Reqid];
            cases = [Select Id,Status, Resubmit__c, Withdraw__c FROM Case WHERE Id IN:Reqid];
            System.debug(Reqid);
            System.debug(cases.size());
            for(Case cse:cases)
            {
                if(studentsWithdraw.size() > 0 && docs.size() > 0)
                {
                    System.debug('studentsWithdraw > 0');
                    //This has been comment out on client request see CHERNCP-318
                   // cse.Status = 'In Progress';
                }
                
               // cse.Resubmit__c = true;
                
                if(studentsWithdraw.size() < 1){
                    System.debug('studentsWithdraw < 1');
                    //cse.Withdraw__c = true;
                   // cse.Status = 'WITHDRAWN';
                }
            }
            update cases;
            }
        }    
    }
}