import type { BoxProps } from '@mui/material/Box';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';

import { HelperText } from './help-text';
import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

export type RHFUploadProps = UploadProps & {
  name: string;
  slotProps?: {
    wrapper?: BoxProps;
  };
};

export function RHFUploadAvatar({ name, slotProps, ...other }: RHFUploadProps) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Box {...slotProps?.wrapper}>
            <UploadAvatar value={field.value} error={!!error} onDrop={onDrop} {...other} />

            <HelperText errorMessage={error?.message} sx={{ textAlign: 'center' }} />
          </Box>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }: RHFUploadProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }: RHFUploadProps) {
  const { control, setValue, setError, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // Use the accept prop from other if provided, otherwise default to images
        const acceptProp = other.accept || { 'image/*': [] };

        // More robust detection of file type expectations
        const acceptKeys = Object.keys(acceptProp);
        const isImageOnly = acceptKeys.length === 1 && acceptKeys[0] === 'image/*';
        const isPDFOnly = acceptKeys.length === 1 && acceptKeys[0] === 'application/pdf';

        console.log('Accept prop analysis:', {
          acceptProp,
          acceptKeys,
          isImageOnly,
          isPDFOnly,
          fieldName: name,
        });

        const uploadProps = {
          multiple,
          accept: acceptProp,
          maxSize: isPDFOnly ? 5 * 1024 * 1024 : 10 * 1024 * 1024, // 5MB for PDFs, 10MB for images
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          // Clear any previous errors
          clearErrors(name);

          // Debug logging
          console.log('RHFUpload onDrop called for field:', name);
          console.log('Accept prop:', acceptProp);
          console.log('Is image only:', isImageOnly);
          console.log('Is PDF only:', isPDFOnly);
          console.log(
            'Files:',
            acceptedFiles.map((f) => ({ name: f.name, type: f.type }))
          );

          // Validate files before setting them
          const validFiles: File[] = [];
          const errors: string[] = [];

          acceptedFiles.forEach((file) => {
            // Determine max size based on file type
            const maxSize = isPDFOnly ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

            // Check file size
            if (file.size > maxSize) {
              const maxSizeMB = maxSize / (1024 * 1024);
              errors.push(
                `${file.name} is too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Maximum size is ${maxSizeMB}MB.`
              );
              return;
            }

            // Validate file type based on accept prop
            console.log(`Validating file: ${file.name}, type: ${file.type}`);
            console.log(`Field: ${name}, isImageOnly: ${isImageOnly}, isPDFOnly: ${isPDFOnly}`);

            if (isPDFOnly) {
              // PDF validation - check this first
              console.log('PDF validation for:', file.name);
              if (file.type !== 'application/pdf') {
                console.log('PDF validation failed - wrong type:', file.type);
                errors.push(`${file.name} is not a valid PDF file. Please upload a PDF file.`);
                return;
              }
              console.log('PDF validation passed');
            } else if (isImageOnly) {
              // Image validation
              console.log('Image validation for:', file.name);
              if (!file.type.startsWith('image/')) {
                console.log('Image validation failed - not an image:', file.type);
                errors.push(`${file.name} is not a valid image file.`);
                return;
              }

              // Check for supported image types
              const supportedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/bmp',
              ];
              if (!supportedTypes.includes(file.type)) {
                console.log('Image validation failed - unsupported type:', file.type);
                errors.push(
                  `${file.name} format is not supported. Please use JPEG, PNG, GIF, WebP, or BMP.`
                );
                return;
              }
              console.log('Image validation passed');
            } else {
              // Mixed or other file types - validate based on accept prop
              console.log('Mixed validation for:', file.name);
              const acceptedTypes = Object.keys(acceptProp);
              const isAccepted = acceptedTypes.some((acceptedType) => {
                if (acceptedType.endsWith('/*')) {
                  const baseType = acceptedType.replace('/*', '');
                  return file.type.startsWith(baseType);
                }
                return file.type === acceptedType;
              });

              if (!isAccepted) {
                console.log(
                  'Mixed validation failed - not accepted:',
                  file.type,
                  'Accepted:',
                  acceptedTypes
                );
                errors.push(
                  `${file.name} file type is not supported. Accepted types: ${acceptedTypes.join(', ')}`
                );
                return;
              }
              console.log('Mixed validation passed');
            }

            validFiles.push(file);
          });

          // Set error if there are validation issues
          if (errors.length > 0) {
            setError(name, {
              type: 'manual',
              message: errors.join(' '),
            });
            return;
          }

          // Set the valid files
          const value = multiple ? [...(field.value || []), ...validFiles] : validFiles[0];
          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
