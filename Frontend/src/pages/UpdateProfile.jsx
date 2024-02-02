import React, { useRef, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
} from '@chakra-ui/react';
import { SmallCloseIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useImagePreview from '../hooks/useImagePreview';
import useShowToast from '../hooks/useShowToast';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userAtom);
  console.log('Current user from atom is: ', currentUser);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    userName: currentUser.userName,
    email: currentUser.email,
    password: '',
    bio: currentUser.bio,
    profilePic: currentUser.profilePic,
  });
  const fileref = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imageURL } = useImagePreview();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) {
      return;
    }
    setUpdating(true);
    try {
      console.log('Formdata is: ', formData);
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, profilePic: imageURL }),
      });

      const data = await res.json();
      // console.log('Data is: ', data);

      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      showToast('Success', 'Profile updated successfully', 'success');
      setCurrentUser(data);
      localStorage.setItem('user-threads', JSON.stringify(data));
      navigate(`/${currentUser.userName}`);
      // console.log('current user profile pic is: ', currentUser.profilePic);
    } catch (err) {
      console.log('Error is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.100', 'gray.600')}
        my={12}
      >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id='userName'>
            {/* <FormLabel>User Icon</FormLabel> */}
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size='xl' src={imageURL || currentUser.profilePic}>
                  {/* <AvatarBadge
                  as={IconButton}
                  size='sm'
                  rounded='full'
                  top='-10px'
                  colorScheme='red'
                  aria-label='remove Image'
                  icon={<SmallCloseIcon />}
                /> */}
                </Avatar>
              </Center>
              <Center w='full'>
                <Button w='full' onClick={() => fileref.current.click()}>
                  Change Profile photo
                </Button>
                <Input
                  type='file'
                  hidden
                  ref={fileref}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder={formData.name}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder={formData.userName}
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder={formData.email}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type='email'
            />
          </FormControl>
          {/* <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder='Password'
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type='password'
            />
          </FormControl> */}

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                value={formData.password}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder={formData.bio}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              _placeholder={{ color: 'gray.500' }}
              type='text'
            />
          </FormControl>

          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w='full'
              _hover={{
                bg: 'red.500',
              }}
              onClick={() => navigate(`/${currentUser.userName}`)}
            >
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w='full'
              _hover={{
                bg: 'blue.500',
              }}
              type='submit'
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfile;
