import {useEffect, useState} from "react";
import * as imageService from "../services/ImageService.ts";
import * as folderService from "../services/FolderService.ts";
import * as userService from "../services/UserService.ts";
import {Folder, Image, User} from "../types/global";
import {FolderFC} from "../components/Folder.tsx";
import {getUserId} from "../services/AuthService.ts";
import {useNavigate} from "react-router-dom";
import "../css/folders.css";

function Folders() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [isLoggedIn] = useState(getUserId() != -1);
    const navigate = useNavigate();
    const [newFolderTitle, setNewFolderTitle] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);

    const DEFAULT_FOLDER: Folder = {
        id: -1,
        authorId: getUserId(),
        title: "All of your images"
    };

    // Fetch data on component mount
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/', {replace: true});
            window.location.reload();
        }
    }, [isLoggedIn]);

    async function loadData() {
        setImages(await imageService.getImagesByUserId());
        setFolders(await folderService.getFoldersByUserId());
        setUsers(await userService.getUsers());
    }

    async function handleFolderCreate(authorId: number) {
        if (newFolderTitle.length > 0) {
            setFolders(await folderService.createFolder(folders, authorId, newFolderTitle));
        }
    }

    return (
        <div className="folders-page">
            <div className="interaction-section">
                <button className="image-button" type="submit" onClick={() => handleFolderCreate(getUserId())}>
                    <img src="/create_folder.svg" alt="Create folder"/>
                </button>
                <input
                    type="text"
                    id="folder-title-input"
                    className="folder-title-input"
                    placeholder="Folder title"
                    onChange={(e) => setNewFolderTitle(e.target.value)}
                />
            </div>

            <div className="flex-container">
                <FolderFC
                    key={-1}
                    folder={DEFAULT_FOLDER}
                    folders={folders}
                    setFolders={setFolders}
                    images={images}
                    setImages={setImages}
                    users={users}
                />

                {folders.map((folder) => (
                    <FolderFC
                        key={folder.id}
                        folder={folder}
                        folders={folders}
                        setFolders={setFolders}
                        images={images}
                        setImages={setImages}
                        users={users}
                    />
                ))}
            </div>
        </div>
    );
}

export default Folders;