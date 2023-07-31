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
    const [selectedEditorIds, setSelectedEditorIds] = useState<Set<number>>(new Set<number>(imageEditorIds));

    function handleUserSelect(user: User) {
        const updatedSelectedEditorIds = new Set<number>(selectedEditorIds);

        if (updatedSelectedEditorIds.has(user.id)) {
            updatedSelectedEditorIds.delete(user.id);
        } else {
            updatedSelectedEditorIds.add(user.id);
        }

        setSelectedEditorIds(updatedSelectedEditorIds);
    }

    function handleConfirmSelection() {
        onSelectEditorIds(Array.from(selectedEditorIds));
        onCloseModal();
    }

    return (
        <div className="folder-modal border">
            <h2>Select users</h2>
            <ul>
                {users.filter((user) => user.id != authorId).map((user) => (
                    <li
                        className={selectedEditorIds.has(user.id) ? "selected-bold" : ""}
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
