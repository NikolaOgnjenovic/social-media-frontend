import {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {ImageWithComments} from '../components/ImageWithComments';
import HashtagInput from '../components/HashtagInput';
import ErrorDialog from '../components/ErrorDialog';

import {getUserId} from '../services/AuthService';
import {Comment, Image} from '../types/global';
import {createImage, getImages} from "../services/ImageService";
import {getComments} from "../services/CommentService";

import '../css/feed.css';
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
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

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
        }
    }, [isLoggedIn]);

    // Fetch images, comments, and folders
    async function loadData() {
        setImages(await getImages());
        // TODO: pagination / infinite scrolling
        //setImages(await getImagesWithPagination(1, 10));
        setComments(await getComments());

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

        try {
            const updatedImages = await createImage(authorId, tags, newImageTitle, imageFile);
            setImages(updatedImages);
        } catch {
            setErrorMessage("Failed to create image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenImageEditorsModal() {
        setIsImageEditorModalOpen(true);
    }

    function updateImage(imageFile: File) {
        handleImageCreate(getUserId(), hashtags, imageFile);
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    return (
        <>
            <p>Upload an image</p>
            <div id="image-input">
                <input type="text" placeholder="Image title" id="image-title-input"
                       onChange={e => handleSetImageTitle(e)}/>
                <div id="image-upload-section">
                    <label htmlFor="image-file-input" id="image-file-label">Select an image</label>
                    <input type="file" id="image-file-input"
                           onChange={e => handleSetImageFile(e)}/>
                    <div className="selected-image-name" id="selected-image-name"></div>
                </div>

                <div id="#hashtag-input">
                    <HashtagInput
                        hashtags={hashtags}
                        setHashtags={setHashtags}
                    />
                </div>

                <button className="image-button centered-flex" type="submit" id="upload-button"
                        onClick={() => handleOpenImageEditorsModal()}>
                    <img src="/create_image.svg" alt="Create image"/>
                </button>
            </div>

            <div className="search-container">
                <div className="interaction-section">
                    <p>Title:</p>
                    <input type="text" className="search-title-input" placeholder="Search images by title"
                           onChange={e => handleSetImageTitleSearchTerm(e)}/>
                </div>

                <div className="interaction-section">
                    <p>Tags:</p>
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
                            comments={comments}
                            setImages={setImages}
                            setComments={setComments}
                        />
                    )
                }
            </div>

            {
                showErrorMessageDialog &&
                <ErrorDialog
                    message={errorMessage}
                    isOpen={showErrorMessageDialog}
                    onClose={handleCloseErrorMessageDialog}
                />
            }

            {isImageEditorModalOpen && newImageFile && (
                <ImageEditModal
                    imageSource={newImageFile}
                    visible={isImageEditorModalOpen}
                    setVisible={setIsImageEditorModalOpen}
                    updateImage={updateImage}
                />
            )}
        </>
    )
}

export default Feed