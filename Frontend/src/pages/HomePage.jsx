import { Button, Flex, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import CreatePost from '../components/CreatePost';

const HomePage = () => {
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch('/api/posts/feed', {
          method: 'GET',
        });
        const data = await res.json();
        // console.log('Data of posts from response is: ', data);

        if (data.error) {
          console.log('Error is: ', data.error);
          showToast('Error', data.error, 'error');
          return;
        }
        setPosts(data);
        // console.log('Initial Posts in the feed are: ', posts);
      } catch (err) {
        console.log('Err is: ', err);
        showToast('Error', err, 'error');
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [showToast, setPosts]);
  // console.log('Posts in the feed are: ', posts);
  return (
    <>
      {loading && (
        <>
          <Flex justifyContent={'center'}>
            <Spinner size={'xl'} color='red.500' />
          </Flex>
        </>
      )}
      {!loading && !posts.length && (
        <>
          <h2>Follow some users to see the feed</h2>
        </>
      )}
      {posts.length &&
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}

      <CreatePost />
    </>
  );
};

export default HomePage;
