/**
 * BitlyMockHttpResponseGenerator
 * Mock Response class for SL_Batch_UpdateFluTestResultLink_Test
 */
@isTest
global class BitlyMockHttpResponseGenerator implements HttpCalloutMock {
    
    // Implement this interface method
    global HTTPResponse respond(HTTPRequest req) {
        // System.assertEquals('callout:Bitly/v3/shorten', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        
        // Create a fake response
        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody('https://sforce.co/3JazOwq');
        res.setStatusCode(200);
        return res;
    }
}