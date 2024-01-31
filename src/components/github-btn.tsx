import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
  margin-top: 50px;
  background-color: white;
  font-weight: 700;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      //GithubAuthProvider는 firebase/auth 사용 cordova 금지
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider); //가입 팝업창
      navigate("/"); //Home으로 리디렉션
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Button onClick={onClick}>
      {/* Github Logo */}
      <Logo src="/github-logo.svg" /> 
      Continue with Github
    </Button>
  );
}
