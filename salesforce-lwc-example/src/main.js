import { createElement } from 'lwc'
import App from 'c/app'

const container = document.getElementById('lwc-container')
const app = createElement('c-app', { is: App })
container.appendChild(app)
