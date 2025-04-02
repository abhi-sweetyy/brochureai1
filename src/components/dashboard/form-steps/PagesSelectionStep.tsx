import { Checkbox, FormControlLabel, FormGroup, Paper, Typography } from '@mui/material';
import React from 'react';

export interface PageOption {
  id: string;
  label: string;
  requiredImages: number;
  placeholderKeys?: string[];
}

export const availablePages: PageOption[] = [
  { 
    id: 'projectOverview', 
    label: 'Project Overview', 
    requiredImages: 1,
    placeholderKeys: ['{{image1}}']
  },
  { 
    id: 'buildingLayout', 
    label: 'Building Layout Plan', 
    requiredImages: 1,
    placeholderKeys: ['{{image2}}']
  },
  { 
    id: 'description', 
    label: 'Description', 
    requiredImages: 0 
  },
  { 
    id: 'exteriorPhotos', 
    label: 'Exterior Photos', 
    requiredImages: 2,
    placeholderKeys: ['{{image3}}', '{{image4}}']
  },
  { 
    id: 'interiorPhotos', 
    label: 'Interior Photos', 
    requiredImages: 2,
    placeholderKeys: ['{{image5}}', '{{image6}}']
  },
  { 
    id: 'floorPlan', 
    label: 'Floor Plan', 
    requiredImages: 1,
    placeholderKeys: ['{{image7}}']
  },
  { 
    id: 'energyCertificate', 
    label: 'Excerpt from energy certificate', 
    requiredImages: 2,
    placeholderKeys: ['{{image8}}', '{{image9}}']
  },
  { 
    id: 'termsConditions', 
    label: 'Terms & Conditions', 
    requiredImages: 0 
  },
];

interface PagesSelectionStepProps {
  selectedPages: Record<string, boolean>;
  onPagesChange: (pages: Record<string, boolean>) => void;
}

export const PagesSelectionStep: React.FC<PagesSelectionStepProps> = ({ selectedPages, onPagesChange }) => {
  const handlePageChange = (pageId: string, checked: boolean) => {
    const newSelectedPages = {
      ...selectedPages,
      [pageId]: checked
    };
    onPagesChange(newSelectedPages);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#111b33', borderColor: '#1c2a47' }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
        Select Pages to Include
      </Typography>
      <Typography variant="body2" sx={{ color: '#8491A5', mb: 2 }}>
        Choose the pages you want to include in your listing. The number in brackets indicates required images for each page.
      </Typography>
      
      <FormGroup>
        {availablePages.map((page) => (
          <FormControlLabel
            key={page.id}
            control={
              <Checkbox
                checked={selectedPages[page.id] ?? true}
                onChange={(e) => handlePageChange(page.id, e.target.checked)}
                sx={{
                  color: '#8491A5',
                  '&.Mui-checked': {
                    color: '#3b82f6',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'white' }}>
                {`${page.label} ${page.requiredImages > 0 ? `(${page.requiredImages} image${page.requiredImages > 1 ? 's' : ''})` : ''}`}
              </Typography>
            }
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default PagesSelectionStep; 