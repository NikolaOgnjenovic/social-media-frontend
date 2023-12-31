import React, {useEffect, useState} from "react";
import * as authService from "../services/AuthService";
import {getUserId} from "../services/AuthService";
import {useNavigate} from "react-router-dom";
import {Box, Button, Center, FormControl, FormLabel, Heading, Input,} from "@chakra-ui/react";
import {localizedStrings} from "../res/LocalizedStrings.tsx";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(getUserId() !== -1);
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

    async function handleRegister() {
        await authService.register(username, password);
        setIsLoggedIn(true);
    }

    return (
        <Center h="100vh">
            <Box maxW="50%" w="100%" className={"login-body"} textAlign="center">
                <Box className={"login-container"} p={6} boxShadow="lg" rounded="md">
                    <Heading as="h1" size="xl">
                        {localizedStrings.auth.register}
                    </Heading>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="username">{localizedStrings.auth.username}:</FormLabel>
                        <Input
                            placeholder={localizedStrings.auth.username}
                            type="text"
                            id="username"
                            required
                            onChange={handleUsernameChange}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="password">{localizedStrings.auth.password}:</FormLabel>
                        <Input
                            placeholder={localizedStrings.auth.password}
                            type="password"
                            id="password"
                            required
                            onChange={handlePasswordChange}
                        />
                    </FormControl>
                    <Button mt={6} colorScheme="blue" onClick={handleRegister}>
                        {localizedStrings.auth.register}
                    </Button>
                </Box>
            </Box>
        </Center>
    );
}

export default Register;
