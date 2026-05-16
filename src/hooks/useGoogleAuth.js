import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '214548978121-o8cql86qiv3750nqhgh7q5gok5e7ujhj.apps.googleusercontent.com',
  webClientId: '214548978121-7ohfjg0nqhqafhk27lj4tfonr233pcf3.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});



  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      }
    } catch (error) {
      console.log('Google sign-in error:', error);
    }
  };

  return { signInWithGoogle, request };
}