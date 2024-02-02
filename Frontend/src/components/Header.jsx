import { Button, Flex, Image, Link, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from 'react-router-dom';
import { RxAvatar } from 'react-icons/rx';
import { AiFillHome } from 'react-icons/ai';
import useLogout from '../hooks/useLogout';
import authScreenAtom from '../atoms/authAtom';
import { BsFillChatQuoteFill } from 'react-icons/bs';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const currentUser = useRecoilValue(userAtom);
  const setAuthScreenAtom = useSetRecoilState(authScreenAtom);
  const handleLogout = useLogout();
  return (
    <Flex justifyContent={'space-around'} mt={6} mb={12}>
      {currentUser && !currentUser.error && (
        <>
          <RouterLink to={'/'}>
            <AiFillHome size={24} />
          </RouterLink>
        </>
      )}{' '}
      {!currentUser || currentUser.error ? (
        <>
          <RouterLink to={'/auth'} onClick={() => setAuthScreenAtom('login')}>
            Login
          </RouterLink>
        </>
      ) : (
        <></>
      )}
      <Image
        cursor={'pointer'}
        alt='logo'
        w={6}
        src={colorMode === 'dark' ? '/light-logo.svg' : '/dark-logo.svg'}
        onClick={toggleColorMode}
      />
      {currentUser && !currentUser.error && (
        <>
          <Flex alignItems={'center'} gap={4}>
            <RouterLink to={`/${currentUser.userName}`}>
              <RxAvatar size={24} />
            </RouterLink>

            <RouterLink to={'/chat'}>
              <BsFillChatQuoteFill size={20} />
            </RouterLink>

            <Button
              // position={'fixed'}
              // top={'30px'}
              // right={'30px'}
              size={'sm'}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Flex>
        </>
      )}
      {!currentUser || currentUser.error ? (
        <>
          <RouterLink to={'/auth'} onClick={() => setAuthScreenAtom('signup')}>
            Signup
          </RouterLink>
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export default Header;
