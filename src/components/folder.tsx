import React from "react";
import {Folder, Image, User} from "../types/global";
import * as folderService from "../services/folder-service.ts";
import {FolderImage} from "./folder-image.tsx";
import {getUserId} from "../services/auth-service.ts";

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
    async function handleFolderDelete(folderId: number) {
        setFolders(await folderService.deleteFolder(folders, folderId));
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
                <button className="image-button" type="submit" onClick={() => handleFolderDelete(folder.id)}>
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
        </div>
    )
}