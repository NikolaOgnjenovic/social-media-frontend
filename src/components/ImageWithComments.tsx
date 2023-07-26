import React, {ChangeEvent, useEffect, useState} from "react";
import * as imageService from "../services/ImageService.ts";
import * as commentService from "../services/CommentService.ts";
import {Comment, Image} from "../types/global";
import {getUserId} from "../services/AuthService.ts";
import "../css/image-with-comments.css";
import GenericConfirmationDialog from "./GenericConfirmationDialog.tsx";

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
    const userId = getUserId();

    async function handleCommentCreate(newCommentContent: string) {
        setComments(await commentService.createComment(comments, userId, image.id, newCommentContent));
    }

    async function handleImageLike(updatedLikeCount: number) {
        setImages(await imageService.updateImageLikeCount(images, image.id, updatedLikeCount));
    }

    function handleOpenImageDeletionDialog() {
        setShowImageDeletionDialog(true);
    }

    function handleCloseImageDeletionDialog() {
        setShowImageDeletionDialog(false);
    }

    async function handleImageDelete() {
        const updatedImages = await imageService.deleteImage(images, image.id);
        setImages(updatedImages);
    }

    function handleCommentContentUpdate(event: ChangeEvent<HTMLInputElement>) {
        setNewCommentContent(event.target.value);
    }

    async function handleCommentLike(commentId: number, updatedLikeCount: number) {
        setComments(await commentService.updateCommentLikeCount(comments, commentId, updatedLikeCount));
    }

    function handleOpenCommentDeletionDialog(commentId: number) {
        setShowCommentDeletionDialog(true);
        setCommentDeletionId(commentId);
    }

    function handleCloseCommentDeletionDialog() {
        setShowCommentDeletionDialog(false);
    }

    async function handleCommentDelete(commentId: number) {
        const updatedComments = await commentService.deleteComment(comments, commentId);
        setComments(updatedComments);
    }

    useEffect(() => {
        loadImage();
    }, [image.id]);

    function loadImage() {
        imageService.getCompressedImageFilePath(image.id).then((url) => setImageUrl(url));
        // TODO: figure out why tags are being sent as an array of one item??
        image.tags = image.tags[0].split(",");
    }

    function toggleCommentVisibility() {
        setShowComments((prevShowComments) => !prevShowComments);
    }

    if (!imageUrl) {
        return <div>Loading image...</div>
    }

    return (
        <div className="image-with-comments">
            <p className="author">Author: {image.authorId}</p>
            <img className="image" src={imageUrl} alt={`Image ${image.id}`}/>
            <p className="title">{image.title}</p>
            <div className="extracted-hashtags">
                {image.tags.map((hashtag, index) => (
                    <ul>
                        <li key={index}>{hashtag}</li>
                    </ul>
                ))}
            </div>

            {image.editorIds.includes(getUserId()) && (
                <button className="delete-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                    {/*<button className="delete-button" type="submit" onClick={handleImageDelete}>*/}
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
        </div>
    );
};