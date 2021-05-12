export enum OwnerType {
  USER = 'User',
  ORGANIZATION = 'Organization',
}

export interface Owner {
  id: number;
  name: string;
  type: OwnerType;
  username: string
  url: string;
  avatarUrl: string;
}