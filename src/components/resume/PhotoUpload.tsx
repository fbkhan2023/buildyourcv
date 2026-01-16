import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useResume } from '@/contexts/ResumeContext';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Camera, Upload, Trash2, User, Crop } from 'lucide-react';
import { toast } from 'sonner';

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: CroppedAreaPixels): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg', 0.9);
}

export const PhotoUpload = () => {
  const { resumeData, updatePersonalInfo } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Cropping states
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: CroppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageToCrop(result);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    if (croppedAreaPixels && imageToCrop) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        updatePersonalInfo('photo', croppedImage);
        setShowCropper(false);
        setImageToCrop('');
        toast.success('Photo cropped and saved!');
      } catch (error) {
        toast.error('Failed to crop image');
      }
    }
  };

  const handleSkipCrop = () => {
    updatePersonalInfo('photo', imageToCrop);
    setShowCropper(false);
    setImageToCrop('');
    toast.success('Photo uploaded successfully!');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    updatePersonalInfo('photo', '');
    toast.success('Photo removed');
  };

  const openCropperForExisting = () => {
    if (resumeData.personalInfo.photo) {
      setImageToCrop(resumeData.personalInfo.photo);
      setShowCropper(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  return (
    <>
      <Card className="shadow-soft animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-display flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            Profile Photo
          </CardTitle>
          <CardDescription>
            Add a professional photo to your resume (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            {/* Photo Preview */}
            <div className="relative">
              {resumeData.personalInfo.photo ? (
                <div className="relative group">
                  <img
                    src={resumeData.personalInfo.photo}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                  />
                  <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={openCropperForExisting}
                      title="Crop photo"
                    >
                      <Crop className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={removePhoto}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border-4 border-dashed border-muted-foreground/30">
                  <User className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-secondary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your photo here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-secondary/50 p-4">
            <h4 className="text-sm font-medium mb-2">Tips for a professional photo:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a recent, high-quality headshot</li>
              <li>• Dress professionally as you would for the job</li>
              <li>• Use a neutral or solid background</li>
              <li>• Ensure good lighting on your face</li>
              <li>• Smile naturally and make eye contact with the camera</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Cropper Dialog */}
      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Your Photo
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Zoom</Label>
            <Slider
              value={[zoom]}
              onValueChange={(values) => setZoom(values[0])}
              min={1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleSkipCrop}>
              Skip Cropping
            </Button>
            <Button onClick={handleCropSave} className="gradient-primary">
              Apply Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};