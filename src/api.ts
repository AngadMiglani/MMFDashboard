export const fetchDataFromSheet = async () => {
  try {
    const response = await (
      await fetch(
        "https://opensheet.elk.sh/1EHEvqbtoHtUvg10z05cMUw49Byty5NBChaAznNzIDLo/Sheet1"
      )
    ).json();

    return response.map(({ name, latitude, longitude, status, area, numsaplings, plantationdate, image, ...props }) => ({
      name: name || "Unknown", // Provide a default value if name is not present
      latitude: latitude ? parseFloat(latitude) : 0, // Default to 0 if latitude is not present
      longitude: longitude ? parseFloat(longitude) : 0, // Default to 0 if longitude is not present
      status: status || "Unknown", // Provide a default value if status is not present
      area: area ? parseInt(area) : 0, // Default to 0 if area is not present
      numsaplings: numsaplings ? parseInt(numsaplings) : 0, // Default to 0 if numsaplings is not present
      plantationdate: plantationdate || "Unknown", // Provide a default value if plantationdate is not present
      imageUrls: image ? image.split(',') : [], // Split image URLs into an array or use an empty array if not present
      ...props,
    }));
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};

