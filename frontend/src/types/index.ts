export interface Post {
    _id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
  }
  
export interface Comment {
    _id: string;
    content: string;
    postId: string;
    authorId: string;
    createdAt: string;
  }
  
export interface User {
    email: string;
    _id: string;
  }