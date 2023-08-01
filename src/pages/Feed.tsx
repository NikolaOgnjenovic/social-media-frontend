import {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {ImageWithComments} from '../components/ImageWithComments';
import HashtagInput from '../components/HashtagInput';
import ErrorDialog from '../components/ErrorDialog';
import ImageEditModal from '../components/ImageEditModal.tsx';

import {getUserId} from '../services/AuthService';
import {Comment, Image} from '../types/global';
import {createImage, getImages} from '../services/ImageService';
import {getComments} from '../services/CommentService';

import '../css/feed.css';

function Feed() {
    const navigate = useNavigate();
    const selectedImageNameElement = document.getElementById('selected-image-name');

    // Auth
    const [isLoggedIn] = useState(getUserId() != -1);

    // Images
    const [images, setImages] = useState<Image[]>([]);
    const [searchedImages, setSearchedImages] = useState<Image[]>(images);
    const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [newImageTitle, setNewImageTitle] = useState<string>("");
    const [hashtags, setHashtags] = useState<string[]>([]);

    // Comments
    const [comments, setComments] = useState<Comment[]>([]);

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    let imageTitleSearchTerm: string = "";
    let imageTagSearchTerm: string = "";

    // If the user is not logged in, navigate to /login
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/', {replace: true});
        }
    }, [isLoggedIn]);

    // Fetch data on component mount
    useEffect(() => {
        loadData();
    }, []);

    // Fetch images & comments
    async function loadData() {
        try {
            setImages(await getImages());
        } catch {
            console.log("Failed to load images");
        }

        try {
            setComments(await getComments());
        } catch {
            console.log("Failed to load comments");
        }
    }

    // Update selected image name text on selectedImageNameElement change
    useEffect(() => {
        if (selectedImageNameElement !== null) {
            selectedImageNameElement.textContent = "No image selected";
        }
    }, [selectedImageNameElement]);

    // Update searched images that are displayed when the images change or when searching by title / tags
    useEffect(() => {
        searchImages();
    }, [images, imageTitleSearchTerm, imageTagSearchTerm]);

    function handleSetImageTitle(event: ChangeEvent<HTMLInputElement>) {
        setNewImageTitle(event.target.value);
    }

    function handleSetImageFile(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files != null && files.length > 0) {
            setNewImageFile(files[0]);

            if (selectedImageNameElement != null) {
                selectedImageNameElement.textContent = "Selected image: " + newImageFile?.name;
            }
        }
    }

    // Filters the searched images by title & tags using imageTitleSearchTerm & imageTagSearchTerm
    function searchImages() {
        let searchedImages = [...images];

        // Filter by title
        if (imageTitleSearchTerm.length > 0) {
            searchedImages = searchedImages.filter((image) => {
                return image.title.toLowerCase().includes(imageTitleSearchTerm.toLowerCase());
            });
        }

        // Filter by tags
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
        searchImages();
    }

    function handleSetImageTagSearchTerm(event: ChangeEvent<HTMLInputElement>) {
        imageTagSearchTerm = event.target.value;
        searchImages();
    }

    // Creates an image using the image service and updates the images state.
    async function handleImageCreate(authorId: number, tags: string[], imageFile: File) {
        try {
            console.log("Creating image");
            console.table(tags);
            const createdImage = await createImage(authorId, tags, newImageTitle, imageFile);
            setImages(prevImages => [...prevImages, createdImage]); // Update state with the new image
        } catch {
            setErrorMessage("Failed to create image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    // Opens the image editing modal if the image title, file and tags are valid
    function handleOpenImageEditingModal() {
        if (newImageTitle.length < 1) {
            setErrorMessage("Please input a title for your image");
            handleOpenErrorMessageDialog();
            return;
        }

        if (newImageFile == null) {
            setErrorMessage("Please upload your image.");
            handleOpenErrorMessageDialog();
            return;
        }

        if (hashtags.length === 0) {
            setErrorMessage("Please input some hashtags for your image.");
            handleOpenErrorMessageDialog();
            return;
        }

        setIsImageEditorModalOpen(true);
    }

    // Since the image editor needs a function which takes only a file parameter (because it is used for updating too),
    // this function exists purely as a wrapper around handleImageCreate()
    function createImageWithFile(imageFile: File) {
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
            <p className={"title"}>Upload an image</p>
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
                        onClick={() => handleOpenImageEditingModal()}>
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
                    updateImage={createImageWithFile}
                />
            )}
        </>
    )
}

export default Feed