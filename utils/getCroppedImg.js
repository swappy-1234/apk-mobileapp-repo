import * as ImageManipulator from 'expo-image-manipulator';

export const getCroppedImg = async (imageUri, pixelCrop) => {
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [
      {
        crop: {
          originX: pixelCrop.x,
          originY: pixelCrop.y,
          width: pixelCrop.width,
          height: pixelCrop.height,
        },
      },
    ],
    {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return {
    uri: result.uri,
    name: `cropped_${Date.now()}.jpg`,
    type: 'image/jpeg',
  };
};
