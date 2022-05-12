/**
 * @author Zeeshan Haider
 * @version 1.0
 * @since 27/09/2021
 */
public class ProcessResponse {
	@AuraEnabled
	public Account acnt{ get; set; }

	@AuraEnabled
	public Case caseObj{ get; set; }
    
    @AuraEnabled
	public Boolean caseExists{ get; set;}
    
    @AuraEnabled
	public String errorCode{ get; set; }
    
    @AuraEnabled
	public String errorMsg{ get; set; }
    
}