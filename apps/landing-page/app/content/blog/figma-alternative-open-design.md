---
title: "The open-source alternative to Figma"
date: 2026-05-26
category: "Guides"
readingTime: 7
summary: "Figma is excellent and it isn't going anywhere. But the file is proprietary, the seats are a subscription, and the canvas lives in someone else's cloud. Here's the honest read on when Figma is still the answer — and when owning an agent-native, local-first workflow wins."
i18n:
  zh:
    title: "Figma 的开源替代方案"
    summary: "Figma 很优秀,也不会消失。但文件格式是专有的、席位是订阅制的、画布跑在别人的云上。这是一份诚实的判断:什么时候 Figma 仍是答案——以及什么时候,拥有一套 agent 原生、本地优先的工作流会赢。"
    bodyHtml: |
      <p>Figma 很优秀。我们用它交付真实的工作已经好几年了,这不是一篇「Figma 已死」的文章——它完全不是。我们没有再造一块画布、而是<a href="/blog/why-we-built-open-design-as-a-skill-layer/">做了一个开源的 skill 层</a>,原因并不是嫌 Figma 做得不好。这是一个押注:设计工作的下一个十年,看起来会更少地像「无限画布上的一个光标」,更多地像「一个你本来就在付费的 agent,驱动一套你真正拥有的工作流」。这篇文章,是一个同赛道团队对 Figma 的诚实判断:它最擅长什么、它在哪里把你锁住、开源路径到底长什么样、以及这个季度你该选哪一个。</p>

      <h2>Figma 到底是什么</h2>
      <p>Figma 是默认的协作设计工具。浏览器里的实时多人画布,配上面向交付的 Dev Mode、用来做白板的 FigJam、以及一组不断长出来、挂在同一个界面上的 AI 功能。定价是按席位、按月,再按角色和组织分档。</p>
      <p>有几件事,它做得比任何工具都好:</p>
      <ul>
        <li><strong>实时画布协作。</strong>五个人在同一个文件里,光标实时可见,评论就地展开。开源里没有任何东西能匹配这种多人协作的打磨度。</li>
        <li><strong>像素级矢量工作。</strong>Auto Layout、约束、变体、组件——画布原语成熟,肌肉记忆扎得很深。</li>
        <li><strong>庞大的插件生态。</strong>十年沉淀的第三方插件、社区文件和模板,拿来即用。</li>
        <li><strong>团队已经熟悉的交付方式。</strong>Dev Mode、inspect、标注红线,工程师被训练了多年的那套流程。</li>
      </ul>
      <p>如果你的工作是一名设计师在共享画布上画精确的屏幕、给其他人 review,Figma 仍然是答案,而且是个好答案。真正值得在意的差异,藏在下面一层——在于谁拥有这个文件、这套工作流和这条成本曲线。</p>

      <h2>它在哪里把你锁住</h2>
      <p>Figma 带着四重值得开门见山说清的锁定,因为定价页不会说。</p>
      <p><strong>文件是专有的。</strong>你的设计活在 Figma 的格式里、Figma 的服务器上。你能导出 PNG 和交付规格,但真正的事实来源——组件、变体、活的设计系统——只有在 Figma 里才完全可读。没有一个纯文本版本能在工具之外存活下来。</p>
      <p><strong>运行时是托管的。</strong>画布就是云。对于代理商工作、或 NDA 下的发布前创意,「这个文件存在哪」每次都是一场采购对话,而不是一个设置项。本地优先,不是一个可选模式。</p>
      <p><strong>插件不可移植。</strong>Figma 的插件生态真实且深厚——但每个插件都跑在 Figma 的运行时里、对着 Figma 的 API。你在那里搭的工作流,没法被拎出来、交给你笔记本上的一个 agent 跑,也没法被组合进一条不以 Figma 画布开头的流水线。</p>
      <p><strong>账单永远是按席位的。</strong>订阅席位对一个稳定的设计团队没问题。但对快速扩张的组织会变得别扭,对那条长尾——本来也能接手同一套工作流的贡献者、外包、一次性合作者——则根本不成立。</p>
      <p>这些都不是 bug。它们是一个托管的、协作画布产品的形状,而 Figma 是这个形状里最好的版本。我们只是不为画布而造——我们为 agent 而造。</p>

      <figure>
        <img src="/blog/plate-17-locked-format.png" alt="一把黑色多面挂锁与文档形状融合,被一圈虚线边界包住,旁边有一把以工程图方式绘制的钥匙,呈现在暖色编辑风研究图版上" />
        <figcaption>事实来源活在一个专有文件里,在别人的云上。</figcaption>
      </figure>

      <h2>Open Design 押的那个转变</h2>
      <p>Open Design 不是 Figma 的克隆。这里没有无限画布,也没有多人光标。它是一个薄薄的 skill 层,把你本来就在用的编程 agent 变成一台设计引擎。四个原语是 <a href="/blog/31-skills-72-systems-how-the-library-works/">skills、systems、adapters 和 daemon</a>——而关键在于,它们全都只是文件:</p>
      <ul>
        <li>每个 skill 是一个 <code>SKILL.md</code> 文件,你可以读、可以 fork、可以提 PR 回来。</li>
        <li>每个设计系统是一个可移植的 <code>DESIGN.md</code> 文件——包括我们为 Figma 本身 ship 的那一份。你可以在任何编辑器里打开它、在 git 里 diff 它,它能活得比下一个读它的工具更久。</li>
        <li>每个 agent adapter 大约 80 行 TypeScript。</li>
      </ul>
      <p>这换来的,正好是上面四重锁定的反面:</p>
      <ul>
        <li><strong>文件是纯文本。</strong>skill 和 system 是 repo 里的 Markdown。你的设计系统不靠工具也能读。</li>
        <li><strong>运行时在本地。</strong>它通过 <code>pnpm tools-dev</code> 跑在你的笔记本上,或者你自己部署。提示词发给你选的模型提供商——什么都不经过我们。</li>
        <li><strong>工作流可移植。</strong>一个 skill 就是一个文件夹。它能组合进你 <code>$PATH</code> 上的任何 agent,而不是某个厂商的插件运行时。</li>
        <li><strong>默认 BYOK。</strong>粘贴任何 OpenAI 兼容的 <code>base_url</code> 和 key;<a href="/blog/byok-design-workflow-claude-codex-qwen/">你的 token 直接发给提供商</a>。Apache-2.0,无需注册,没有按席位的账单。</li>
      </ul>
      <p>心智模型是这样的:Figma 是一块你租来的画布。Open Design 是一套你拥有的工作流。</p>

      <figure>
        <img src="/blog/plate-18-portable-files.png" alt="一叠黑色素纸和索引卡从一个打开的容器里铺展开来,有几张正飘离,呈现在暖色编辑风研究图版上" />
        <figcaption>skill 和 system 是 repo 里的纯文本文件——可移植、可 fork、不靠工具也能读。</figcaption>
      </figure>

      <h2>逐项对照</h2>
      <table>
        <thead><tr><th></th><th><strong>Figma</strong></th><th><strong>Open Design</strong></th></tr></thead>
        <tbody>
          <tr><td>许可</td><td>专有</td><td>Apache-2.0</td></tr>
          <tr><td>运行时</td><td>托管(浏览器,Figma 云)</td><td>本地 daemon(<code>pnpm tools-dev</code>)+ 可选自托管</td></tr>
          <tr><td>源文件格式</td><td>专有 <code>.fig</code></td><td>repo 里的纯文本 <code>SKILL.md</code> / <code>DESIGN.md</code></td></tr>
          <tr><td>主要界面</td><td>实时多人画布</td><td>agent 驱动生成 + 沙箱预览</td></tr>
          <tr><td>模型 / AI</td><td>Figma 自家 AI 功能</td><td>任意 OpenAI 兼容端点 + 检测到的编程 agent CLI</td></tr>
          <tr><td>插件</td><td>市场,跑在 Figma 内</td><td>可 fork 的 skill 文件夹,任意 agent 都能跑</td></tr>
          <tr><td>设计系统</td><td>Figma 库(工具内)</td><td>可移植的 <code>DESIGN.md</code> 文件(含一份 Figma 的)</td></tr>
          <tr><td>定价</td><td>按席位订阅</td><td>免费;你直接付给模型提供商</td></tr>
          <tr><td>交付</td><td>Dev Mode、inspect、红线</td><td><code>$PATH</code> 上任意 agent,外加 HTML / PDF / PPTX / ZIP 导出</td></tr>
          <tr><td>可自托管</td><td>否</td><td>是(笔记本或你自己的部署)</td></tr>
          <tr><td>数据路径</td><td>文件 → Figma 云</td><td>提示词 → 你选的提供商;什么都不经过我们</td></tr>
        </tbody>
      </table>
      <p>诚实地总结:Figma 拥有市面上最打磨的协作画布体验,而对一个一起 review 精确屏幕的设计师团队来说,这份打磨就是产品本身。Open Design 则完全用画布换来了一个库——skills、systems 和 agents,设计成与你笔记本上已有的工具组合起来用。不同的形状,不同的押注。</p>

      <h2>谁该选哪个</h2>
      <table>
        <thead><tr><th>如果你是……</th><th>选</th></tr></thead>
        <tbody>
          <tr><td>做实时、多设计师画布工作、需要在线 review 的设计团队</td><td><strong>Figma。</strong>开源里没有东西能匹配那块多人画布。</td></tr>
          <tr><td>整天做像素级矢量和组件工作的设计师</td><td><strong>Figma。</strong>画布原语成熟,你的肌肉记忆值真金白银。</td></tr>
          <tr><td>已经标准化在 Figma 上、Dev Mode 进了工程环节的组织</td><td><strong>Figma。</strong>整合成本你已经付过了;把它花掉。</td></tr>
          <tr><td>已经在终端里驱动 Claude Code、Codex 或 Cursor 的设计工程师</td><td><strong>Open Design。</strong>你的 agent 就是设计引擎;skill 层加上品味和结构,不用再装一个新应用。</td></tr>
          <tr><td>任何需要 BYOK、项目中途换模型、或敏感简报要本地化处理的人</td><td><strong>Open Design。</strong><a href="/blog/byok-reality-check-5-things-that-break/">现实比宣传更粗糙</a>,但这是唯一真正成立的契约。</td></tr>
          <tr><td>想要一套能熬过工具更替的设计系统的团队</td><td><strong>Open Design。</strong><code>DESIGN.md</code> 文件比读它的工具活得更久。</td></tr>
          <tr><td>想 ship 一套项目能采纳的设计工作流的开源贡献者</td><td><strong>Open Design。</strong>放一个文件夹,重启 daemon,提 PR。</td></tr>
        </tbody>
      </table>
      <p>对大多数团队来说,定胜负的那个维度不是质量——Figma 的手艺是真的。而是:你的工作是一块用来画的画布,还是一套用来自动化的工作流。如果是后者,你会更想拥有它,而不是租它。</p>

      <h2>接下来做什么</h2>
      <p>如果你已经有一个可重复的 Figma 活儿——导出这些 frame、同步那些 token、重建那个 deck 模板——感受差异最快的方式,是把其中一个<a href="/blog/port-figma-workflow-open-design-plugin/">迁移成一个插件</a>。从一个烦人的、可重复的小任务开始,而不是「替换 Figma」。</p>
      <p>或者直接跑那条三行命令的快速上手,把它指向你本来就在付费的模型。整个东西活在一个 repo 里,第一个 deck 大约十分钟。</p>
      <p><a href="https://github.com/nexu-io/open-design/releases">试试这套开源工作流</a>。</p>

      <h2>延伸阅读</h2>
      <ul>
        <li><a href="/blog/port-figma-workflow-open-design-plugin/">如何把 Figma 工作流迁移成 Open Design 插件</a>——一次导出、token 同步或品牌套件的具体路径</li>
        <li><a href="/blog/open-source-alternative-to-claude-design/">Claude Design 的开源替代方案</a>——同样诚实的判断,换一个工具</li>
        <li><a href="/blog/why-we-built-open-design-as-a-skill-layer/">为什么我们把 Open Design 做成 skill 层,而不是一个产品</a>——「是层,不是产品」这个押注背后更长的宣言</li>
      </ul>
---

Figma is excellent. We've shipped real work in it for years, and this isn't a "Figma is dead" post — it very much isn't. The fact that we [built an open-source layer](/blog/why-we-built-open-design-as-a-skill-layer/) instead of another canvas isn't a complaint about Figma's craft. It's a bet that the next decade of design work looks less like a cursor on an infinite canvas and more like an agent you already pay for, driving a workflow you actually own. This post is the honest read on Figma from a team building in the same category: what it does best, where it locks you in, what the open-source path actually looks like, and which one you should reach for this quarter.

## What Figma actually is

Figma is the default collaborative design tool. A real-time multiplayer canvas in the browser, with Dev Mode for handoff, FigJam for whiteboarding, a deep plugin marketplace, and a growing set of AI features bolted onto the same surface. Pricing is per-seat per-month, tiered by role and by org.

It does a handful of things better than anything else:

- **Real-time canvas collaboration.** Five people in one file, cursors live, comments inline. Nothing in open source matches the multiplayer polish.
- **Pixel-precise vector work.** Auto Layout, constraints, variants, components — the canvas primitives are mature and the muscle memory runs deep.
- **A huge plugin ecosystem.** A decade of third-party plugins, community files, and templates you can drop in.
- **Handoff that teams already know.** Dev Mode, inspect, redlines, and a workflow engineering has been trained on for years.

If your work is a designer painting precise screens for other humans to review on a shared canvas, Figma is still the answer, and it's a good one. The differences worth caring about live one layer down — in who owns the file, the workflow, and the cost curve.

## Where it locks you in

Figma carries four pieces of lock-in worth naming upfront, because the pricing pages don't.

**The file is proprietary.** Your design lives in Figma's format, inside Figma's servers. You can export PNGs and dev specs, but the source of truth — components, variants, the live design system — is only fully legible inside Figma. There is no plain-text version of your work that survives the tool.

**The runtime is hosted.** The canvas is the cloud. For agency work or pre-launch creative under NDA, "where does this file live" is a procurement conversation, not a setting. Local-only isn't a mode.

**The plugins aren't portable.** Figma's plugin ecosystem is real and deep — but every plugin runs inside Figma's runtime, against Figma's API. A workflow you build there can't be lifted out and run by an agent on your laptop, or composed into a pipeline that doesn't start with the Figma canvas.

**The bill is per-seat, forever.** Subscription seats are fine for a stable design team. They get awkward for a fast-growing org, and they're a non-starter for the long tail of contributors, contractors, and one-off collaborators who'd otherwise pick up the same workflow.

None of these are bugs. They're the shape of a hosted, collaborative-canvas product, and Figma is the best version of that shape. We're just not building for the canvas — we're building for the agent.

<figure>
  <img src="/blog/plate-17-locked-format.png" alt="A black faceted padlock fused with a document shape, ringed by a dashed boundary with a key drawn as an engineering diagram, on a warm editorial study plate" />
  <figcaption>The source of truth lives in a proprietary file, inside someone else's cloud.</figcaption>
</figure>

## The shift Open Design bets on

Open Design isn't a Figma clone. There's no infinite canvas and no multiplayer cursors. It's a thin skill layer that turns the coding agent you already use into a design engine. The four primitives are [skills, systems, adapters, and the daemon](/blog/31-skills-72-systems-how-the-library-works/) — and the important part is that they're all just files:

- Every skill is a `SKILL.md` file you can read, fork, and send back as a PR.
- Every design system is a portable `DESIGN.md` file — including the one we ship for Figma itself. You can open it in any editor, diff it in git, and it outlives whatever tool reads it next.
- Every agent adapter is ~80 lines of TypeScript.

What that buys you is the opposite of the four lock-ins above:

- **The file is plain text.** Skills and systems are Markdown in a repo. Your design system is legible without the tool.
- **The runtime is local.** It runs on your laptop via `pnpm tools-dev`, or you deploy it yourself. Prompts go to the model provider you chose — nothing routes through us.
- **The workflow is portable.** A skill is a folder. It composes into any agent on your `$PATH`, not a single vendor's plugin runtime.
- **BYOK by default.** Paste any OpenAI-compatible `base_url` and key; [your tokens go straight to the provider](/blog/byok-design-workflow-claude-codex-qwen/). Apache-2.0, no signup, no per-seat bill.

The mental model: Figma is a canvas you rent. Open Design is a workflow you own.

<figure>
  <img src="/blog/plate-18-portable-files.png" alt="A fan of plain black paper sheets and index cards spreading out of an open container, a couple drifting free, on a warm editorial study plate" />
  <figcaption>Skills and systems are plain-text files in a repo — portable, forkable, legible without the tool.</figcaption>
</figure>

## Side-by-side

| | **Figma** | **Open Design** |
|---|---|---|
| License | Proprietary | Apache-2.0 |
| Runtime | Hosted (browser, Figma cloud) | Local daemon (`pnpm tools-dev`) + optional self-host |
| Source format | Proprietary `.fig` | Plain-text `SKILL.md` / `DESIGN.md` in a repo |
| Primary surface | Real-time multiplayer canvas | Agent-driven generation + sandboxed preview |
| Models / AI | Figma's own AI features | Any OpenAI-compatible endpoint + detected coding-agent CLIs |
| Plugins | Marketplace, runs inside Figma | Forkable skill folders, run by any agent |
| Design systems | Figma libraries (in-tool) | Portable `DESIGN.md` files (incl. a Figma one) |
| Pricing | Per-seat subscription | Free; you pay your model provider directly |
| Handoff | Dev Mode, inspect, redlines | Any agent on `$PATH`, plus HTML / PDF / PPTX / ZIP exports |
| Self-hostable | No | Yes (laptop or your own deploy) |
| Data path | Files → Figma cloud | Prompts → your chosen provider; nothing through us |

The honest summary: Figma has the most polished collaborative-canvas experience on the market, and for a team of designers reviewing precise screens together, that polish is the product. Open Design trades the canvas entirely for a library — skills, systems, and agents designed to compose with the tool already on your laptop. Different shape, different bet.

## Who should pick what

| If you are… | Pick |
|---|---|
| A design team doing real-time, multi-designer canvas work with live review | **Figma.** Nothing in open source matches the multiplayer canvas. |
| A designer doing pixel-precise vector and component work all day | **Figma.** The canvas primitives are mature and your muscle memory is worth real money. |
| An org already standardised on Figma with Dev Mode in the engineering loop | **Figma.** You've paid the integration cost; spend it. |
| A design engineer who already drives Claude Code, Codex, or Cursor from the terminal | **Open Design.** Your agent is the design engine; the skill layer adds taste and structure without a new app. |
| Anyone who needs BYOK, model choice mid-project, or local-only for sensitive briefs | **Open Design.** [The reality is rougher than the marketing](/blog/byok-reality-check-5-things-that-break/), but it's the only contract that actually holds. |
| A team that wants a design system that survives tool churn | **Open Design.** `DESIGN.md` files outlive the tool that reads them. |
| An open-source contributor who wants to ship a design workflow the project can adopt | **Open Design.** Drop a folder, restart the daemon, send the PR. |

The dimension that decides it for most teams isn't quality — Figma's craft is real. It's whether your work is a canvas to paint on, or a workflow to automate. If it's the latter, you'd rather own it than rent it.

## What to do next

If you already have a repeatable Figma job — export these frames, sync those tokens, rebuild that deck template — the fastest way to feel the difference is to [port one of them into a plugin](/blog/port-figma-workflow-open-design-plugin/). Start with one annoying, repeatable task, not "replace Figma."

Or just run the three-command quickstart and point it at the model you already pay for. The whole thing lives in one repo and the first deck takes about ten minutes.

[Try the open-source workflow](https://github.com/nexu-io/open-design/releases).

## Related reading

- [How to port a Figma workflow into an Open Design plugin](/blog/port-figma-workflow-open-design-plugin/) — the concrete path for an export, token sync, or brand kit
- [The open-source alternative to Claude Design](/blog/open-source-alternative-to-claude-design/) — the same honest read, one tool over
- [Why we built Open Design as a skill layer, not a product](/blog/why-we-built-open-design-as-a-skill-layer/) — the longer manifesto behind the "layer, not product" bet
