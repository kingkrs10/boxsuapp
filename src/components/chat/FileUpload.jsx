import React, { useState, useRef } from 'react';
import { Toaster, toast } from '@/components/ui/toast';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, UploadCloud } from 'lucide-react';

const FileUpload = ({ 
  onUpload, 
  accept, 
  maxSize = 50 * 1024 * 1024, // 50MB default
  children, 
  className 
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const toastIdRef = useRef(null);

  const showProgressToast = (progress) => {
    if (!toastIdRef.current) {
      toastIdRef.current = toast({
        title: "Uploading file...",
        description: (
          <div className="w-full">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">{progress}% complete</p>
          </div>
        ),
        duration: Infinity,
      });
    } else {
      toast.update(toastIdRef.current, {
        description: (
          <div className="w-full">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-sm text-gray-500">{progress}% complete</p>
          </div>
        ),
      });
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Check file type if accept prop is provided
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;
      
      const isAcceptedType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return type.toLowerCase() === fileExtension.toLowerCase();
        } else if (type.includes('*')) {
          // Handle wildcards like image/*
          return fileType.startsWith(type.split('*')[0]);
        } else {
          // Exact mime type match
          return type === fileType;
        }
      });

      if (!isAcceptedType) {
        throw new Error(`File type ${fileType} is not supported`);
      }
    }
  };

  const simulateProgress = async () => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(progress);
      showProgressToast(progress);
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    toastIdRef.current = null;

    try {
      // Validate file
      validateFile(file);

      // Show initial progress
      showProgressToast(0);

      // Simulate upload progress
      await simulateProgress();

      // Attempt to upload the file
      await onUpload(file);

      // Show success toast
      toast({
        title: "Upload complete",
        description: "Your file has been uploaded successfully",
        variant: "success",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

    } catch (error) {
      // Show error toast
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      // Clean up
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }
  };

  return (
    <div className={className}>
      <Toaster />
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        id={`file-upload-${accept}`}
        disabled={isUploading}
      />
      <label 
        htmlFor={`file-upload-${accept}`}
        className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children || (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <UploadCloud className="h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept ? `Supported formats: ${accept}` : 'All files supported'}
            </p>
            {maxSize && (
              <p className="mt-1 text-xs text-gray-500">
                Max size: {maxSize / (1024 * 1024)}MB
              </p>
            )}
          </div>
        )}
      </label>
    </div>
  );
};

export default FileUpload;