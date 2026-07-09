export interface NoteGPTConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  timeout?: number;
}

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export interface TranscriptResult {
  videoId: string;
  title: string;
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
}

export interface SummaryResult {
  videoId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
  model: string;
}

export interface DesignInsights {
  colorPalette: string[];
  designPrinciples: string[];
  typographySuggestions: string[];
  layoutPatterns: string[];
  moodKeywords: string[];
}

export class NoteGPTClient {
  private config: NoteGPTConfig;

  constructor(config: NoteGPTConfig = {}) {
    this.config = {
      baseUrl: "https://notegpt.io/api",
      model: "deepseek",
      timeout: 60000,
      ...config,
    };
  }

  async getTranscript(videoId: string): Promise<TranscriptResult> {
    const resp = await fetch(`${this.config.baseUrl}/transcript/${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!resp.ok) {
      throw new Error(`NoteGPT transcript error ${resp.status}`);
    }

    const data = await resp.json();

    const segments: TranscriptSegment[] =
      data.segments?.map((s: any) => ({
        text: s.text || "",
        start: s.start || 0,
        duration: s.duration || 0,
      })) || [];

    return {
      videoId,
      title: data.title || "",
      segments,
      fullText: segments.map((s) => s.text).join(" "),
      language: data.language || "en",
    };
  }

  async summarize(
    text: string,
    options: { maxLength?: number; style?: string } = {}
  ): Promise<SummaryResult> {
    const resp = await fetch(`${this.config.baseUrl}/summarize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model: this.config.model,
        maxLength: options.maxLength || 500,
        style: options.style || "concise",
      }),
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!resp.ok) {
      throw new Error(`NoteGPT summarize error ${resp.status}`);
    }

    const data = await resp.json();

    return {
      videoId: data.videoId || "",
      title: data.title || "",
      summary: data.summary || "",
      keyPoints: data.keyPoints || [],
      tags: data.tags || [],
      model: this.config.model || "deepseek",
    };
  }

  async extractDesignInsights(text: string): Promise<DesignInsights> {
    const prompt = `Analyze this design-related text and extract:
1. Color palette (exact hex codes if mentioned)
2. Design principles (specific rules/guidelines)
3. Typography suggestions (font families, sizes, weights)
4. Layout patterns (grid systems, spacing)
5. Mood keywords (adjectives describing the aesthetic)

Text: ${text}

Return as JSON with these exact keys:
{
  "colorPalette": [],
  "designPrinciples": [],
  "typographySuggestions": [],
  "layoutPatterns": [],
  "moodKeywords": []
}`;

    const resp = await fetch(`${this.config.baseUrl}/summarize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        model: this.config.model,
        maxLength: 1000,
      }),
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!resp.ok) {
      throw new Error(`NoteGPT extract error ${resp.status}`);
    }

    const data = await resp.json();

    try {
      const parsed = JSON.parse(data.summary || "{}");
      return {
        colorPalette: parsed.colorPalette || [],
        designPrinciples: parsed.designPrinciples || [],
        typographySuggestions: parsed.typographySuggestions || [],
        layoutPatterns: parsed.layoutPatterns || [],
        moodKeywords: parsed.moodKeywords || [],
      };
    } catch {
      return {
        colorPalette: [],
        designPrinciples: [],
        typographySuggestions: [],
        layoutPatterns: [],
        moodKeywords: [],
      };
    }
  }

  async processVideo(videoId: string): Promise<{
    transcript: TranscriptResult;
    summary: SummaryResult;
    designInsights: DesignInsights;
  }> {
    // Step 1: Get transcript
    const transcript = await this.getTranscript(videoId);

    // Step 2: Summarize
    const summary = await this.summarize(transcript.fullText);

    // Step 3: Extract design insights
    const designInsights = await this.extractDesignInsights(transcript.fullText);

    return { transcript, summary, designInsights };
  }
}
