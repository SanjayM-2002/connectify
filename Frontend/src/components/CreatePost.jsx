import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import useImagePreview from '../hooks/useImagePreview';
import { BsFillImageFill } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { useParams } from 'react-router-dom';

const MAX_CHAR = 69;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useRecoilValue(userAtom);
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imageURL, setImageURL } = useImagePreview();
  const fileRef = useRef(null);
  const [postText, setPostText] = useState('');
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };
  const handleCreatePost = async () => {
    try {
      if (updating) {
        return;
      }
      setUpdating(true);
      const res = await fetch('api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postedBy: currentUser._id,
          text: postText,
          image: imageURL,
        }),
      });
      const data = await res.json();
      // console.log('Data from response is: ', data);
      if (data.error) {
        console.log('Error is: ', data.error);
        showToast('Error', data.error, 'error');
        return;
      }
      // console.log('Post created succesfully');
      showToast('Success', 'Post Created Successfully', 'success');
      if (username === currentUser.userName) {
        setPosts([data, ...posts]);
      }
      onClose();
      setPostText('');
      setImageURL('');
    } catch (err) {
      console.log('Err is: ', err);
      showToast('Error', err, 'error');
    } finally {
      setUpdating(false);
    }
  };
  return (
    <>
      <Button
        position={'fixed'}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue('gray.300', 'gray.700')}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>some text</ModalBody>
          <FormControl>
            <Textarea
              placeholder='Post content goes here...'
              onChange={handleTextChange}
              value={postText}
            ></Textarea>
            <Text
              fontSize={'xs'}
              fontWeight={'bold'}
              textAlign={'right'}
              m={2}
              color={'gray.800'}
            >
              {remainingChar}/{MAX_CHAR}
            </Text>
            <Input
              type='file'
              hidden
              ref={fileRef}
              onChange={handleImageChange}
            />
            <BsFillImageFill
              style={{ marginLeft: '5px', cursor: 'pointer' }}
              size={16}
              onClick={() => fileRef.current.click()}
            />
          </FormControl>

          {imageURL && (
            <>
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imageURL} alt='Selected Image' />
                <CloseButton
                  onClick={() => {
                    setImageURL('');
                  }}
                  bg={'gray.700'}
                  position={'absolute'}
                  top={2}
                  right={2}
                />
              </Flex>
            </>
          )}

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={handleCreatePost}
              isLoading={updating}
            >
              Post
            </Button>
            {/* <Button variant='ghost'>Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
