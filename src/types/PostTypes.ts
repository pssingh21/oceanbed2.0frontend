export type Post = {
  content: string;
  country: string;
  likes: number;
  user: {
    _id: string;
  };
  _id: string;
};
