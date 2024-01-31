import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  // 로그인한 사용자만 사용하는 Layout
  {
    path: "/",
    element: ( 
      /* protected-route.tsx 
       * protected route children (Home and profile)
       * Layout is Wrapping home and profile
       */
      <ProtectedRoute> 
        <Layout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  // End 로그인한 사용자만 사용하는 Layout

  // Login or create one 
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  // End Login or create one 
]);

// Global Style 글로벌 스타일 
const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color:white; //text-color 
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;
// End Global Style 글로벌 스타일 

// App을 Wrapper로 감싸 모두 가운데로 위치
const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;
//End of Wrapper

function App() {
  const [isLoading, setLoading] = useState(true);

  // Firebase Loading check 화면(firebase.ts) 
  const init = async () => {
    await auth.authStateReady(); //인증 상태 준비 기다림
    setLoading(false); //false 로 변경하고 사용자를 router로 보낸다.
  }; 
  useEffect(() => {
    init();
  }, []);
  // End Firebase Loading check 화면(firebase.ts) 

  return (
    <Wrapper>
      {/* global Style 적용 */}
      <GlobalStyles /> 

      {/* Router Provider 로딩이 끝나는지 확인*/}
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
