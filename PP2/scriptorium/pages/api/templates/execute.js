// This file was created with the assistance of GPT-4

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const executeCode = (code, language, input) => {
  return new Promise((resolve, reject) => {
    let fileName;
    if (language === 'java') {
      const classNameMatch = code.match(/public\s+class\s+(\w+)/);
      if (!classNameMatch) {
        return reject('Invalid Java code: No public class found');
      }
      const className = classNameMatch[1];
      fileName = `${className}.java`;
    } else {
      fileName = `code.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'c' ? 'c' : 'cpp'}`;
    }
    const filePath = path.join(process.cwd(), fileName);
    
    try {
      fs.writeFileSync(filePath, code);
    } catch (err) {
      return reject(`Error writing file: ${err.message}`);
    }

    let command;
    let args = [];
    let compiledFileName = '';
    
    switch (language.toLowerCase()) {
      case 'python':
        command = 'python3';
        args = [filePath];
        break;
      case 'javascript':
        command = 'node';
        args = [filePath];
        break;
      case 'java':
        command = 'javac';
        args = [filePath];
        compiledFileName = `${fileName.split('.')[0]}.class`;
        break;
      case 'c':
        command = 'gcc';
        compiledFileName = `${fileName.split('.')[0]}`;
        args = [filePath, '-o', compiledFileName];
        break;
      case 'cpp':
        command = 'g++';
        compiledFileName = `${fileName.split('.')[0]}`;
        args = [filePath, '-o', compiledFileName];
        break;
      default:
        cleanupFiles(filePath, compiledFileName);
        return reject('Unsupported language');
    }

    if (language === 'java' || language === 'c' || language === 'cpp') {
      const compile = spawn(command, args);
      compile.on('close', (code) => {
        if (code !== 0) {
          cleanupFiles(filePath, compiledFileName);
          return reject(`Compilation error: ${code}`);
        }
        if (language === 'java') {
          command = 'java';
          args = [fileName.split('.')[0], ...input.split(' ')];
        } else {
          command = `./${fileName.split('.')[0]}`;
          args = input.split(' ');
        }
        runCommand(command, args, input, filePath, compiledFileName, language, resolve, reject);
      });
    } else {
      runCommand(command, args, input, filePath, compiledFileName, language, resolve, reject);
    }
  });
};

const cleanupFiles = (filePath, compiledFileName) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    if (compiledFileName && fs.existsSync(compiledFileName)) {
      fs.unlinkSync(compiledFileName);
    }
  } catch (err) {
    console.error('Error cleaning up files:', err);
  }
};

const runCommand = (command, args, input, filePath, compiledFileName, language, resolve, reject) => {
  // Append input arguments for JavaScript
  if (language === 'javascript') {
    args = args.concat(input.split(' '));
  }

  console.log(`Running command: ${command} ${args.join(' ')}`);
  const child = spawn(command, args);
  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    cleanupFiles(filePath, compiledFileName);
    if (code !== 0) {
      reject(stderr);
    } else {
      resolve(stdout);
    }
  });

  // Handle multiple inputs for other languages
  if (input && language !== 'javascript' && language !== 'java') {
    const inputLines = Array.isArray(input) ? input.join('\n') : input;
    child.stdin.write(inputLines + '\n');
    child.stdin.end();
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { templateId, input } = req.body;

  if (!templateId) {
    return res.status(400).json({ error: 'Template ID is required' });
  }

  try {
    const template = await prisma.codeTemplate.findUnique({
      where: {
        id: templateId
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Code template not found' });
    }

    const output = await executeCode(template.content, template.language, input);
    
    res.status(200).json({
      output,
      template: {
        id: template.id,
        title: template.title,
        language: template.language
      }
    });

  } catch (error) {
    console.error("Error executing code:", error);
    res.status(400).json({ error: error.toString() });
  } finally {
    await prisma.$disconnect();
  }
}