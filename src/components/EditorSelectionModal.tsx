import React, {useState} from "react";
import "../css/folder-selection-modal.css";
import {User} from "../types/global";

interface Props {
    authorId: number,
    imageEditorIds: number[],
    users: User[],
    onSelectEditorIds: (editorIds: number[]) => void,
    onCloseModal: () => void
}

const EditorSelectionModal: React.FC<Props> = ({authorId, imageEditorIds, users, onSelectEditorIds, onCloseModal}) => {
    const [selectedEditorIds, setSelectedEditorIds] = useState<number[]>(imageEditorIds);

    function handleUserSelect(user: User) {
        const updatedEditorIds = [...selectedEditorIds];
        updatedEditorIds.push(user.id);
        setSelectedEditorIds(updatedEditorIds);
    }

    function handleConfirmSelection() {
        onSelectEditorIds(selectedEditorIds);
        onCloseModal();
    }

    return (
        <div className="folder-modal border">
            <h2>Select users</h2>
            <ul>
                {users.filter((user) => user.id != authorId).map((user) => (
                    <li
                        className={selectedEditorIds.includes(user.id) ? "selected-bold" : ""}
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                    >
                        {user.username}
                    </li>
                ))}
            </ul>
            <div className="modal-actions">
                <button onClick={handleConfirmSelection} disabled={!selectedEditorIds}>
                    Confirm
                </button>
                <button onClick={onCloseModal}>Cancel</button>
            </div>
        </div>
    );
};

export default EditorSelectionModal;
