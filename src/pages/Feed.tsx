import {ChangeEvent, useEffect, useState} from 'react';
import * as imageService from "../services/ImageService.ts";
import * as commentService from "../services/CommentService.ts";
import {ImageWithComments} from "../components/ImageWithComments.tsx";
import {Comment, Image} from "../types/global";
import {getUserId} from "../services/AuthService.ts";
import {useNavigate} from "react-router-dom";
import "../css/interaction-section.css";
import HashtagInput from "../components/HashtagInput.tsx";
import ImageEditModal from "../components/ImageEditModal.tsx";

function Feed() {
    const [images, setImages] = useState<Image[]>([]);
    const [searchedImages, setSearchedImages] = useState<Image[]>(images);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoggedIn] = useState(getUserId() != -1);
    const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [newImageTitle, setNewImageTitle] = useState<string>("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const navigate = useNavigate();
    const selectedImageName = document.getElementById('selected-image-name');

    let imageTitleSearchTerm: string = "";
    let imageTagSearchTerm: string = "";

    // Fetch data on component mount
    useEffect(() => {
        loadData();
    }, []);

    // Use useEffect to update searchedImages when images change
    useEffect(() => {
        updateSearchedImages();
    }, [images, imageTitleSearchTerm, imageTagSearchTerm]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/', {replace: true});
            window.location.reload();
        }
    }, [isLoggedIn]);

    // Fetch images, comments, and folders
    async function loadData() {
        setImages(await imageService.getImagesWithPagination(1, 10));
        setComments(await commentService.getComments());

        if (selectedImageName != null) {
            selectedImageName.textContent = "No selected image";
        }
    }

    function handleSetImageTitle(event: ChangeEvent<HTMLInputElement>) {
        setNewImageTitle(event.target.value);
    }

    function handleSetImageFile(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files != null && files.length > 0) {
            setNewImageFile(files[0]);

            if (selectedImageName != null) {
                selectedImageName.textContent = "Selected image: " + newImageFile?.name;
            }
        }
    }

    function updateSearchedImages() {
        let searchedImages = [...images];

        if (imageTitleSearchTerm.length > 0) {
            searchedImages = searchedImages.filter((image) => {
                return image.title.toLowerCase().includes(imageTitleSearchTerm.toLowerCase());
            });
        }

        if (imageTagSearchTerm.length > 0) {
            searchedImages = searchedImages.filter((image) => {
                let containsTag = false;
                image.tags.forEach((tag: string) => {
                    if (tag.toLowerCase().includes(imageTagSearchTerm.toLowerCase())) {
                        containsTag = true;
                        return;
                    }
                })
                return containsTag;
            });
        }

        setSearchedImages(searchedImages);
    }

    function handleSetImageTitleSearchTerm(event: ChangeEvent<HTMLInputElement>) {
        imageTitleSearchTerm = event.target.value;
        updateSearchedImages();
    }

    function handleSetImageTagSearchTerm(event: ChangeEvent<HTMLInputElement>) {
        imageTagSearchTerm = event.target.value;
        updateSearchedImages();
    }

    async function handleImageCreate(authorId: number, tags: string[], imageFile: File | null) {
        if (newImageTitle.length < 1 || imageFile == null) {
            return;
        }

        const updatedImages = await imageService.createImage(images, authorId, tags, newImageTitle, imageFile);
        setImages(updatedImages);
    }

    function handleOpenImageEditorsModal() {
        setIsImageEditorModalOpen(true);
    }

    function updateImage(imageFile: File) {
        handleImageCreate(getUserId(), hashtags, imageFile);
    }

    return (
        <>
            <div className="flex-container">
                <div className="interaction-section">
                    <button className="image-button" type="submit"
                            onClick={() => handleOpenImageEditorsModal()}>
                        <img src="/create_image.svg" alt="Create image"/>
                    </button>

                    <input type="text" id="image-title-input" className="image-title-input" placeholder="Image title"
                           onChange={e => handleSetImageTitle(e)}/>

                    <label htmlFor="image-file-input" className="image-upload-label">Select an image</label>
                    <input type="file" id="image-file-input" className="image-file-input"
                           onChange={e => handleSetImageFile(e)}/>
                    <div className="selected-image-name" id="selected-image-name"></div>

                    <HashtagInput
                        hashtags={hashtags}
                        setHashtags={setHashtags}
                    />
                </div>

                {isImageEditorModalOpen && newImageFile && (
                    <ImageEditModal
                        imageSource={newImageFile}
                        visible={isImageEditorModalOpen}
                        setVisible={setIsImageEditorModalOpen}
                        updateImage={updateImage}
                    />
                )}

                <div className="interaction-section">
                    <p>Search by title:</p>
                    <input type="text" className="search-title-input" placeholder="Search images by title"
                           onChange={e => handleSetImageTitleSearchTerm(e)}/>
                </div>

                <div className="interaction-section">
                    <p>Search by tag:</p>
                    <input type="text" className="search-tag-input" placeholder="Search images by specific tag"
                           onChange={e => handleSetImageTagSearchTerm(e)}/>
                </div>
            </div>


            <div className="flex-container">
                {
                    searchedImages.map((image: Image) =>
                        <ImageWithComments
                            key={image.id}
                            image={image}
                            images={images}
                            comments={comments}
                            setImages={setImages}
                            setComments={setComments}
                        />
                    )
                }
            </div>
        </>
    )
}

export default Feed