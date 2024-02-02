import { Button, useColorMode } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import UserPage from './pages/UserPage';
import PostPage from './pages/PostPage';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import LogoutButton from './components/LogoutButton';
import UpdateProfile from './pages/UpdateProfile';
import CreatePost from './components/CreatePost';
import ChatPage from './pages/ChatPage';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  console.log('Current user is: ', currentUser);
  return (
    <>
      <Container maxW={'800px'}>
        <Header />
        {/* <div>Hi</div>
        <Button onClick={toggleColorMode}>Hello world</Button>
        <div>Hmmm</div> */}
        <Routes>
          <Route
            path='/'
            element={
              currentUser && !currentUser.error ? (
                <HomePage />
              ) : (
                <Navigate to={'/auth'} />
              )
            }
          ></Route>

          <Route
            path='/auth'
            element={
              !currentUser || currentUser.error ? (
                <AuthPage />
              ) : (
                <Navigate to={'/'} />
              )
            }
          ></Route>
          <Route
            path='/updateProfile'
            element={
              currentUser && !currentUser.error ? (
                <UpdateProfile />
              ) : (
                <Navigate to={'/auth'} />
              )
            }
          ></Route>
          <Route
            path='/:username'
            element={
              currentUser && !currentUser.error ? (
                <>
                  <UserPage />
                  {/* <CreatePost /> */}
                </>
              ) : (
                <UserPage />
              )
            }
          ></Route>
          <Route path='/:username/post/:pid' element={<PostPage />}></Route>
          <Route
            path='/chat'
            element={
              currentUser && !currentUser.error ? (
                <>
                  <ChatPage />
                </>
              ) : (
                <Navigate to={'/'} />
              )
            }
          ></Route>
        </Routes>
      </Container>
    </>
  );
}

export default App;
