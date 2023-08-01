import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Folder, Image, User} from '../types/global';
import {getUserId} from '../services/AuthService';
import {createFolder, getFoldersByUserId} from '../services/FolderService';
import {getEditableImagesByUserId} from '../services/ImageService';
import {getUsers} from '../services/UserService';
import {FolderFC} from '../components/Folder';
import '../css/folders.css';
import ErrorDialog from "../components/ErrorDialog.tsx";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

function Folders() {
    const navigate = useNavigate();

    // Auth
    const [isLoggedIn] = useState(getUserId() != -1);

    // Users
    const [users, setUsers] = useState<User[]>([]);

    // Images
    const [images, setImages] = useState<Image[]>([]);

    // Folders
    const [folders, setFolders] = useState<Folder[]>([]);
    const [newFolderTitle, setNewFolderTitle] = useState<string>("");
    const DEFAULT_FOLDER: Folder = {
        id: -1,
        authorId: getUserId(),
        title: localizedStrings.folders.allImages
    };

    // Errors
    const [showErrorMessageDialog, setShowErrorMessageDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // If the user is not logged in, navigate to /login
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/', {replace: true});
        }
    }, [isLoggedIn]);

    // Fetch data on component mount
    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setImages(await getEditableImagesByUserId(getUserId()));
        setFolders(await getFoldersByUserId());
        setUsers(await getUsers());
    }

    // Creates a folder and sets the folders state variable
    async function handleFolderCreate(authorId: number) {
        // Title length validation
        if (newFolderTitle.length === 0) {
            setErrorMessage(localizedStrings.folders.errors.title);
            handleOpenErrorMessageDialog();
            return;
        }

        try {
            setFolders(await createFolder(authorId, newFolderTitle));
        } catch {
            setErrorMessage(localizedStrings.folders.errors.upload);
            handleOpenErrorMessageDialog();
        }
    }

    function handleOpenErrorMessageDialog() {
        setShowErrorMessageDialog(true);
    }

    function handleCloseErrorMessageDialog() {
        setShowErrorMessageDialog(false);
    }

    // TODO: All components get re-rendered and the images[] in the folders.tsx updates BUT
    //  the folder children do not re-render until refresh
    console.log("Re-rendered, images : " + images);
    console.table(images);

    return (
        <>
            <div className={"flex-row-centered-container"}>
                <div id="folder-input">
                    <p className={"title"}>{localizedStrings.folders.createFolder}</p>

                    <input
                        type="text"
                        id="folder-title-input"
                        className="folder-title-input"
                        placeholder={localizedStrings.folders.folderTitlePlaceholder}
                        onChange={(e) => setNewFolderTitle(e.target.value)}
                    />

                    <button className="image-button" type="submit" onClick={() => handleFolderCreate(getUserId())}>
                        <img src="/create_folder.svg" alt={localizedStrings.folders.createFolder}/>
                    </button>
                </div>
            </div>

            <div className="flex-container">
                <FolderFC
                    key={-1}
                    folder={DEFAULT_FOLDER}
                    folders={folders}
                    setFolders={setFolders}
                    images={images}
                    users={users}
                    setImages={setImages}
                />

                {folders.map((folder) => (
                    <FolderFC
                        key={folder.id}
                        folder={folder}
                        folders={folders}
                        setFolders={setFolders}
                        images={images}
                        users={users}
                        setImages={setImages}
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
        </>
    );
}

export default Folders;