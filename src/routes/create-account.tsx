import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components"; //CSS 파일들
import GithubButton from "../components/github-btn";

// CSS 내용 -> layout.tsx

export default function CreateAccount() {
  const navigate = useNavigate(); //Hook
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // name, email, password onChange Event 
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Target 추출
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  // End of name, email, password onChange Event 

  // Form을 위한 onSubmit Method
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 화면 refresh(새로고침) 방지 
    setError(""); //일단 error를 빈값으로 설정 

    //Empty Check 
    if (isLoading || name === "" || email === "" || password === "") return;
    //End of Empty Check 

    try {
      setLoading(true);
        /* create an account
         * set the name of the user.
         * redirect to the home page 
         * credentials = 자격증명 
         */
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name, //로그인 후 이름(state)
      });
      navigate("/"); //Hook 으로 index("/")에 navigate
    } catch (e) {
        // setError catch
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  // End of Form을 위한 onSubmit Method

  return (
    // 로그인 초기화면
    <Wrapper>
      <Title>Join 𝕏</Title> 
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>

      {/* login error 화면 */}
      {error !== "" ? <Error>{error}</Error> : null}

      {/* Login account (already have) */}
      <Switcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      {/* End of Login account (already have) */}

      {/* Github Button */}
      <GithubButton />
    </Wrapper>
  );
}
