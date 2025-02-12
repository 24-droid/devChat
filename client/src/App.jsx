import { useState } from "react"
function App() {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  return (
   <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12">
    <input value={username} onChange={(event)=> setUsername(event.target.value)} type="text" placeholder="Username" className="w-full block roundeed-md p-2 mb-2 border" />
    <input value={password} onChange={(event)=> setPassword(event.target.value)} type="password" placeholder="Password" className="w-full block roundeed-md p-2 mb-2 border" />
    <button className="bg-blue-500 text-white block w-full h-8 rounded-md hover:cursor-pointer">Register</button>
    <div className="text-center mt-2">
      Already a Member?
      <button className="ml-2 text-blue-600 hover:cursor-pointer">Login Here</button>
    </div>
      </form>
   </div>
  )
}

export default App
