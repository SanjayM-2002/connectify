import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setAuthScreenStateFn = useSetRecoilState(authScreenAtom);
  const changeToSignup = () => {
    setAuthScreenStateFn('signup');
  };
  const showToast = useShowToast();
  const setCurrentUser = useSetRecoilState(userAtom);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
  });

  const handleLogin = async () => {
    setLoading(true);
    console.log('Formdata is: ', formData);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log('Data from resposne is: ', data);

      if (data.error) {
        console.log('Error in request is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }

      localStorage.setItem('user-threads', JSON.stringify(data));
      setCurrentUser(data);
    } catch (err) {
      console.log('Error is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
          {/* <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool features ✌️
          </Text> */}
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'blackAlpha.500')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: 'full',
            sm: '470px',
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>User name</FormLabel>
              <Input
                type='userName'
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                value={formData.userName}
              />
            </FormControl>
            <FormControl isRequired>
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
            <Stack spacing={10} pt={2}>
              <Button
                loadingText='Logging in'
                size='lg'
                bg={useColorModeValue('gray.500', 'gray.600')}
                color={'white'}
                _hover={{
                  bg: useColorModeValue('gray.700', 'gray.700'),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link color={'blue.400'} onClick={changeToSignup}>
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginCard;
