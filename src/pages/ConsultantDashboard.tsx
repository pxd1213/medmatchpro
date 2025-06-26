import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { Project, Bid } from '../types/database';

const ConsultantDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    country: '',
    deviceType: '',
    minBudget: '',
    maxBudget: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [bidData, setBidData] = useState({
    proposal: '',
    price: 0,
  });

  const fetchProjects = async () => {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (filters.country) {
        query = query.eq('country', filters.country);
      }
      if (filters.deviceType) {
        query = query.eq('device_type', filters.deviceType);
      }
      if (filters.minBudget) {
        query = query.gte('budget_range.min', parseInt(filters.minBudget));
      }
      if (filters.maxBudget) {
        query = query.lte('budget_range.max', parseInt(filters.maxBudget));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBid = async () => {
    try {
      if (!selectedProject) return;

      const bid = {
        ...bidData,
        project_id: selectedProject.id,
        consultant_id: user?.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      await supabase.from('bids').insert([bid]);
      toast({
        title: 'Success',
        description: 'Bid submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setSelectedProject(null);
      setBidData({
        proposal: '',
        price: 0,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bid',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>Available Projects</Heading>
      
      <Box mb={6}>
        <HStack spacing={4}>
          <FormControl>
            <FormLabel>Country</FormLabel>
            <Input
              placeholder="Filter by country"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Device Type</FormLabel>
            <Input
              placeholder="Filter by device type"
              value={filters.deviceType}
              onChange={(e) => setFilters({ ...filters, deviceType: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Min Budget</FormLabel>
            <Input
              type="number"
              value={filters.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Max Budget</FormLabel>
            <Input
              type="number"
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
            />
          </FormControl>
        </HStack>
      </Box>

      <VStack spacing={6}>
        {projects.map((project) => (
          <Card key={project.id} w="full">
            <CardHeader>
              <Heading size="md">{project.title}</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Device Type: {project.device_type}</Text>
                <Text>Country: {project.country}</Text>
                <Text>Timeline: {project.timeline.start_date} to {project.timeline.end_date}</Text>
                <Text>Budget Range: ${project.budget_range.min} - ${project.budget_range.max}</Text>
                <Text>Regulatory Requirements:</Text>
                <VStack align="stretch">
                  {project.regulatory_requirements.map((req, index) => (
                    <Text key={index}>{req}</Text>
                  ))}
                </VStack>
                <Button
                  colorScheme="brand"
                  onClick={() => {
                    setSelectedProject(project);
                    onOpen();
                  }}
                >
                  Submit Bid
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Project Title</FormLabel>
                <Text>{selectedProject?.title}</Text>
              </FormControl>
              <FormControl>
                <FormLabel>Proposal</FormLabel>
                <Textarea
                  value={bidData.proposal}
                  onChange={(e) => setBidData({ ...bidData, proposal: e.target.value })}
                  rows={6}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bid Amount</FormLabel>
                <Input
                  type="number"
                  value={bidData.price}
                  onChange={(e) => setBidData({ ...bidData, price: parseInt(e.target.value) })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleBid}>
              Submit Bid
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ConsultantDashboard;
