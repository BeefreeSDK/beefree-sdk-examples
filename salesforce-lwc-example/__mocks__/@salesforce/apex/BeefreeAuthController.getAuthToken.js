/**
 * Jest mock for @salesforce/apex/BeefreeAuthController.getAuthToken
 */

export default jest.fn().mockResolvedValue({
  access_token: 'mock-token',
  token_type: 'Bearer',
  expires_in: 3600
})
