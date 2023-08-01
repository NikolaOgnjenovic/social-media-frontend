import React, {ChangeEvent, useEffect, useState} from "react";
import * as imageService from "../services/ImageService";
import * as commentService from "../services/CommentService";
import {Comment, Image} from "../types/global";
import {getUserId} from "../services/AuthService";
import "../css/image-with-comments.css";
import GenericConfirmationDialog from "./GenericConfirmationDialog";
import ErrorDialog from "./ErrorDialog.tsx";
import {getUserLikedImageIds, getUsernameById, updateUserLikedImageIds} from "../services/UserService.ts";
import {CommentFC} from "./Comment.tsx";

export const ImageWithComments: React.FC<{
    image: Image,
    comments: Comment[],
    setImages: React.Dispatch<any>,
    setComments: React.Dispatch<any>,
}> = ({
          image,
          comments,
          setImages,
          setComments,
      }) => {
    // Auth
    const userId = getUserId();

    // Images
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [showImageDeletionDialog, setShowImageDeletionDialog] = useState(false);
    const [imageAuthorUsername, setImageAuthorUsername] = useState("");
    const [imageIsLiked, setImageIsLiked] = useState<boolean>(getUserLikedImageIds().has(image.id));

    // Comments
    const [showComments, setShowComments] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // On component mount
    useEffect(() => {
        // Set image author username in order to display it
        getUsernameById(image.authorId).then((username) => {
            setImageAuthorUsername(username);
        });

        // Get compressed image in order to display it
        imageService.getCompressedImageFilePath(image.id).then((url) => setImageUrl(url)).catch((error) => {
            console.log(error);
        });
        
    }, []);

    // Creates a comment and updates the comments state variable
    async function handleCommentCreate(newCommentText: string) {
        if (newCommentText.length === 0) {
            setErrorMessage("Please input a message for your comment.");
            handleOpenErrorMessageDialog();
            return;
        }

        try {
            const createdComment = await commentService.createComment(userId, image.id, newCommentText);
            setComments((prevComments: Comment[]) => [...prevComments, createdComment]); // Update state with the new comment
        } catch {
            setErrorMessage("Failed to create comment. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    // Likes an image and sets the images state variable
    async function handleImageLike(updatedLikeCount: number) {
        const liking: boolean = updatedLikeCount > image.likeCount;
        try {
            await imageService.updateImageLikeCount(image.id, updatedLikeCount).then(async (images: Image[]) => {
                setImages(images);

                const updatedLikedImageIds = getUserLikedImageIds();
                if (liking) {
                    updatedLikedImageIds.add(image.id);
                } else {
                    updatedLikedImageIds.delete(image.id);
                }
                await updateUserLikedImageIds(userId, updatedLikedImageIds).then(() => {
                    setImageIsLiked(liking);
                })
            });
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

    // Deletes an image and sets the images state variable
    async function handleImageDelete() {
        try {
            setImages(await imageService.deleteImage(image.id, imageUrl));
        } catch {
            setErrorMessage("Failed to delete image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleCommentTextUpdate(event: ChangeEvent<HTMLInputElement>) {
        setNewCommentText(event.target.value);
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    function toggleCommentVisibility() {
        setShowComments((prevShowComments) => !prevShowComments);
    }

    return (
        <div className="image-container">
            <p className="author">Author: {imageAuthorUsername}</p>

            {imageUrl &&
                <img className="image" src={imageUrl} alt={`Image ${image.id}`}/>
            }

            {!imageUrl &&
                <p className="author">Loading image...</p>
            }

            <p className="title">{image.title}</p>

            <div className="extracted-hashtags">
                <ul>
                    {image.tags.map((hashtag, index) => (
                        <li key={index}>{hashtag}</li>
                    ))}
                </ul>
            </div>

            {image.editorIds.includes(getUserId()) && (
                <button className="delete-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                    <img src="/delete.svg" alt="Delete"/>
                </button>
            )}

            <div className="interaction-section">
                {!imageIsLiked &&
                    <button className="like-button" type="submit" onClick={() => handleImageLike(image.likeCount + 1)}>
                        <img src="/not_liked.svg" alt="Like"/>
                    </button>
                }

                {imageIsLiked &&
                    <button className="like-button" type="submit" onClick={() => handleImageLike(image.likeCount - 1)}>
                        <img src="/liked.svg" alt="Unlike"/>
                    </button>
                }

                <span className="like-counter">{image.likeCount} likes</span>
            </div>

            <div className="interaction-section">
                <span>
                    <input
                        type="text"
                        className="comment-input"
                        placeholder="Leave a comment"
                        value={newCommentText}
                        onChange={(e) => handleCommentTextUpdate(e)}/>
                </span>
                <button className="comment-button" type="submit" onClick={() => handleCommentCreate(newCommentText)}>
                    <img src="/comment.svg" alt="Comment"/>
                </button>
            </div>

            {
                comments.filter(comment => comment.imageId === image.id).length > 0 &&
                <button className="toggle-comments-button" onClick={toggleCommentVisibility}>
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
            }

            {
                showComments &&
                <div className="comment-list">
                    {comments
                        .filter((comment) => comment.imageId === image.id)
                        .map((comment) => (
                            <CommentFC
                                comment={comment}
                                setComments={setComments}
                                userId={userId}
                            />
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