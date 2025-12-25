import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // 递归复制目录
    function copyDirRecursive(src: string, dest: string) {
      if (!existsSync(src)) return;

      mkdirSync(dest, { recursive: true });

      const entries = readdirSync(src, { withFileTypes: true });

      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          copyDirRecursive(srcPath, destPath);
        } else if (entry.name.endsWith('.md')) {
          copyFileSync(srcPath, destPath);
          console.log(`Copied: ${srcPath} -> ${destPath}`);
        }
      }
    }

    return {
      base: '',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        {
          name: 'copy-docs',
          closeBundle() {
            const docsDir = path.resolve(__dirname, 'docs');
            const distDocsDir = path.resolve(__dirname, 'dist/docs');

            console.log('Copying docs directory...');
            copyDirRecursive(docsDir, distDocsDir);
            console.log('Docs copied successfully!');
          }
        }
      ],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
