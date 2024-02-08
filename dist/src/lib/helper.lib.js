"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomUsername = exports.generateOtp = exports.checkForNullOrUndefinedKeys = void 0;
const checkForNullOrUndefinedKeys = (configObject) => {
    const nullOrUndefinedKeys = [];
    for (const section in configObject) {
        if (Object.hasOwnProperty.call(configObject, section)) {
            const sectionKeys = Object.keys(configObject[section]);
            for (const key of sectionKeys) {
                if (configObject[section][key] === null ||
                    configObject[section][key] === undefined ||
                    configObject[section][key] === "") {
                    nullOrUndefinedKeys.push(`${section}.${key}`);
                }
            }
        }
    }
    return nullOrUndefinedKeys;
};
exports.checkForNullOrUndefinedKeys = checkForNullOrUndefinedKeys;
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
exports.generateOtp = generateOtp;
const generateRandomUsername = () => {
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
exports.generateRandomUsername = generateRandomUsername;
