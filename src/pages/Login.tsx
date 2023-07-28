import React, {useEffect, useState} from "react";
import {Box, Button, Center, FormControl, FormLabel, Heading, Input} from "@chakra-ui/react";
import ErrorDialog from "../components/ErrorDialog";
import {useNavigate} from "react-router-dom";
import {getUserId, login} from "../services/AuthService";

interface LoginProps {
    // Add prop definitions here if needed
}

const Login: React.FC<LoginProps> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(getUserId() !== -1);
    const [showInvalidCredentialsError, setShowInvalidCredentialsError] =
        useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/feed", {replace: true});
            window.location.reload();
        }
    }, [isLoggedIn]);

    function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function handleLogin() {
        try {
            const success = await login(username, password);
            if (success) {
                setIsLoggedIn(true);
            } else {
                handleOpenInvalidCredentialsError();
            }
        } catch (error) {
            console.error("Error during login:", error);
            handleOpenInvalidCredentialsError();
        }
    }

    function handleOpenInvalidCredentialsError() {
        setShowInvalidCredentialsError(true);
    }

    function handleCloseInvalidCredentialsError() {
        setShowInvalidCredentialsError(false);
    }

    return (
        <Center h="100vh">
            <Box maxW="50%" w="100%" className={"login-body"} textAlign="center">
                <Box className={"login-container"} p={6} boxShadow="lg" rounded="md">
                    <Heading as="h1" size="xl">
                        Login
                    </Heading>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="username">Username:</FormLabel>
                        <Input
                            placeholder="Username"
                            type="text"
                            id="username"
                            required
                            onChange={handleUsernameChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="password">Password:</FormLabel>
                        <Input
                            placeholder="Password"
                            type="password"
                            id="password"
                            required
                            onChange={handlePasswordChange}
                        />
                    </FormControl>
                    <Button mt={6} colorScheme="blue" onClick={handleLogin}>
                        Login
                    </Button>
                </Box>

                {showInvalidCredentialsError && (
                    <ErrorDialog
                        message="Invalid credentials"
                        isOpen={showInvalidCredentialsError}
                        onClose={handleCloseInvalidCredentialsError}
                    />
                )}
            </Box>
        </Center>
    );
};

export default Login;
