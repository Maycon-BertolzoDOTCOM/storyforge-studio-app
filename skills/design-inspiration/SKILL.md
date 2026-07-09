# Design Inspiration Skill

This skill generates designs based on knowledge ingested from YouTube design channels.

## When to Use

- User requests a landing page "inspired by" a specific YouTube channel
- User wants to apply design principles from ingested content
- User asks for design recommendations based on competitor analysis

## Workflow

### 1. Identify Inspiration Source

When user mentions a channel name or URL:
- Search the KnowledgeDB for matching channels
- If found, retrieve design insights (palettes, principles, typography)
- If not found, suggest ingesting the channel first

### 2. Extract Design Elements

From the ingested knowledge, extract:

| Element | Source | Application |
|:---|:---|:---|
| **Color Palette** | `colorPalette` from video analysis | Primary/secondary/accent colors |
| **Typography** | `typographySuggestions` | Font families, weights, sizes |
| **Layout Patterns** | `layoutPatterns` | Grid systems, spacing rules |
| **Mood Keywords** | `moodKeywords` | Visual tone and atmosphere |
| **Design Principles** | `designPrinciples` | Rules to follow/avoid |

### 3. Generate Design System

Create a design system based on extracted insights:

```json
{
  "colors": {
    "primary": "<from palette>",
    "secondary": "<from palette>",
    "accent": "<from palette>",
    "background": "<derived from mood>",
    "text": "<contrast-optimized>"
  },
  "typography": {
    "heading": "<from suggestions>",
    "body": "<from suggestions>",
    "scale": "1.25 (major third)"
  },
  "spacing": {
    "unit": "8px",
    "patterns": "<from layoutPatterns>"
  },
  "mood": "<from moodKeywords>"
}
```

### 4. Apply to Generation

When generating the landing page:
- Use the extracted color palette as the base
- Apply typography suggestions for headings and body
- Follow layout patterns for component placement
- Maintain the mood/tone throughout the copy
- Respect design principles (e.g., "use 8px grid")

## Example Usage

### User Request
> "Create a landing page inspired by the 'Design com IA' YouTube channel"

### Skill Execution

1. **Query KnowledgeDB**:
   ```sql
   SELECT * FROM channels WHERE name LIKE '%Design com IA%'
   ```

2. **Get Design Insights**:
   ```sql
   SELECT v.design_tags, v.color_palette 
   FROM videos v 
   WHERE v.channel_id = ? 
   ORDER BY v.scraped_at DESC 
   LIMIT 5
   ```

3. **Merge Insights**:
   - Primary color: #1E3A5F (most frequent from palette)
   - Secondary: #F5F5F5
   - Accent: #FF6B35
   - Typography: Inter (headings), system-ui (body)
   - Mood: "professional", "technical", "modern"

4. **Generate Design System**:
   ```json
   {
     "colors": {
       "primary": "#1E3A5F",
       "secondary": "#F5F5F5",
       "accent": "#FF6B35"
     },
     "typography": {
       "heading": "Inter",
       "body": "system-ui"
     }
   }
   ```

5. **Apply to Landing Page**:
   - Hero section with primary color background
   - Cards with secondary color
   - CTA buttons with accent color
   - Professional, technical tone in copy

## Advanced Features

### Multi-Channel Inspiration

Combine insights from multiple channels:
- Query multiple channels from KnowledgeDB
- Merge color palettes (weighted by relevance)
- Combine typography suggestions
- Blend mood keywords

### Trend Analysis

Use temporal data to identify trends:
- Compare insights across time periods
- Identify emerging design patterns
- Track color/typography trends

### Competitor Differentiation

Generate designs that differentiate from competitors:
- Analyze competitor palettes
- Avoid overused colors/patterns
- Find gaps in design approaches

## Integration Points

### With MaterialView-Pro

When simulating materials:
- Use ingested color palettes for material colors
- Apply design principles for surface selection
- Match mood keywords for texture choices

### With StoryForge Engine

When generating layouts:
- Apply layout patterns from ingested content
- Use typography suggestions for text hierarchy
- Follow design principles for component spacing

### With Billing System

Track usage:
- Count inspirations per channel
- Measure design quality scores
- Monitor credit consumption

## API Endpoints

### Get Channel Insights
```
GET /api/ingest/insights/:channelId
```

### Search by Design Style
```
GET /api/ingest/search?style=minimalist&colors=blue
```

### Get Recommendations
```
POST /api/ingest/recommend
{
  "industry": "jewelry",
  "mood": "luxurious",
  "excludeChannels": ["channel-id-1"]
}
```

## Limitations

- Insights are only as good as the ingested content
- Some channels may not have design-relevant content
- Color extraction depends on video quality
- Typography suggestions are text-based (no visual analysis)

## Future Enhancements

- Visual analysis of video frames for color extraction
- Font recognition from on-screen text
- Layout analysis from screenshots
- Real-time trend tracking
