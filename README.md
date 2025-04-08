# Kontent.ai Model Visualizer

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Discord][discord-shield]][discord-url]

A Kontent.ai custom application for content model visualization, allowing you to explore the relationships between your content types and other entities.

## Contents
- [Quick Deploy on Netlify](#quick-deploy-on-netlify)
- [Configuration](#configuration)
  - [Embedding the Custom App](#embedding-the-custom-app)
  - [Layout Configuration](#layout-configuration)
- [Features](#features)
  - [Interactive Content Model View](#interactive-content-model-view)
    - [Default (Content Type) View](#default-content-type-view)
    - [Snippet View](#snippet-view)
    - [Taxonomy View](#taxonomy-view)
  - [Sidebar and Search](#sidebar-and-search)
  - [Model Import & Export](#model-import--export)
- [API Consumption](#api-consumption)
- [Local Development](#local-development)
  - [Running the App Locally](#running-the-app-locally)
  - [Extending Views](#extending-views)
- [Performance Considerations](#performance-considerations)
- [Technical Notes](#technical-notes)
- [License](#license)
- [Support](#support)
- [Additional Resources](#additional-resources)

## Quick Deploy on Netlify

Clicking on the below button will guide you through the deployment process and also create a copy of the repository in your account.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/model-visualizer#NODE_VERSION=20&AWS_LAMBDA_JS_RUNTIME=nodejs20.x)

> [!IMPORTANT]  
> Setting/changing an environment variable does not take effect until next site deploy.
>
> Make sure you manually trigger re-deploy once you set the `MAPI_KEY` variable.

## Configuration

### Embedding the custom app
After deployment, set up the following environment variable in your Netlify project settings:
   - `MAPI_KEY`: Your Kontent.ai Management API key with `Manage content model` permission

Afterwards, create a new custom app in Kontent.ai under **Environment settings → Custom Apps** and pass the URL of your deployed application to **Hosted code URL (HTTPS)** field.

### Layout Configuration
The visualization layout can be customized by modifying the `layoutConfig` object. The following options are available:

| Option | Default | Available Values | Description |
|--------|---------|-----------------|-------------|
| edgeType | `default` | `default`, `straight`, `smoothstep`, `step` | Shape of the edge connecting nodes. `default` is a bezier curve. |
| alignment | `DL` | `UL`, `UR`, `DL`, `DR` | Node alignment within ranks. `UL` = up-left, `UR` = up-right, `DL` = down-left, `DR` = down-right |
| rankDirection | `TB` | `TB`, `LR` | Direction of the graph layout. `TB` = top to bottom, `LR` = left to right |
| ranker | `network-simplex` | `network-simplex`, `tight-tree`, `longest-path` | Algorithm used for ranking nodes. Network-simplex generally gives the best results |
| acyclicer | `none` | `greedy`, `none` | Method to handle cyclic relationships. `greedy` attempts to minimize edge crossings and may result in a more compact graph. |
| nodeSeparation | 60 | number (pixels) | Horizontal spacing between nodes at the same rank |
| rankSeparation | 200 | number (pixels) | Vertical spacing between ranks (levels) in the graph |

To modify these settings, update the `layoutConfig` object under [utils/config.ts](./src/utils/config.ts):

```typescript
// utils/config.ts
export const layoutConfig: Readonly<LayoutConfig> = {
  edgeType: "default",
  alignment: "UL",
  rankDirection: "LR",
  ranker: "network-simplex",
  acyclicer: "none",
  nodeSeparation: 60,
  rankSeparation: 200,
};
```

## Features

### Interactive content model view

The custom app retrieves content model entities (types, snippets and taxonomies) via management API and renders them as interactive nodes into a React Flow canvas, automatically layouted using Dagre layouting library. There are three selectable views, each with a specific purpose:

#### Default (content type) view 
Renders all content types defined in your environment and their relationships with each other based on allowed types configured in **Linked items** and optionally **Rich text** elements.

![image](https://github.com/user-attachments/assets/f3410193-6c90-4570-8e6d-650b45f840c1)

#### Snippet view
This view renders separate nodes for Snippets and Types and allows you to see where each snippet is used. Content types without snippet elements are hidden.

![image](https://github.com/user-attachments/assets/b2f049ab-a5a0-4ee8-830d-a49af30b5737)

#### Taxonomy view
Similarly to the snippet view, renders Taxonomy nodes and edges to the Content type nodes the taxonomies are used in. Types without taxonomies are omitted.

![image](https://github.com/user-attachments/assets/a75f6b23-2728-4a2b-ace6-d3af37501590)

### Sidebar and search

Each view comes with a collapsible sidebar, which dynamically lists the entities currently on the canvas, grouped by their type. Each sidebar entry serves as a shortcut to its corresponding node and also provides the same tools. For convenience, a search bar is also included.

### Model import & export

The app allows you to export your content model to a JSON file and load it later. This way you can explore models from earlier or from a completely different environment; or perhaps store a snapshot of your content model for versioning purposes. The exported file matches management API response format.

## API Consumption

Although the extent is minimal, the app makes use of Management API and thus contributes to your MAPI calls quota. In an ideal scenario, **each initial load of the application performs exactly three listing requests**, one for each entity. 

If the number of types, taxonomies or snippets in your environment exceeds the point where pagination is required, the number of requests increases accordingly.

The loaded entities are memoized for the app's lifecycle, only triggering a re-request if the application or the window it's hosted in is reloaded.

## Local Development

### Running the app locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Create a `.env` file in the root directory with:
   ```
   MAPI_KEY=your_management_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev:functions
   
   # or

   npm run dev:functions:live
   ```
   - the latter option creates a live tunnel URL you can use to embed the developed custom app into Kontent.ai and observe the changes in real time (refresh needed for changes to take effect). Requires running `netlify link` first.

### Extending views

To create your own view, you need to implement a `ViewRenderer` type, consisting of two methods – `createNodes` and `createEdges` – returning an array of `Node` and `Edge` respectively. When creating a node, its `type` property should point to an existing (or your own) custom node defined in `nodeTypes` property under [utils/layout.ts](./src/utils/layout.ts#L19).

The view then needs to be added to `views` constant under [components/views/views.ts](./src/components/views/views.ts#L17) file, specifying its data and the renderer you created.

Use existing renderer and node implementations for reference.

## Performance considerations

The app uses [Dagre](https://github.com/dagrejs/dagre) algorithm for automatic graph layout. The algorithm typically has a time complexity of $O(V+E)$ where V is the number of nodes and E is the number of edges, making it reasonably efficient for moderately sized content models.

Since the tool runs entirely in the browser, its performance is influenced by the client’s hardware and browser capabilities.

## Technical Notes

- Built with React and TypeScript
- Uses [React Flow](https://reactflow.dev/) for graph visualization
- [Dagre](https://github.com/dagrejs/dagre) algorithm used for automatic layouting
- Implements Netlify Functions for API communication
- Tailwind CSS for styling

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.

## Support

If you have any questions or need assistance, please reach out:

- **Kontent.ai Support**: [Contact Support](https://kontent.ai/contact/)

## Additional Resources

- **Kontent.ai Official Documentation**: [Learn more about Kontent.ai](https://kontent.ai/learn/)

[contributors-shield]: https://img.shields.io/github/contributors/kontent-ai/model-visualizer.svg?style=for-the-badge
[contributors-url]: https://github.com/kontent-ai/model-visualizer/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/kontent-ai/model-visualizer.svg?style=for-the-badge
[forks-url]: https://github.com/kontent-ai/model-visualizer/network/members
[stars-shield]: https://img.shields.io/github/stars/kontent-ai/model-visualizer.svg?style=for-the-badge
[stars-url]: https://github.com/kontent-ai/model-visualizer/stargazers
[issues-shield]: https://img.shields.io/github/issues/kontent-ai/model-visualizer.svg?style=for-the-badge
[issues-url]: https://github.com/kontent-ai/model-visualizer/issues
[license-shield]: https://img.shields.io/github/license/kontent-ai/model-visualizer.svg?style=for-the-badge
[license-url]: https://github.com/kontent-ai/model-visualizer/blob/main/LICENSE.md
[discord-shield]: https://img.shields.io/discord/821885171984891914?color=%237289DA&label=Kontent.ai%20Discord&logo=discord&style=for-the-badge
[discord-url]: https://discord.com/invite/SKCxwPtevJ
