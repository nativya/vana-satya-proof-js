export class ProofResponse {
  dlp_id: number;
  valid: boolean = false;
  score: number = 0.0;
  authenticity: number = 0.0;
  ownership: number = 0.0;
  quality: number = 0.0;
  uniqueness: number = 0.0;
  attributes?: Record<string, any> = {};
  metadata?: Record<string, any> = {};

  constructor(dlp_id: number) {
    this.dlp_id = dlp_id;
  }
} 