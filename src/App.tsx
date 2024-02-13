import React, { useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import Login from './components/LoginForm';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { MovieForm } from './components/movieForm/MovieForm';
import { RegistrationForm } from './components/RegistrationForm';
import { MovieDetails } from './components/movieDetails/MovieDetails';
import { Home } from './components/Home';
import { fetchMovies } from './features/MoviesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './app/Store';
import { setCurrentUser } from './features/LoginSlice';
import { getUserFromLocalStorage } from './Services/GetUser';
import { LogOut } from './components/LogOut';
import HorizontalLinearStepper from './components/Stepper';
function App() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchMovies());
    if(getUserFromLocalStorage()!==""){
    dispatch(setCurrentUser(JSON.parse(getUserFromLocalStorage())))}
  }, [dispatch]);
  
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
       {/* <HorizontalLinearStepper/> */}
        <Routes>
          <Route element={<Home/>} path='/'/>
          <Route element={<Login />} path="/Login" />
          <Route element={<LogOut/>} path='/Logout'/>
          <Route element={<MovieForm/>} path='/MovieForm/:id?'/>
          <Route element={<RegistrationForm/>} path='/Register'/>
          <Route element={<MovieDetails/>} path='/MovieDetails/:id'/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
