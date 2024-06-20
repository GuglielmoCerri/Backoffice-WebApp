import React from 'react';
import { Box, Button, Heading, VStack, Icon } from '@chakra-ui/react';
import { FaUsers, FaBoxOpen, FaTags, FaChartBar } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={6}>
        Home Page
      </Heading>
      <VStack spacing={4}>
        <Button leftIcon={<FaUsers />} colorScheme="teal" size="lg" onClick={() => navigate("/customers")}>
            Manage Customers
        </Button>
        <Button leftIcon={<FaBoxOpen />} colorScheme="teal" size="lg" onClick={() => navigate('/products')}>
            Manage Products
        </Button>
        <Button leftIcon={<FaTags />} colorScheme="teal" size="lg" onClick={() => navigate('/categories')}>
            Manage Categories
        </Button>
        <Button leftIcon={<FaChartBar />} colorScheme="teal" size="lg" onClick={() => navigate('/analytics')}>
            View Analytics
        </Button>
        </VStack>
    </Box>
  );
};

export default HomePage;
