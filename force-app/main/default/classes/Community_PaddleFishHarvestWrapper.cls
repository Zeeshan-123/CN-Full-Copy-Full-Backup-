/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date: July/15/2021
 @Purpose: This class is used as a wrapper  for Community_HuntingDrawAppController class.
 ---------------------------------------------------------------------------------------------------------------*/

public class Community_PaddleFishHarvestWrapper {
    @AuraEnabled
	public Account acnt{ get; set; }


    @AuraEnabled
	public String exceptionMsg{ get; set; }
    
    

    
    @AuraEnabled
    public Map<String, String> riverSystemMap {get;set;}
    
    public Community_PaddleFishHarvestWrapper(Account acnt, Map<String, String> riverSystemMap){
     this.riverSystemMap = riverSystemMap; 
     this.acnt = acnt; 
                   
    }


}