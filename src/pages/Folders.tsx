import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Folder, Image, User} from '../types/global';
import {getUserId} from '../services/AuthService';
import {createFolder, getFoldersByUserId} from '../services/FolderService';
import {getImagesByUserId} from '../services/ImageService';
import {getUsers} from '../services/UserService';
import {FolderFC} from '../components/Folder';
import '../css/folders.css';
import ErrorDialog from "../components/ErrorDialog.tsx";

function Folders() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [images, setImages] = useState<Image[]>([]);
    const [isLoggedIn] = useState(getUserId() != -1);
    const navigate = useNavigate();
    const [newFolderTitle, setNewFolderTitle] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

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
        setImages(await getImagesByUserId());
        setFolders(await getFoldersByUserId());
        setUsers(await getUsers());
    }

    async function handleFolderCreate(authorId: number) {
        if (newFolderTitle.length > 0) {
            try {
                setFolders(await createFolder(folders, authorId, newFolderTitle));
            } catch {
                setErrorMessage("Failed to create folder. Please check if you're connected to the internet and try again.");
                handleOpenErrorMessageDialog();
            }
        }
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
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
}

export default Folders;