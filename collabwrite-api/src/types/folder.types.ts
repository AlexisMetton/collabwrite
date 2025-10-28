export interface FolderDTO {
  userId: string;
  body: {
    name: string;
  }
}

export interface FolderUpdateDTO {
    body: {
        oldname: string,
        newname: string,
    }
}