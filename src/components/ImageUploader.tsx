"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Konva from 'konva';

interface ImageUploaderProps {
  // Props for project page
  images?: string[];
  onUpload?: (file: File) => Promise<void>;
  onReplace?: (index: number, file: File) => Promise<void>;
  onDelete?: (index: number) => Promise<void>;
  
  // Props for ImagesStep
  existingImages?: string[];
  onImagesUploaded?: (urls: string[]) => void;
  
  // Common props
  uploading?: boolean;
  limit?: number;
  isProjectView?: boolean;
}

// Add new interfaces for our editor
interface EditorState {
  brightness: number;
  contrast: number;
  blur: number;
  isDrawingBlur: boolean;
  blurBrushSize: number;
  blurBrushStrength: number;
  blurRectangles: Array<{id: string, x: number, y: number, width: number, height: number, blur: number}>;
}

export default function ImageUploader({
  images = [],
  existingImages = [],
  onUpload,
  onReplace,
  onDelete,
  onImagesUploaded,
  uploading = false,
  limit = 10,
  isProjectView = false
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(uploading);
  const [isDragging, setIsDragging] = useState(false);
  const supabase = createClientComponentClient();
  
  // Use either images or existingImages based on which is provided
  const displayImages = images.length > 0 ? images : existingImages;

  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    brightness: 0,
    contrast: 0,
    blur: 0,
    isDrawingBlur: false,
    blurBrushSize: 20,
    blurBrushStrength: 5,
    blurRectangles: []
  });
  
  // Remove all blur-related state variables
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageLayerRef = useRef<Konva.Layer | null>(null);
  const konvaImageRef = useRef<Konva.Image | null>(null);
  
  // Add a layer reference for blur shapes
  const blurLayerRef = useRef<Konva.Layer | null>(null);
  
  // Upload a file to Supabase storage
  const uploadFile = async (file: File): Promise<string> => {
    console.log('Uploading file to Supabase:', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    console.log('File path for upload:', filePath);
    console.log('Using bucket: docx');
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('docx')  // Using the correct bucket name
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful');
      
      const { data: urlData } = supabase.storage
        .from('docx')  // Using the correct bucket name
        .getPublicUrl(filePath);
      
      console.log('Public URL:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      // Instead of immediately uploading, first open the editor
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          // Set the current image as the one to edit
          setEditingImage(e.target.result as string);
          // Store the index or set a special flag for new uploads
          setEditingIndex(replaceIndex !== null ? replaceIndex : -1); // -1 indicates a new upload
        }
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error handling file:', error);
      setIsUploading(false);
      setReplaceIndex(null);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleReplaceClick = (index: number) => {
    setReplaceIndex(index);
    // When clicking "Replace", we'll directly go to file selection
    // We'll set editingIndex later when the file is actually selected
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to dataURL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Function to apply filters and get the result as a file
  const applyFiltersAndGetFile = () => {
    if (!stageRef.current) return null;
    
    // Apply brightness and contrast manually
    const stage = stageRef.current;
    
    // Get the dataURL of the canvas
    const dataURL = stage.toDataURL();
    
    // Convert the dataURL to a File object
    const file = dataURLtoFile(dataURL, `edited_image_${Date.now()}.png`);
    
    return file;
  };

  // Function to save edited image
  const saveEditedImage = async () => {
    if (editingIndex === null) return;
    
    const editedFile = applyFiltersAndGetFile();
    if (!editedFile) return;
    
    try {
      setIsUploading(true);
      
      if (editingIndex === -1) {
        // This is a new upload
        if (onUpload) {
          await onUpload(editedFile);
        } else if (onImagesUploaded) {
          const uploadedUrl = await uploadFile(editedFile);
          onImagesUploaded([...displayImages, uploadedUrl]);
        }
      } else {
        // This is a replacement
      if (onReplace) {
        await onReplace(editingIndex, editedFile);
      } else if (onImagesUploaded) {
        const uploadedUrl = await uploadFile(editedFile);
        const newUrls = [...displayImages];
        newUrls[editingIndex] = uploadedUrl;
        onImagesUploaded(newUrls);
        }
      }
      
      // Reset editing state
      setEditingImage(null);
      setEditingIndex(null);
      setReplaceIndex(null);
      setEditorState({
        brightness: 0,
        contrast: 0,
        blur: 0,
        isDrawingBlur: false,
        blurBrushSize: 20,
        blurBrushStrength: 5,
        blurRectangles: []
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error saving edited image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Initialize Konva stage when editing image
  useEffect(() => {
    if (!editingImage || !canvasRef.current) return;
    
    console.log('Loading image for editing:', editingImage);
    
    // Add a small delay to ensure the DOM is fully ready
    const initTimer = setTimeout(() => {
      try {
        // Clean up any existing stage
        if (stageRef.current) {
          console.log('Destroying previous stage');
          stageRef.current.destroy();
          stageRef.current = null;
        }
        
        // Verify container still exists
        if (!canvasRef.current) {
          console.error('Canvas container not found');
          return;
        }
        
        // Clear canvas container
        canvasRef.current.innerHTML = '';
        canvasRef.current.style.backgroundColor = '#0a0a0a'; // Dark background
        
        // Load the image
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = editingImage;
        
        image.onload = () => {
          // Additional safety check
          if (!canvasRef.current) {
            console.error('Canvas container lost after image load');
            return;
          }
          
          console.log('Image loaded, dimensions:', image.width, 'x', image.height);
          
          try {
            // Calculate dimensions
            const maxWidth = Math.min(window.innerWidth * 0.6, 800);
            const maxHeight = Math.min(window.innerHeight * 0.6, 500);
            let width = image.width;
            let height = image.height;
            
            // Calculate proper scaling to fit
            const aspectRatio = width / height;
            
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
            
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
            
            console.log('Calculated stage dimensions:', width, 'x', height);
            
            // Create new stage
            const stage = new Konva.Stage({
              container: canvasRef.current!,
              width: width,
              height: height,
            });
            stageRef.current = stage;
            
            // Create image layer
            const imageLayer = new Konva.Layer();
            imageLayerRef.current = imageLayer;
            
            // Create a separate layer for blur rectangles
            const blurLayer = new Konva.Layer();
            blurLayerRef.current = blurLayer;
            
            stage.add(imageLayer);
            stage.add(blurLayer);
            
            // Add image to layer
            const konvaImage = new Konva.Image({
              image: image,
              width: width,
              height: height,
            });
            konvaImageRef.current = konvaImage;
            
            konvaImage.cache();
            konvaImage.filters([Konva.Filters.Brighten, Konva.Filters.Contrast, Konva.Filters.Blur]);
            konvaImage.brightness(editorState.brightness / 100);
            konvaImage.contrast(1 + editorState.contrast / 25);
            konvaImage.blurRadius(editorState.blur);
            
            imageLayer.add(konvaImage);
            imageLayer.batchDraw();
            
            // Draw existing blur rectangles
            editorState.blurRectangles.forEach(rect => {
              // Apply blur to the specific region
              const blurredRegionImage = applyActualBlurToRegion(
                rect.x, rect.y, rect.width, rect.height, rect.blur
              );
              
              if (blurredRegionImage) {
                // Create rectangle to show the blur region boundary
                const blurRect = new Konva.Rect({
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                  fill: 'transparent',
                  stroke: 'transparent',
                  strokeWidth: 1,
                  draggable: true,
                  id: rect.id,
                  name: 'blurRect'
                });
                
                // Instead of clip, we'll create a new layer with a clipping function
                const clipGroup = new Konva.Group({
                  clipFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.rect(rect.x, rect.y, rect.width, rect.height);
                    ctx.closePath();
                  },
                  id: `${rect.id}-clip`
                });
                
                // Create a Konva image using the blurred region
                const blurredImage = new Konva.Image({
                  image: blurredRegionImage,
                  x: 0,
                  y: 0,
                  width: stageRef.current ? stageRef.current.width() : 0,
                  height: stageRef.current ? stageRef.current.height() : 0,
                  id: `${rect.id}-img`,
                  name: 'blurredImage',
                  listening: false
                });
                
                // Add the blurred image to the clipping group
                clipGroup.add(blurredImage);
                
                // Add elements to blur layer
                blurLayer.add(clipGroup);
                blurLayer.add(blurRect);
                
                // When the rectangle is moved, update the clip area as well
                blurRect.on('dragmove', function() {
                  const newX = blurRect.x();
                  const newY = blurRect.y();
                  
                  // Update the clipping function
                  clipGroup.clipFunc(function(ctx) {
                    ctx.beginPath();
                    ctx.rect(newX, newY, rect.width, rect.height);
                    ctx.closePath();
                  });
                  
                  // Update state to reflect new position
                  setEditorState({
                    ...editorState,
                    blurRectangles: editorState.blurRectangles.map(r => 
                      r.id === rect.id 
                        ? {...r, x: newX, y: newY}
                        : r
                    )
                  });
                  
                  blurLayer.batchDraw();
                });
                
                // Add double-click listener to remove rectangle
                blurRect.on('dblclick dbltap', () => {
                  // Remove from state
                  setEditorState({
                    ...editorState,
                    blurRectangles: editorState.blurRectangles.filter(r => r.id !== rect.id)
                  });
                  
                  // Remove from layer
                  blurRect.destroy();
                  clipGroup.destroy();
                  blurLayer.batchDraw();
                });
              }
            });
            
            // Set up drawing functionality for blur rectangles
            let startPoint = {x: 0, y: 0};
            let selectionRect: Konva.Rect | null = null;
            let isDrawing = false;
            
            // Add event handlers for creating new blur rectangles
            stage.on('mousedown touchstart', (e) => {
              if (!editorState.isDrawingBlur) return;
              
              // Prevent default behavior
              e.evt.preventDefault();
              
              // Get mouse position
              const pos = stage.getPointerPosition();
              if (!pos) return;
              
              isDrawing = true;
              startPoint = {x: pos.x, y: pos.y};
              
              // Create a new selection rectangle
              selectionRect = new Konva.Rect({
                x: startPoint.x,
                y: startPoint.y,
                width: 0,
                height: 0,
                fill: 'transparent',
                stroke: 'rgba(138, 43, 226, 0.8)',
                strokeWidth: 1,
                dash: [5, 5],
              });
              
              blurLayer.add(selectionRect);
              blurLayer.batchDraw();
            });
            
            stage.on('mousemove touchmove', (e) => {
              if (!isDrawing || !selectionRect || !editorState.isDrawingBlur) return;
              
              // Prevent default behavior
              e.evt.preventDefault();
              
              // Get mouse position
              const pos = stage.getPointerPosition();
              if (!pos) return;
              
              // Update the selection rectangle
              const width = pos.x - startPoint.x;
              const height = pos.y - startPoint.y;
              
              selectionRect.width(width);
              selectionRect.height(height);
              blurLayer.batchDraw();
            });
            
            stage.on('mouseup touchend', (e) => {
              if (!isDrawing || !selectionRect || !editorState.isDrawingBlur) {
                isDrawing = false;
                return;
              }
              
              // Prevent default behavior
              e.evt.preventDefault();
              
              // Finalize the selection
              isDrawing = false;
              
              // Get the final rectangle dimensions
              let rect = {
                x: selectionRect.x(),
                y: selectionRect.y(),
                width: selectionRect.width(),
                height: selectionRect.height()
              };
              
              // Normalize negative width/height
              if (rect.width < 0) {
                rect.x += rect.width;
                rect.width = Math.abs(rect.width);
              }
              
              if (rect.height < 0) {
                rect.y += rect.height;
                rect.height = Math.abs(rect.height);
              }
              
              // Only create rectangles with meaningful dimensions
              if (rect.width > 5 && rect.height > 5) {
                // Remove selection rectangle
                selectionRect.destroy();
                
                // Create a unique ID
                const rectId = `rect-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                
                // Apply blur to the specific region
                const blurStrength = editorState.blurBrushStrength * 2;
                
                // Create a blurred version of just this region
                const blurredRegionImage = applyActualBlurToRegion(
                  rect.x, rect.y, rect.width, rect.height, blurStrength
                );
                
                if (blurredRegionImage) {
                  // Add the blur rectangle to our state
                  const newBlurRectangles = [
                    ...editorState.blurRectangles,
                    {
                      id: rectId,
                      x: rect.x,
                      y: rect.y,
                      width: rect.width,
                      height: rect.height,
                      blur: blurStrength
                    }
                  ];
                  
                  setEditorState({
                    ...editorState,
                    blurRectangles: newBlurRectangles
                  });
                  
                  // Create rectangle to show the blur region boundary
                  const blurRect = new Konva.Rect({
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    fill: 'transparent',
                    stroke: 'transparent',
                    strokeWidth: 1,
                    draggable: true,
                    id: rectId,
                    name: 'blurRect'
                  });
                  
                  // Create a clipping group
                  const clipGroup = new Konva.Group({
                    clipFunc: function(ctx) {
                      ctx.beginPath();
                      ctx.rect(rect.x, rect.y, rect.width, rect.height);
                      ctx.closePath();
                    },
                    id: `${rectId}-clip`
                  });
                  
                  // Create a Konva image using the blurred region
                  const blurredImage = new Konva.Image({
                    image: blurredRegionImage,
                    x: 0,
                    y: 0,
                    width: stageRef.current ? stageRef.current.width() : 0,
                    height: stageRef.current ? stageRef.current.height() : 0,
                    id: `${rectId}-img`,
                    name: 'blurredImage',
                    listening: false
                  });
                  
                  // Add the blurred image to the clipping group
                  clipGroup.add(blurredImage);
                  
                  // Add elements to blur layer
                  blurLayer.add(clipGroup);
                  blurLayer.add(blurRect);
                  blurLayer.batchDraw();
                  
                  // When the rectangle is moved, update the clip area as well
                  blurRect.on('dragmove', function() {
                    const newX = blurRect.x();
                    const newY = blurRect.y();
                    
                    // Update the clipping function
                    clipGroup.clipFunc(function(ctx) {
                      ctx.beginPath();
                      ctx.rect(newX, newY, rect.width, rect.height);
                      ctx.closePath();
                    });
                    
                    // Update state to reflect new position
                    setEditorState({
                      ...editorState,
                      blurRectangles: editorState.blurRectangles.map(r => 
                        r.id === rectId 
                          ? {...r, x: newX, y: newY}
                          : r
                      )
                    });
                    
                    blurLayer.batchDraw();
                  });
                  
                  // Add double-click listener to remove rectangle
                  blurRect.on('dblclick dbltap', () => {
                    // Remove from state
                    setEditorState({
                      ...editorState,
                      blurRectangles: editorState.blurRectangles.filter(r => r.id !== rectId)
                    });
                    
                    // Remove from layer
                    blurRect.destroy();
                    clipGroup.destroy();
                    blurLayer.batchDraw();
                  });
                }
              } else {
                // If it's too small, just remove it
                selectionRect.destroy();
              }
              
              blurLayer.batchDraw();
              selectionRect = null;
            });
            
            console.log('Konva stage initialized successfully');
          } catch (error) {
            console.error('Error initializing stage:', error);
          }
        };
      } catch (error) {
        console.error('Error in initialization:', error);
      }
    }, 100); // Small delay to ensure DOM is ready
    
    // Updated cleanup function
    return () => {
      clearTimeout(initTimer);
      if (stageRef.current) {
        stageRef.current.destroy();
        stageRef.current = null;
      }
    };
  }, [editingImage, editorState.brightness, editorState.contrast, editorState.blur, 
      editorState.isDrawingBlur, editorState.blurBrushStrength, editorState.blurRectangles]);

  // Component for the Image Editor Modal
  const ImageEditorModal = () => {
    if (!editingImage) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-[#1A202C] p-4 rounded-lg w-full md:w-auto max-w-[90vw] max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white">Edit Image</h2>
            <button
              onClick={() => {
                setEditingImage(null);
                setEditingIndex(null);
                setReplaceIndex(null);
                setEditorState({
                  brightness: 0,
                  contrast: 0,
                  blur: 0,
                  isDrawingBlur: false,
                  blurBrushSize: 20,
                  blurBrushStrength: 5,
                  blurRectangles: []
                });
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Main canvas area */}
            <div className="flex-1 bg-[#121824] rounded-lg p-2 flex items-center justify-center">
              <div 
                ref={canvasRef} 
                className="canvas-container"
                style={{ 
                  width: '100%',
                  minHeight: '300px', 
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2A3441',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: editorState.isDrawingBlur ? 'crosshair' : 'default'
                }}
              ></div>
            </div>
            
            {/* Controls sidebar */}
            <div className="w-full lg:w-60 flex-shrink-0">
              <div className="p-3 bg-[#222A38] rounded-lg">
                <h3 className="text-base font-medium text-white mb-3">Adjustments</h3>
                
                <div className="mb-3">
                  <label className="text-sm text-gray-300 block mb-1">Brightness</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editorState.brightness}
                    onChange={(e) => {
                      const newBrightness = parseInt(e.target.value);
                      setEditorState({
                        ...editorState,
                        brightness: newBrightness
                      });
                      
                      // Apply changes immediately to the image
                      if (konvaImageRef.current) {
                        konvaImageRef.current.brightness(newBrightness / 100);
                        konvaImageRef.current.getLayer()?.batchDraw();
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>-100</span>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="text-sm text-gray-300 block mb-1">Contrast</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editorState.contrast}
                    onChange={(e) => {
                      const newContrast = parseInt(e.target.value);
                      setEditorState({
                        ...editorState,
                        contrast: newContrast
                      });
                      
                      // Apply changes immediately to the image
                      if (konvaImageRef.current) {
                        konvaImageRef.current.contrast(1 + newContrast / 25);
                        konvaImageRef.current.getLayer()?.batchDraw();
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>-100</span>
                    <span>0</span>
                    <span>100</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="text-sm text-gray-300 block mb-1">Global Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={editorState.blur}
                    onChange={(e) => {
                      const newBlur = parseInt(e.target.value);
                      setEditorState({
                        ...editorState,
                        blur: newBlur
                      });
                      
                      // Apply changes immediately to the image
                      if (konvaImageRef.current) {
                        konvaImageRef.current.blurRadius(newBlur);
                        konvaImageRef.current.getLayer()?.batchDraw();
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>20</span>
                    <span>40</span>
                  </div>
                </div>
                
                {/* Blur rectangle selection controls */}
                <div className="mt-5 mb-3 border-t border-[#384152] pt-4">
                  <div className="flex items-center mb-3">
                    <label className="text-sm font-medium text-gray-300">Blur Areas</label>
                    <div className="flex-1"></div>
                    <button 
                      className={`px-3 py-1 text-xs rounded-md ${
                        editorState.isDrawingBlur 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-700 text-gray-300'
                      }`}
                      onClick={() => {
                        setEditorState({
                          ...editorState,
                          isDrawingBlur: !editorState.isDrawingBlur
                        });
                      }}
                    >
                      {editorState.isDrawingBlur ? 'Drawing Mode' : 'Select Mode'}
                    </button>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between">
                      <label className="text-xs text-gray-400 block mb-1">Blur Strength</label>
                      <span className="text-xs text-gray-500">{editorState.blurBrushStrength}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={editorState.blurBrushStrength}
                      onChange={(e) => {
                        setEditorState({
                          ...editorState,
                          blurBrushStrength: parseInt(e.target.value)
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 italic mt-1 mb-3">
                    <p>Click and drag to draw blur regions</p>
                    <p>Double-click a region to remove it</p>
                  </div>
                  
                  {editorState.blurRectangles.length > 0 && (
                    <div className="mb-3">
                      <button
                        onClick={() => {
                          setEditorState({
                            ...editorState,
                            blurRectangles: []
                          });
                          
                          // Clear all blur shapes
                          if (blurLayerRef.current) {
                            const blurRects = blurLayerRef.current.find('.blurRect');
                            blurRects.forEach(rect => rect.destroy());
                            
                            const blurredImages = blurLayerRef.current.find('.blurredImage');
                            blurredImages.forEach(img => img.destroy());
                            
                            blurLayerRef.current.batchDraw();
                          }
                        }}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded-md text-xs mt-2"
                      >
                        Clear All Blur Regions ({editorState.blurRectangles.length})
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={saveEditedImage}
                    disabled={isUploading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {isUploading 
                      ? 'Saving...' 
                      : editingIndex === -1 
                        ? 'Add Image' 
                        : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={() => {
                      // Reset all adjustments
                      setEditorState({
                        brightness: 0,
                        contrast: 0,
                        blur: 0,
                        isDrawingBlur: false,
                        blurBrushSize: 20,
                        blurBrushStrength: 5,
                        blurRectangles: []
                      });
                      
                      // Reset image if it exists
                      if (konvaImageRef.current) {
                        konvaImageRef.current.brightness(0);
                        konvaImageRef.current.contrast(1);
                        konvaImageRef.current.blurRadius(0);
                        konvaImageRef.current.getLayer()?.batchDraw();
                      }
                      
                      // Clear all blur shapes
                      if (blurLayerRef.current) {
                        const blurRects = blurLayerRef.current.find('.blurRect');
                        blurRects.forEach(rect => rect.destroy());
                        
                        const blurredImages = blurLayerRef.current.find('.blurredImage');
                        blurredImages.forEach(img => img.destroy());
                        
                        blurLayerRef.current.batchDraw();
                      }
                    }}
                    className="bg-transparent border border-[#2A3441] text-gray-300 hover:bg-[#2A3441] px-4 py-2 rounded-md text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to handle image edit
  const handleEditClick = (index: number) => {
    setEditingImage(displayImages[index]);
    setEditingIndex(index);
  };

  // Function to apply localized blur to specific regions
  const applyActualBlurToRegion = (x: number, y: number, width: number, height: number, blurStrength: number) => {
    if (!konvaImageRef.current || !stageRef.current) return null;
    
    try {
      // Create a temporary offscreen canvas
      const offscreenCanvas = document.createElement('canvas');
      const stageWidth = stageRef.current.width();
      const stageHeight = stageRef.current.height();
      offscreenCanvas.width = stageWidth;
      offscreenCanvas.height = stageHeight;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) return null;
      
      // Draw the full source image to the canvas
      ctx.drawImage(konvaImageRef.current.image() as HTMLImageElement, 0, 0, stageWidth, stageHeight);
      
      // Apply a blur to just the region we want
      ctx.save();
      // Only blur the region we care about
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.clip();
      
      // Use built-in canvas blur if available
      if (typeof ctx.filter !== 'undefined') {
        ctx.filter = `blur(${blurStrength}px)`;
        // We need to redraw the image with the filter applied
        ctx.drawImage(konvaImageRef.current.image() as HTMLImageElement, 0, 0, stageWidth, stageHeight);
      } else {
        // Fallback - simple box blur
        const pixelData = ctx.getImageData(x, y, width, height);
        const blurredData = simpleBoxBlur(pixelData.data, width, height, blurStrength);
        ctx.putImageData(new ImageData(blurredData, width, height), x, y);
      }
      
      ctx.restore();
      
      // Create a new image from the result
      const blurredImage = new Image();
      blurredImage.src = offscreenCanvas.toDataURL();
      
      return blurredImage;
    } catch (error) {
      console.error('Error applying blur:', error);
      return null;
    }
  };

  // Simple box blur that doesn't use the complex stack algorithm
  function simpleBoxBlur(pixels: Uint8ClampedArray, width: number, height: number, radius: number): Uint8ClampedArray {
    const result = new Uint8ClampedArray(pixels.length);
    const size = radius * 2 + 1;
    const divisor = size * size;
    
    // For each pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0;
        let count = 0;
        
        // Sample the surrounding pixels
        for (let ky = -radius; ky <= radius; ky++) {
          for (let kx = -radius; kx <= radius; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx));
            const py = Math.min(height - 1, Math.max(0, y + ky));
            
            const i = (py * width + px) * 4;
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
            a += pixels[i + 3];
            count++;
          }
        }
        
        // Set the pixel in the result
        const i = (y * width + x) * 4;
        result[i] = r / count;
        result[i + 1] = g / count;
        result[i + 2] = b / count;
        result[i + 3] = a / count;
      }
    }
    
    return result;
  }

  // New function to handle image deletion
  const handleDeleteImage = async (index: number) => {
    try {
      console.log('Deleting image at index:', index);
      setIsUploading(true);
      
      const imageToDelete = displayImages[index];
      console.log('Image URL to delete:', imageToDelete);
      
      // If we have an onDelete handler, use it (for project view)
      if (onDelete) {
        await onDelete(index);
      } 
      // Otherwise if we're using onImagesUploaded flow, remove from array
      else if (onImagesUploaded) {
        // Delete the file from Supabase storage if it's a URL we can parse
        if (imageToDelete && imageToDelete.includes('supabase')) {
          try {
            // Parse the URL to get the file path
            const urlParts = imageToDelete.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const filePath = `uploads/${fileName}`;
            
            console.log('Deleting file from storage:', filePath);
            
            // Delete the file from storage
            const { error } = await supabase.storage
              .from('docx')
              .remove([filePath]);
              
            if (error) {
              console.error('Error deleting file from storage:', error);
            } else {
              console.log('File deleted successfully from storage');
            }
          } catch (error) {
            console.error('Error parsing file URL for deletion:', error);
          }
        }
        
        // Update the array of images regardless of whether storage deletion succeeded
        const newUrls = [...displayImages];
        newUrls.splice(index, 1);
        console.log('New image URLs array:', newUrls);
        
        // Call the callback function to update the parent component
        onImagesUploaded(newUrls);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Image editor modal */}
      {editingImage && <ImageEditorModal />}
      
      {displayImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {displayImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Uploaded image ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg border border-[#2A3441]"
              />
              
              {/* Delete button for upload form (not project view) */}
              {!isProjectView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling to parent elements
                    handleDeleteImage(index);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Delete image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Different hover actions based on context */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  
                  {/* Show Replace button only in project view */}
                  {isProjectView && (
                    <button
                      onClick={() => handleReplaceClick(index)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Replace
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Add image button - shown in both contexts if below limit */}
          {displayImages.length < limit && (
            <div
              ref={dropAreaRef}
              className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragging 
                  ? 'border-purple-500 bg-purple-500/10 scale-105' 
                  : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
              }`}
              onClick={handleAreaClick}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-4 flex flex-col items-center">
                <svg className="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm font-medium text-gray-300">
                  {isUploading ? 'Uploading...' : 'Add Image'}
                </p>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Drop file here or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Empty state - same for both contexts
        <div
          ref={dropAreaRef}
          className={`flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragging 
              ? 'border-purple-500 bg-purple-500/10 scale-105' 
              : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
          }`}
          onClick={handleAreaClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-6 flex flex-col items-center">
            <svg className="w-16 h-16 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-300 mb-2">
              {isUploading ? 'Uploading...' : 'Upload Property Images'}
            </p>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Drag and drop your images here, or click to browse your files
            </p>
            <p className="text-xs text-gray-600 mt-4">
              Supported formats: JPG, PNG, WEBP • Max size: 5MB
            </p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
} 