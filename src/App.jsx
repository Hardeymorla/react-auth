import Register from './Register';
import Login from './Login';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={ <Register />} />
        <Route path='/login' element={ <Login />} />
      </Routes>
    </>
  )
}

export default App
