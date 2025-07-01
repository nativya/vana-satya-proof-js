import express from 'express';
import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { Proof } from './proof';

const INPUT_DIR = 'input';
const OUTPUT_DIR = 'output';
const PORT = process.env.PORT || 3000;

function loadConfig() {
  return {
    dlp_id: 1234,
    input_dir: INPUT_DIR,
    user_email: process.env.USER_EMAIL || null,
  };
}

async function extractInput() {
  const files = fs.readdirSync(INPUT_DIR);
  for (const inputFilename of files) {
    const inputFile = path.join(INPUT_DIR, inputFilename);
    if (inputFilename.endsWith('.zip')) {
      await fs.createReadStream(inputFile)
        .pipe(unzipper.Extract({ path: INPUT_DIR }))
        .promise();
    }
  }
}

const app = express();

app.get('/generate-proof', async (req, res) => {
  try {
    const config = loadConfig();
    if (!fs.existsSync(INPUT_DIR) || fs.readdirSync(INPUT_DIR).length === 0) {
      return res.status(400).json({ error: `No input files found in ${INPUT_DIR}` });
    }
    await extractInput();
    const proof = new Proof(config);
    const proofResponse = await proof.generate();
    const outputPath = path.join(OUTPUT_DIR, 'results.json');
    fs.writeFileSync(outputPath, JSON.stringify(proofResponse, null, 2));
    res.json(proofResponse);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proof server running on port ${PORT}`);
}); 