import React, {useEffect, useState} from "react";
import {Folder, Image, User} from "../types/global";
import * as imageService from "../services/image-service.ts";
import FolderSelectionModal from "./folder-selection-modal.tsx";
import {getUserId} from "../services/auth-service.ts";
import EditorSelectionModal from "./editor-selection-modal.tsx";
import ImageEditModal from "./image-edit-modal.tsx";
import "../css/image-with-comments.css";

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
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
    const [isImageEditorModalOpen, setIsImageEditorModalOpen] = useState(false);

    useEffect(() => {
        if (!isImageEditorModalOpen) {
            loadImage();
        }
    }, [isImageEditorModalOpen]);

    const loadImage = () => {
        imageService.getImageFilePath(image.id).then((url) => setImageUrl(url));
    }

    async function handleImageDelete() {
        setImages(await imageService.deleteImage(images, image.id));
    }

    function handleOpenFolderModal() {
        setIsFolderModalOpen(true);
    }

    function handleCloseFolderModal() {
        setIsFolderModalOpen(false);
    }

    async function handleFolderSelect(folderId: number) {
        setImages(await imageService.updateImageFolderId(images, image.id, folderId));
        handleCloseFolderModal();
    }

    function handleOpenEditorModal() {
        setIsEditorModalOpen(true);
    }

    function handleCloseEditorModal() {
        setIsEditorModalOpen(false);
    }

    async function handleEditorsUpdate(editorIds: number[]) {
        setImages(await imageService.updateImageEditorIds(images, image.id, editorIds));
    }

    function handleOpenImageEditorsModal() {
        setIsImageEditorModalOpen(true);
    }

    function updateImage(imageFile: File) {
        imageService.updateFile(image.id, imageFile);
    }

    if (!imageUrl) {
        return <div>Loading image...</div>
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

                        <button className="image-button" type="submit" onClick={() => handleImageDelete()}>
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

                {isImageEditorModalOpen && (
                    <ImageEditModal
                        imageSource={imageUrl}
                        visible={isImageEditorModalOpen}
                        updateImage={updateImage}
                        setVisible={setIsImageEditorModalOpen}
                    />
                )}
            </div>
        </div>
    );
};