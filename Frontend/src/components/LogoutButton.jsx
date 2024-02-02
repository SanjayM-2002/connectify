import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const setCurrentUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log('Data from response is: ', data);
      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', data.message, 'success');
      // console.log('Logged out via logoutbutton component');
      navigate('/');
      localStorage.removeItem('user-threads');
      setCurrentUser(null);
    } catch (err) {
      console.log('Error is: ', err);
      showToast('Error', err, 'error');
    }
  };
  return (
    <>
      <Button
        position={'fixed'}
        top={'30px'}
        right={'30px'}
        size={'md'}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
};

export default LogoutButton;
