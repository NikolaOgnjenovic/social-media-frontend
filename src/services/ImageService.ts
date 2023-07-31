import {Image} from "../types/global";
import {getUserJwtToken} from "./AuthService.ts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
let images: Image[] = [];

// Sends a POST request to upload an image to the server
export async function createImage(authorId: number, tags: string[], title: String, imageFile: File): Promise<Image> {
    const formData = new FormData();
    formData.append("authorId", authorId.toString());
    formData.append("tags", JSON.stringify(tags));
    formData.append("title", title.toString());
    formData.append("image", imageFile);

    const response = await fetch(BACKEND_URL + "/api/v1/images", {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to create image.");
    }

    const image = await response.json();
    images = [...images, image]; // Update images in the service
    return image;
}

// Sends a GET request which, if successful, populates the images array
export async function getImages(): Promise<Image[]> {
    if (images.length > 0) {
        return images;
    }

    const response = await fetch(BACKEND_URL + "/api/v1/images");

    if (!response.ok) {
        throw new Error("Failed to get images.");
    }

    images = await response.json();
    return images;
}

export function getImageById(imageId: number): Image | null {
    if (images.length === 0) {
        return null;
    }

    for (let i = 0; i < images.length; i++) {
        if (images[i].id === imageId) {
            return images[i];
        }
    }

    return null;
}

export async function getImagesWithPagination(page: number, pageSize: number): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/images/page/" + page + "/" + pageSize);

    if (!response.ok) {
        throw new Error("Failed to get images on page " + page + " with page size " + pageSize);
    }

    return await response.json();
}

// Returns images which the user can edit
export async function getEditableImagesByUserId(userId: number): Promise<Image[]> {
    if (images.length === 0) {
        images = await getImages();
    }

    return images.filter((image: Image) => {
        return image.editorIds.includes(userId) || image.authorId === userId
    });
}


export async function getImagesByUserId(): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/user-images", {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to get images by user id");
    }

    return await response.json();
}

export async function getImageFilePath(id: number): Promise<string> {
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/file");

    if (!response.ok) {
        throw new Error("Failed to get image file");
    }

    return URL.createObjectURL(await response.blob());
}

export async function getCompressedImageFilePath(id: number): Promise<string> {
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/compressed-file");

    if (!response.ok) {
        throw new Error("Failed to get compressed image file");
    }

    return URL.createObjectURL(await response.blob());
}

// Sends a PATCH request which, if successful, updates the like count of the image with the given id
export async function updateImageLikeCount(id: number, updatedLikeCount: number): Promise<Image[]> {
    if (images.length === 0) {
        images = await getImages();
    }

    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/like-count", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedLikeCount)
    });

    if (!response.ok) {
        throw new Error("Failed to update image like count.");
    }

    const updatedImages = [...images];
    const updatedImagesLength = updatedImages.length;
    for (let i = 0; i < updatedImagesLength; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].likeCount = updatedLikeCount;
            break;
        }
    }

    images = updatedImages;
    return updatedImages;
}

// Sends a PATCH request which, if successful, updates the folder id of the image with the given id
export async function updateImageFolderId(id: number, updatedFolderId: number): Promise<Image[]> {
    if (images.length === 0) {
        images = await getImages();
    }

    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/folder-id", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedFolderId)
    });

    if (!response.ok) {
        throw new Error("Failed to update image folder id.");
    }

    const updatedImages = [...images];
    const updatedImagesLength = updatedImages.length;
    for (let i = 0; i < updatedImagesLength; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].folderId = updatedFolderId;
            break;
        }
    }

    images = updatedImages;
    return updatedImages;
}


export async function updateImageEditorIds(id: number, updatedEditorIds: number[]): Promise<Image[]> {
    if (images.length === 0) {
        images = await getImages();
        console.log("Empty images on update editor ids");
    }

    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/editor-ids", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedEditorIds)
    });

    if (!response.ok) {
        throw new Error("Failed to update image editor ids.");
    }

    const updatedImages = [...images];
    const updatedImagesLength = updatedImages.length;
    for (let i = 0; i < updatedImagesLength; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].editorIds = updatedEditorIds;
            break;
        }
    }

    images = updatedImages;
    return updatedImages;
}


export async function updateFile(id: number, imageFile: File): Promise<void> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/file", {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "PATCH",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to update image file.");
    }
}

export async function deleteImage(imageId: number, imageUrl: string | undefined): Promise<Image[]> {
    if (images.length === 0) {
        images = await getImages();
    }

    const response = await fetch(BACKEND_URL + "/api/v1/images/" + imageId, {
        headers: {
            Authorization: `Bearer ${getUserJwtToken()}`
        },
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete image.");
    }

    // Filter out the deleted image from the images array
    images = images.filter((image) => image.id !== imageId);

    // Remove the blob identified with the old url
    if (imageUrl != undefined) {
        URL.revokeObjectURL(imageUrl);
    }

    return images;
}