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

export const FolderImage: React.FC<{
    image: Image,
    images: Image[],
    setImages: React.Dispatch<any>,
    folders: Folder[],
    users: User[]
}> = ({
          image,
          images,
          setImages,
          folders,
          users
      }) => {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);
    const [showImageDeletionDialog, setShowImageDeletionDialog] = useState(false);
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        if (!isImageEditorModalOpen) {
            loadImage();
        }
    }, [isImageEditorModalOpen]);

    const loadImage = () => {
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

    async function handleImageDelete() {
        try {
            setImages(await imageService.deleteImage(images, image.id));
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

    async function handleFolderSelect(folderId: number) {
        try {
            setImages(await imageService.updateImageFolderId(images, image.id, folderId));
        } catch {
            setErrorMessage("Failed to update image folder. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        } finally {
            handleCloseFolderModal();
        }
    }

    function handleOpenEditorModal() {
        setIsEditorModalOpen(true);
    }

    function handleCloseEditorModal() {
        setIsEditorModalOpen(false);
    }

    async function handleEditorsUpdate(editorIds: number[]) {
        try {
            setImages(await imageService.updateImageEditorIds(images, image.id, editorIds));
        } catch {
            setErrorMessage("Failed to update image editors. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenImageEditorsModal() {
        setIsImageEditorModalOpen(true);
    }

    function updateImage(imageFile: File) {
        try {
            imageService.updateFile(image.id, imageFile);
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
        <div className="image-with-comments" style={{width: "100%"}}>
            <p className="author">Author: {image.authorId}</p>
            <img className="image" src={imageUrl} alt={`Image ${image.id}`}/>
            <p className="title">{image.title}</p>
            <p className="tags">Tags: {image.tags}</p>
            <p className="tags">Editors: {image.editorIds}</p>


            <div className={"horizontal-group"}>
                <button className="image-button" type="submit" onClick={() => handleOpenFolderModal()}>
                    <img src="/folder.svg" alt="Update folder"/>
                </button>

                {image.editorIds.includes(getUserId()) && (
                    <>
                        <button className="image-button" type="submit" onClick={() => handleOpenEditorModal()}>
                            <img src="/editors.svg" alt="Update editors"/>
                        </button>

                        <button className="image-button" type="submit" onClick={handleOpenImageDeletionDialog}>
                            <img src="/delete.svg" alt="Delete"/>
                        </button>

                        <button className="image-button" type="submit" onClick={() => handleOpenImageEditorsModal()}>
                            <img src="/editors.svg" alt="Edit image"/>
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

                {isEditorModalOpen && (
                    <EditorSelectionModal
                        authorId={image.authorId}
                        imageEditorIds={image.editorIds}
                        users={users}
                        onSelectEditorIds={handleEditorsUpdate}
                        onCloseModal={handleCloseEditorModal}
                    />
                )}

                {isImageEditorModalOpen && imageUrl !== undefined && (
                    <ImageEditModal
                        imageSource={imageUrl}
                        visible={isImageEditorModalOpen}
                        updateImage={updateImage}
                        setVisible={setIsImageEditorModalOpen}
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