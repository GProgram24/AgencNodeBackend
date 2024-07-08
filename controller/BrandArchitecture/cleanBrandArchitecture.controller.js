// Function to clean brand architecture
const cleanBrandArchitecture = (entity) => {
  const cleanedEntity = { ...entity._doc };
  for (const key in cleanedEntity) {
    if (Array.isArray(cleanedEntity[key]) && cleanedEntity[key].length === 0) {
      delete cleanedEntity[key];
    } else if (Array.isArray(cleanedEntity[key])) {
      cleanedEntity[key] = cleanedEntity[key].map((subEntity) =>
        cleanBrandArchitecture(subEntity)
      );
    }
  }
  return cleanedEntity;
};

export default cleanBrandArchitecture;
