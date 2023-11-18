export const checkForNullOrUndefinedKeys = (configObject: any) => {
  const nullOrUndefinedKeys = [];
  for (const section in configObject) {
    if (Object.hasOwnProperty.call(configObject, section)) {
      const sectionKeys = Object.keys(configObject[section]);
      for (const key of sectionKeys) {
        if (
          configObject[section][key] === null ||
          configObject[section][key] === undefined ||
          configObject[section][key] === ""
        ) {
          nullOrUndefinedKeys.push(`${section}.${key}`);
        }
      }
    }
  }
  return nullOrUndefinedKeys;
};

export const generateRandomUsername = () => {
  const adjectives = [
    "happy",
    "sunny",
    "playful",
    "creative",
    "smart",
    "kind",
    "funny",
    "energetic",
    "brilliant",
    "gentle",
  ];
  const nouns = [
    "cat",
    "dog",
    "bird",
    "tree",
    "flower",
    "star",
    "moon",
    "ocean",
    "mountain",
    "river",
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 10000);

  return `${randomAdjective}-${randomNoun}${randomNumber}`;
};
