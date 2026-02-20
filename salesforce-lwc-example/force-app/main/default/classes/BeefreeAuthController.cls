/**
 * Apex controller for Beefree SDK authentication
 * 
 * This class handles server-side authentication with Beefree API,
 * keeping credentials secure on the server side.
 * 
 * Setup required:
 * 1. Create a Custom Metadata Type or Custom Setting to store credentials
 * 2. Add 'https://auth.getbee.io' to Remote Site Settings
 * 3. Configure Named Credential (recommended) or Custom Metadata
 */
public with sharing class BeefreeAuthController {
    
    /**
     * Authenticates with Beefree API and returns a token
     * @param uid Unique identifier for the user/session
     * @return Map containing the authentication token data
     */
    @AuraEnabled(cacheable=false)
    public static Map<String, Object> getAuthToken(String uid) {
        try {
            // Get credentials from Custom Metadata or Named Credential
            // For production, use Named Credentials instead
            Beefree_Settings__mdt settings = [
                SELECT Client_Id__c, Client_Secret__c 
                FROM Beefree_Settings__mdt 
                WHERE DeveloperName = 'Default' 
                LIMIT 1
            ];
            
            if (settings == null) {
                throw new AuraHandledException('Beefree credentials not configured. Please set up Beefree_Settings__mdt.');
            }
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://auth.getbee.io/loginV2');
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('Accept', 'application/json');
            
            Map<String, String> body = new Map<String, String>{
                'client_id' => settings.Client_Id__c,
                'client_secret' => settings.Client_Secret__c,
                'uid' => String.isBlank(uid) ? UserInfo.getUserId() : uid
            };
            req.setBody(JSON.serialize(body));
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('Authentication failed: ' + res.getStatusCode() + ' ' + res.getBody());
            }
            
            return (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            
        } catch (QueryException e) {
            throw new AuraHandledException('Beefree credentials not found. Please configure Beefree_Settings__mdt Custom Metadata.');
        } catch (Exception e) {
            throw new AuraHandledException('Authentication error: ' + e.getMessage());
        }
    }
    
    /**
     * Fetches a template from Beefree template gallery
     * @param templateId The template identifier (e.g., 'm-bee')
     * @return Map containing the template JSON
     */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getTemplate(String templateId) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('https://rsrc.getbee.io/api/templates/' + EncodingUtil.urlEncode(templateId, 'UTF-8'));
            req.setMethod('GET');
            req.setHeader('Accept', 'application/json');
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() != 200) {
                throw new AuraHandledException('Failed to load template: ' + res.getStatusCode());
            }
            
            return (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            
        } catch (Exception e) {
            throw new AuraHandledException('Template load error: ' + e.getMessage());
        }
    }
}
