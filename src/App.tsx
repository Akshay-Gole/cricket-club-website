import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
