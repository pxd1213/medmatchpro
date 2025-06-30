import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  ChakraProvider, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Box, 
  Flex, 
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Image,
  Link as ChakraLink
} from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { FiMenu } from 'react-icons/fi';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <Box>Loading...</Box>;

  if (!user) {
    navigate('/login');
    return null;
  }

  return children;
}

function Navigation() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={6}
      bg={useColorModeValue('white', 'gray.900')}
      color={useColorModeValue('gray.600', 'gray.200')}
      boxShadow="sm"
    >
      <Flex align="center" mr={5}>
        <ChakraLink href="/" as={Link}>
          <Heading size="md">MedMatch Pro</Heading>
        </ChakraLink>
      </Flex>

      <HStack as="nav" spacing={8} display={{ base: 'none', md: 'flex' }}>
        <ChakraLink as={Link} href="/dashboard" color="inherit">
          Dashboard
        </ChakraLink>
        <Button onClick={toggleColorMode}>Toggle Theme</Button>
      </HStack>

      <HStack spacing={2}>
        <Menu>
          <MenuButton as={Button} rightIcon={<FaUser />}>
            {user?.email}
          </MenuButton>
          <MenuList>
            <MenuItem icon={<FaSignOutAlt />} onClick={() => {
              logout();
              navigate('/login');
            }}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <IconButton
        size="md"
        icon={<FiMenu />}
        aria-label="Open menu"
        display={{ md: 'none' }}
        onClick={() => {
          // Add mobile menu logic here
        }}
      />
    </Flex>
  );
}

function HomePage() {
  return (
    <Box>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            Welcome to MedMatch Pro
          </Heading>
          <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="lg">
            <Text fontSize="xl" mb={4}>
              Your professional medical matching platform
            </Text>
            <Text>
              Please navigate to the dashboard to get started
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

function LoginPage() {
  return (
    <Box>
      <Navigation />
      <Container maxW="container.sm" py={8}>
        <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="lg">
          <Heading as="h2" size="xl" mb={4} textAlign="center">
            Login to MedMatch Pro
          </Heading>
          <Text textAlign="center">
            Click the login button to continue
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

function DashboardPage() {
  return (
    <Box>
      <Navigation />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center">
            Dashboard
          </Heading>
          <Box p={6} bg={useColorModeValue('white', 'gray.800')} borderRadius="lg" boxShadow="lg">
            <Text fontSize="xl" mb={4}>
              Welcome to your dashboard
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
