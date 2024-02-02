import { atom } from 'recoil';

const selectedConversationAtom = atom({
  key: 'selectedConversationAtom',
  default: {
    _id: '',
    userId: '',
    userName: '',
    userProfilePic: '',
    name: '',
  },
});

export default selectedConversationAtom;
