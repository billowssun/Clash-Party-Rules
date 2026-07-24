function main(config) {
  const specialNames = new Set([
    "DIRECT",
    "REJECT",
    "REJECT-DROP",
    "PASS",
    "COMPATIBLE",
    "GLOBAL"
  ]);

  const nodeNames = [
    ...new Set(
      (config.proxies || [])
        .map((proxy) => proxy && proxy.name)
        .filter((name) => name && !specialNames.has(name))
    )
  ];

  const providerNames = Object.keys(config["proxy-providers"] || {});

  if (nodeNames.length === 0 && providerNames.length === 0) {
    throw new Error("没有读取到订阅节点，请确认此覆写已绑定到正确订阅");
  }

  const nodeGroup = {
    name: "节点选择",
    type: "select",
    icon:
      "https://github.com/shindgewongxj/WHATSINStash/raw/main/icon/applesafari.png"
  };

  if (nodeNames.length > 0) {
    nodeGroup.proxies = nodeNames;
  }

  if (providerNames.length > 0) {
    nodeGroup.use = providerNames;
  }

  /*
   * 覆写只管理代理组和分流规则。
   * TUN、DNS、嗅探、端口等设置全部交给 Clash Party 图形界面。
   */
  config.mode = "rule";

  config["proxy-groups"] = [
    nodeGroup,
    {
      name: "其他流量",
      type: "select",
      proxies: [
        "节点选择",
        "DIRECT"
      ],
      icon:
        "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png"
    }
  ];

  const classicalProvider = (path, url) => ({
    type: "http",
    behavior: "classical",
    format: "text",
    interval: 86400,
    path,
    url
  });

  config["rule-providers"] = {
    AD: classicalProvider(
      "./rules/AD.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Reject.list"
    ),

    Direct: classicalProvider(
      "./rules/Direct.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Direct.list"
    ),

    ChinaDomain: classicalProvider(
      "./rules/ChinaDomain.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/ChinaDomain.list"
    ),

    ChinaIP: classicalProvider(
      "./rules/ChinaIP.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/ChinaIP.list"
    ),

    ProxyGFW: classicalProvider(
      "./rules/ProxyGFW.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/ProxyGFW.list"
    ),

    Apple: classicalProvider(
      "./rules/Apple.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Apple.list"
    ),

    YouTube: classicalProvider(
      "./rules/YouTube.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/YouTube.list"
    ),

    Google: classicalProvider(
      "./rules/Google.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Google.list"
    ),

    Telegram: classicalProvider(
      "./rules/Telegram.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Telegram.list"
    ),

    Twitter: classicalProvider(
      "./rules/Twitter.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Twitter.list"
    ),

    Steam: classicalProvider(
      "./rules/Steam.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Steam.list"
    ),

    Epic: classicalProvider(
      "./rules/Epic.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Epic.list"
    ),

    AI: classicalProvider(
      "./rules/AI.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/AI.list"
    ),

    Emby: classicalProvider(
      "./rules/Emby.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Emby.list"
    ),

    Spotify: classicalProvider(
      "./rules/Spotify.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Spotify.list"
    ),

    Bahamut: classicalProvider(
      "./rules/Bahamut.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Bahamut.list"
    ),

    Netflix: classicalProvider(
      "./rules/Netflix.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Netflix.list"
    ),

    Disney: classicalProvider(
      "./rules/Disney.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Disney.list"
    ),

    PrimeVideo: classicalProvider(
      "./rules/PrimeVideo.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/PrimeVideo.list"
    ),

    HBO: classicalProvider(
      "./rules/HBO.list",
      "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/HBO.list"
    )
  };

  config.rules = [
    "RULE-SET,AD,REJECT",

    /*
     * OpenAI 与 Codex 相关域名优先匹配。
     * 必须放在 Direct 和 ChinaDomain 前面，避免被第三方直连规则截走。
     */
    "DOMAIN,chatgpt.com,节点选择",
    "DOMAIN-SUFFIX,chatgpt.com,节点选择",
    "DOMAIN-SUFFIX,openai.com,节点选择",
    "DOMAIN-SUFFIX,oaistatic.com,节点选择",
    "DOMAIN-SUFFIX,oaiusercontent.com,节点选择",
    "DOMAIN-SUFFIX,oaistatsig.com,节点选择",
    "DOMAIN-SUFFIX,openaimerge.com,节点选择",
    "DOMAIN-SUFFIX,workos.com,节点选择",
    "DOMAIN-SUFFIX,workoscdn.com,节点选择",
    "DOMAIN,challenges.cloudflare.com,节点选择",

    "RULE-SET,Direct,DIRECT",
    "RULE-SET,ChinaDomain,DIRECT",

    "RULE-SET,AI,节点选择",
    "RULE-SET,Apple,节点选择",
    "RULE-SET,YouTube,节点选择",
    "RULE-SET,Google,节点选择",
    "RULE-SET,Telegram,节点选择",
    "RULE-SET,Twitter,节点选择",
    "RULE-SET,Steam,节点选择",
    "RULE-SET,Epic,节点选择",
    "RULE-SET,Emby,节点选择",
    "RULE-SET,Spotify,节点选择",
    "RULE-SET,Bahamut,节点选择",
    "RULE-SET,Netflix,节点选择",
    "RULE-SET,Disney,节点选择",
    "RULE-SET,PrimeVideo,节点选择",
    "RULE-SET,HBO,节点选择",

    "GEOSITE,onedrive,节点选择",
    "GEOSITE,github,节点选择",
    "GEOSITE,microsoft,节点选择",
    "GEOSITE,gfw,节点选择",

    "RULE-SET,ProxyGFW,节点选择",

    "GEOIP,private,DIRECT,no-resolve",
    "RULE-SET,ChinaIP,DIRECT",
    "GEOIP,cn,DIRECT",

    "MATCH,其他流量"
  ];

  return config;
}
