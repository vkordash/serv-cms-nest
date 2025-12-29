export interface RequestWithUser extends Request {
  user: {
    id: number;
    id_pers: number;
    role: string;
    login: string;
    id_org: number;
  };
}