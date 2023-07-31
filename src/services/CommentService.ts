import {Comment} from "../types/global";
import {getUserJwtToken} from "./AuthService.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
let comments: Comment[] = [];

export async function createComment(authorId: number, imageId: number, content: string): Promise<Comment> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({
            authorId: authorId,
            imageId: imageId,
            content: content
        })
    });

    if (!response.ok) {
        throw new Error("Failed to create comment.");
    }

    const comment = await response.json();
    comments = [...comments, comment];
    return comment;
}

// Sends a GET request which, if successful, populates the comments array
export async function getComments(): Promise<Comment[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments");

    if (!response.ok) {
        throw new Error("Failed to get comments.");
    }

    comments = await response.json();
    return comments;
}

export async function getCommentsByUserId(): Promise<Comment[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments/user", {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to get comments.");
    }

    return await response.json();
}

// Sends a PATCH request which, if successful, updates the like count of the comment with the given id
export async function updateCommentLikeCount(id: number, updatedLikeCount: number): Promise<Comment[]> {
    if (comments.length === 0) {
        comments = await getComments();
    }

    const updatedComments: Comment[] = [...comments];
    const response = await fetch(BACKEND_URL + "/api/v1/comments/" + id + "/like-count", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedLikeCount)
    });

    if (!response.ok) {
        throw new Error("Failed to update comment like count.");
    }

    for (let i = 0; i < updatedComments.length; i++) {
        if (updatedComments[i].id === id) {
            updatedComments[i].likeCount = updatedLikeCount;
            break;
        }
    }

    comments = updatedComments;
    return comments;
}

export async function deleteComment(commentId: number): Promise<Comment[]> {
    if (comments.length === 0) {
        return comments;
    }
    const [response] = await Promise.all([fetch(BACKEND_URL + "/api/v1/comments/" + commentId, {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "DELETE"
    })]);

    if (!response.ok) {
        throw new Error("Failed to delete comment.");
    }

    // Filter out the deleted comment from the comments array
    comments = comments.filter((comment) => comment.id !== commentId);
    return comments;
}