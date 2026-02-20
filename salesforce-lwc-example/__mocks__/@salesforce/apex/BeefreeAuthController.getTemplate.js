/**
 * Jest mock for @salesforce/apex/BeefreeAuthController.getTemplate
 */

export default jest.fn().mockResolvedValue({
  page: {
    rows: [],
    template: {
      name: 'Mock Template',
      type: 'email'
    }
  }
})
