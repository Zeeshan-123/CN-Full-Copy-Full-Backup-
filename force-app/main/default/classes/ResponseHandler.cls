/**
* @author Zeeshan Haider
* @version 1.0
* @since 27/09/2021
*/
public class ResponseHandler {
    public static GenericResponse getSuccessResponseWithData(ProcessResponse data) {
        GenericResponse response = new GenericResponse();
        response.data = data;
        response.statusCode = AppConstants.RESPONSE_CODE_OK;
        response.statusDescription = AppConstants.RESPONSE_MESSAGE_OK;
        return response;
    }
    
    public static GenericResponse getSuccessResponse() {
        GenericResponse response = new GenericResponse();
        response.statusCode = AppConstants.RESPONSE_CODE_OK;
        response.statusDescription = AppConstants.RESPONSE_MESSAGE_OK;
        return response;
    }
}