import React, {ChangeEvent, useEffect, useState} from "react";
import * as imageService from "../services/image-service.ts";
import * as commentService from "../services/comment-service.ts";
import {Comment, Image} from "../types/global";
import {getUserId} from "../services/auth-service.ts";
import "../css/image-with-comments.css";

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
    const userId = getUserId();

    async function handleCommentCreate(newCommentContent: string) {
        setComments(await commentService.createComment(comments, userId, image.id, newCommentContent));
    }

    async function handleImageLike(updatedLikeCount: number) {
        setImages(await imageService.updateImageLikeCount(images, image.id, updatedLikeCount));
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

    async function handleCommentDelete(commentId: number) {
        const updatedComments = await commentService.deleteComment(comments, commentId);
        setComments(updatedComments);
    }

    useEffect(() => {
        loadImage();
    }, [image.id]);

    function loadImage() {
        imageService.getCompressedImageFilePath(image.id).then((url) => setImageUrl(url));
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
            <div className="extracted-hashtags">Tags:
                <ul>
                    {image.tags.map((hashtag, index) => (
                        <li key={index}>{hashtag}</li>
                    ))}
                </ul>
            </div>

            {image.editorIds.includes(getUserId()) && (
                <button className="delete-button" type="submit" onClick={handleImageDelete}>
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
                                            onClick={() => handleCommentDelete(comment.id)}>
                                        <img src="/delete.svg" alt="Delete"/>
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            }
        </div>
    );
};