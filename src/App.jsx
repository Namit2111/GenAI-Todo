import React from 'react'
import TodoApp from './components/TodoApp'
import Login from "./components/Login";
import Register from "./components/Register";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
const App = () => {
  return (
<Router>
  <Routes>
    <Route path="*" element={<Navigate to="/login" />} />
    <Route path="/todo" element={<TodoApp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />}  />
  </Routes>
</Router>
  )
}

export default App