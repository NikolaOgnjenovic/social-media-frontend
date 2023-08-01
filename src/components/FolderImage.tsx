import React, {useEffect, useState} from "react";
import {Folder, Image, User} from "../types/global";
import * as imageService from "../services/ImageService";
import FolderSelectionModal from "./FolderSelectionModal";
import {getUserId} from "../services/AuthService";
import EditorSelectionModal from "./EditorSelectionModal";
import ImageEditModal from "./ImageEditModal";
import "../css/image-with-comments.css";
import GenericConfirmationDialog from "./GenericConfirmationDialog";
import ErrorDialog from "./ErrorDialog.tsx";
import {getUsernameById} from "../services/UserService.ts";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

export const FolderImage: React.FC<{
    image: Image,
    folders: Folder[],
    users: User[],
    setImages: React.Dispatch<any>
}> = ({
          image,
          folders,
          users,
          setImages
      }) => {

    // Images
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [isImageEditingModalOpen, setIsImageEditingModalOpen] = useState(false);
    const [isEditorUsernamesModalOpen, setIsEditorUsernamesModalOpen] = useState(false);
    const [showImageDeletionDialog, setShowImageDeletionDialog] = useState(false);
    const [editorUsernames, setEditorUsernames] = useState<string>("");
    const [imageAuthorUsername, setImageAuthorUsername] = useState<string>("");

    // Folders
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Set image author & editor usernames on component mount
    useEffect(() => {
        getUsernameById(image.authorId).then((username) => {
            setImageAuthorUsername(username);
        });

        handleSetEditorUsernames();
    }, []);

    async function handleSetEditorUsernames() {
        setEditorUsernames(await getImageEditorUsernames());
    }

    // Load image if the editing modal is not open
    useEffect(() => {
        if (!isImageEditingModalOpen) {
            loadImage();
        }
    }, [isImageEditingModalOpen]);

    // Gets the image file and sets the image url state variable
    function loadImage() {
        imageService.getImageFilePath(image.id).then((url) => setImageUrl(url)).catch((error) => {
            console.log(error)
        });
    }

    function handleOpenImageDeletionDialog() {
        setShowImageDeletionDialog(true);
    }

    function handleCloseImageDeletionDialog() {
        setShowImageDeletionDialog(false);
    }

    // Deletes the image and sets the images state variable
    async function handleImageDelete() {
        try {
            setImages(await imageService.deleteImage(image.id, imageUrl));
        } catch {
            setErrorMessage(localizedStrings.images.errors.delete);
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenFolderModal() {
        if (folders.length === 0) {
            setErrorMessage(localizedStrings.folders.errors.noFolders);
            handleOpenErrorMessageDialog();
            return;
        }

        setIsFolderModalOpen(true);
    }

    function handleCloseFolderModal() {
        setIsFolderModalOpen(false);
    }

    // Updates the folder id of the selected image and sets the images state variable
    async function handleFolderSelect(folderId: number) {
        try {
            setImages(await imageService.updateImageFolderId(image.id, folderId));
        } catch {
            setErrorMessage(localizedStrings.images.errors.updateImageFolder);
            handleOpenErrorMessageDialog();
        } finally {
            handleCloseFolderModal();
        }
    }

    function handleOpenEditorUsernamesModal() {
        if (users.length === 1) {
            setErrorMessage(localizedStrings.images.errors.openEditors);
            handleOpenErrorMessageDialog();
            return;
        }

        setIsEditorUsernamesModalOpen(true);
    }

    function handleCloseEditorUsernamesModal() {
        setIsEditorUsernamesModalOpen(false);
    }

    console.log("Rerendered, image is: " + image);
    console.table(image);

    // Sets the editor ids of the selected image and sets the images state variable
    async function handleEditorUsernamesUpdate(editorIds: number[]) {
        try {
            await getImageEditorUsernames().then(async (editorUsernames) => {
                // TODO: All components get re-rendered and the images[] in the folders.tsx updates BUT
                //  the folder children do not re-render until refresh
                setEditorUsernames(editorUsernames);
                const images = await imageService.updateImageEditorIds(image.id, editorIds);
                setImages(images);
                window.location.reload(); // Temporary solution
            });

        } catch {
            setErrorMessage(localizedStrings.images.errors.updateEditors);
            handleOpenErrorMessageDialog();
        }
    }

    // Returns a string which contains comma separated usernames of the image editors
    async function getImageEditorUsernames(): Promise<string> {
        const editorIds: number[] = image.editorIds;
        const editorCount = editorIds.length;

        let usernames = "";

        for (let i = 0; i < editorCount; i++) {
            const username = await getUsernameById(editorIds[i]);

            usernames += username;
            if (i == editorCount - 1) {
                break;
            }

            usernames += ", ";
        }

        return usernames;
    }

    function handleOpenImageEditingModal() {
        if (imageUrl === undefined) {
            setErrorMessage(localizedStrings.images.errors.openImageEditor);
            handleOpenErrorMessageDialog();
        } else {
            setIsImageEditingModalOpen(true);
        }
    }

    // Updates the image file then gets the new image file path and sets the image url state variable
    async function updateImage(imageFile: File) {
        try {
            imageService.updateFile(image.id, imageFile).then(async () => {
                imageService.getImageFilePath(image.id).then((url) => {
                    // Remove the blob identified with the old url
                    URL.revokeObjectURL(url);

                    // Set the url of the new blob
                    setImageUrl(url);
                }).catch((error) => {
                    console.log(error);
                });
            });
        } catch {
            setErrorMessage(localizedStrings.images.errors.updateFile);
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    return (
        <div className="image-container" style={{width: "100%"}}>
            <p className="author">{localizedStrings.author} {imageAuthorUsername}</p>
            <img className="image" src={imageUrl} alt={`${localizedStrings.images.imageAlt} ${image.id}`}/>
            <p className="title">{image.title}</p>
            <div className="extracted-hashtags">
                <ul>
                    {image.tags.map((hashtag, index) => (
                        <li key={index}>{hashtag}</li>
                    ))}
                </ul>
            </div>
            <p className="tags">{localizedStrings.editors} {editorUsernames}</p>

            <div className={"horizontal-group"}>
                <button className="image-button" type="submit" onClick={() => handleOpenFolderModal()}>
                    <img src="/folder.svg" alt={localizedStrings.images.updateFolder}/>
                </button>

                {image.editorIds.includes(getUserId()) && (
                    <>
                        <button className="image-button" type="submit" onClick={() => handleOpenEditorUsernamesModal()}>
                            <img src="/editors.svg" alt={localizedStrings.images.updateEditors}/>
                        </button>

                        <button className="image-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                            <img src="/delete.svg" alt={localizedStrings.delete}/>
                        </button>

                        <button className="image-button" type="submit" onClick={() => handleOpenImageEditingModal()}>
                            <img src="/edit_image.svg" alt={localizedStrings.images.editImage}/>
                        </button>
                    </>
                )}

                {isFolderModalOpen && (
                    <FolderSelectionModal
                        imageFolderId={image.folderId}
                        folders={folders}
                        onSelectFolderId={handleFolderSelect}
                        onCloseModal={handleCloseFolderModal}
                    />
                )}

                {isEditorUsernamesModalOpen && (
                    <EditorSelectionModal
                        authorId={image.authorId}
                        imageEditorIds={image.editorIds}
                        users={users}
                        onSelectEditorIds={handleEditorUsernamesUpdate}
                        onCloseModal={handleCloseEditorUsernamesModal}
                    />
                )}

                {isImageEditingModalOpen && imageUrl !== undefined && (
                    <ImageEditModal
                        imageSource={imageUrl}
                        visible={isImageEditingModalOpen}
                        updateImage={updateImage}
                        setVisible={setIsImageEditingModalOpen}
                    />
                )}

                {
                    showImageDeletionDialog &&
                    <GenericConfirmationDialog
                        message={localizedStrings.images.deleteImage}
                        isOpen={showImageDeletionDialog}
                        onConfirm={() => {
                            handleImageDelete();
                            handleCloseImageDeletionDialog();
                        }}
                        onClose={handleCloseImageDeletionDialog}
                    />
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
        </div>
    );
};