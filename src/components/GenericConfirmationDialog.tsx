import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react';
import React from "react";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

const GenericConfirmationDialog: React.FC<{
    message: string,
    isOpen: boolean,
    onConfirm: () => void,
    onClose: () => void
}> = ({message, isOpen, onConfirm, onClose}) => {
    const cancelRef = React.useRef(null);

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader color="var(--primary)" fontSize='lg' fontWeight='bold'>
                        {message}
                    </AlertDialogHeader>

                    <AlertDialogBody backgroundColor="var(--secondary)" color="var(--primary)">
                        {localizedStrings.confirmationText}
                    </AlertDialogBody>

                    <AlertDialogFooter justifyContent="center">
                        <Button ref={cancelRef} onClick={onClose}>
                            {localizedStrings.cancel}
                        </Button>
                        <Button colorScheme='red' onClick={() => {
                            onConfirm();
                            onClose(); // Close the dialog after confirming the action
                        }} ml={3}>
                            {message}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default GenericConfirmationDialog;
