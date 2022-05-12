/*--------------------------------------------------------------------------------------------------------------
@Author: Alishba Asif
@Date: Sept/09/2021
@Purpose: This class is used as controller for Community_SurveyNotification vfc.
---------------------------------------------------------------------------------------------------------------*/

public without sharing class Community_SurveyNotificationCntrl
{
    
    
    public String cId {get;}
    public String uId;
    public string getuId(){ return uId;}
    
    public String uEmail;
    public string getuEmail(){ return uEmail;}
    
    public String uLastName;
    public string getuLastName(){ return uLastName;}
    
    public String uFirstName;
    public string getuFirstName(){ return uFirstName;}
  
 	public void setcId(string contid)
    {
        user[] objUser = [select id,FirstName,LastName,Email,username from user where contactId  = : contid limit 1];
        if(objUser.size() > 0){
            
         uId= objUser[0].id;
         uEmail= objUser[0].Email;
         uFirstName= objUser[0].FirstName;
         uLastName= objUser[0].LastName;

        }
  }
    

}