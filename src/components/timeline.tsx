import {
  collection,
  /*  getDocs, */
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

//게시글 밑에 다른 사람이 쓴 tweet이 순서대로 보여짐 

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;  // 트윗 작성 양식은 고정된 상태로 스크롤
`;

// Firebase/firestore/tweets/Add field 에서 리스트 확인
export interface ITweet {
  id: string;
  photo?: string;  // ? 넣어서 Not Required 표시
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

//쿼리
export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]); //기본값 빈 배열

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    //어떤 tweet 을 원하는지 query 생성 
    const fetchTweets = async () => {
      const tweetsQuery = query(       // firebase에서 불러오는 query
        collection(db, "tweets"),      // tweets collection을 target함 
        orderBy("createdAt", "desc"),  // 최신순 정렬 ("기준","내림차순")
        limit(25) // 무한정 불러오면 서버낭비임, 처음 25개만 불러옴 
      );
    //End 어떤 tweet 을 원하는지 query 생성 

      // 쿼리의 snapshot을 받아서 쿼리에서 반환된 각 문서 내부 데이터를 console.log
      /* const spanshot = await getDocs(tweetsQuery);

        //받은 내용의 트윗을 상태에 저장하기
        const tweets = spanshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,  //ID는 Add field에 있는게 아니라 Add document에 있다. 
          };
        }); */

      /* 
       * onSnapShot : DB 및 쿼리와 실시간 연결, 생성 또는 삭제시 쿼리에 알려줌
       * Evet listener 와 연결시켜준다. (snapshot에는 정보가 포함됨)
       * 문서를 한번만 가져오는 대신 쿼리에 리스너를 추가한거임
       * 누군가 새 트윗을 추가하거나 하면 타임라인에서 즉시 볼 수 있다.
       * 유저가 타임라인을 보고있지 않으면 리스너를 쓸 필요없다 -> unsubscribe
       */
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {

        // 마지막 snapshot 이후 array로 반환한다.
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id, //ID는 Add field에 있는게 아니라 Add document에 있다. 
          };
        });
        setTweet(tweets);  // 추출한 트윗을 state에 저장하기 
      });
      // End onSnapShot 
    };

    fetchTweets();

    // 굳이 이벤트를 들을 필요가 없을 때 사용
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {/* tweet 마다 tweet 컴포넌트를 렌더링, key는 ID */}
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
