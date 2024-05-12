export const fetchDataFromSheet = async () => {
  try {
    const response = await (
      await fetch(
        "https://opensheet.elk.sh/1EHEvqbtoHtUvg10z05cMUw49Byty5NBChaAznNzIDLo/Sheet1"
      )
    ).json();

    return response.map(({ name, latitude, longitude, status, ...props }) => ({
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status: String(status),
      area: parseInt(area),
      numsaplings: parseInt(NumSaplings),
      plantationdate: String(PlantationDate),
      ...props,
    }));
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
};
