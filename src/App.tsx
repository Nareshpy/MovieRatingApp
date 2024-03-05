import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Service from './Services/Service';
import { AppDispatch } from './app/Store';
import { fetchMovies } from './features/MoviesSlice';
import { setCurrentUser } from './features/LoginSlice';

import { Header } from './components/header/Header';
import Login from './components/loginForm/LoginForm';
import { MovieForm } from './components/movieForm/MovieForm';
import { RegistrationForm } from './components/registrationForm/RegistrationForm';
import { MovieDetails } from './components/movieDetails/MovieDetails';
import { Home } from './components/home/Home';
import { LogOut } from './components/logOut/LogOut';

import './App.css';

function App() {

  const dispatch = useDispatch<AppDispatch>();
  const serviceObj=new Service();

  useEffect(() => {
    dispatch(fetchMovies());
    if (serviceObj.getUserFromLocalStorage() !== "") {
      dispatch(setCurrentUser(JSON.parse(serviceObj.getUserFromLocalStorage())));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<Home />} path='/' />
          <Route element={<Login />} path="/Login" />
          <Route element={<LogOut />} path='/Logout' />
          <Route element={<MovieForm />} path='/MovieForm/:id?' />
          <Route element={<RegistrationForm />} path='/Register' />
          <Route element={<MovieDetails />} path='/MovieDetails/:id' />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
