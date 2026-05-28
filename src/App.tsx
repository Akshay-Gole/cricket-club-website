const apiUrl = import.meta.env.VITE_API_URL
const mode = import.meta.env.MODE

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-green-600">
        🏏 Cricket Club Website
      </h1>
      <p>API URL: {apiUrl}</p>
      <p>MODE: {mode}</p>
    </div>
  )
}
export default App
