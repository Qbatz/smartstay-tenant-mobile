import { launchImageLibrary } from 'react-native-image-picker';

export const pickSingleImage = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      includeExtra: true,
    });

    if (result.didCancel) return null;

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const isImage =
        asset.type?.startsWith('image/') ||
        asset.fileName?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

      return {
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.jpg`,
        type: asset.type || 'image/jpeg',
        isImage: true,
      };
    }
    return null;
  } catch (error) {
    console.log('Image pick error:', error);
    return null;
  }
};

export const pickSingleFile = async () => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.5,
      includeExtra: true,
    });

    if (result.didCancel) return null;

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const isImage =
        asset.type?.startsWith('image/') ||
        asset.fileName?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

      return {
        uri: asset.uri,
        name: asset.fileName || `document_${Date.now()}`,
        type: asset.type || 'application/octet-stream',
        isImage: isImage || false,
      };
    }
    return null;
  } catch (error) {
    console.log('File pick error:', error);
    return null;
  }
};

export const pickFileOrImage = async (type = 'all') => {
  if (type === 'image') {
    return await pickSingleImage();
  } else {
    return await pickSingleFile();
  }
};
