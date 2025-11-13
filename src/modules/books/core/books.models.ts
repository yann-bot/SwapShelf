


export type Book = {
      id: string,
      owner_id: string,
      title: string,
      description: string,
      author: string,
      available: boolean,
      condition: string,
      created_at: Date,
}



export type createBookInput = Omit<Book, 'id' | 'owner_id' |'created_at'>;
export interface BookRepo {
    create: (book: Book) => Promise<Book>,
    readAllByTitle: (title: string) => Promise<Book[]>,
    readAll: () => Promise<Book[]>,
    readOneId: (id:string) => Promise<Book | undefined>,
    delete: (id: string) => Promise<boolean>
}