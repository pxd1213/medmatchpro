import React, { useState } from 'react';
import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface ProfileFormProps {
  role: 'manufacturer' | 'consultant';
}

const ProfileForm: React.FC<ProfileFormProps> = ({ role }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    country: '',
    bio: '',
    expertise: '',
    certifications: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert([
          {
            id: user?.id,
            role,
            ...formData,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing={6} as="form" onSubmit={handleSubmit} align="stretch">
      <Heading size="md">Profile Information</Heading>

      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Company Name</FormLabel>
        <Input
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Country</FormLabel>
        <Input
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
      </FormControl>

      {role === 'consultant' && (
        <>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Areas of Expertise</FormLabel>
            <Textarea
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Certifications</FormLabel>
            <Textarea
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              rows={4}
            />
          </FormControl>
        </>
      )}

      <Button
        colorScheme="brand"
        type="submit"
        isLoading={isLoading}
      >
        Save Profile
      </Button>
    </VStack>
  );
};

export default ProfileForm;
