export interface FolderDTO {
  userId: string;
  body: {
    name: string;
    color: string;
  }
}

export interface FolderUpdateDTO {
    body: {
        oldname: string,
        newname: string,
    }
}