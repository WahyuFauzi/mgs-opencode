# Tool Index

- Generated at: 2026-08-02 12:09:27 +0700
- Platform: macos (Darwin 25.6.0)
- Script: `skills/scripts/refresh-tool-index.sh`
- Note: This script detects tools only. It does not install tools.

| Tool | Skill | Purpose | Available | Path | Version | Source | Install hint |
|---|---|---|---|---|---|---|---|
| java | core-runtime | Java runtime for jadx/apktool/Burp/Ghidra | yes | /usr/bin/java | The operation couldn’t be completed. Unable to locate a Java Runtime. | command | brew: brew install openjdk |
| python3 | core-runtime | Python runtime for helper scripts and pipx tools | yes | /usr/local/bin/python3 | Python 3.14.6 | command | brew: brew install python; then pipx/venv |
| pipx | core-runtime | Isolated Python CLI installer | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| node | core-runtime | Node.js runtime for MCP bridges | yes | /opt/homebrew/bin/node | v26.5.0 | command | brew/nvm: brew install node; or nvm |
| npm | core-runtime | Node package manager | yes | /opt/homebrew/bin/npm | 11.17.0 | command | see PLATFORMS.md and docs/platforms/macos.md |
| npx | core-runtime | Run npm MCP packages | yes | /opt/homebrew/bin/npx | 11.17.0 | command | see PLATFORMS.md and docs/platforms/macos.md |
| jadx | apk-reverse | APK Java/Kotlin decompiler | no | — | — | — | brew: brew install jadx |
| apktool | apk-reverse | APK decode and rebuild | no | — | — | — | brew: brew install apktool |
| adb | apk-reverse | Android device bridge | no | — | — | — | brew: brew install android-platform-tools |
| frida | reverse-engineering | Dynamic instrumentation CLI | no | — | — | — | pipx: pipx install frida-tools |
| frida-ps | reverse-engineering | Frida process listing | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| r2 | radare2 | radare2 CLI analysis | no | — | — | — | brew: brew install radare2 |
| rabin2 | radare2 | Binary metadata extraction | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| ghidra | reverse-engineering | Ghidra reverse-engineering suite | no | — | — | — | brew: brew install ghidra or brew install --cask ghidra |
| idapro | ida-reverse | IDA Pro commercial reverse-engineering suite | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| burpsuite | burp-mcp | BurpSuite desktop application | no | — | — | — | brew cask/manual: brew install --cask burp-suite |
| graphviz | diagram-generator | Graphviz diagram rendering | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| plantuml | diagram-generator | PlantUML diagram rendering | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| nmap | pentest-tools | Network scanner | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| sqlmap | pentest-tools | SQL injection testing tool | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| ffuf | pentest-tools | Web fuzzer | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| hashcat | pentest-tools | Password recovery | no | — | — | — | see PLATFORMS.md and docs/platforms/macos.md |
| nuclei | pentest-tools | Template-based vulnerability scanner | no | — | — | — | brew: brew install nuclei |
| binwalk | firmware-pentest | Firmware extraction and analysis | no | — | — | — | brew: brew install binwalk |
| seclists | pentest-tools | Security wordlists | no | — | — | — | git clone https://github.com/danielmiessler/SecLists ~/tools/SecLists |
| jshookmcp | js-reverse | JS/CDP/Hook MCP runtime via npx | yes | /opt/homebrew/bin/npx | 11.17.0 | command | npx: npx -y @jshookmcp/jshook@0.3.4 |
| anything-analyzer | browser-automation | Browser/HTTP analyzer MCP project | no | — | — | — | git clone + corepack enable + pnpm install + pnpm dev |
| burp-mcp-full | burp-mcp | Local Burp MCP extension and stdio bridge | yes | /Users/user/projects/ai-skills/reverse-skill/burp-mcp-full/mcp-bridge.js | — | path-probe | see PLATFORMS.md and docs/platforms/macos.md |
| binwalk | firmware-pentest | Firmware extraction and analysis | no | — | — | — | brew: brew install binwalk |
| yara | malware-analysis | Malware rule matching engine | no | — | — | — | brew: brew install yara |
| pwntools | reverse-engineering | CTF pwn exploit development framework | no | — | — | — | pipx: pipx install pwntools |

---

## Next steps

- Read `docs/platforms/macos.md` for Homebrew and app-bundle setup.
- Register MCP servers in your Agent client; tool availability does not imply MCP registration.

---

## 能力状态视图 (Capability Status)

| 能力 | 工具可用 | Ready | MCP 已注册 | 服务在线 | MCP HTTP | 可自动安装 | 安装方式 |
|------|---------|-------|-----------|---------|----------|-----------|---------|
| jadx | ✗ | ✗ | — | — | — | ✓ | github-release-zip |
| apktool | ✗ | ✗ | — | — | — | ✓ | github-release-jar-wrapper |
| frida | ✗ | ✗ | — | — | — | ✓ | pip-package |
| frida-ps | ✗ | ✗ | — | — | — | ✓ | pip-package |
| idalib-mcp | ✗ | ✗ | — | — | — | ✓ | pip-package |
| jshookmcp | ✓ | ✗ | — | — | — | ✓ | npm-mcp |
| anything-analyzer | ✗ | ✗ | — | — | — | ✓ | local-http-mcp |
| idapro | ✗ | ✗ | — | — | — | ✓ | local-http-mcp |
| r2 | ✗ | ✗ | — | — | — | ✓ | github-release-zip |
| rabin2 | ✗ | ✗ | — | — | — | ✓ | github-release-zip |
| adb | ✗ | ✗ | — | — | — | ✓ | winget-package |
| agent-browser | ✗ | ✗ | — | — | — | ✓ | npm-global |
| ghidra-mcp | ✗ | ✗ | — | — | — | ✓ | github-release-zip |
| seclists | ✗ | ✗ | — | — | — | ✓ | git-clone |
| proxycat | ✗ | ✗ | — | — | — | ✓ | git-clone |
| burpsuite-mcp | ✗ | ✗ | — | — | — | ✗ | local-http-mcp |
| nmap | ✗ | ✗ | — | — | — | ✓ | winget-package |
| pentestswarm | ✗ | ✗ | — | — | — | ✓ | go-install |
| binwalk | ✗ | ✗ | — | — | — | ✓ | winget-package |
| yara | ✗ | ✗ | — | — | — | ✓ | winget-package |
| pwntools | ✗ | ✗ | — | — | — | ✓ | pip-package |

> ✓ = 是 | ✗ = 否 | — = 不适用或未检测

