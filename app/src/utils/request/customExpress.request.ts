import { Tokens } from 'src/modules/auth/entities';
import { PostDocument } from 'src/modules/post/post.schema';
import { ProtectedUser } from 'src/modules/user/entities';

declare global {
  namespace Express {
    interface User {
      user?: ProtectedUser;
      tokens?: Tokens;
      post?: PostDocument;
    }
  }
}
