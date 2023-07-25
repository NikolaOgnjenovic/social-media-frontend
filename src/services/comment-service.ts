import {Comment} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createComment(comments: Comment[], authorId: number, imageId: number, content: string): Promise<Comment[]> {
    const updatedComments: Comment[] = [...comments];
    await fetch(BACKEND_URL + "/api/v1/comments", {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({
            authorId: authorId,
            imageId: imageId,
            content: content
        })
    })
        .then((res) => res.json())
        .then((comment: Comment) => updatedComments.push(comment))
        .catch((err) => {
            alert("Error creating comment: " + err.message);
        });

    return updatedComments;
}

// Sends a GET request which, if successful, populates the comments array
export async function getComments(): Promise<Comment[]> {
    let comments: Comment[] = [];
    await fetch(BACKEND_URL + "/api/v1/comments")
        .then(res => res.json())
        .then(data => {
            comments = data;
        }).catch((err) => {
            alert("Error getting comments: " + err.message);
        });
    return comments;
}

export async function getCommentsByUserId(): Promise<Comment[]> {
    let comments: Comment[] = [];
    await fetch(BACKEND_URL + "/api/v1/comments/user", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    })
        .then(res => res.json())
        .then(data => {
            comments = data;
        }).catch((err) => {
            alert("Error getting comments: " + err.message);
        });
    return comments;
}

// Sends a PATCH request which, if successful, updates the like count of the comment with the given id
export async function updateCommentLikeCount(comments: Comment[], id: number, updatedLikeCount: number): Promise<Comment[]> {
    const updatedComments: Comment[] = [...comments];

    await fetch(BACKEND_URL + "/api/v1/comments/" + id + "/like-count", {
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("jwtToken")}`},
        method: "PATCH",
        body: JSON.stringify(updatedLikeCount)
    }).then(() => {
            for (let i = 0; i < updatedComments.length; i++) {
                if (updatedComments[i].id == id) {
                    updatedComments[i].likeCount = updatedLikeCount;
                    break;
                }
            }
        }
    ).catch((err) => {
        alert("Error liking comment: " + err.message);
    })
    return updatedComments;
}

export async function deleteComment(comments: Comment[], commentId: number): Promise<Comment[]> {
    try {
        await fetch(BACKEND_URL + "/api/v1/comments/" + commentId, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            },
            method: "DELETE"
        });

        // Filter out the deleted comment from the comments array
        return comments.filter((comment) => comment.id !== commentId);
    } catch (err: any) {
        alert("Error deleting comment: " + err.message);
        return comments; // Return the original array in case of an error
    }
}