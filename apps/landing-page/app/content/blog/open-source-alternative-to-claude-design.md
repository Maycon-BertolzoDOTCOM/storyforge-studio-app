---
title: "The open-source alternative to Claude Design"
date: 2026-05-14
category: "Guides"
readingTime: 7
summary: "Claude Design is good. It's also closed-source, hosted-only, and bundled with a Claude subscription. Here's the honest read on when to pick it — and when the open-source path wins."
i18n:
  zh:
    title: "Claude Design 的开源替代方案"
    summary: "Claude Design 很好。它也是闭源的、只能托管运行、并捆绑在 Claude 订阅里。这是一份诚实的判断:什么时候该选它——以及什么时候,开源路径会赢。"
    bodyHtml: |
      <p>Claude Design 很好。我们在真实的简报上用过它。我们最后没有用它、而是<a href="/blog/why-we-built-open-design-as-a-skill-layer/">做了一个开源的层</a>,并不是因为 Anthropic ship 了一个糟糕的工具——他们没有。而是因为闭源、只能托管、每月 20 到 200 美元的设计工具,对于设计工作的下一个十年来说,是错的形状。这篇文章,是一个同赛道交付团队对 Claude Design 的诚实判断:它是什么、它在哪里把你锁住、开源替代方案到底长什么样、以及这个季度你该选哪一个。</p>

      <h2>Claude Design 到底是什么</h2>
      <p><a href="https://www.anthropic.com/news/claude-design-anthropic-labs">Claude Design</a> 于 2026 年 4 月从 Anthropic Labs 推出。它是一个由 Claude Opus 4.7 驱动的对话式设计工具:左边对话,右边画布。你描述想要什么,Claude 生成一个设计,你通过评论、就地编辑和提示词微调来迭代。</p>
      <p>有四件事它做得很好:</p>
      <ul>
        <li><strong>从文字生成原型。</strong>onboarding 流程、设置页、管理面板、结账变体——从提示词到可交互屏幕,五分钟。</li>
        <li><strong>代码库感知。</strong>导入一个 GitHub repo 或挂上一个本地目录,原型就会用你真实的组件、你的 token 体系、你的约定。</li>
        <li><strong>品牌整合。</strong>设计系统配置一次,之后每个项目都会自动接上颜色、字体和组件模式。</li>
        <li><strong>交接给 Claude Code。</strong>「build this」按钮把原型在同一个浏览器标签页里带到可上生产的代码。</li>
      </ul>
      <p>导出包括 Canva、PDF、PPTX、HTML 和独立 URL。定价是捆绑的——Claude Pro 20 美元、Max 100–200 美元、Enterprise 是惯常的「联系我们」档。它目前是面向付费 Claude 订阅者的研究预览。</p>
      <p>如果你读<a href="https://support.claude.com/en/articles/14604416-get-started-with-claude-design">官方教程</a>,Anthropic 描述的工作流,跟 Open Design ship 的是同一套:一份简报、一个方向、一个产物、一次交接。差异藏在下面一层。</p>

      <h2>它在哪里把你锁住</h2>
      <p>Claude Design 带着四重值得开门见山说清的锁定,因为营销页不会说。</p>
      <p><strong>模型是固定的。</strong>每一次渲染都走 Claude。不是 Claude <em>或</em>一个你已经付费的模型——就只是 Claude。如果你的团队跟 GPT、Gemini 或 DeepSeek 有合同,或者你为敏感简报在 Ollama 上自托管,那些工作流没法迁过来。token 成本永远骑在 Anthropic 的定价曲线上。</p>
      <p><strong>运行时是托管的。</strong>你的提示词、你的设计系统、你的代码库上下文,全都会传到 Anthropic 的服务器。对代理商工作、或 NDA 下的发布前创意,那每次都是一场采购对话。自托管在研究预览里不是选项,公告里也没承诺会有。</p>
      <p><strong>skill 不是你的。</strong>Claude Design 的行为由活在 Anthropic 内部的提示词和工具定义。你没法 fork 它们、审计它们,或替换其中一个。Anthropic 在 Claude Skills 里 ship 的那套「skills」是相邻但独立的;设计专用的工具是内部的。</p>
      <p><strong>账单是订阅。</strong>每席位每月 20–200 美元,对单人设计师没问题,对二十人的团队肉疼,对那十几个本来也会接手同一套工作流的开源贡献者来说,根本走不通。</p>
      <p>这些都不是 Claude Design 的 bug。它们是一个托管产品的形状。Anthropic 为中位数的 Pro 订阅者做了优化。我们不是中位数的 Pro 订阅者。</p>

      <figure>
        <img src="/blog/plate-19-hosted-cloud.png" alt="一个黑色多面云体由虚线系到一个小型地面锚点与服务器方块上,呈现在暖色编辑风研究图版上" />
        <figcaption>默认托管:你的提示词、设计系统和代码库上下文,都传到别人的服务器上。</figcaption>
      </figure>

      <h2>开源替代方案到底长什么样</h2>
      <p>搜「替代方案」时会冒出两个开源项目。两个都值得说清楚。</p>
      <p><strong><code>open-codesign</code></strong>(<a href="https://github.com/OpenCoworkAI/open-codesign">OpenCoworkAI/open-codesign</a>)是一个 MIT 许可下的 Electron 桌面应用。它支持 Claude、GPT、Gemini、Kimi、GLM 和 Ollama,主打一个「一键导入你的 Claude Code / Codex API key」的 onboarding 钩子,从提示词产出原型、幻灯片和 PDF。它是今天开源里对 Claude Design 表面功能最一对一的镜像。</p>
      <p><strong>Open Design</strong>(就是本站)是另一种押注。它不是 Claude Design 的克隆——它是一个薄薄的 skill 层,把你已经在用的编程 agent 变成一台设计引擎。四个原语是 <a href="/blog/31-skills-72-systems-how-the-library-works/">skills、systems、adapters 和 daemon</a>。每个 skill 是一个 <code>SKILL.md</code> 文件。每个设计系统是一个 <code>DESIGN.md</code> 文件。每个 agent adapter 大约 80 行 TypeScript。</p>
      <p>今天开箱即有的:</p>
      <ul>
        <li><strong>123 个 skill</strong>——deck 生成器、移动端 mockup、编辑风页面、Word/Excel/PPT、品牌探索</li>
        <li><strong>148 个设计系统</strong>——Linear、Vercel、Stripe、Apple、Cursor、Figma 的可移植 Markdown 版本,外加一条长尾</li>
        <li><strong>16 个编程 agent CLI 自动检测</strong>——在你的 <code>$PATH</code> 上:Claude Code、Codex、Cursor、Gemini、OpenCode、Copilot、Devin、Hermes、Pi、Kimi、Kiro、Qwen、DeepSeek TUI、Qoder、Mistral Vibe、Kilo</li>
        <li><strong>四步锁定工作流</strong>——问题表单 → 方向选择 → 实时计划流 → 沙箱 iframe 预览</li>
        <li><strong>默认 BYOK</strong>——粘贴任意 OpenAI 兼容的 <code>base_url</code> 和 key,<a href="/blog/byok-design-workflow-claude-codex-qwen/">你的 token 直接发给提供商</a></li>
        <li><strong>Apache-2.0,无需注册,<code>pnpm tools-dev</code> 即可跑</strong></li>
      </ul>
      <p>心智模型:Claude Design 是一个产品。<code>open-codesign</code> 是一个克隆。Open Design 是一个层。</p>

      <figure>
        <img src="/blog/plate-20-model-lock.png" alt="三个不同形状的黑色多面体立在一条带刻度的基线上,只有一个嵌进了卡槽框里、其余散放,呈现在暖色编辑风研究图版上" />
        <figcaption>Claude Design 固定了模型。开源路径让你带上你已经在付费的那个。</figcaption>
      </figure>

      <h2>逐项对照</h2>
      <table>
        <thead><tr><th></th><th><strong>Claude Design</strong></th><th><strong><code>open-codesign</code></strong></th><th><strong>Open Design</strong></th></tr></thead>
        <tbody>
          <tr><td>许可</td><td>专有</td><td>MIT</td><td>Apache-2.0</td></tr>
          <tr><td>运行时</td><td>托管(Anthropic)</td><td>本地 Electron 应用</td><td>本地 daemon(<code>pnpm tools-dev</code>)+ 可选 Vercel 部署</td></tr>
          <tr><td>模型</td><td>仅 Claude</td><td>Claude、GPT、Gemini、Kimi、GLM、Ollama</td><td>任意 OpenAI 兼容端点 + 16 个检测到的 CLI</td></tr>
          <tr><td>skill</td><td>内部</td><td>没有成体系的</td><td>123 个可 fork 的 <code>SKILL.md</code> 文件夹</td></tr>
          <tr><td>设计系统</td><td>按项目做品牌配置</td><td>按项目</td><td>148 个可移植 <code>DESIGN.md</code> 文件</td></tr>
          <tr><td>代码库上下文</td><td>GitHub 导入 + 本地</td><td>有限</td><td>skill 级别,真实工作目录</td></tr>
          <tr><td>定价</td><td>20 / 100 / 200 美元 / Enterprise</td><td>免费</td><td>免费;你直接付给模型提供商</td></tr>
          <tr><td>交接</td><td>Claude Code(应用内)</td><td>本地导出</td><td><code>$PATH</code> 上任意 agent,外加 HTML / PDF / PPTX / ZIP 导出</td></tr>
          <tr><td>可自托管</td><td>否</td><td>是(桌面)</td><td>是(笔记本或 Vercel)</td></tr>
          <tr><td>数据路径</td><td>提示词 → Anthropic</td><td>提示词 → 你选的提供商</td><td>提示词 → 你选的提供商;什么都不经过我们</td></tr>
        </tbody>
      </table>
      <p>诚实地总结:Claude Design 拥有最打磨的单一产品体验。<code>open-codesign</code> 是最接近的视觉对应物,如果你要的是「免费版的 Claude Design」。Open Design 则用这份打磨的单一产品表面,换来了一个库——更多 skill、更多 system、更多 agent,设计成与你笔记本上已有的 agent 组合起来用。</p>

      <figure>
        <img src="/blog/plate-21-layer-stack.png" alt="三块薄薄的黑色板材以等距视角带间隙地堆叠成层栈,刻度标注着间隙,顶上有一片橄榄叶,呈现在暖色编辑风研究图版上" />
        <figcaption>一个产品、一个克隆、一个层——Open Design 坐在你的 agent 和设计工作之间。</figcaption>
      </figure>

      <h2>谁该选哪个</h2>
      <table>
        <thead><tr><th>如果你是……</th><th>选</th></tr></thead>
        <tbody>
          <tr><td>公司已经上了 Claude Pro、午饭前需要一个原型的单人 PM</td><td><strong>Claude Design。</strong>那 20 美元已是沉没成本;界面是真的快。</td></tr>
          <tr><td>Anthropic 已经过了采购的企业设计团队</td><td><strong>Claude Design。</strong>整合成本你付过一次了;把它花掉。</td></tr>
          <tr><td>想要「免费版 Claude Design」、带桌面应用手感的单人设计师</td><td><strong><code>open-codesign</code>。</strong>单一二进制、Electron 体验,不用学 skill 这套概念。</td></tr>
          <tr><td>已经在终端里驱动 Claude Code、Codex 或 Cursor 的设计工程师</td><td><strong>Open Design。</strong>你的 agent 就是设计引擎;skill 层加上品味和结构,不用装新应用。</td></tr>
          <tr><td>任何需要 BYOK、项目中途换模型、或敏感简报要纯本地的人</td><td><strong>Open Design。</strong><a href="/blog/byok-reality-check-5-things-that-break/">现实比宣传更粗糙</a>,但这是唯一真正成立的契约。</td></tr>
          <tr><td>想 ship 一个项目能采纳的新设计 skill 的开源贡献者</td><td><strong>Open Design。</strong>放一个文件夹,重启 daemon,提 PR。</td></tr>
          <tr><td>要标准化一套能熬过工具更替的可移植设计系统的团队</td><td><strong>Open Design。</strong><code>DESIGN.md</code> 文件比读它的工具活得更久。</td></tr>
        </tbody>
      </table>
      <p>对大多数团队来说,定胜负的那个维度不是质量。而是:你更愿意租这套工作流,还是拥有它。</p>

      <h2>接下来做什么</h2>
      <p>如果你想在花一笔 Pro 订阅之前,先感受一下「拥有工作流」是什么感觉,那就跑那条三行命令的快速上手,把它指向你本来就在付费的模型。整个东西活在一个 repo 里,第一个 deck 大约十分钟。</p>
      <p><a href="https://github.com/nexu-io/open-design/releases">试试这套开源工作流</a>。</p>

      <h2>延伸阅读</h2>
      <ul>
        <li><a href="/blog/why-we-built-open-design-as-a-skill-layer/">为什么我们把 Open Design 做成 skill 层,而不是一个产品</a>——「是层,不是产品」这个押注背后更长的宣言</li>
        <li><a href="/blog/byok-design-workflow-claude-codex-qwen/">BYOK 设计工作流——用你自己的 key 跑 Claude、Codex 或 Qwen</a>——自己选模型背后的成本算账</li>
        <li><a href="/blog/byok-reality-check-5-things-that-break/">BYOK 现实核对——会坏的五件事</a>——开源路径今天真正会坏的地方,以及绕过的办法</li>
      </ul>
---

Claude Design is good. We've used it on real briefs. The fact that we [built an open-source layer](/blog/why-we-built-open-design-as-a-skill-layer/) instead isn't because Anthropic shipped a bad tool — they didn't. It's because closed-source, hosted-only, $20-to-$200-a-month design tooling is the wrong shape for the next decade of design work. This post is the honest read on Claude Design from a team that ships in the same category: what it is, where it locks you in, what the open-source alternatives actually look like, and which one you should pick this quarter.

## What Claude Design actually is

[Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs) launched out of Anthropic Labs in April 2026. It's a conversational design tool powered by Claude Opus 4.7: chat on the left, canvas on the right. You describe what you want, Claude generates a design, and you iterate through comments, inline edits, and prompt refinements.

It does four things well:

- **Prototypes from prose.** Onboarding flows, settings pages, admin panels, checkout variants — five minutes from prompt to interactive screen.
- **Codebase awareness.** Import a GitHub repo or attach a local directory and the prototypes use your real components, your token system, your conventions.
- **Brand integration.** Set up a design system once and every project automatically picks up the colors, typography, and component patterns.
- **Handoff to Claude Code.** The "build this" button takes the prototype to production-ready code in the same browser tab.

Exports include Canva, PDF, PPTX, HTML, and standalone URLs. Pricing is bundled — Claude Pro at $20, Max at $100–$200, Enterprise at the usual call-us tier. It's currently a research preview for paying Claude subscribers.

If you read [the official tutorial](https://support.claude.com/en/articles/14604416-get-started-with-claude-design), the workflow Anthropic describes is the same one Open Design ships: a brief, a direction, an artifact, a handoff. The differences live one layer down.

## Where it locks you in

Claude Design carries four pieces of lock-in worth naming upfront, because the marketing pages don't.

**The model is fixed.** Every render goes through Claude. Not Claude *or* a model you've already paid for — just Claude. If your team has a contract with GPT, Gemini, or DeepSeek, or if you self-host on Ollama for sensitive briefs, those workflows don't translate. Token cost rides Anthropic's pricing curve forever.

**The runtime is hosted.** Your prompts, your design system, and your codebase context all travel to Anthropic's servers. For agency work or pre-launch creative under NDA, that's a procurement conversation every time. Self-hosted is not an option in the research preview, and the announcement does not commit to one.

**The skills are not yours.** Claude Design's behaviour is defined by prompts and tools that live inside Anthropic. You can't fork them, audit them, or replace one. The "skills" Anthropic is shipping in Claude Skills are adjacent but separate; the design-specific tooling is internal.

**The bill is a subscription.** $20–$200/month per seat is fine for a solo designer, painful for a team of twenty, and a non-starter for the dozen open-source contributors who would otherwise pick up the same workflow.

None of these are bugs in Claude Design. They are the shape of a hosted product. Anthropic optimised for the median Pro subscriber. We're not the median Pro subscriber.

<figure>
  <img src="/blog/plate-19-hosted-cloud.png" alt="A black faceted cloud solid tethered by a dashed line to a small ground anchor and server block, on a warm editorial study plate" />
  <figcaption>Hosted by default: your prompts, design system, and codebase context travel to someone else's servers.</figcaption>
</figure>

## What the open-source alternatives actually look like

Two open-source projects show up when you search for an alternative. It's worth being clear about both.

**`open-codesign`** ([OpenCoworkAI/open-codesign](https://github.com/OpenCoworkAI/open-codesign)) is an Electron desktop app under MIT. It supports Claude, GPT, Gemini, Kimi, GLM, and Ollama, leans on a "one-click import your Claude Code / Codex API key" onboarding hook, and produces prototypes, slides, and PDFs from prompts. It's the closest one-to-one mirror of Claude Design's surface area in open source today.

**Open Design** (this site) is a different bet. It's not a Claude Design clone — it's a thin skill layer that turns the coding agent you already use into a design engine. The four primitives are [skills, systems, adapters, and the daemon](/blog/31-skills-72-systems-how-the-library-works/). Every skill is a `SKILL.md` file. Every design system is a `DESIGN.md` file. Every agent adapter is ~80 lines of TypeScript.

What ships in the box today:

- **123 skills** — deck generators, mobile mockups, editorial pages, Word/Excel/PPT, brand explorations
- **148 design systems** — portable Markdown versions of Linear, Vercel, Stripe, Apple, Cursor, Figma, plus a long tail
- **16 coding-agent CLIs auto-detected** on your `$PATH` — Claude Code, Codex, Cursor, Gemini, OpenCode, Copilot, Devin, Hermes, Pi, Kimi, Kiro, Qwen, DeepSeek TUI, Qoder, Mistral Vibe, Kilo
- **Four-step locked workflow** — question form → direction picker → live plan stream → sandboxed iframe preview
- **BYOK by default** — paste any OpenAI-compatible `base_url` and key, [your tokens go straight to the provider](/blog/byok-design-workflow-claude-codex-qwen/)
- **Apache-2.0, no signup, runs on `pnpm tools-dev`**

The mental model: Claude Design is a product. `open-codesign` is a clone. Open Design is a layer.

<figure>
  <img src="/blog/plate-20-model-lock.png" alt="Three black faceted polyhedra on a measured baseline, only one slotted into a bracket frame while the others sit loose, on a warm editorial study plate" />
  <figcaption>Claude Design fixes the model. The open path lets you bring the one you already pay for.</figcaption>
</figure>

## Side-by-side

| | **Claude Design** | **`open-codesign`** | **Open Design** |
|---|---|---|---|
| License | Proprietary | MIT | Apache-2.0 |
| Runtime | Hosted (Anthropic) | Local Electron app | Local daemon (`pnpm tools-dev`) + optional Vercel deploy |
| Models | Claude only | Claude, GPT, Gemini, Kimi, GLM, Ollama | Any OpenAI-compatible endpoint + 16 detected CLIs |
| Skills | Internal | None as a system | 123 forkable `SKILL.md` folders |
| Design systems | Per-project brand setup | Per-project | 148 portable `DESIGN.md` files |
| Codebase context | GitHub import + local | Limited | Skill-level, real working directory |
| Pricing | $20 / $100 / $200 / Enterprise | Free | Free; you pay your model provider directly |
| Handoff | Claude Code (in-app) | Local export | Any agent on `$PATH`, plus HTML / PDF / PPTX / ZIP exports |
| Self-hostable | No | Yes (desktop) | Yes (laptop or Vercel) |
| Data path | Prompts → Anthropic | Prompts → your chosen provider | Prompts → your chosen provider; nothing through us |

The honest summary: Claude Design has the most polished single-product experience. `open-codesign` is the closest visual analog if what you want is "Claude Design but free." Open Design trades the polished single-product surface for a library — more skills, more systems, more agents, designed to compose with the agent already on your laptop.

<figure>
  <img src="/blog/plate-21-layer-stack.png" alt="Three thin black slabs stacked with visible gaps like a layer stack in isometric, dimension ticks marking the gaps, an olive leaf on top, on a warm editorial study plate" />
  <figcaption>A product, a clone, and a layer — Open Design sits between your agent and the design work.</figcaption>
</figure>

## Who should pick what

| If you are… | Pick |
|---|---|
| A solo PM at a company already on Claude Pro who needs a prototype before lunch | **Claude Design.** The $20/month is sunk; the interface is genuinely fast. |
| An enterprise design team where Anthropic already cleared procurement | **Claude Design.** You've paid the integration cost once; spend it. |
| A solo designer who wants "Claude Design but free" with a desktop app feel | **`open-codesign`.** Single binary, Electron UX, no concept of skills to learn. |
| A design engineer who already drives Claude Code, Codex, or Cursor from the terminal | **Open Design.** Your agent is the design engine; the skill layer adds taste and structure without a new app. |
| Anyone who needs BYOK, model choice mid-project, or local-only for sensitive briefs | **Open Design.** [The reality is rougher than the marketing](/blog/byok-reality-check-5-things-that-break/), but the contract is the only one that actually holds. |
| An open-source contributor who wants to ship a new design skill the project can adopt | **Open Design.** Drop a folder, restart the daemon, send the PR. |
| A team standardising on a portable design system that survives tool churn | **Open Design.** `DESIGN.md` files outlive the tool that reads them. |

The dimension that decides it for most teams isn't quality. It's whether you'd rather rent the workflow or own it.

## What to do next

If you want to see what owning the workflow feels like before you spend a Pro subscription, run the three-command quickstart and point it at the model you already pay for. The whole thing lives in one repo and the first deck takes about ten minutes.

[Try the open-source workflow](https://github.com/nexu-io/open-design/releases).

## Related reading

- [Why we built Open Design as a skill layer, not a product](/blog/why-we-built-open-design-as-a-skill-layer/) — the longer manifesto behind the "layer, not product" bet
- [BYOK design workflow — run Claude, Codex, or Qwen on your own key](/blog/byok-design-workflow-claude-codex-qwen/) — the cost math behind picking your own model
- [BYOK reality check — five things that break](/blog/byok-reality-check-5-things-that-break/) — what the open path actually breaks today, and the workarounds
