import axios from "axios"
import { UserContextProvider } from "./UserContext"
import Routes from "./Routes"

const App = () => {
  axios.defaults.baseURL = 'http://localhost:8080';
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
    <Routes />
  </UserContextProvider>
  )
}

export default App