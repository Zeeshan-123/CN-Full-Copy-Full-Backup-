/**
* @author Zeeshan Haider
* @version 1.0
* @since 27/09/2021
*/
public class GenericResponse {
    
    @AuraEnabled
	public String statusCode{ get; set; }

	@AuraEnabled
	public String statusDescription{ get; set; }
    
    @AuraEnabled
    public Object data {get; set; }
    
    @AuraEnabled
    public Map<String, String> errors {get; set; }
    
}