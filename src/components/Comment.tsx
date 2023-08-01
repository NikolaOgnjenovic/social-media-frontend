import React, {useEffect, useState} from "react";
import {getUserLikedCommentIds, getUsernameById, updateUserLikedCommentIds,} from "../services/UserService.ts";
import {getUserId} from "../services/AuthService.ts";
import {Comment} from "../types/global";
import * as commentService from "../services/CommentService.ts";
import ErrorDialog from "./ErrorDialog.tsx";
import GenericConfirmationDialog from "./GenericConfirmationDialog.tsx";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

interface Props {
    comment: Comment;
    setComments: React.Dispatch<any>;
    userId: number;
}

export const CommentFC: React.FC<Props> = ({comment, setComments, userId}) => {
    // Comments
    const [commentIsLiked, setCommentIsLiked] = useState<boolean>(getUserLikedCommentIds().has(comment.id));
    const [showCommentDeletionDialog, setShowCommentDeletionDialog] = useState(false);
    const [commentDeletionId, setCommentDeletionId] = useState(-1);
    const [commentAuthorUsername, setCommentAuthorUsername] = useState("");

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        // Set commentIsLiked
        setCommentIsLiked(getUserLikedCommentIds().has(comment.id));

        // Set comment author username in order to display it
        getUsernameById(comment.authorId).then((username) => {
            setCommentAuthorUsername(username);
        });
    })

    // Likes a comment and sets the comments state variable
    async function handleCommentLike(updatedLikeCount: number) {
        const liking: boolean = updatedLikeCount > comment.likeCount;
        try {
            await commentService.updateCommentLikeCount(comment.id, updatedLikeCount).then(async (comments: Comment[]) => {
                setComments(comments);

                const updatedLikedCommentIds = getUserLikedCommentIds();
                if (liking) {
                    updatedLikedCommentIds.add(comment.id);
                } else {
                    updatedLikedCommentIds.delete(comment.id);
                }
                await updateUserLikedCommentIds(userId, updatedLikedCommentIds).then(() => {
                    setCommentIsLiked(liking);
                })
            });
        } catch {
            setErrorMessage(localizedStrings.comments.errors.like);
            handleOpenErrorMessageDialog();
        }
    }

    // Deletes a comment and sets the comments state variable
    async function handleCommentDelete(commentId: number) {
        try {
            setComments(await commentService.deleteComment(commentId));
        } catch {
            setErrorMessage(localizedStrings.comments.errors.delete);
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    function handleOpenCommentDeletionDialog(commentId: number) {
        setShowCommentDeletionDialog(true);
        setCommentDeletionId(commentId);
    }

    function handleCloseCommentDeletionDialog() {
        setShowCommentDeletionDialog(false);
    }

    return (
        <div className="comment-item centered-flex" key={comment.id}>
            <span className="author-name">{commentAuthorUsername}</span>
            <p className="comment-text">{comment.content}</p>

            <div className="interaction-section">
                {!commentIsLiked &&
                    <button className="like-button" type="submit"
                            onClick={() => handleCommentLike(comment.likeCount + 1)}>
                        <img src="/not_liked.svg" alt={localizedStrings.like}/>
                    </button>
                }

                {commentIsLiked &&
                    <button className="like-button" type="submit"
                            onClick={() => handleCommentLike(comment.likeCount - 1)}>
                        <img src="/liked.svg" alt={localizedStrings.unlike}/>
                    </button>
                }
                <span className="like-counter">{comment.likeCount} {localizedStrings.likes}</span>
            </div>

            {comment.authorId === getUserId() && (
                <button className="delete-button" type="submit"
                        onClick={() => handleOpenCommentDeletionDialog(comment.id)}>
                    <img src="/delete.svg" alt={localizedStrings.delete}/>
                </button>
            )}

            {
                showCommentDeletionDialog &&
                <GenericConfirmationDialog
                    message={localizedStrings.comments.deleteComment}
                    isOpen={showCommentDeletionDialog}
                    onConfirm={() => {
                        handleCommentDelete(commentDeletionId);
                        handleCloseCommentDeletionDialog();
                    }}
                    onClose={handleCloseCommentDeletionDialog}
                />
            }

            {
                showErrorMessageDialog &&
                <ErrorDialog
                    message={errorMessage}
                    isOpen={showErrorMessageDialog}
                    onClose={handleCloseErrorMessageDialog}
                />
            }
        </div>
    );
}