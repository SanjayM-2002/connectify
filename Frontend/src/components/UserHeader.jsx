import {
  Stack,
  HStack,
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserHeader = ({ user }) => {
  const toast = useToast();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  // console.log('Logged in user is: ', currentUser);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast('Error', 'Please login to follow', 'error');
      return;
    }
    if (updating) {
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      // console.log('Reponse is: ', data);
      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      if (!following) {
        showToast('Followed', data.message, 'success');
        user.followers.push(currentUser?._id);
      } else {
        showToast('Unfollowed', data.message, 'success');
        user.followers.pop();
      }
      setFollowing(!following);
    } catch (err) {
      console.log('Error is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    console.log(window.location.href);
    navigator.clipboard.writeText(currentURL).then(() => {
      // console.log('URL copied to clip board ', currentURL);
      toast({
        // title: 'Account created.',
        description: 'Profile link copied.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };
  // console.log('user details is: ', user);
  return (
    <>
      {/* <div>userheader</div> */}
      <VStack gap={4} alignItems={'start'}>
        <Flex justifyContent={'space-between'} w={'full'}>
          <Box>
            <Text fontSize={'2x1'} fontWeight={'bold'}>
              {user.name}
            </Text>
            <Flex alignItems={'center'} gap={2}>
              <Text fontSize={'sm'}>{user.userName}</Text>
              <Text fontSize={'xx-small'} bg={'gray.dark'} color={'gray.light'}>
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name={user.name}
              src={user.profilePic ? user.profilePic : '/emptyProfilePic.png'}
              size={{
                base: 'md',
                md: 'xl',
              }}
            ></Avatar>
          </Box>
        </Flex>
        <Text>{user.bio}</Text>

        {currentUser?._id === user._id && (
          <>
            <RouterLink to='/updateProfile'>
              <Button size={'sm'}>Update Profile</Button>
            </RouterLink>
          </>
        )}

        {currentUser?._id !== user._id && (
          <>
            <Button
              size={'sm'}
              onClick={handleFollowUnfollow}
              isLoading={updating}
            >
              {following ? 'Unfollow' : 'Follow'}
            </Button>
          </>
        )}

        <Flex w={'full'} justifyContent={'space-between'}>
          <Flex gap={2} alignItems={'center'}>
            <Text color={'gray.light'}>{user.followers.length} followers</Text>
            <Box w={1} h={1} bg={'gray.light'} borderRadius={'full'}></Box>
            <Link color={'gray.light'}>instagram.com</Link>
          </Flex>

          <Flex>
            <Box className='icon-container'>
              <BsInstagram size={24} cursor={'pointer'} />
            </Box>
            <Box className='icon-container'>
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={'pointer'} />
                </MenuButton>
                <Portal>
                  <MenuList bg={'gray.dark'} onClick={copyURL}>
                    <MenuItem>Copy Link</MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={'full'}>
          <Flex
            flex={1}
            borderBottom={'1.5px solid white'}
            justifyContent={'center'}
            pb={3}
            cursor={'pointer'}
          >
            <Text fontWeight={'bold'}>Threads</Text>
          </Flex>
          {/* <Flex
            flex={1}
            borderBottom={'1.5px solid gray'}
            justifyContent={'center'}
            pb={3}
            color={'gray'}
            cursor={'pointer'}
          >
            <Text fontWeight={'bold'}>Replies</Text>
          </Flex> */}
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;
