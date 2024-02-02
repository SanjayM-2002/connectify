import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
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
      console.log('Data from response is: ', data);
      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', data.message, 'success');
      //   console.log('Logged out via useLogout hook and will navigate to home');
      navigate('/');
      localStorage.removeItem('user-threads');
      setCurrentUser(null);
    } catch (err) {
      console.log('Error is: ', err);
      showToast('Error', err, 'error');
    }
  };

  return handleLogout;
};

export default useLogout;
