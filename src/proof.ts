import fs from 'fs';
import path from 'path';
import { ProofResponse } from './models/proofResponse';
import { detectLanguagePercentage } from './utils';

export class Proof {
  config: any;
  proofResponse: ProofResponse;

  constructor(config: any) {
    this.config = config;
    this.proofResponse = new ProofResponse(config.dlp_id);
  }

  async generate(): Promise<ProofResponse> {
    const inputDir = this.config.input_dir;
    let totalHindiPercent = 0;
    let count = 0;
    let minPercent = 70; // Threshold for "high quality" Hindi
    let validResponses = 0;

    const files = fs.readdirSync(inputDir);
    for (const inputFilename of files) {
      const inputFile = path.join(inputDir, inputFilename);
      if (path.extname(inputFile).toLowerCase() === '.json') {
        const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
        if (Array.isArray(inputData)) {
          for (const entry of inputData) {
            if (entry.textContent && entry.languageCode) {
              const percent = detectLanguagePercentage(entry.textContent, entry.languageCode);
              totalHindiPercent += percent;
              count++;
              if (percent >= minPercent) validResponses++;
            }
          }
        }
      }
    }

    // Quality: average Hindi percentage across all responses
    this.proofResponse.quality = count > 0 ? totalHindiPercent / (count * 100) : 0;
    this.proofResponse.score = this.proofResponse.quality; // For now, score = quality
    this.proofResponse.valid = validResponses === count && count > 0; // All responses pass threshold
    this.proofResponse.authenticity = 0; // Not checked
    this.proofResponse.ownership = 0; // Not checked
    this.proofResponse.uniqueness = 0; // Not checked
    this.proofResponse.attributes = {
      total_responses: count,
      valid_responses: validResponses,
      min_percent: minPercent,
      average_hindi_percent: count > 0 ? totalHindiPercent / count : 0,
    };
    this.proofResponse.metadata = {
      dlp_id: this.config.dlp_id,
    };
    return this.proofResponse;
  }
} 