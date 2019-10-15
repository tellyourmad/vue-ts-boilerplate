interface IUserToken {
  data: IToken;
  expire: number;
}

interface IToken {
  token: string;
  openId: string;
}
interface ILoginData {
  token: string;
  fixed: boolean;
  status: string;
  username: string;
  perms?: any;
  perm?: any;
  openId?: any;
}
export { IUserToken, ILoginData };
