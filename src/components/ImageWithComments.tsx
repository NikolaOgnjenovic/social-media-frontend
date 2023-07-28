import React, {ChangeEvent, useEffect, useState} from "react";
import * as imageService from "../services/ImageService";
import * as commentService from "../services/CommentService";
import {Comment, Image} from "../types/global";
import {getUserId} from "../services/AuthService";
import "../css/image-with-comments.css";
import GenericConfirmationDialog from "./GenericConfirmationDialog";
import ErrorDialog from "./ErrorDialog.tsx";

export const ImageWithComments: React.FC<{
    image: Image,
    images: Image[],
    comments: Comment[],
    setImages: React.Dispatch<any>,
    setComments: React.Dispatch<any>
}> = ({
          image,
          images,
          comments,
          setImages,
          setComments
      }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [showImageDeletionDialog, setShowImageDeletionDialog] = useState(false);
    const [showCommentDeletionDialog, setShowCommentDeletionDialog] = useState(false);
    const [commentDeletionId, setCommentDeletionId] = useState(-1);
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const userId = getUserId();

    async function handleCommentCreate(newCommentContent: string) {
        try {
            setComments(await commentService.createComment(comments, userId, image.id, newCommentContent));
        } catch {
            setErrorMessage("Failed to create comment. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    async function handleImageLike(updatedLikeCount: number) {
        try {
            setImages(await imageService.updateImageLikeCount(images, image.id, updatedLikeCount));
        } catch {
            setErrorMessage("Failed to like image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenImageDeletionDialog() {
        setShowImageDeletionDialog(true);
    }

    function handleCloseImageDeletionDialog() {
        setShowImageDeletionDialog(false);
    }

    async function handleImageDelete() {
        try {
            setImages(await imageService.deleteImage(images, image.id));
        } catch {
            setErrorMessage("Failed to delete image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleCommentContentUpdate(event: ChangeEvent<HTMLInputElement>) {
        setNewCommentContent(event.target.value);
    }

    async function handleCommentLike(commentId: number, updatedLikeCount: number) {
        try {
            const updatedComments = await commentService.updateCommentLikeCount(comments, commentId, updatedLikeCount);
            setComments(updatedComments);
        } catch {
            setErrorMessage("Failed to like comment. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenCommentDeletionDialog(commentId: number) {
        setShowCommentDeletionDialog(true);
        setCommentDeletionId(commentId);
    }

    function handleCloseCommentDeletionDialog() {
        setShowCommentDeletionDialog(false);
    }

    async function handleCommentDelete(commentId: number) {
        try {
            setComments(await commentService.deleteComment(comments, commentId));
        } catch {
            setErrorMessage("Failed to delete comment. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    useEffect(() => {
        loadImage();
    }, [image.id]);

    function loadImage() {
        imageService.getCompressedImageFilePath(image.id).then((url) => setImageUrl(url)).catch((error) => {
            console.log(error);
        });
        image.tags = image.tags[0].split(",");
    }

    function toggleCommentVisibility() {
        setShowComments((prevShowComments) => !prevShowComments);
    }


    return (
        <div className="image-with-comments">
            <p className="author">Author: {image.authorId}</p>

            {imageUrl &&
                <img className="image" src={imageUrl} alt={`Image ${image.id}`}/>
            }

            {!imageUrl &&
                <p className="author">Loading image...</p>
            }

            <p className="title">{image.title}</p>

            {image.tags.length > 2 &&
                <div className="extracted-hashtags">
                    <ul>
                        {image.tags.map((hashtag, index) => (
                            <li key={index}>{hashtag}</li>
                        ))}
                    </ul>
                </div>
            }

            {image.editorIds.includes(getUserId()) && (
                <button className="delete-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                    <img src="/delete.svg" alt="Delete"/>
                </button>
            )}

            <div className="interaction-section">
                <button className="like-button" type="submit" onClick={() => handleImageLike(image.likeCount + 1)}>
                    <img src="/like.svg" alt="Like"/>
                </button>
                <span className="like-counter">{image.likeCount} likes</span>
            </div>

            <div className="interaction-section">
                <button className="comment-button" type="submit" onClick={() => handleCommentCreate(newCommentContent)}>
                    <img src="/comment.svg" alt="Comment"/>
                </button>
                <span>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="Leave a comment"
                        value={newCommentContent}
                        onChange={(e) => handleCommentContentUpdate(e)}/>
                </span>
            </div>

            <button className="toggle-comments-button" onClick={toggleCommentVisibility}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>

            {
                showComments &&
                <div className="comment-list">
                    {comments
                        .filter((comment) => comment.imageId === image.id)
                        .map((comment) => (
                            <div className="comment-item" key={comment.id}>
                                <span className="author-name">{comment.authorId}</span>
                                <p className="comment-text">{comment.content}</p>

                                <div className="interaction-section">
                                    <button className="like-button" type="submit"
                                            onClick={() => handleCommentLike(comment.id, comment.likeCount + 1)}>
                                        <img src="/like.svg" alt="Like"/>
                                    </button>
                                    <span className="like-counter">{comment.likeCount} likes</span>
                                </div>

                                {comment.authorId === getUserId() && (
                                    <button className="delete-button" type="submit"
                                            onClick={() => handleOpenCommentDeletionDialog(comment.id)}>
                                        <img src="/delete.svg" alt="Delete"/>
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            }

            {
                showImageDeletionDialog &&
                <GenericConfirmationDialog
                    message="Delete image"
                    isOpen={showImageDeletionDialog}
                    onConfirm={() => {
                        handleImageDelete();
                        handleCloseImageDeletionDialog();
                    }}
                    onClose={handleCloseImageDeletionDialog}
                />
            }
            {
                showCommentDeletionDialog &&
                <GenericConfirmationDialog
                    message="Delete comment"
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
};