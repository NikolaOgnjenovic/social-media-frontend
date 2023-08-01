import {Folder} from "../types/global";
import React, {useState} from "react";
import "../css/folder-selection-modal.css";

interface Props {
    imageFolderId: number;
    folders: Folder[];
    onSelectFolderId: (folderId: number) => void;
    onCloseModal: () => void;
}

const FolderSelectionModal: React.FC<Props> = ({imageFolderId, folders, onSelectFolderId, onCloseModal}) => {
    const [selectedFolderId, setSelectedFolderId] = useState<number>(imageFolderId);

    function handleFolderSelect(folder: Folder) {
        setSelectedFolderId(folder.id);
    }

    function handleConfirmSelection() {
        onSelectFolderId(selectedFolderId);
        onCloseModal();
    }

    return (
        <div className="folder-modal border">
            <h2>Select a Folder</h2>
            <ul>
                {folders.map((folder) => (
                    <li
                        className={selectedFolderId === folder.id ? 'bold' : ''}
                        key={folder.id}
                        onClick={() => handleFolderSelect(folder)}
                    >
                        {folder.title}
                    </li>
                ))}
            </ul>
            <div className="modal-actions">
                <button onClick={handleConfirmSelection} disabled={!selectedFolderId}>
                    Confirm
                </button>
                
                <button onClick={onCloseModal}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default FolderSelectionModal;
