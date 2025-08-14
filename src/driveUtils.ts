// driveUtils.ts

const API_KEY = "AIzaSyADWvsv4yDUy257HC8icbKkrgRUgQFOi9k";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


export const fetchImagesFromDriveFolder = async (folderId: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+(mimeType='image/jpeg'+or+mimeType='image/png')&key=${API_KEY}&fields=files(id,name,mimeType)`
    );

    const data = await response.json();

    if (!data.files || !Array.isArray(data.files)) {
      console.error("Unexpected API response", data);
      return [];
    }

    //return data.files.map((file) => `https://drive.google.com/uc?export=view&id=${file.id}`);
    //return data.files.map((file) => `https://drive.google.com/file/d/${file.id}/view`);
    return data.files.map((file) => `${API_BASE_URL}/drive?id=${file.id}`);
    } catch (error) {
    console.error("Error fetching images from Drive folder:", error);
    return [];
  }
};
