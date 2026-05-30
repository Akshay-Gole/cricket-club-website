import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/shared/Navbar'

const App = () => {
  return (
    <BrowserRouter>
      <div className="p-8">
        <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App
