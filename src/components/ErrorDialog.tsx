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

const ErrorDialog: React.FC<{
    message: string,
    isOpen: boolean,
    onClose: () => void
}> = ({message, isOpen, onClose}) => {
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
                        {localizedStrings.error}
                    </AlertDialogHeader>

                    <AlertDialogBody backgroundColor="var(--secondary)" color="var(--primary)">
                        {message}
                    </AlertDialogBody>

                    <AlertDialogFooter justifyContent="center">
                        <Button ref={cancelRef} onClick={onClose}>
                            {localizedStrings.ok}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default ErrorDialog;
