import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import styleImport, {AntdResolve} from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
      react(),
      //  使用Table组件时出错
      // styleImport({
      //     resolves: [
      //         AntdResolve()
      //     ],
      // }),
    ],
    server: {
        port: 8080,
        strictPort:true
    }
})
