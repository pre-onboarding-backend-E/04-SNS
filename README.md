# SNS

## 목차
현재 개인적인 사정으로 문서화 등 마무리 되지 않은 부분이 많습니다.  
추후 마무리 지을 예정입니다.

<br>

## 요구 사항
<img width="729" alt="스크린샷 2022-07-26 오후 4 39 27" src="https://user-images.githubusercontent.com/79984416/180950782-512e69ca-9bbb-466d-a4ad-263665f4f446.png">
<img width="724" alt="스크린샷 2022-07-26 오후 4 39 47" src="https://user-images.githubusercontent.com/79984416/180950837-836828d9-2a70-450b-be45-d16db06b1c45.png">
<img width="724" alt="스크린샷 2022-07-26 오후 4 40 04" src="https://user-images.githubusercontent.com/79984416/180950893-db84c9f1-f0dd-4974-b655-4879c0c57f92.png">
<img width="716" alt="스크린샷 2022-07-26 오후 4 40 30" src="https://user-images.githubusercontent.com/79984416/180950981-31d09f71-b9c1-4997-afb2-dc65ac2ca0db.png">
<img width="719" alt="스크린샷 2022-07-26 오후 4 40 44" src="https://user-images.githubusercontent.com/79984416/180951023-2cb7cbcb-4469-45e2-ad7a-8aaa4ecde98f.png">
<br>
위의 요구사항에서 미루어 봤을 때, 필요한 EndPoit 는 다음과 같다고 생각했다. (root /api)   

```
A. 유저 /users
회원가입      POST /signUp
로그인 및 인증 POST /login
Token 재발급 GET  /refreshAccessToken

B. 게시글 /posts
생성    POST   /
수정    PATCH  /{postId}
삭제    DELETE /{postId}
복구    PATCH  /restore/{postId}
목록    GET    /
상세보기 GET    /{postId}

C. 좋아요 /likes
좋아요     PUT /like/{postId} 
좋아요 취소 PUT /unlike/{postId}
```
