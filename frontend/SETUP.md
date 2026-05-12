# Setup Instructions

The npm install commands are not producing output in this environment. Please follow these manual steps to install dependencies:

## Option 1: Using Command Prompt/PowerShell

Open a terminal in the `d:\DigitalWallet_Frontend` directory and run:

```bash
npm install
```

If that doesn't work, try:

```bash
npm install --verbose
```

Or try clearing npm cache:

```bash
npm cache clean --force
npm install
```

## Option 2: Using Yarn

If you have yarn installed:

```bash
yarn install
```

## Option 3: Manual Package Installation

If npm continues to have issues, install packages individually:

```bash
npm install react@18.3.1
npm install react-dom@18.3.1
npm install react-router-dom@6.23.0
npm install axios@1.7.2
npm install framer-motion@11.2.10
npm install react-hot-toast@2.4.1
npm install lucide-react@0.379.0
npm install -D @types/react@18.3.3
npm install -D @types/react-dom@18.3.0
npm install -D @vitejs/plugin-react@4.3.1
npm install -D autoprefixer@10.4.19
npm install -D postcss@8.4.38
npm install -D tailwindcss@3.4.3
npm install -D vite@5.2.11
```

## After Installation

Once dependencies are installed, start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Troubleshooting

If you encounter issues:

1. **Node.js version**: Ensure you have Node.js v16 or higher installed
   ```bash
   node --version
   ```

2. **NPM version**: Check npm version
   ```bash
   npm --version
   ```

3. **Delete node_modules and package-lock.json** if installation fails:
   ```bash
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

4. **Use a different registry** if the default is slow:
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```

## Backend Configuration

Make sure your Spring Boot backend is running on `http://localhost:8088`

If your backend is on a different port, update the `.env` file:

```
VITE_API_URL=http://your-backend-url:port/api
```
