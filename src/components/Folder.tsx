import React, {useState} from "react";
import {Folder, Image, User} from "../types/global";
import * as folderService from "../services/FolderService";
import {FolderImage} from "./FolderImage";
import GenericConfirmationDialog from "./GenericConfirmationDialog";
import ErrorDialog from "./ErrorDialog.tsx";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

interface Props {
    folder: Folder,
    folders: Folder[],
    setFolders: React.Dispatch<any>,
    users: User[],
    images: Image[],
    setImages: React.Dispatch<any>
}

export const FolderFC: React.FC<Props> = ({
                                              folder,
                                              folders,
                                              setFolders,
                                              users,
                                              images,
                                              setImages
                                          }) => {
    // Folders
    const [showFolderDeletionDialog, setShowFolderDeletionDialog] = useState(false);

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Deletes a folder and sets the folders state variable
    async function handleFolderDelete(folderId: number) {
        try {
            setFolders(await folderService.deleteFolder(folders, folderId));
        } catch {
            setErrorMessage(localizedStrings.folders.errors.delete);
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

    // Default folder with id -1 made in Folders.tsx which contains all editable images
    // This folder cannot be deleted
    if (folder.id == -1) {
        return (
            <div className="folder-card flex-container">
                <p className="folder-title">{folder.title}</p>
                {
                    images.map((image: Image) =>
                        <FolderImage
                            key={image.id}
                            folders={folders}
                            image={image}
                            users={users}
                            setImages={setImages}
                        />
                    )
                }
            </div>
        )
    }

    return (
        <div className="folder-card">
            <p className="folder-title">{folder.title}</p>

            <button className="image-button" type="submit" onClick={handleOpenFolderDeletionDialog}>
                <img src="/delete.svg" alt={localizedStrings.delete}/>
            </button>

            {images
                .filter((image) => image.folderId === folder.id)
                .map((image) => (
                    <FolderImage
                        key={image.id}
                        folders={folders}
                        image={image}
                        users={users}
                        setImages={setImages}
                    />
                ))}
            {
                showFolderDeletionDialog &&
                <GenericConfirmationDialog
                    message={localizedStrings.folders.deleteFolder}
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