import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

//이전에 생성한 ITweet 인터페이스를 받음
export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {

  // auth 인스턴스를 사용해 현재 로그인 유저 정보를 받음 
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");

    // 삭제 취소 || 로그인유저 id /= 작성자id : 함수종료
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));

      // 사진 있는 경우 사진도 삭제해야됨 
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        {/* 작성자 이름 */}
        <Username>{username}</Username>

        {/* 트윗 내용이 payload안에 위치 */}
        <Payload>{tweet}</Payload> 

        {/* 로그인유저 id === 트윗유저 id 인 경우만 트윗 삭제 */}
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>

      {/* 작성자가 올린 사진 (필수 값 아님) 그래서 grid 우측 정렬*/}
      <Column>
        {photo ? <Photo src={photo} /> : null}
      </Column>

    </Wrapper>
  );
}
