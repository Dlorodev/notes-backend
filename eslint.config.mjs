import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
    // Configuración base de ESLint
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.browser
        }
    },

    // Configuración de CommonJS
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs'
        }
    },

    // Ignorar la carpeta 'dist'
    {
        ignores: ['dist/']
    },

    // Configuración del plugin de estilos
    {
        files: ['**/*.js', '**/*.mjs'],
        plugins: {
            '@stylistic': stylistic,
        },
        // Eliminamos el `extends` para evitar el error
        rules: {
            // Usamos el prefijo '@stylistic' para las reglas
            '@stylistic/indent': ['error', 4],
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'never'],
        }
    }
])