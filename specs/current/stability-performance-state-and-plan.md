# 稳定性 & 性能:现状与修复/优化计划

Status: living doc · Parent: #3408 · 这是给 reviewer 的**背景 + 计划总览**;每条修复/优化各有(或将有)独立下钻 spec。

---

# Part 1 · 现状(reviewer 背景)

接手 #3408 后,用 PostHog(生产遥测)+ Langfuse + 本地真实 daemon + 读源码(含本地 vela 仓库),把稳定性/性能彻底排查了一遍。结论:**多数"问题"要么不是我们能修的、要么已经做了、要么是我们在测错。真正该投工程的没那么多,但都定位清楚了。**

## 1.1 我们怎么测(指标口径)
失败按两个视角拆(对齐「0.10.0 Release Health」官方口径,已推广到主看板滚动全版本):
- **产品视角失败率 ≈ 13.5%**:用户面向失败(auth / 余额 / user_cancel / prompt 过大 / 模型不可用 / config…)。用户体验/留存信号。
- **工程视角失败率 ≈ 7%**:引擎可修失败(process_exit / timeout / upstream / empty_output / tool_error / rate_limit / unknown)。**这才是"我们能修的产品可靠性",是工程发力点。**
- 旧"全量失败率 ≈ 22%"把"用户自救 + 老版本噪音"算进去 → 虚高 ~3 倍,误导。

> 实测:7d ~41k 失败里,user-action(login/recharge…)= 43%,老版本 (null) = 19%,真·产品/上游故障只占 38%。

## 1.2 失败地图(谁的锅)
| 类别 | 占比 | 性质 |
|---|---|---|
| user-action(login/recharge) | ~40% | **不是我们锅**:外部 CLI 凭据过期,用户登录/充值即可。已确认 `spawnEnvForAgent` 不隔离 HOME、不破坏 token 刷新。 |
| 老版本 (null 分类) | ~19% | 分类器(#3412)0.10.0 才上线;随升级自愈。 |
| **被 user_action 标签盖住的我方 bug** | — | fix_config(codex 配置)、reduce_context(无总预算)、switch_model(stale 模型目录)= **我们的 bug,该修不该排除**。 |
| **真·引擎故障** | ~38% of fails | process_exit / execution_failed(#4502 在拆)、timeout、upstream、empty_output。 |

## 1.3 性能地图(TTFT)
- TTFT 大头是**模型首字节**(claude 自报 `[API:timing] 3140ms`,provider 侧,动不了);setup(claude ~1.7s / opencode ~2.3s)里 MCP 连接是唯一可变项、但随用户配的 MCP 数变。
- **已排除的 phantom**:bun install(ship 版 opencode 自包含)、进程冷启动、claude session(main 已 `--resume`)、前缀前置(作者基本做了)。
- **埋点误导**:opencode/codex/gemini "慢 TTFT"(31s/20s/78s)大半是 `time_to_first_token` 量"首个可见文本",而 agentic CLI 先 planning+调工具再出文本(实证:opencode 有 tool 比无 tool +12s)→ 用户看得到进度、非冻住。
- **真大头(但是项目)**:AMR 每轮重发整段历史(turn-1 ~100k / turn-2+ ~153k 未缓存 token)→ 延迟 + 烧 balance。优化在 vela/opencode 栈,是跨仓项目。

## 1.4 用户 reach(关键优先级轴)
全平台 20,016 用户/7d:claude_code 36% · **AMR 31%(6,217 人,run 少≠影响小)** · codex 23% · opencode 16% · gemini 7%。**按用户数排优先级,不只 run 数。**

---

# Part 2 · 修复/优化计划(先写全,再逐个下钻)

按 `our-fault × ROI × 用户reach × 工程成本` 排。每条标注:类型 / 我方锅 / 预期收益 / 状态 / 成本 / 下钻 spec。

### P0-a · 可靠性指标校准 ✅ 已做
- **类型** 观测 · **我方锅** N/A · **收益** 让"工程视角 ~7%"可见,不被噪音淹没 · **成本** 极小
- **状态** ✅ 主看板已加 tile,对齐 Release Health 口径;扫了其他看板,多数(前端健康/成功率/失败归因)不需校准。
- 下钻:无(已完成)

### P0-b · fix_config:codex service_tier 归一化器补漏 ⭐ 下一个动手
- **类型** 引擎 bug · **我方锅** 100% · **收益** 工程视角失败率直接降一点(~380/周,当前版本)· **成本** 小(一个文件)
- **现状** `codex-config-normalize.ts` 只接住 `service_tier="priority"→"fast"`,其他无效值漏过(注释明说不管)。380/周全在 0.10.x/0.11(真 bug 非噪音)。
- **修** 改成"非法值(不在 {fast,flex})通配归一化",防打地鼠 + 防未来改名;红 spec 用可注入 `CodexConfigIO`。先 Langfuse 采真实无效值。
- 下钻:待写

### P1 · process_exit / execution_failed 深挖(#4502 续) 
- **类型** 引擎 bug · **我方锅** 高 · **收益** 工程视角最大单桶(execution_failed ~4,500/周)· **成本** 中(需 Langfuse 挖)
- **现状** #4502 已把 execution_failed 按 close-reason 拆成 stream_error/exit_nonzero/fatal_rpc_error(in review)。下一步挖 stream_error 真实错误(opencode 多吞真因,需 Langfuse + 可能 opencode 侧加日志)。
- 下钻:#4502 + 续

### P1 · reduce_context:总预算截断
- **类型** 引擎 bug · **我方锅** 高 · **收益** ~787/周 prompt_too_large · **成本** 中
- **现状** 只有单条 12k 截断(`MAX_TRANSCRIPT_MESSAGE_CHARS`),**无总预算上限** → 长对话撑爆窗口。和 AMR 历史瘦身同源。
- **修** 总预算感知截断/摘要,或自动换大上下文模型。
- 下钻:待写

### P2 · switch_model:模型目录卫生
- **类型** 引擎 bug · **我方锅** 高 · **收益** ~300/周 · **成本** 中
- **现状** 列了用户实际用不了的模型(codex cli_version_incompatible / model_not_found)。
- **修** 只列可用模型 + 不可用时 fallback。
- 下钻:待写

### P2 · TTFT 指标口径修正
- **类型** 观测 · **我方锅** N/A · **收益** 让 agentic CLI 的"慢 TTFT"反映真实体感(模型首 token 而非首个可见文本)· **成本** 中
- **现状** TTFT 把 planning+工具 loop 算进首 token,误导(opencode 31s 等)。
- **修** 加/改埋点量"模型首 token"。
- 下钻:待写

### P3(项目)· AMR 延迟:session 复用 + 缓存效率
- **类型** 性能项目(跨仓 vela)· **我方锅** 是(架构)· **收益** 续轮 ~11s→~6-7s + 降 token/balance(联动 insufficient_balance);**reach 31% 用户** · **成本** 大(立项)
- **现状** 已有专门 spec + codex 可行性核查:缓存已在 Vela Link 网关做(无 1h TTL);session 复用是架构改造(vela `loadSession:false`+每轮删 temp home,opencode reload 未验)。两步:Step1 网关 1h TTL+稳前缀(小);Step2 session 复用(大)。
- 下钻:`amr-latency-session-reuse-prompt-cache.md`

---

## 不做(已排除,记录理由)
- ❌ 非 AMR auth 预检:不是我们锅 + 用户自愈 = vanity metrics。
- ❌ bun install / 进程冷启动 / claude session 复用 / 前缀大改:已做或不存在。
- ❌ opencode 31s 当"性能 bug"修:大半是埋点口径(见 P2)。

## 推进顺序建议
**P0-b(fix_config)→ P1(process_exit 续 + reduce_context)→ P2(switch_model + TTFT 口径)→ P3(AMR 立项)。** P0-a 已完成。
