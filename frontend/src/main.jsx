import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { SidebarContextState } from './Context/SibebarContext';
import { SongContextState } from './Context/SongContext';
import { QueueContextState } from './Context/QueueContex';
import { FetchContextState } from './Context/FetchContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SidebarContextState>
      <SongContextState>
        <FetchContextState>
          <QueueContextState>
            <App />
          </QueueContextState>
        </FetchContextState>
      </SongContextState>
    </SidebarContextState>
  </React.StrictMode>,
)
