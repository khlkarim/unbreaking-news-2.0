import { spawn } from 'child_process';
import { Injectable } from '@nestjs/common';
import { TestRequestDto } from './dto/test-request.dto';
import { TestResponseDto } from './dto/test-response.dto';
import path from 'path';
import { EvaluationRequestDto } from './dto/evaluation-request.dto';
import { EvaluationResponseDto } from './dto/evaluation-response.dto';
import { plainToClass } from 'class-transformer';

import { promises as fs } from 'fs';
import * as os from 'os';
import * as crypto from 'crypto';

@Injectable()
export class OpencvService {
  async test(evalReq: TestRequestDto): Promise<TestResponseDto> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ["./src/opencv/scripts/test.py"]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ message: output });
        } else {
          reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
        }
      });
    });
  }

  async testOpencv(evalReq: TestRequestDto): Promise<TestResponseDto> {
    return new Promise((resolve, reject) => {
      // Path to the Python inside your virtual environment
      const pythonBin = process.platform === 'win32'
        ? 'python/.venv/Scripts/python.exe'
        : 'python/.venv/bin/python';

      const scriptPath = "./python/scripts/test.py";

      const py = spawn(pythonBin, [scriptPath]);

      let out = '';
      let err = '';

      py.stdout.on('data', (data) => (out += data));
      py.stderr.on('data', (data) => (err += data));

      py.on('close', (code) => {
        if (code === 0) resolve({ message: out });
        else reject(new Error(err));
      });
    });
  }

  async evaluate(evalReq: EvaluationRequestDto): Promise<EvaluationResponseDto> {
    if (!evalReq.file) throw new Error("No file provided");

    const pythonBin = process.platform === 'win32'
      ? path.join('python', '.venv', 'Scripts', 'python.exe')
      : path.join('python', '.venv', 'bin', 'python');

    const scriptPath = path.resolve('./python/scripts/evaluate.py');

    // Create a temporary file path if not already saved
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

    return new Promise<EvaluationResponseDto>((resolve, reject) => {
      const py = spawn(pythonBin, [scriptPath, tempFilePath], { stdio: ['ignore', 'pipe', 'pipe'] });

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (data) => { stdout += data.toString(); });
      py.stderr.on('data', (data) => { stderr += data.toString(); });

      py.on('error', async (err) => {
        if (wroteTempFile) await fs.unlink(tempFilePath).catch(() => {});
        reject(new Error(`Failed to start Python process: ${err.message}`));
      });

      py.on('close', async (code) => {
        if (wroteTempFile) await fs.unlink(tempFilePath).catch(() => {});

        if (code !== 0) {
          return reject(new Error(`Python process exited with code ${code}: ${stderr || 'No error message'}`));
        }

        try {
          const result = plainToClass(EvaluationResponseDto, JSON.parse(stdout));
          resolve(result);
        } catch (err) {
          reject(new Error(`Failed to parse Python output: ${err instanceof Error ? err.message : err}`));
        }
      });
    });
  }
}
