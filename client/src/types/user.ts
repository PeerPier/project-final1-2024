export type User = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  profile_picture: string;
  email: string;
  isFollowing?: boolean;
  createAt: Date;
};
