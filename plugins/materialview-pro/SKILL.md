# MaterialView Pro — StoryForge Plugin

## Description
Simulate materials on surfaces using AI. Upload an image, apply marble/wood/ceramic textures, and get photorealistic results with invariant validation.

## Usage
1. Upload an image of a surface (floor, wall, furniture, etc.)
2. Select material type (marble, wood, ceramic, granite, concrete, metal, glass)
3. Choose color and dimensions
4. The plugin applies the material with AI, preserving shadows, geometry, and perspective

## Inputs
- `image` (file, required): Source image to apply material to
- `material_type` (select, required): marble | wood | ceramic | granite | concrete | metal | glass
- `material_color` (string, required): Color of the material (e.g. "white", "dark", "beige")
- `surface_type` (select): floor | wall | ceiling | furniture | car-body (default: floor)
- `dimensions` (select): 30x30cm | 60x60cm | 90x90cm (default: 60x60cm)

## MCP Server
This plugin requires the MaterialView-Pro MCP server running at `http://localhost:4000`.

Start the server:
```bash
cd MaterialView-Pro/backend
npm install
npm start
```

## API Endpoints
- `POST /api/simulate` — Apply material to image
- `GET /api/simulate/:jobId/status` — Poll async job
- `POST /api/analyze` — Analyze scene (lighting, objects)
- `POST /api/validate` — Validate invariants (shadows, geometry, perspective)

## Invariant Validation
The plugin validates four invariants after simulation:
1. **Shadows**: Preserved shadow patterns
2. **Geometry**: Geometric integrity maintained
3. **Objects**: Object consistency preserved
4. **Perspective**: Perspective coherence maintained

## Credit System
Uses the unified StoryForge billing system. Each simulation consumes 1 credit from the MaterialView allocation.
