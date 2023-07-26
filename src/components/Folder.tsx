import React, {useState} from "react";
import {Folder, Image, User} from "../types/global";
import * as folderService from "../services/FolderService.ts";
import {FolderImage} from "./FolderImage.tsx";
import {getUserId} from "../services/AuthService.ts";
import GenericConfirmationDialog from "./GenericConfirmationDialog.tsx";

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

    async function handleFolderDelete(folderId: number) {
        setFolders(await folderService.deleteFolder(folders, folderId));
    }

    function handleOpenFolderDeletionDialog() {
        setShowFolderDeletionDialog(true);
    }

    function handleCloseFolderDeletionDialog() {
        setShowFolderDeletionDialog(false);
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
                            images={images}
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
            <p className="folder-title text-3xl">{folder.title}</p>
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
                        images={images}
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
        </div>
    )
}