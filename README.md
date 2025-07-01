# Vana Satya Proof of Contribution - TypeScript/Node.js Template

This repository is a TypeScript/Node.js port of the original Python template for creating [proof of contribution](https://docs.vana.org/docs/proof-of-contribution/) tasks. It uses Express for the server and is designed to run in a containerized environment, such as Vana's Satya Network.

## Overview

This template provides a basic structure for building proof tasks that:

1. Read input files from the `/input` directory.
2. Process the data securely, running any necessary validations to prove the data authentic, unique, high quality, etc.
3. Write proof results to the `/output/results.json` file in the following format:

```json
{
  "dlp_id": 1234,
  "valid": false,
  "score": 0.7614457831325301,
  "authenticity": 1.0,
  "ownership": 1.0,
  "quality": 0.6024096385542169,
  "uniqueness": 0,
  "attributes": {
    "total_score": 0.5,
    "score_threshold": 0.83,
    "email_verified": true
  },
  "metadata": {
    "dlp_id": 1234
  }
}
```

## Project Structure

- `src/`: Contains the main proof logic
    - `proof.ts`: Implements the proof generation logic
    - `main.ts`: Express server entry point
    - `models/`: Data models for the proof system
- `input/`: Contains sample input files for testing
- `output/`: Results output from the container is written here
- `Dockerfile`: Defines the container image for the proof task
- `package.json`, `tsconfig.json`: Node.js/TypeScript configuration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Run the server:
   ```bash
   npm start
   ```
4. Generate a proof (after placing input files in `/input`):
   ```bash
   curl http://localhost:3000/generate-proof
   ```

## Docker Usage

To build and run the container:

```bash
docker build -t my-proof .
docker run \
  --rm \
  --volume $(pwd)/input:/app/input \
  --volume $(pwd)/output:/app/output \
  --env USER_EMAIL=user123@gmail.com \
  -p 3000:3000 \
  my-proof
```

## Environment Variables

- `USER_EMAIL`: The email address of the data contributor, to verify data ownership
- `PORT`: (optional) The port for the Express server (default: 3000)

## Security Features

- **Hardware-based Isolation**: Can run inside a TDX-protected environment
- **Input/Output Isolation**: Input and output directories are mounted separately
- **Minimal Container**: Uses a minimal Node.js base image

## Customization

Modify `src/proof.ts` to implement your specific proof logic. The structure is designed for easy extensibility and future type safety.

## License

[MIT License](LICENSE)