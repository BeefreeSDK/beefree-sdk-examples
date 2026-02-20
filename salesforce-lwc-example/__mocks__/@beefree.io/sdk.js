/**
 * Mock for @beefree.io/sdk
 */
export const mockStart = jest.fn()
export const mockConstructor = jest.fn()

class BeefreeSDK {
  constructor(token) {
    mockConstructor(token)
    this.token = token
  }

  start = mockStart
}

export default BeefreeSDK

