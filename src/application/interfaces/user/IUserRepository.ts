import { User } from "../../../entities/User";

export interface IUserRepository {
  find(filter: any, page: any): Promise<User[]>;
  findOne(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  add(user: User): Promise<User>;
  update(_id: string, user: any): Promise<User | null>;
  upsert(user: User): Promise<boolean>;
  filter(filter: any, page: any): Promise<User[]>;
  count(filter: any): Promise<number>;
  search(search: string): Promise<User[]>;
  allUsers(): Promise<User[]>;
}
