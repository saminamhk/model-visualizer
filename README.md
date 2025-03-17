# Kontent.ai Model Visualizer

A visualization tool for Kontent.ai content models that helps you understand and explore the relationships between your content types.

## Features

- Interactive graph visualization of content types and their relationships
- Expand/collapse nodes to view element details
- Filter rich text relationships
- Isolate specific content types and their connections
- Export the model diagram to PDF
- Search and filter content types
- Responsive sidebar for easy navigation

## Quick Deploy on Netlify

Clicking on the below button will guide you through the deployment process and also create a copy of the repository in your account.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/model-visualizer#NODE_VERSION=20&AWS_LAMBDA_JS_RUNTIME=nodejs20.x)

### Configuration

1. After deployment, set up the following environment variable in your Netlify project settings:
   - `MAPI_KEY`: Your Kontent.ai Management API key with `Manage content model` permission

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MAPI_KEY=your_management_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Navigate to your deployed instance or local development server
2. The tool will automatically load your content model
3. Use the toolbar to:
   - Expand/collapse all nodes
   - Toggle rich text relationships
   - Reset the view
   - Export to PDF
4. Click on nodes to expand/collapse them
5. Use the sidebar to search and navigate content types

## Technical Notes

- Built with React and TypeScript
- Uses React Flow for graph visualization
- Implements Netlify Functions for API communication
- Tailwind CSS for styling

## License

MIT