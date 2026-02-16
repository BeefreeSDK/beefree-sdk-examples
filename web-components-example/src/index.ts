import './web-components/Beefree.ts'
import { loginV2, updateBeefreeComponent, getTemplate } from './utils.ts'
import { DEFAULT_UID } from './config/constants.ts'

const initSDK = async (): Promise<void> => {
  const beefreeComponent = document.getElementById('beefree-component')
  const token = await loginV2()
  const template = await getTemplate()
  const beeConfig = {
    uid: DEFAULT_UID
  }
  const startOptions = {
    shared: false
  }
  if (beefreeComponent) {
    updateBeefreeComponent('token', token)
    updateBeefreeComponent('config', { beeConfig, startOptions })
    updateBeefreeComponent('template', template)
  }
}

initSDK()
