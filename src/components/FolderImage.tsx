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

    // Folders
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Set editor usernames on component mount
    useEffect(() => {
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
            setErrorMessage("Failed to delete image. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenFolderModal() {
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
            setErrorMessage("Failed to update image folder. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        } finally {
            handleCloseFolderModal();
        }
    }

    function handleOpenEditorUsernamesModal() {
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
            setErrorMessage("Failed to update image editors. Please check if you're connected to the internet and try again.");
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
            setErrorMessage("Failed to open image editing dialog because the image is missing. Please check if you're connected to the internet and try again.");
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
            setErrorMessage("Failed to update image file. Please check if you're connected to the internet and try again.");
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
            <p className="author">Author: {image.authorId}</p>
            <img className="image" src={imageUrl} alt={`Image ${image.id}`}/>
            <p className="title">{image.title}</p>
            <p className="tags">Tags: {image.tags}</p>
            <p className="tags">Editors: {editorUsernames}</p>

            <div className={"horizontal-group"}>
                <button className="image-button" type="submit" onClick={() => handleOpenFolderModal()}>
                    <img src="/folder.svg" alt="Update folder"/>
                </button>

                {image.editorIds.includes(getUserId()) && (
                    <>
                        <button className="image-button" type="submit" onClick={() => handleOpenEditorUsernamesModal()}>
                            <img src="/editors.svg" alt="Update editors"/>
                        </button>

                        <button className="image-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                            <img src="/delete.svg" alt="Delete"/>
                        </button>

                        <button className="image-button" type="submit" onClick={() => handleOpenImageEditingModal()}>
                            <img src="/edit_image.svg" alt="Edit image"/>
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
                        message="Delete image"
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