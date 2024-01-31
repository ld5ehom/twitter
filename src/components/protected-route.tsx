import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

/*
 * login 한 유저만 볼 수 있음 
 * 로그인하지 않은 경우 create-account로 리디렉션 
 * protect <home /> and <profile /> from app.tsx
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // User Login check from firebase
  const user = auth.currentUser; // Asking user data (로그인한 유저가 누구?)
  if (user === null) {  // Not User! (유저 정보가 없으면 로그인화면으로)
    return <Navigate to="/login" />;
  }
  // End of User Login check from firebase 

  return children; // <home /> and <profile />
}
