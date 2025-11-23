import { spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { TestRequestDto } from './dto/test-request.dto';
import { TestResponseDto } from './dto/test-response.dto';
import { EvaluationRequestDto } from './dto/evaluation-request.dto';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';
import { plainToClass } from 'class-transformer';
import path from 'path';
import { promises as fs } from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';

@Injectable()
export class OpencvService {
  private async runPythonScript(scriptPath: string, args: string[] = []): Promise<string> {
    const pythonBin = process.platform === 'win32'
      ? path.join('python', 'venv', 'Scripts', 'python.exe')
      : path.join('python', 'venv', 'bin', 'python');

    return new Promise((resolve, reject) => {
      const py = spawn(pythonBin, [scriptPath, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (data) => { stdout += data.toString(); });
      py.stderr.on('data', (data) => { stderr += data.toString(); });

      py.on('error', (err) => reject(new Error(`Failed to start Python process: ${err.message}`)));

      py.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${stderr || 'No error message'}`));
        }
        resolve(stdout);
      });
    });
  }

  async test(evalReq: TestRequestDto): Promise<TestResponseDto> {
    const scriptPath = path.resolve('./src/opencv/scripts/test.py');
    const output = await this.runPythonScript(scriptPath);
    return { message: output };
  }

  async testOpencv(evalReq: TestRequestDto): Promise<TestResponseDto> {
    const scriptPath = path.resolve('./python/scripts/test.py');
    const output = await this.runPythonScript(scriptPath);
    return { message: output };
  }

  async evaluate(evalReq: EvaluationRequestDto): Promise<EvaluationResponseDto> {
    if (!evalReq.file) throw new Error("No file provided");

    let tempFilePath: string;
    let wroteTempFile = false;

    if (evalReq.file.path) {
      tempFilePath = evalReq.file.path;
    } else {
      const fileName = `${crypto.randomUUID()}_${evalReq.file.originalname}`;
      tempFilePath = path.join(os.tmpdir(), fileName);
      await fs.writeFile(tempFilePath, evalReq.file.buffer);
      wroteTempFile = true;
    }

    console.log("Python file path:", tempFilePath);

    try {
      const metadataPath = path.resolve('./python/scripts/metadata.py');
      const consistencyPath = path.resolve('./python/scripts/consistency.py');
      const textextractorPath = path.resolve('./python/scripts/textextractor.py');
      const visualForensicsPath = path.resolve('./python/scripts/visualforensics.py');

      return plainToClass(EvaluationResponseDto, { 
  metadata: {
    score: 20,
    notes: [
      "File metadata is minimal and lacks descriptive EXIF or authoring information.",
      "Absence of camera or device identifiers reduces confidence in the document’s origin.",
      "Timestamps appear generic and provide no meaningful traceability."
    ],
  },
  contentIntegrity: {
    score: 40,
    notes: [
      "Text structure is mostly coherent but contains inconsistencies in formatting.",
      "Detected regions show minor anomalies that may result from recompression or editing.",
      "No strong indicators of content tampering, but certain areas warrant closer inspection."
    ],
  },
  visualForensics: {
    score: 50,
    notes: [
      "Edges and textures appear mostly consistent, though some sections show irregular noise patterns.",
      "Lighting distribution is generally uniform with slight deviations suggesting localized modifications.",
      "Compression artifacts are present but within expected ranges for the file type."
    ],
  },
  consistency: {
    score: 90,
    notes: [
      "Style and layout differ across sections, reducing overall document uniformity.",
      "Minor alignment issues indicate the content may have been assembled from multiple sources.",
      "Internal references and formatting conventions are not consistently followed."
    ],
  },
});

    } finally {
      if (wroteTempFile) {
        await fs.unlink(tempFilePath).catch(() => {});
      }
    }
  }
}
