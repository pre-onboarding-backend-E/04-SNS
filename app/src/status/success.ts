import { UpdatePostDTO } from 'src/modules/post/dto';
import { Post } from 'src/modules/post/post.schema';
import { ProtectedUser } from 'src/modules/user/entities';
import { SuccessResponse } from 'src/utils/customTypes';

export const SignUpResponse: SuccessResponse = {
  code: 201,
  message: '성공적으로 회원가입이 완료되었습니다!',
  type: ProtectedUser,
};

export const LoginResponse: SuccessResponse = {
  code: 200,
  message: '성공적으로 로그인 되었습니다!',
};

export const RefreshTokenResponse: SuccessResponse = {
  code: 200,
  message: 'Access Token 이 발급되었습니다!',
};

export const CreatePostResponse: SuccessResponse = {
  code: 201,
  message: '성공적으로 게시물이 작성되었습니다!',
  type: Post,
};

export const UpdatePostResponse: SuccessResponse = {
  code: 200,
  message: '성공적으로 게시물이 수정되었습니다!',
  type: UpdatePostDTO,
};

export const DeletePostResponse: SuccessResponse = {
  code: 204,
  message: '성공적으로 게시물이 삭제되었습니다!',
};

export const RestorePostResponse: SuccessResponse = {
  code: 200,
  message: '성공적으로 게시물이 복구되었습니다!',
};

export const GetPostResponse: SuccessResponse = {
  code: 200,
  message: '성공적으로 게시물을 불러왔습니다!',
  type: Post,
};

export const GetPostsResponse: SuccessResponse = {
  code: 200,
  message: '성공적으로 게시물 목록을 불러왔습니다!',
  type: Post,
};

export const LikeCreatedResponse: SuccessResponse = {
  code: 201,
  message: '성공적으로 좋아요가 적용되었습니다!',
};

export const LikeNoContentResponse: SuccessResponse = {
  code: 204,
  message: '성공적으로 좋아요가 적용되었습니다!',
};

export const UnlikeResponse: SuccessResponse = {
  code: 204,
  message: '성공적으로 좋아요가 취소되었습니다!',
};
