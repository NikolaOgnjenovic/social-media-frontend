export type Image = {
    id: number;
    authorId: number;
    tags: string[];
    title: string;
    likeCount: number;
    editorIds: number[];
    folderId: number;
}

export type Comment = {
    id: number;
    authorId: number;
    imageId: number;
    content: string;
    likeCount: number;
}

export type Folder = {
    id: number;
    authorId: number;
    title: string;
}

export type User = {
    id: number;
    username: string;
    "likedImageIds": Set<number>;
    "likedCommentIds": Set<number>;
}

export type LoginResponse = {
    "userId": number;
    "token": string;
    "likedImageIds": number[];
    "likedCommentIds": number[];
}