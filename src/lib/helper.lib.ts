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

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
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

export const generateRandomAlpaNumberic = (size: number, type: string = "NUMCAPLOW") => {
  let characters = "";
  if (type.includes("NUM")) characters += "0123456789";
  if (type.includes("CAP")) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (type.includes("LOW")) characters += "abcdefghijklmnopqrstuvwxyz";

  let result = "";
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
