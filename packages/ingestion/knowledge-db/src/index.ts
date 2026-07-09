import Database from "better-sqlite3";

export interface Channel {
  id?: number;
  name: string;
  url: string;
  subscriberCount?: string;
  lastScraped?: string;
  createdAt?: string;
}

export interface Video {
  id?: number;
  channelId: number;
  videoId: string;
  title: string;
  url: string;
  duration?: string;
  viewCount?: string;
  transcript?: string;
  summary?: string;
  designTags?: string;
  colorPalette?: string;
  scrapedAt?: string;
}

export interface DesignPrinciple {
  id?: number;
  videoId: number;
  principle: string;
  source: string;
  category: string;
}

export interface SearchOptions {
  query?: string;
  tags?: string[];
  colors?: string[];
  limit?: number;
  offset?: number;
}

export class KnowledgeDB {
  private db: Database.Database;

  constructor(dbPath: string = "./knowledge.db") {
    this.db = new Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT UNIQUE NOT NULL,
        subscriber_count TEXT,
        last_scraped TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel_id INTEGER NOT NULL,
        video_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        duration TEXT,
        view_count TEXT,
        transcript TEXT,
        summary TEXT,
        design_tags TEXT,
        color_palette TEXT,
        scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (channel_id) REFERENCES channels(id)
      );

      CREATE TABLE IF NOT EXISTS design_principles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER NOT NULL,
        principle TEXT NOT NULL,
        source TEXT,
        category TEXT,
        FOREIGN KEY (video_id) REFERENCES videos(id)
      );

      CREATE INDEX IF NOT EXISTS idx_videos_channel ON videos(channel_id);
      CREATE INDEX IF NOT EXISTS idx_principles_video ON design_principles(video_id);
      CREATE INDEX IF NOT EXISTS idx_videos_tags ON videos(design_tags);
    `);
  }

  // Channels
  addChannel(channel: Channel): number {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO channels (name, url, subscriber_count)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(channel.name, channel.url, channel.subscriberCount);
    return result.lastInsertRowid as number;
  }

  getChannel(url: string): Channel | undefined {
    return this.db.prepare("SELECT * FROM channels WHERE url = ?").get(url) as Channel | undefined;
  }

  getAllChannels(): Channel[] {
    return this.db.prepare("SELECT * FROM channels ORDER BY created_at DESC").all() as Channel[];
  }

  updateChannelLastScraped(channelId: number): void {
    this.db.prepare("UPDATE channels SET last_scraped = CURRENT_TIMESTAMP WHERE id = ?").run(channelId);
  }

  // Videos
  addVideo(video: Video): number {
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO videos (channel_id, video_id, title, url, duration, view_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      video.channelId,
      video.videoId,
      video.title,
      video.url,
      video.duration,
      video.viewCount
    );
    return result.lastInsertRowid as number;
  }

  getVideo(videoId: string): Video | undefined {
    return this.db.prepare("SELECT * FROM videos WHERE video_id = ?").get(videoId) as Video | undefined;
  }

  updateVideoTranscript(
    videoId: string,
    transcript: string,
    summary: string,
    designTags: string[],
    colorPalette: string[]
  ): void {
    this.db.prepare(`
      UPDATE videos 
      SET transcript = ?, summary = ?, design_tags = ?, color_palette = ?
      WHERE video_id = ?
    `).run(transcript, summary, JSON.stringify(designTags), JSON.stringify(colorPalette), videoId);
  }

  getVideosByChannel(channelId: number): Video[] {
    return this.db.prepare("SELECT * FROM videos WHERE channel_id = ?").all(channelId) as Video[];
  }

  // Design Principles
  addDesignPrinciple(principle: DesignPrinciple): number {
    const stmt = this.db.prepare(`
      INSERT INTO design_principles (video_id, principle, source, category)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(principle.videoId, principle.principle, principle.source, principle.category);
    return result.lastInsertRowid as number;
  }

  getPrinciplesByVideo(videoId: number): DesignPrinciple[] {
    return this.db.prepare("SELECT * FROM design_principles WHERE video_id = ?").all(videoId) as DesignPrinciple[];
  }

  // Search
  search(options: SearchOptions): Video[] {
    let query = "SELECT v.*, c.name as channel_name FROM videos v JOIN channels c ON v.channel_id = c.id";
    const conditions: string[] = [];
    const params: any[] = [];

    if (options.query) {
      conditions.push("(v.title LIKE ? OR v.summary LIKE ? OR v.design_tags LIKE ?)");
      const searchTerm = `%${options.query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (options.tags && options.tags.length > 0) {
      const tagConditions = options.tags.map(() => "v.design_tags LIKE ?");
      conditions.push(`(${tagConditions.join(" OR ")})`);
      options.tags.forEach((tag) => params.push(`%${tag}%`));
    }

    if (options.colors && options.colors.length > 0) {
      const colorConditions = options.colors.map(() => "v.color_palette LIKE ?");
      conditions.push(`(${colorConditions.join(" OR ")})`);
      options.colors.forEach((color) => params.push(`%${color}%`));
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY v.scraped_at DESC";

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    if (options.offset) {
      query += ` OFFSET ${options.offset}`;
    }

    return this.db.prepare(query).all(...params) as Video[];
  }

  // Stats
  getStats(): {
    totalChannels: number;
    totalVideos: number;
    totalPrinciples: number;
    videosWithTranscripts: number;
  } {
    return {
      totalChannels: (this.db.prepare("SELECT COUNT(*) as count FROM channels").get() as any).count,
      totalVideos: (this.db.prepare("SELECT COUNT(*) as count FROM videos").get() as any).count,
      totalPrinciples: (this.db.prepare("SELECT COUNT(*) as count FROM design_principles").get() as any).count,
      videosWithTranscripts: (this.db.prepare(
        "SELECT COUNT(*) as count FROM videos WHERE transcript IS NOT NULL"
      ).get() as any).count,
    };
  }

  close(): void {
    this.db.close();
  }
}
