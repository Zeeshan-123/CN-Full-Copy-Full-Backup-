/*--------------------------------------------------------------------------
@author: Shams
@date: 4/19/2021
@purpose: RRR duplicate Citizen ID validation
---------------------------------------------------------------------------*/
public class HouseHoldMemberTriggerHandler {
    public void handleBeforeInsert(List<Household_Member__c> HMlist){
        List<String> Cid=new list<String>();
        //create citizen id map
        for(Household_Member__c HM:HMlist){
            if(HM.Citizen_ID__c!=null){
                Cid.add(HM.Citizen_ID__c);
            }
        }
        //query requests and Household Members if Citizen id already exists
        List<Case> Clist=[select id,Citizen_ID__c from Case where Citizen_ID__c in :Cid  and recordtype.developername='RRR'];
        List<Household_Member__c> HMmatchinglist=[select id,Citizen_Id__c from Household_Member__c where Citizen_Id__c in :Cid and id not in :HMlist];
        List<Account> Alist=[select id,HealthCloudGA__Gender__pc,Is_Void__c,Stop_Flag__c,FirstName,LastName,Date_of_Birth__c,Tribe_Id__c,DOD__c,Finalized_Date_of_Relinquishment__c,If_CN_Citizen__c from Account where Tribe_Id__c in :Cid and recordtype.developername='CN_Registration'];
        Map<String,Case> Cmap=new Map<String,Case>();
        Map<String,Household_Member__c> HMmap=new Map<String,Household_Member__c>();
        Map<String,Account> Amap=new Map<String,Account>();
        //create maps
        for(Account A:Alist){
            Amap.put(A.Tribe_Id__c,A);
        }
        for(Case C:Clist){
            Cmap.put(C.Citizen_ID__c,C);
        }
        for(Household_Member__c HM:HMmatchinglist){
            HMmap.put(HM.Citizen_Id__c,HM);
        }
        for(Household_Member__c HM:HMlist){
            if(!HM.Bypass__c){
                //if already exists on another request throw error
                if(Cmap.get(HM.Citizen_ID__c)!=null || HMmap.get(HM.Citizen_ID__c)!=null){
                    if(Cmap.get(HM.Citizen_ID__c)!=null){
                        if(Cmap.get(HM.Citizen_ID__c).id==HM.Request__c){
                            HM.addError(Label.RRR_CitID_same_as_App_p1+HM.Citizen_Id__c+' '+Label.RRR_CitID_same_as_App_p2);
                        }else
                            HM.addError(Label.RRR_Citizen_id_Duplicate_error);
                    }else
                        HM.addError(Label.RRR_Citizen_id_Duplicate_error);
                }
                //if no citizen exists throw error
                else if(Amap.get(HM.Citizen_ID__c)==null){
                    HM.addError(Label.RRR_no_Citizen_found);
                }
                //if Citizen account foundt
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
                        //set found citizen id and remaining details
                        HM.AccountId__c=AC.id;
                        HM.First_Name__c=AC.FirstName;
                        //if female dont owerrite the last name
                        if(AC.HealthCloudGA__Gender__pc!=Label.RRR_female){
                            HM.Last_Name__c=AC.LastName;
                        }  
                    }
                }
            }
        }
    }
    public void handleBeforeUpdate(List<Household_Member__c> HMlist,Map<id,Household_Member__c> oldHMmap){
        Map<id,boolean> nameNotupdated=new Map<id,boolean>();
        List<id> Reqid=new list<id>();
        //create citizen id map
        for(Household_Member__c c:HMlist){
            if(c.bypass__c){
              Reqid.add(c.request__c);
            }
        }
        List<Household_Member__c> AllpendingHMlist=[select id,request__c from Household_Member__c where request__c in :Reqid and status__c='NAME CORRECTION REQUIRED'  ];
        for(Household_Member__c HM:AllpendingHMlist){
            system.debug(HM.Request__c);
            if(nameNotupdated.get(HM.Request__c)==null){
                nameNotupdated.put(HM.Request__c,true);
            }
        }
        for(Household_Member__c HM:HMlist){
            Household_Member__c oldHM=oldHMmap.get(HM.id);
            if(HM.Status__c!=oldHM.Status__c && oldHM.Status__c=='NAME CORRECTION REQUIRED' && HM.Status__c=='In Progress'){
                HM.Name_Fixed__c=true;
                if(nameNotupdated.get(HM.Request__c)!=null){
                    //HM.addError(Label.Community_RRR_Name_Not_fixed);
                }
            }
        }
    }
    public void handleAfterUpdate(List<Household_Member__c> HMlist,Map<id,Household_Member__c> oldHMmap){
        Map<id,Household_Member__c> HHMap=new Map<id,Household_Member__c>();
        List<Case> CaseUpdateList=new List<Case>();
        for(Household_Member__c HM:HMlist){
            //get old object
            Household_Member__c oldHM=oldHMmap.get(HM.id);
            //Check if name updated
            if(/*(!HM.Last_Name__c.equals(oldHM.Last_Name__c) || !HM.First_Name__c.equals(oldHM.First_Name__c)  || HM.Status__c!=oldHM.Status__c) &&*/ hm.Bypass__c){
                HHMap.put(HM.Request__c,HM);
            }
        }
        //query the RRR requests which are to be updated
    List<case> Caselist=[select id,Primary_Contact_Last_Name__c,status,Primary_Contact_First_Name__c from case where id =:HHMap.keySet()];
        //iterate over the RRR requests
        for(case RRRreq:Caselist){
            //Set name
            Household_Member__c HMrec=HHMap.get(RRRreq.id);
            try{
                if(!RRRreq.Primary_Contact_Last_Name__c.equals(HMrec.Last_Name__c) || !RRRreq.Primary_Contact_First_Name__c.equals(HMrec.First_Name__c)){// || RRRreq.Status!=HMrec.Status__c){
                    RRRreq.Primary_Contact_Last_Name__c=HMrec.Last_Name__c;
                    RRRreq.Primary_Contact_First_Name__c=HMrec.First_Name__c;
                    //RRRreq.Status=HMrec.Status__c;
                    CaseUpdateList.add(RRRreq);
                }
            }
            catch(Exception e){
                if(RRRreq.Primary_Contact_Last_Name__c!=HMrec.Last_Name__c || RRRreq.Primary_Contact_First_Name__c!=HMrec.First_Name__c){// || RRRreq.Status!=HMrec.Status__c){
                    RRRreq.Primary_Contact_Last_Name__c=HMrec.Last_Name__c;
                    RRRreq.Primary_Contact_First_Name__c=HMrec.First_Name__c;
                    //RRRreq.Status=HMrec.Status__c;
                    CaseUpdateList.add(RRRreq);
                }
            }
        }
        if(CaseUpdateList.size()>0){
            //update name on parent RRR request
            database.update(CaseUpdateList,false);
        }
    }
    public void handleBeforeDelete(List<Household_Member__c> HMlist){
        //create citizen id map
        for(Household_Member__c HM:HMlist){
            //check if bypass is true
            if(HM.Bypass__c){
                //throw an error on delete
                HM.addError(Label.RRR_HH_delete_error);
            }
        }
    }
}