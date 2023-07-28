import React, {useEffect, useState} from "react";
import * as authService from "../services/AuthService";
import {getUserId} from "../services/AuthService";
import {useNavigate} from "react-router-dom";
import {Box, Button, Center, FormControl, FormLabel, Heading, Input,} from "@chakra-ui/react";

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
                        Register
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
                    <Button mt={6} colorScheme="blue" onClick={handleRegister}>
                        Register
                    </Button>
                </Box>
            </Box>
        </Center>
    );
}

export default Register;
