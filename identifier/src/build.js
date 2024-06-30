// build.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { identifierTypeDescriptions } from './identifierTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname);
const distDir = path.join(__dirname, '../dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const identifierTypes = Object.keys(identifierTypeDescriptions);

// Generate JSDoc comments
const jsDocComments = identifierTypes.map(type => {
  return ` * @property {() => string} ${type} - ${identifierTypeDescriptions[type]}`;
}).join('\n');

// Generate identifierTypes array and JSDoc for identifier.js
const identifierTypesContent = `
/**
 * Generated by build script
 * Contains identifier types and generator functions
 * 
${jsDocComments}
 */
const identifierTypes = ${JSON.stringify(identifierTypes)};
const identifierTypesSet = new Set(identifierTypes);
`;

// Read identifier.js
const identifierContent = fs.readFileSync(path.join(srcDir, 'identifier.js'), 'utf8');

// create CJS version of identifier.js
const cjsContent = 
`${identifierTypesContent}

let generateId;

// Load nanoid dynamically
const loadNanoid = async () => {
  const { customAlphabet } = await import('nanoid');
  generateId = customAlphabet(HELLO_ALPHABET, 27);
};

loadNanoid(); // Call the function to load nanoid immediately


${identifierContent}

module.exports = generators;`;

// create ESM version of identifier.js
const mjsContent = 
`${identifierTypesContent}
import { customAlphabet } from 'nanoid';
const generateId = customAlphabet(HELLO_ALPHABET, 27);

${identifierContent}

export default generators;`;

fs.writeFileSync(path.join(distDir, 'identifier.cjs'), cjsContent, 'utf8');
fs.writeFileSync(path.join(distDir, 'identifier.mjs'), mjsContent, 'utf8');

// Generate TypeScript definition file
const tsDefFileContent = `
// Generated by build script

type IdentifierType = ${identifierTypes.map(type => `'${type}'`).join(' | ')};

type Generators = {
    [key in IdentifierType]: () => string;
} & {
    validate: (identifier: string) => boolean;
};

declare const generators: Generators;
export default generators;
`;

fs.writeFileSync(path.join(distDir, 'identifier.d.ts'), tsDefFileContent, 'utf8');