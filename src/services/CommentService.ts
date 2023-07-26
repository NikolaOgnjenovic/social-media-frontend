import {Comment} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createComment(comments: Comment[], authorId: number, imageId: number, content: string): Promise<Comment[]> {
    const updatedComments: Comment[] = [...comments];
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
    updatedComments.push(comment);
    return updatedComments;
}


// Sends a GET request which, if successful, populates the comments array
export async function getComments(): Promise<Comment[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments");

    if (!response.ok) {
        throw new Error("Failed to get comments.");
    }

    return response.json();
}

export async function getCommentsByUserId(): Promise<Comment[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments/user", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to get comments.");
    }

    return response.json();
}

// Sends a PATCH request which, if successful, updates the like count of the comment with the given id
export async function updateCommentLikeCount(comments: Comment[], id: number, updatedLikeCount: number): Promise<Comment[]> {
    const updatedComments: Comment[] = [...comments];
    const response = await fetch(BACKEND_URL + "/api/v1/comments/" + id + "/like-count", {
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
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

    return updatedComments;
}

export async function deleteComment(comments: Comment[], commentId: number): Promise<Comment[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/comments/" + commentId, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete comment.");
    }

    // Filter out the deleted comment from the comments array
    return comments.filter((comment) => comment.id !== commentId);
}