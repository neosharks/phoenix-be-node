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
