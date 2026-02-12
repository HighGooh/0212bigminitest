import { createRoot } from 'react-dom/client'
import '@styles/index.css'
import App from '@/App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter } from "react-router";
import AuthProvider from '@hooks/AuthProvider.jsx'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')).render(
    <CookiesProvider defaultSetOptions={{ path: '/', maxAge: (60 * 60 * 24), secure: true, sameSite: 'lax' }}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </CookiesProvider>
)
