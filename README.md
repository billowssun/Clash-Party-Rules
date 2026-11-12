# Clash Party Rules

自用 Mihomo Party 规则与覆写脚本，包含订阅配置模板、业务分流及个性化直连规则。

## 文件说明

| 文件 | 用途 |
| --- | --- |
| `config_two_nodes_each_group.yaml` | Mihomo 完整配置模板，包含订阅、DNS、TUN 与业务分组 |
| `Overwrite with Optimized Version.js` | JavaScript 覆写脚本 |
| `simple.js` | 简化版覆写脚本 |
| `Personalization` | 个性化规则片段 |

## 使用

在 Mihomo Party 中按文件类型导入配置或添加覆写脚本。使用完整模板前，先在本地替换订阅地址占位符，检查与现有 DNS、TUN、端口及规则的冲突。

这些配置按个人使用环境编写，不能保证适合其他网络。完整模板注明需要 Mihomo 1.19.23 或以上版本。

## 配置隐私

`Personalization` 包含个人域名和固定 IP 分流配置。公开分享前应逐项检查；真实订阅地址、节点密码、UUID 和访问令牌只保存在本地，不要提交到仓库。
