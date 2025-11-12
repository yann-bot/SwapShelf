
export type User = {
    id: string;
    name: string,
    email: string,
    password: string,
    role: string
    created_at: Date;
}


export type createUserInput = Omit<User, 'id' | 'created_at'>;

export interface UserRepo {
    create: (input: User) => Promise<User>,
    readOneEmail:(email:string) => Promise<User | undefined>
    // readOneId:(id:string) => Promise<User| undefined>,
  
}