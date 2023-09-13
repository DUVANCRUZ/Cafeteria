import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyB4RVHT15N5sqS-siBYj1Cbon2wUQ-v2zU",
  authDomain: "naruto-a4fb1.firebaseapp.com",
  projectId: "naruto-a4fb1",
  storageBucket: "naruto-a4fb1.appspot.com",
  messagingSenderId: "911070395043",
  appId: "1:911070395043:web:448220212f5554e2741d16",
  measurementId: "G-CDQL3WWGWW"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);


export async function uploadFile(file) {
  const storageRef = ref(storage, "products/" + v4());
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
