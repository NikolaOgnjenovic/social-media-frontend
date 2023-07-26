import {Image} from "../types/global";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Sends a POST request to upload an image to the server
export async function createImage(images: Image[], authorId: number, tags: string[], title: String, imageFile: File): Promise<Image[]> {
    const updatedImages = [...images];
    const formData = new FormData();
    formData.append("authorId", authorId.toString());
    formData.append("tags", tags.toString());
    formData.append("title", title.toString());
    formData.append("image", imageFile);

    const response = await fetch(BACKEND_URL + "/api/v1/images", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to create image.");
    }

    const image = await response.json();
    updatedImages.push(image);
    return updatedImages;
}

// Sends a GET request which, if successful, populates the images array
export async function getImages(): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/images");

    if (!response.ok) {
        throw new Error("Failed to get images.");
    }

    return await response.json();
}

export async function getImagesWithPagination(page: number, pageSize: number): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/images/page/" + page + "/" + pageSize);

    if (!response.ok) {
        throw new Error("Failed to get images on page " + page + " with page size " + pageSize);
    }

    return await response.json();
}

export async function getImagesByUserId(): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/user-images", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
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
export async function updateImageLikeCount(images: Image[], id: number, updatedLikeCount: number): Promise<Image[]> {
    const updatedImages = [...images];
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/like-count", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedLikeCount)
    });

    if (!response.ok) {
        throw new Error("Failed to update image like count.");
    }

    for (let i = 0; i < updatedImages.length; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].likeCount = updatedLikeCount;
            break;
        }
    }

    return updatedImages;
}


// Sends a PATCH request which, if successful, updates the folder id of the image with the given id
export async function updateImageFolderId(images: Image[], id: number, updatedFolderId: number): Promise<Image[]> {
    const updatedImages = [...images];
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/folder-id", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedFolderId)
    });

    if (!response.ok) {
        throw new Error("Failed to update image folder id.");
    }

    for (let i = 0; i < updatedImages.length; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].folderId = updatedFolderId;
            break;
        }
    }

    return updatedImages;
}


export async function updateImageEditorIds(images: Image[], id: number, updatedEditorIds: number[]): Promise<Image[]> {
    const updatedImages = [...images];
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/editor-ids", {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: JSON.stringify(updatedEditorIds)
    });

    if (!response.ok) {
        throw new Error("Failed to update image editor ids.");
    }

    for (let i = 0; i < updatedImages.length; i++) {
        if (updatedImages[i].id === id) {
            updatedImages[i].editorIds = updatedEditorIds;
            break;
        }
    }

    return updatedImages;
}


export async function updateFile(id: number, imageFile: File): Promise<void> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + id + "/file", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "PATCH",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to update image file.");
    }
}

export async function deleteImage(images: Image[], imageId: number): Promise<Image[]> {
    const response = await fetch(BACKEND_URL + "/api/v1/images/" + imageId, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        },
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete image.");
    }

    // Filter out the deleted image from the images array
    return images.filter((image) => image.id !== imageId);
}