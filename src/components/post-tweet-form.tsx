import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//X Home 화면 

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0; //box 클릭시 색상이 변함
  }
`;

// Add photo btn CSS
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

  // AttachFileInput 의 type="file" 버튼을 숨기고 id를 AttachFileButton으로 넘김
const AttachFileInput = styled.input`
  display: none;
`;
// End of Add photo btn CSS

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null); //file upload 유무 체크

  //<AttachFileInput>
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  // e.target.value 대신 e.files가 들어감 
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target; //input이 변경될 때 마다 파일의 배열을 받음.
    if (files && files.length === 1) { //우리는 파일 하나만 업로드함
      setFile(files[0]);
    }
  };
  //<End of AttachFileInput>

  //Firebase - Cloud Firestore
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    // 로그인됨? 로딩중? 트윗이 비었는지 / 길이가 180보다 긴지 확인
    if (!user || isLoading || tweet === "" || tweet.length > 180) return;
    try {
      setLoading(true);
      // add Document (database , "collection") 경로
      const doc = await addDoc(collection(db, "tweets"), { //이미지 파일 저장 
        tweet,
        createdAt: Date.now(), //생성 날짜 확인
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      
      if (file) { // 파일값 true 있다.
        // 업로드된 파일이 저장되는 폴더명, 파일명/(유저ID)(문서ID)
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);

        // file을 어디에 저장할건지 알려줘야함
        const result = await uploadBytes(locationRef, file);

        // firebase/storage에서 URL 받아옴 
        const url = await getDownloadURL(result.ref);

        // document에 사진 URL 저장
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet(""); // 업로드 성공하면 내용 박스reset
      setFile(null); // file 리셋 
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  //End of Firebase - Cloud Firestore

  return (
    <Form onSubmit={onSubmit}>
      {/* user가 글쓰는 공간 */}
      <TextArea
        required // 필수
        rows={5} //박스 길이
        maxLength={180}
        onChange={onChange}
        value={tweet}  // tweet state
        placeholder="Hello!" //회백 미리보기 글씨
      />
      {/* End user가 글쓰는 공간 */}
      {/* user 파일첨부 버튼, FileInput과 같은 ID를 제공해서 같은 기능*/}
      <AttachFileButton htmlFor="file"> 
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"  //input file box 스타일링 어려워서 같은 id제공
        id="file"
        accept="image/*"
      />
      {/* End user 파일첨부 버튼 */}
      {/* Post 버튼 */}
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post"} //posting check , isLoading state
      />
      {/* End of Post 버튼 */}
    </Form>
  );
}
