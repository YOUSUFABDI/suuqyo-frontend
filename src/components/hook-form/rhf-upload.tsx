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

        // Debug logging (remove in production)
        // console.log('Accept prop analysis:', {
        //   acceptProp,
        //   acceptKeys,
        //   isImageOnly,
        //   isPDFOnly,
        //   fieldName: name,
        // });

        const uploadProps = {
          multiple,
          accept: acceptProp,
          maxSize: 1024 * 1024 * 1024, // 1GB for all file types
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          // Clear any previous errors
          clearErrors(name);

          // Debug logging (remove in production)
          // console.log('RHFUpload onDrop called for field:', name);
          // console.log('Accept prop:', acceptProp);
          // console.log('Is image only:', isImageOnly);
          // console.log('Is PDF only:', isPDFOnly);
          // console.log(
          //   'Files:',
          //   acceptedFiles.map((f) => ({ name: f.name, type: f.type }))
          // );

          // Validate files before setting them
          const validFiles: File[] = [];
          const errors: string[] = [];

          acceptedFiles.forEach((file) => {
            // Support up to 1GB files
            const maxSize = 1024 * 1024 * 1024; // 1GB

            // Check file size
            if (file.size > maxSize) {
              const maxSizeGB = maxSize / (1024 * 1024 * 1024);
              const fileSizeDisplay =
                file.size > 1024 * 1024 * 1024
                  ? `${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB`
                  : `${(file.size / (1024 * 1024)).toFixed(2)}MB`;
              errors.push(
                `${file.name} is too large (${fileSizeDisplay}). Maximum size is ${maxSizeGB}GB.`
              );
              return;
            }

            // Validate file type based on accept prop
            if (isPDFOnly) {
              // PDF validation - check this first
              if (file.type !== 'application/pdf') {
                errors.push(`${file.name} is not a valid PDF file. Please upload a PDF file.`);
                return;
              }
            } else if (isImageOnly) {
              // Image validation
              if (!file.type.startsWith('image/')) {
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
                errors.push(
                  `${file.name} format is not supported. Please use JPEG, PNG, GIF, WebP, or BMP.`
                );
                return;
              }
            } else {
              // Mixed or other file types - validate based on accept prop
              const acceptedTypes = Object.keys(acceptProp);
              const isAccepted = acceptedTypes.some((acceptedType) => {
                if (acceptedType.endsWith('/*')) {
                  const baseType = acceptedType.replace('/*', '');
                  return file.type.startsWith(baseType);
                }
                return file.type === acceptedType;
              });

              if (!isAccepted) {
                errors.push(
                  `${file.name} file type is not supported. Accepted types: ${acceptedTypes.join(', ')}`
                );
                return;
              }
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
