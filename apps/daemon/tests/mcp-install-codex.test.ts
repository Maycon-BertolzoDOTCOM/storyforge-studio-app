import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  installCodexMcp,
  probeCodexInstall,
  setCodexRunner,
  uninstallCodexMcp,
  type CodexRunner,
} from '../src/codex-cli.js';

// One-click "Install to Codex" relies on the bundled `codex` CLI's own
// `codex mcp add/remove/get` subcommands rather than rewriting
// ~/.codex/config.toml ourselves. This file pins the argv we hand it,
// the ENOENT / not-found / installed branches of the probe, and the
// shape of the spec we receive from buildMcpInstallPayload.

interface RecordedCall {
  args: string[];
  env?: Record<string, string>;
}

function makeStubRunner(impl: (call: RecordedCall) => Promise<{ exitCode: number; stdout: string; stderr: string }>): CodexRunner & { calls: RecordedCall[] } {
  const calls: RecordedCall[] = [];
  const runner = {
    calls,
    async run(args: string[], opts?: { env?: Record<string, string> }) {
      const call: RecordedCall = opts?.env ? { args, env: opts.env } : { args };
      calls.push(call);
      return impl(call);
    },
  };
  return runner;
}

afterEach(() => {
  setCodexRunner(null);
  vi.restoreAllMocks();
});

describe('codex-cli probe', () => {
  it('reports available:false when the codex binary is missing (ENOENT)', async () => {
    const runner = makeStubRunner(async () => {
      const err = new Error('spawn codex ENOENT') as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    });
    setCodexRunner(runner);

    const status = await probeCodexInstall('storyforge');
    expect(status).toEqual({ available: false, installed: false });
    expect(runner.calls).toHaveLength(1);
    expect(runner.calls[0]?.args).toEqual(['mcp', 'get', 'storyforge']);
  });

  it('reports available:true installed:false when `codex mcp get` says no such server', async () => {
    const runner = makeStubRunner(async () => ({
      exitCode: 1,
      stdout: '',
      stderr: "Error: No MCP server named 'storyforge' found.\n",
    }));
    setCodexRunner(runner);

    const status = await probeCodexInstall('storyforge');
    expect(status).toEqual({ available: true, installed: false });
  });

  it('reports available:true installed:true when `codex mcp get` returns the server entry', async () => {
    const runner = makeStubRunner(async () => ({
      exitCode: 0,
      stdout: 'storyforge\n  enabled: true\n  transport: stdio\n',
      stderr: '',
    }));
    setCodexRunner(runner);

    const status = await probeCodexInstall('storyforge');
    expect(status).toEqual({ available: true, installed: true });
  });
});

describe('codex-cli install', () => {
  it('shells out `codex mcp add` with --env pairs and -- before the command', async () => {
    const runner = makeStubRunner(async () => ({ exitCode: 0, stdout: "Added global MCP server 'storyforge'.\n", stderr: '' }));
    setCodexRunner(runner);

    await installCodexMcp({
      name: 'storyforge',
      command: '/path/to/node',
      args: ['/path/to/cli.js', 'mcp'],
      env: { OD_DATA_DIR: '/tmp/od', OD_SIDECAR_IPC_PATH: '/tmp/sock' },
    });

    expect(runner.calls).toHaveLength(1);
    expect(runner.calls[0]?.args).toEqual([
      'mcp',
      'add',
      'storyforge',
      '--env',
      'OD_DATA_DIR=/tmp/od',
      '--env',
      'OD_SIDECAR_IPC_PATH=/tmp/sock',
      '--',
      '/path/to/node',
      '/path/to/cli.js',
      'mcp',
    ]);
  });

  it('rejects when codex exits non-zero, surfacing stderr', async () => {
    const runner = makeStubRunner(async () => ({ exitCode: 1, stdout: '', stderr: "Error: 'storyforge' already exists\n" }));
    setCodexRunner(runner);

    await expect(
      installCodexMcp({ name: 'storyforge', command: 'node', args: ['cli.js', 'mcp'], env: {} }),
    ).rejects.toThrow(/already exists/);
  });

  it('omits the --env block entirely when env is empty', async () => {
    const runner = makeStubRunner(async () => ({ exitCode: 0, stdout: '', stderr: '' }));
    setCodexRunner(runner);

    await installCodexMcp({ name: 'storyforge', command: '/n', args: ['cli'], env: {} });
    expect(runner.calls[0]?.args).toEqual(['mcp', 'add', 'storyforge', '--', '/n', 'cli']);
  });
});

describe('codex-cli uninstall', () => {
  it('shells out `codex mcp remove <name>`', async () => {
    const runner = makeStubRunner(async () => ({ exitCode: 0, stdout: '', stderr: '' }));
    setCodexRunner(runner);

    await uninstallCodexMcp('storyforge');
    expect(runner.calls[0]?.args).toEqual(['mcp', 'remove', 'storyforge']);
  });

  it('rejects when codex exits non-zero', async () => {
    const runner = makeStubRunner(async () => ({ exitCode: 1, stdout: '', stderr: 'Error: not found\n' }));
    setCodexRunner(runner);
    await expect(uninstallCodexMcp('storyforge')).rejects.toThrow(/not found/);
  });
});
