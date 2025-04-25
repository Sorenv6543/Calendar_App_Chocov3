# Calendar App

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Testing

This project uses Vitest for unit testing. Tests are located in the `tests` directory.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Pre-Deployment Checklist

Before deploying the application, make sure to:

1. **Run tests** to ensure everything is working properly
   ```bash
   npm test
   ```

2. **Analyze bundle size** to identify performance issues
   ```bash
   npm run analyze
   ```

3. **Optimize images** in public directory
   - Convert to WebP format where possible
   - Compress images appropriately

4. **Build for production** with optimizations
   ```bash
   npm run build
   ```

5. **Preview the production build** to verify everything works
   ```bash
   npm run preview
   ```

## Performance Optimization

- The app uses code splitting by route for better performance
- Static assets are automatically optimized during build
- Console logs are removed in production builds
- Manual chunk splitting is configured for common libraries

## Deployment

Deploy the contents of the `dist` directory to your web server or hosting platform.

### Firebase Hosting Example

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (first time only)
firebase init hosting

# Deploy to Firebase
firebase deploy
``` 