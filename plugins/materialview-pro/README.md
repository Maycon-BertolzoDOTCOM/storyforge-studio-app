# MaterialView Pro — StoryForge Plugin

AI-powered material simulation for surfaces. Apply marble, wood, ceramic, and other textures to images with photorealistic results.

## Features

- **7 Material Types**: Marble, Wood, Ceramic, Granite, Concrete, Metal, Glass
- **5 Surface Types**: Floor, Wall, Ceiling, Furniture, Car Body
- **Invariant Validation**: Shadows, Geometry, Objects, Perspective
- **Async Jobs**: Non-blocking simulation with polling
- **Credit System**: Integrated with StoryForge billing

## Installation

### Via StoryForge Studio
1. Open StoryForge Studio
2. Go to Plugins → Install
3. Enter: `github:Maycon-BertolzoDOTCOM/MaterialView-Pro`
4. Click Install

### Via CLI
```bash
od plugins install github:Maycon-BertolzoDOTCOM/MaterialView-Pro
```

### Manual
```bash
cd plugins
git clone https://github.com/Maycon-BertolzoDOTCOM/MaterialView-Pro.git
```

## Configuration

### MCP Server
The plugin requires MaterialView-Pro backend running:

```bash
cd MaterialView-Pro/backend
npm install
npm start
```

Default URL: `http://localhost:4000`

### API Key (Optional)
For production use, set an API key:

```bash
export MATERIALVIEW_API_KEY=your-api-key
```

## Usage

### In StoryForge Studio
1. Click the MaterialView Pro plugin in the sidebar
2. Upload an image
3. Select material type, color, and surface
4. Click "Simulate"
5. View results with invariant scores

### Via API
```typescript
import { createMaterialViewPlugin } from "./plugins/materialview-pro";

const mv = createMaterialViewPlugin({
  apiUrl: "http://localhost:4000",
});

const result = await mv.simulate({
  image: base64Image,
  materialType: "marble",
  materialColor: "white",
  surfaceType: "floor",
});

console.log(result.fidelity); // 0.85
console.log(result.invariantResult.scores); // { shadows: 0.92, ... }
```

## Invariant Scores

| Invariant | Threshold | Description |
| :--- | :--- | :--- |
| Shadows | ≥ 0.70 | Preserved shadow patterns |
| Geometry | ≥ 0.80 | Geometric integrity maintained |
| Objects | ≥ 0.75 | Object consistency preserved |
| Perspective | ≥ 0.85 | Perspective coherence maintained |

## License

MIT
