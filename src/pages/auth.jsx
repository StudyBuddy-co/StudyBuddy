import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { auth, db } from "../services/Firebase"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const isValidUWEmail = (email) => email.endsWith("@uw.edu")

  async function handleSignIn() {
    if (!isValidUWEmail(email)) return alert("Only @uw.edu emails allowed")
    await signInWithEmailAndPassword(auth, email, password)
    navigate("/dashboard")
  }

  async function handleSignUp() {
    if (!isValidUWEmail(email)) return alert("Only @uw.edu emails allowed")

    const res = await createUserWithEmailAndPassword(auth, email, password)

    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      email: res.user.email,
      createdAt: serverTimestamp()
    })

    navigate("/dashboard")
  }

  async function handleGoogle() {
    const provider = new GoogleAuthProvider()
    const res = await signInWithPopup(auth, provider)

    await setDoc(
      doc(db, "users", res.user.uid),
      {
        uid: res.user.uid,
        email: res.user.email,
        lastLogin: serverTimestamp()
      },
      { merge: true }
    )

    navigate("/dashboard")
  }

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignUp}>Create Account</button>
      <button onClick={handleGoogle}>Google</button>
    </div>
  )
}