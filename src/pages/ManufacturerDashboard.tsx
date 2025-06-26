import React, { useState } from 'react';
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
import { Project } from '../types/database';

const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    device_type: '',
    country: '',
    regulatory_requirements: [] as string[],
    timeline: {
      start_date: '',
      end_date: '',
    },
    budget_range: {
      min: 0,
      max: 0,
    },
  });

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('manufacturer_id', user?.id)
        .order('created_at', { ascending: false });

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const project = {
        ...projectData,
        manufacturer_id: user?.id,
        status: 'draft',
        created_at: new Date().toISOString(),
      };

      await supabase.from('projects').insert([project]);
      toast({
        title: 'Success',
        description: 'Project created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProjects();
      onClose();
      setProjectData({
        title: '',
        description: '',
        device_type: '',
        country: '',
        regulatory_requirements: [],
        timeline: {
          start_date: '',
          end_date: '',
        },
        budget_range: {
          min: 0,
          max: 0,
        },
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateStatus = async (projectId: string, status: string) => {
    try {
      await supabase
        .from('projects')
        .update({ status })
        .eq('id', projectId);
      toast({
        title: 'Success',
        description: 'Project status updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>My Projects</Heading>
      
      <Button
        colorScheme="brand"
        onClick={onOpen}
      >
        Create New Project
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  rows={4}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Device Type</FormLabel>
                <Input
                  value={projectData.device_type}
                  onChange={(e) => setProjectData({ ...projectData, device_type: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  value={projectData.country}
                  onChange={(e) => setProjectData({ ...projectData, country: e.target.value })}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Regulatory Requirements</FormLabel>
                <Textarea
                  value={projectData.regulatory_requirements.join('\n')}
                  onChange={(e) => setProjectData({
                    ...projectData,
                    regulatory_requirements: e.target.value.split('\n').filter(Boolean),
                  })}
                  rows={4}
                />
              </FormControl>
              
              <HStack>
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    type="date"
                    value={projectData.timeline.start_date}
                    onChange={(e) => setProjectData({
                      ...projectData,
                      timeline: { ...projectData.timeline, start_date: e.target.value },
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    value={projectData.timeline.end_date}
                    onChange={(e) => setProjectData({
                      ...projectData,
                      timeline: { ...projectData.timeline, end_date: e.target.value },
                    })}
                  />
                </FormControl>
              </HStack>
              
              <HStack>
                <FormControl>
                  <FormLabel>Min Budget</FormLabel>
                  <Input
                    type="number"
                    value={projectData.budget_range.min}
                    onChange={(e) => setProjectData({
                      ...projectData,
                      budget_range: { ...projectData.budget_range, min: parseInt(e.target.value) },
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Max Budget</FormLabel>
                  <Input
                    type="number"
                    value={projectData.budget_range.max}
                    onChange={(e) => setProjectData({
                      ...projectData,
                      budget_range: { ...projectData.budget_range, max: parseInt(e.target.value) },
                    })}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand" onClick={handleCreateProject} isLoading={isLoading}>
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack spacing={6} mt={6}>
        {projects.map((project) => (
          <Card key={project.id} w="full">
            <CardHeader>
              <Heading size="md">{project.title}</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>Device Type: {project.device_type}</Text>
                <Text>Country: {project.country}</Text>
                <Text>Status: {project.status}</Text>
                <Text>Timeline: {project.timeline.start_date} to {project.timeline.end_date}</Text>
                <Text>Budget Range: ${project.budget_range.min} - ${project.budget_range.max}</Text>
                <Text>Regulatory Requirements:</Text>
                <VStack align="stretch">
                  {project.regulatory_requirements.map((req, index) => (
                    <Text key={index}>{req}</Text>
                  ))}
                </VStack>
                <HStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleUpdateStatus(project.id, 'published')}
                  >
                    Publish
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={() => handleUpdateStatus(project.id, 'awarded')}
                  >
                    Awarded
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleUpdateStatus(project.id, 'completed')}
                  >
                    Completed
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    </Box>
  );
};

export default ManufacturerDashboard;
