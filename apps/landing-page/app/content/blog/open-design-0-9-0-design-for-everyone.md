---
title: "Open Design 0.9.0: design for everyone"
date: 2026-06-02
category: "Product"
readingTime: 6
summary: "Open Design 0.9.0 is the install-and-create release. No API-key scavenger hunt, no three-CLI setup — open the app, sign in once, pick a model, and start building. Plus a bigger agent bench, a real plugin library, and easier installs on Windows and Linux."
i18n:
  zh:
    title: "Open Design 0.9.0:设计,给每一个人"
    summary: "Open Design 0.9.0 是「装完即创作」的版本。不用再到处找 API key,不用装三个 CLI——打开应用、登录一次、选一个模型,就能开始做东西。再加上更大的 agent 阵容、一个真正的插件库,以及在 Windows 和 Linux 上更顺的安装。"
    bodyHtml: |
      <p>Tag <code>open-design-v0.9.0</code>,于 2026 年 6 月 2 日发布。<strong>7 天里 310 个 PR,98 位贡献者。</strong>代号「Design for everyone」——这是我们的<strong>「装完即创作」版本</strong>。前面三个版本,我们一直在请你「先干活,才能干活」:装一个 CLI、找一个 API key、粘贴密钥、测认证、从一份得现查的列表里挑对模型名。每一步,都是有人在真正做出第一个东西之前就放弃的地方。</p>
      <p>0.9.0 把这些步骤删掉了。</p>
      <p>如果你想看长版本,<a href="https://github.com/nexu-io/open-design/releases/tag/open-design-v0.9.0">GitHub 上的发布说明</a>有全部细节。这篇是短版本:底层改了什么、今天能拿它做什么、以及从哪开始。</p>

      <h2>为什么是「上手」这件事</h2>
      <p>设计工具的第一印象,几乎从不发生在画布上,而发生在画布之前——那段没人愿意经历的配置环节。我们盯着自己的 onboarding 漏斗看了很久,结论很扎心:大量的人在做出任何东西<em>之前</em>就走了。不是因为产品不行,是因为「开始」本身太贵。</p>
      <p>0.9.0 把开始这件事,砍成了人们真正想要的那一句话:</p>
      <blockquote><strong>打开应用 → 登录一次 → 选一个模型 → 开始创作。</strong></blockquote>
      <p>不用配置。不用装 CLI。不需要 API key。</p>

      <h2>三块主线</h2>
      <p><strong>Open Design AMR——官方 AI,装完就在。</strong>过去「开始」是一种税:装 CLI、翻 API key、粘密钥、测认证、跟 shell 较劲,然后才轮到设计。0.9.0 把 <a href="https://open-design.ai/amr">Open Design AMR</a> 直接做进了安装包——AI 引擎随安装器一起来,不用再单独装 CLI 或配 key。onboarding 现在以 AMR 打头,桌面端登录永远是一键的距离,可用模型自动保持最新,账户和余额状态就在界面上。图片附件开箱即用。登录一次,选个模型,就走。</p>
      <p><strong>agent 阵容大了一圈。</strong>Aider、Trae CLI、Antigravity、DeepSeek Reasonix 全都进了选择器,给到的是更多<em>真实的</em>本地 agent 路径,而不是一条被钦定的工作流。Aider 拿到了一等公民级的品牌呈现,Trae 通过 ACP 在 yolo 模式下跑,这些新 adapter 让 Open Design 越来越不像「一个 agent 集成」,而更像「agent 们来干活的地方」。模型选择也不再像翻电话本:列表里能直接搜,Settings 和行内切换器共享同一份 BYOK 目录,切模型变得快而不是磨叽。</p>
      <p><strong>skill 变成了一个真正的插件生态。</strong>skill bundle 现在正式毕业成一等公民的 Plugins:在抽屉里看得见、能从 CLI 列出来、在站点上被索引,也更好向用户解释。一套扩展模型、一个库、一种心智模型。官方 GSAP 插件把正经的 web 动画带进了 agent 循环;Research Decision Room 把研究类提示词变成结构化的多角色评审,而不是一长段答案。站点上的插件库现在跟应用内的分类对齐、按各语言原生阅读,插件和模板的详情页也从静态列表变成了能真正动手的发现面——预览、安装、试用、分享。</p>

      <h2>0.9.0 还带来了什么</h2>
      <p>这个版本很宽。值得拎出来的几块:</p>
      <ul>
        <li><strong>边出片边对话。</strong>模型还在跑的时候就能把下一句排队发出去,当前这轮一结束,Open Design 立刻接上。Studio 和 Draw 也走同一套流程——记下一个念头,不再得等上一条回复结束。</li>
        <li><strong>设计系统从文件变成活资产。</strong>可以重命名、把自己的钉到最上面、从颜色表里读出真实色板,还能把设计系统项目直接连到 GitHub,不用再来回倒腾 zip。</li>
        <li><strong>评审能跟着产物一起动。</strong>评论模式支持附件、实时预览更新、干净的取消选中——截图和批注始终挂在作品上,而不是把评审流程冻住。</li>
        <li><strong>自动化感觉像被排程,而不是被脚本。</strong>真正的时间选择器、自然语言摘要、最新优先排序、创建后自动聚焦、本地化、重复槽位清理,让自动化更值得信任。</li>
        <li><strong>MCP 客户端能干真正的工作区活了。</strong>写文件、删文件、删项目、解析当前项目目录、跑生成循环、一键 bootstrap Codex——外部客户端现在能参与到 Open Design 的工作区里,而不只是旁观。</li>
        <li><strong>在 Windows 和 Linux 上试用更容易了。</strong>Windows 多了一条免安装的 portable zip 路径;Linux 有了 Docker / Podman Compose 一键启动。安装摩擦更小,首跑更快。</li>
      </ul>
      <p>完整清单是 310 个 PR。<a href="https://github.com/nexu-io/open-design/releases/tag/open-design-v0.9.0">GitHub 上的发布说明</a>装着其余的部分。</p>

      <h2>今天拿它做什么</h2>
      <table>
        <thead><tr><th>如果你是…</th><th>从这开始</th></tr></thead>
        <tbody>
          <tr><td>第一次用 Open Design</td><td>下载桌面应用,用 AMR 登录一次,选个模型,直接发第一条提示词——这一版整条路上没有 API key 这一步</td></tr>
          <tr><td>已经在跑 Open Design</td><td>让打包好的自动更新把你带到 0.9.0;之后 onboarding 会以 AMR 打头</td></tr>
          <tr><td>已经在终端里驱动 Claude Code、Codex、Aider 或 Trae</td><td>把它们指向桌面应用自带的同一个 OD CLI,你已有的 agent 就是设计引擎,skill 层在不引入新应用的前提下补上品味和结构</td></tr>
          <tr><td>在 Windows 或 Linux 上</td><td>抓 Windows portable zip,或用 Linux 的 Docker / Podman Compose 一键起——不碰系统安装器也能首跑</td></tr>
        </tbody>
      </table>

      <h2>接下来</h2>
      <p>如果你一直在等「装完就能创作」这件事真的成立,这就是那个版本。下载桌面应用,用 AMR 登录,跑一个你本来要做的简报——从打开应用到第一个产物之间,这一次没有配置环节。</p>
      <p><a href="https://github.com/nexu-io/open-design/releases">下载 Open Design</a>。</p>
      <p>310 个 PR,7 天。这个「装完即创作」的版本之所以存在,是因为那么多人从那么多不同的角度出现、补上了缺失的那一块。一场运动不是从一个团队的笔记本里发出去的,是从那些到场、动手造出零件的人手里发出去的。我们看见你们了。🫡</p>

      <h2>延伸阅读</h2>
      <ul>
        <li><a href="/blog/open-design-0-8-0-everything-is-a-plugin/">Open Design 0.8.0:一切皆插件</a>——0.9.0 这一版立在其上的引擎重写</li>
        <li><a href="/blog/why-we-built-open-design-as-a-skill-layer/">为什么我们把 Open Design 做成 skill 层,而不是一个产品</a>——「是层,不是产品」这个押注背后更长的宣言</li>
        <li><a href="/blog/open-source-alternative-to-claude-design/">Claude Design 的开源替代方案</a>——这一版落在 agent 原生设计版图里的位置</li>
      </ul>
---

Tag `open-design-v0.9.0`, shipped 2 June 2026. **310 PRs from 98 contributors in seven days.** Codename "Design for everyone" — this is the **install-and-create release**. For three releases we asked you to do work before you could do work: install a CLI, find an API key, paste secrets, test authentication, pick the right model name from a list you had to look up. Every one of those steps was a place where someone bounced before they ever made anything.

0.9.0 deletes those steps.

If you want the long version, the [release notes on GitHub](https://github.com/nexu-io/open-design/releases/tag/open-design-v0.9.0) have it. This post is the short version: what changed under the hood, what you can do with it today, and where to start.

## Why getting started was the work

A design tool's first impression almost never happens on the canvas. It happens before the canvas — in the setup nobody wants to do. We stared at our own onboarding funnel long enough to reach an uncomfortable conclusion: a lot of people left *before* making anything. Not because the product was wrong, but because "start" was too expensive.

0.9.0 cuts starting down to the one line people actually wanted:

> **Open the app → sign in once → pick a model → start creating.**

No configuration. No CLI installation. No API key required.

## The three plates

**Open Design AMR — official AI, ready the moment you install.** Getting started used to be a tax: install a CLI, hunt down an API key, paste secrets, test auth, fight the shell — and only then start designing. 0.9.0 ships [Open Design AMR](https://open-design.ai/amr) inside the installer. The AI engine comes with the app; there's no separate CLI or API key to set up. Onboarding now leads with AMR, sign-in stays one click away on desktop, your available models stay fresh automatically, and account and balance status live right in the UI. Image attachments work out of the box. Sign in once, pick a model, go.

**The agent bench gets much bigger.** Aider, Trae CLI, Antigravity, and DeepSeek Reasonix all join the picker, giving builders more *real* local-agent paths instead of a single blessed workflow. Aider gets first-class branding, Trae runs over ACP in yolo mode, and the new adapters make Open Design feel less like one agent integration and more like the place where agents come to work. Model picking stops feeling like scrolling a phone book, too: search cuts through long lists, and a shared BYOK catalog keeps Settings and the inline switcher aligned so switching models is fast instead of fiddly.

**Skills become a real plugin ecosystem.** Skill bundles graduate into first-class Plugins: visible in the drawer, listable from the CLI, indexed on the site, and easier to explain to users. One extension model, one library, one mental model. The official GSAP plugin brings serious web animation into the agent loop, and Research Decision Room turns research prompts into structured multi-role reviews instead of one long answer. The on-site plugin library now mirrors the in-app taxonomy and reads natively across locales, and plugin and template detail pages turn from static listings into a real discovery surface — preview, install, try, share.

## What else lands in 0.9.0

The release is wide. The pieces worth pulling forward:

- **Keep talking while the model is still working.** Queue the next send mid-stream, and Open Design continues the moment the current turn finishes. Studio and Draw follow the same flow, so capturing an idea doesn't depend on waiting for the previous response to end.
- **Design systems move from files to living assets.** Rename them, pin your own to the top, read real swatches from their color tables, and connect design-system projects to GitHub without the zip-file shuffle.
- **Review keeps moving while the artifact changes.** Comment mode now supports attachments, live preview updates, and clean deselection, so screenshots and notes stay attached to the work instead of freezing the flow.
- **Routines feel scheduled, not scripted.** A real picker, natural-language summaries, newest-first ordering, auto-focus after create, localization, and duplicate-slot cleanup make automations easier to trust.
- **MCP clients can do real workspace work.** Write files, delete files, delete projects, resolve the active project directory, run generation loops, and bootstrap Codex from one place. External clients can now participate in the workspace instead of only observing it.
- **Trying Open Design gets easier on Windows and Linux.** Windows gets a portable zip path; Linux gets a Docker / Podman Compose one-click setup. Less install friction, faster first run.

The full list runs to 310 PRs. The [release notes on GitHub](https://github.com/nexu-io/open-design/releases/tag/open-design-v0.9.0) carry the rest.

## What to do with it today

| If you're… | Start here |
|---|---|
| New to Open Design | Download the desktop app, sign in once with AMR, pick a model, and send your first prompt — there's no API-key step on the path anymore |
| Already running Open Design | Let the packaged auto-update bring you to 0.9.0; onboarding now leads with AMR |
| Already driving Claude Code, Codex, Aider, or Trae in the terminal | Point them at the same OD CLI the desktop app ships with; your agent is the design engine and the skill layer adds taste and structure without a new app |
| On Windows or Linux | Grab the Windows portable zip, or use the Linux Docker / Podman Compose one-click setup for a first run without touching a system installer |

## What to do next

If you've been waiting for "install and create" to actually be true, this is the release. Download the desktop app, sign in with AMR, and run the brief you were going to run anyway — this time there's no setup between opening the app and the first artifact.

[Download Open Design](https://github.com/nexu-io/open-design/releases).

310 PRs in 7 days. The install-and-create release only exists because so many people showed up from so many different angles and built the missing pieces. A movement doesn't ship from one team's laptops; it ships from the people who showed up and built. We see you. 🫡

## Related reading

- [Open Design 0.8.0: everything is a plugin](/blog/open-design-0-8-0-everything-is-a-plugin/) — the engine rebuild 0.9.0 is built on top of
- [Why we built Open Design as a skill layer, not a product](/blog/why-we-built-open-design-as-a-skill-layer/) — the longer manifesto behind the "layer, not product" bet
- [The open-source alternative to Claude Design](/blog/open-source-alternative-to-claude-design/) — where this release fits in the agent-native design landscape
