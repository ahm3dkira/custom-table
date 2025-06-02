# Publishing Instructions for @ahmedkira/custom-view

This document provides step-by-step instructions for publishing your CustomView component to npm.

## Prerequisites

- Node.js and npm installed on your machine
- An npm account with the username @ahmedkira
- Being logged in to npm on your local machine

## Publishing Steps

1. **Extract the zip file** to a directory on your local machine

2. **Navigate to the extracted directory** in your terminal:
   ```
   cd path/to/extracted/custom-view-component
   ```

3. **Log in to npm** (if you haven't already):
   ```
   npm login
   ```
   Enter your username (@ahmedkira), password, and email when prompted.

4. **Publish the package**:
   ```
   npm publish
   ```
   Since the package.json already includes `"publishConfig": { "access": "public" }`, the package will be published with public access.

5. **Verify the publication** by checking your npm profile or running:
   ```
   npm view @ahmedkira/custom-view
   ```

## Using the Published Package

Once published, you can install and use your component in any React project:

```bash
npm install @ahmedkira/custom-view
```

```jsx
import CustomView from '@ahmedkira/custom-view';

// Example usage
const MyComponent = () => {
  const values = {
    name: 'John Doe',
    email: 'john@example.com',
    website: 'https://example.com',
    isActive: true,
    languages: { en: 'English', ar: 'Arabic' }
  };

  const tableProps = [
    { id: 'name', prop: 'name', label: 'Name', view: 1 },
    { id: 'email', prop: 'email', label: 'Email', view: 1 },
    { id: 'website', prop: 'website', label: 'Website', type: 'url', view: 1 },
    { id: 'isActive', prop: 'isActive', label: 'Active', view: 1 },
    { id: 'languages', prop: 'languages', label: 'Languages', type: 'lang', view: 1 }
  ];

  return <CustomView values={values} tableProps={tableProps} />;
};
```

## Package Information

- **Name**: @ahmedkira/custom-view
- **Version**: 1.0.0
- **Main**: dist/index.js
- **Module**: dist/index.esm.js
- **Types**: dist/index.d.ts

## Updating the Package

To update the package in the future:

1. Make your changes to the code
2. Update the version number in package.json
3. Run `npm run build` to rebuild the package
4. Run `npm publish` to publish the updated version
