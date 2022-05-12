/*--------------------------------------------------------------------------------------------------------------
 @Author: Zeeshan Haider
 @Date: Sep/9/2021
 @Purpose: This class is used as a wrapper  for Community_VaccineLotteryController class.
 ---------------------------------------------------------------------------------------------------------------*/
 public class Community_VaccineLotteryWrapper{

	@AuraEnabled
	public Map<String, List<String>> cs_PickListMap;

    @AuraEnabled
	public Map<String, String> vax_PickListMap;

	@AuraEnabled
	public Map<string, string> statesMap{ get; set; }

	@AuraEnabled
	public Account acnt{ get; set; }

	@AuraEnabled
	public Case caseObj{ get; set; }

	@AuraEnabled
	public Boolean caseExists{ get; set;}

	@AuraEnabled
	public String exceptionMsg{ get; set; }

    @AuraEnabled
	public List<String> fileids{ get; set; }

    @AuraEnabled
	public Boolean isUnder18{ get; set; }
}