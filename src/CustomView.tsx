import React from 'react';
import { Box, Typography, Link, useMediaQuery } from '@mui/material';

// interface BaseFieldProps {
//   id: string; 
//   prop?: string;
//   label: string;
//   type?: 'lang' | 'url' | string;
//   view: number;
//   formLabel?: string;
//   validation?: any;
//   options?: any;
//   viewFn?: (values: any) => boolean;
// }

type FieldProps = any;

interface CustomViewProps {
  values: Record<string, any>;
  tableProps: FieldProps[];
}

function CustomView({ values, tableProps }: CustomViewProps) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const usedTableProps = tableProps
    .filter((field): field is Exclude<FieldProps, { id: 'operations' }> => field.id !== 'operations')
    .filter((field: FieldProps) => field.view & 1)
    .filter((field: FieldProps) => field.viewFn === undefined || field.viewFn(values));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-8px' }}>
      {usedTableProps.map((field: FieldProps) => {
        if (!field.prop) {
          console.warn(`Field with id "${field.id}" is missing 'prop' property.`);
          return null; // Skip rendering if prop is missing
        }

        if (values[field.prop] && typeof values[field.prop] === 'object' && field.type !== 'lang') {
          console.warn(`Field with id "${field.id}" has an object value for prop "${field.prop}" but is not of type 'lang'.`);
          // return null; // Skip rendering if value is an object but not of type 'lang'
          values[field.prop] = JSON.stringify(values[field.prop], null, 2); // Convert object to string for display
        }




        const value = values[field.prop];

        return (
          <div
            key={field.id}
            style={{
              // width: 'calc(50% - 16px)',
              width: isMobile ? '100%' : 'calc(50% - 16px)',
              padding: '8px',
              boxSizing: 'border-box'
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                {field.label}
              </Typography>

              {/* Lang Field */}
              {field.type === 'lang' && value && typeof value === 'object' ? (
                <>
                  <Typography variant="body1">EN: {value.en}</Typography>
                  <Typography variant="body1">AR: {value.ar}</Typography>
                </>
              ) : field.type === 'url' && value ? (
                // URL Field
                <Link href={value} target="_blank" rel="noopener" underline="hover">
                  {value.length > 50 ? `${value.slice(0, 50)}...` : value}
                </Link>
              ) : field.type === 'select' && field.options ? (
                <Typography variant="body1">
                  {field.options.find((opt: any) => opt.value === value)?.label || value || '—'}
                </Typography>
              ) : field.type === 'date' && value ? (
                // Date Field
                <Typography variant="body1">
                  {new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              ) : field.type === 'boolean' ? (
                // Boolean Field
                <Typography variant="body1">
                  {value ? 'Yes' : 'No'}
                </Typography>
              ) : (
                // Generic display
                <Typography variant="body1">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '—'}
                </Typography>
              )}
            </Box>
          </div>
        );
      })}
    </div>
  );
}

export default CustomView;
