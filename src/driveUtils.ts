export const fetchImagesFromDriveFolder = async (folderUrl: string, apiKey: string) => {
    try {
      // Extract the folder ID from the URL
      const folderIdMatch = folderUrl.match(/[-\w]{25,}/);
      if (!folderIdMatch) throw new Error("Invalid Google Drive folder URL.");
      const folderId = folderIdMatch[0];
  
      // Fetch file list from Google Drive API
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`
      );
  
      const data = await response.json();
  
      // Filter for image files (jpg, jpeg, png)
      const imageFiles = data.files.filter((file) =>
        file.mimeType.startsWith("image/")
      );
  
      // Construct public URLs
      return imageFiles.map((file) => `https://drive.google.com/uc?export=view&id=${file.id}`);
    } catch (error) {
      console.error("Failed to fetch images from Drive:", error);
      return [];
    }
  };
  