import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`, {
          method: 'GET',
        });
        const data = await res.json();
        // console.log('Data from get user hook is: ', data);
        if (data.error) {
          console.log('Error from get user hook is: ', data.error);
          showToast('Error', data.error, 'error');
          return;
        }
        setUser(data);
      } catch (err) {
        console.log('Err from get user hook is: ', err);
        showToast('Error', err, 'error');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);
  return { loading, user };
};

export default useGetUserProfile;
