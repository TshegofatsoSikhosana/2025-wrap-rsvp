import {auth,firebaseStorage} from '../firebase/clientApp'
import {useAuthState} from 'react-firebase-hooks/auth'
import { deleteObject, getBlob, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile, User } from 'firebase/auth';
import { UserService } from './UserService';
import { TrickOfTheDayService } from './TrickOfTheDayService';

export default class FirebaseService{

    constructor(){
    }


    getAuthUser(){
        return useAuthState(auth);
    }

    async getCurrentUser(){
        return await auth.currentUser;
    }


}