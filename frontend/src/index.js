import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import App from './App'
import store from './store'

import { registerLicense } from '@syncfusion/ej2-base'

registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCeUx0Qnxbf1x1ZFRGal5UTnJXUiweQnxTdEBjX31ZcXRXQ2VeUkdzXEleYw==',
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
