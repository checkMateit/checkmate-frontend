export type Comment = {
  id: number;
  name: string;
  text: string;
  date?: string;
};

export type Post = {
  id: number;
  studyName: string;
  name: string;
  title: string;
  desc: string;
  detail: string;
  date: string;
  likes: number;
  liked: boolean;
  alarmEnabled: boolean;
  comments: number;
  image?: number;
  commentList: Comment[];
};
