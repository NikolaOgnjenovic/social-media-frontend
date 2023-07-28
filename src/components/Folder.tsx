import React, {useState} from "react";
import {Folder, Image, User} from "../types/global";
import * as folderService from "../services/FolderService";
import {FolderImage} from "./FolderImage";
import {getUserId} from "../services/AuthService";
import GenericConfirmationDialog from "./GenericConfirmationDialog";
import ErrorDialog from "./ErrorDialog.tsx";

export const FolderFC: React.FC<{
    folder: Folder,
    folders: Folder[],
    setFolders: React.Dispatch<any>,
    images: Image[],
    users: User[],
    setImages: React.Dispatch<any>
}> = ({
          folder,
          folders,
          setFolders,
          images,
          users,
          setImages
      }) => {
    const [showFolderDeletionDialog, setShowFolderDeletionDialog] = useState(false);
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    async function handleFolderDelete(folderId: number) {
        try {
            setFolders(await folderService.deleteFolder(folders, folderId));
        } catch {
            setErrorMessage("Failed to delete folder. Please check if you're connected to the internet and try again.");
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenFolderDeletionDialog() {
        setShowFolderDeletionDialog(true);
    }

    function handleCloseFolderDeletionDialog() {
        setShowFolderDeletionDialog(false);
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    if (folder.id == -1) {
        return (
            <div className="folder-card flex-container">
                <p className="folder-title text-3xl">{folder.title}</p>
                {
                    images.map((image: Image) =>
                        <FolderImage
                            key={image.id}
                            folders={folders}
                            image={image}
                            setImages={setImages}
                            users={users}
                        />
                    )
                }
            </div>
        )
    }

    return (
        <div className="folder-card">
            <p className="folder-title">{folder.title}</p>
            {folder.authorId === getUserId() && (
                <button className="image-button" type="submit" onClick={handleOpenFolderDeletionDialog}>
                    <img src="/delete.svg" alt="Delete"/>
                </button>
            )}

            {images
                .filter((image) => image.folderId === folder.id)
                .map((image) => (
                    <FolderImage
                        key={image.id}
                        folders={folders}
                        image={image}
                        setImages={setImages}
                        users={users}
                    />
                ))}
            {
                showFolderDeletionDialog &&
                <GenericConfirmationDialog
                    message="Delete folder"
                    isOpen={showFolderDeletionDialog}
                    onConfirm={() => {
                        handleFolderDelete(folder.id);
                        handleCloseFolderDeletionDialog();
                    }}
                    onClose={handleCloseFolderDeletionDialog}
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
    )
}