/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date: July/15/2021
 @Purpose: This class is used as a wrapper  for Community_HuntingDrawAppController class.
 ---------------------------------------------------------------------------------------------------------------*/

public class Community_SurveyFormWrapper {
    @AuraEnabled
	public Account acnt{ get; set; }

	@AuraEnabled
	public Case caseObj{ get; set; }

	@AuraEnabled
	public Boolean caseExists{ get; set;}

    @AuraEnabled
	public String exceptionMsg{ get; set; }


}