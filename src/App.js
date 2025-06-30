import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Container, VStack, Heading, Text, Box } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

function HomePage() {
  const { user } = useAuth();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome to MedMatch Pro
        </Heading>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="lg">
          <Text fontSize="xl" mb={4}>
            Your professional medical matching platform
          </Text>
          <Text>
            {user ? (
              <>
                Logged in as: {user.email}
              </>
            ) : (
              <>
                Please login to continue
              </>
            )}
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}

function LoginPage() {
  return (
    <Container maxW="container.sm" py={8}>
      <Box p={6} bg="white" borderRadius="lg" boxShadow="lg">
        <Heading as="h2" size="xl" mb={4} textAlign="center">
          Login to MedMatch Pro
        </Heading>
        <Text textAlign="center">
          Click the login button to continue
        </Text>
      </Box>
    </Container>
  );
}

export default App;
