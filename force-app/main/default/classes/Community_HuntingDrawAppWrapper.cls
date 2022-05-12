/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date: July/15/2021
 @Purpose: This class is used as a wrapper  for Community_HuntingDrawAppController class.
 ---------------------------------------------------------------------------------------------------------------*/
public class Community_HuntingDrawAppWrapper{
	// @AuraEnabled
	// public Map<String, String> categories{ get; set; }

	// @AuraEnabled
	// public Map<String, String> requestingPerson{ get; set; }

	@AuraEnabled
	public Map<String, List<String>> cs_PickListMap;

	@AuraEnabled
	public Map<string, string> statesMap{ get; set; }

	@AuraEnabled
	public Account acnt{ get; set; }

	@AuraEnabled
	public Case caseObj{ get; set; }

	@AuraEnabled
	public Boolean caseExists{ get; set;}

	@AuraEnabled
	public String[] huntCategories{ get; set; }

	@AuraEnabled
	public String[] huntEvents{ get; set; }

	@AuraEnabled
	public String exceptionMsg{ get; set; }

	@AuraEnabled
	public String fileid{ get; set; }
    
    @AuraEnabled
	public String filename{ get; set; }
}