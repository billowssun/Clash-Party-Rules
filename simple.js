function main(config) {
  const specialNames = new Set([
    "DIRECT",
    "REJECT",
    "REJECT-DROP",
    "PASS",
    "COMPATIBLE",
    "GLOBAL"
  ]);

  // =========================
  // 读取订阅节点
  // =========================

  const nodeNames = [
    ...new Set(
      (config.proxies || [])
        .map((proxy) => proxy && proxy.name)
        .filter((name) => name && !specialNames.has(name))
    )
  ];

  const providerNames = Object.keys(
    config["proxy-providers"] || {}
  );

  if (nodeNames.length === 0 && providerNames.length === 0) {
    throw new Error(
      "没有读取到订阅节点，请确认此覆写已绑定到正确订阅"
    );
  }

  // =========================
  // 节点选择组
  // =========================

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

  // =========================
  // Mihomo 基础配置
  // =========================

  config["mixed-port"] = 7893;

  config.mode = "rule";

  config["tcp-concurrent"] = true;

  config["allow-lan"] = true;

  config["bind-address"] = "*";

  config.ipv6 = false;

  config["log-level"] = "info";

  config["unified-delay"] = true;

  config["global-client-fingerprint"] = "chrome";

  config["find-process-mode"] = "strict";

  // =========================
  // GeoData
  // =========================

  config["geodata-mode"] = true;

  config["geox-url"] = {
    geoip:
      "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",

    geosite:
      "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",

    mmdb:
      "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",

    asn:
      "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  // =========================
  // Profile
  // =========================

  config.profile = {
    "store-selected": true,
    "store-fake-ip": true
  };

  // =========================
  // Sniffer
  // =========================

  config.sniffer = {
    enable: true,

    "parse-pure-ip": true,

    "force-dns-mapping": true,

    sniff: {
      HTTP: {
        ports: [
          80,
          "8080-8880"
        ],

        "override-destination": true
      },

      TLS: {
        ports: [
          443,
          8443
        ]
      },

      QUIC: {
        ports: [
          443,
          8443
        ]
      }
    }
  };

  // =========================
  // TUN
  // =========================

  config.tun = {
    enable: true,

    stack: "mixed",

    "auto-route": true,

    "auto-detect-interface": true,

    // DNS 请求全部交给 Mihomo
    "dns-hijack": [
      "any:53",
      "tcp://any:53"
    ]
  };

  // =========================
  // DNS
  //
  // 重点：
  //
  // 不使用：
  // proxy-server-nameserver
  // proxy-server-nameserver-policy
  // nameserver-policy
  //
  // 避免触发 Clash Party
  // 订阅 DNS 覆写保护冲突
  // =========================

  config.dns = {
    enable: true,

    // Mihomo DNS 监听端口
    listen: ":1053",

    ipv6: false,

    // Fake-IP 模式
    "enhanced-mode": "fake-ip",

    "fake-ip-range": "198.18.0.1/16",

    // DNS 缓存
    "cache-algorithm": "arc",

    // =====================
    // Fake-IP 排除
    // =====================

    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "+.direct",
      "+.home.arpa",

      // Windows 网络检测
      "+.msftconnecttest.com",
      "+.msftncsi.com",

      // Apple Push
      "+.push.apple.com",

      // STUN / WebRTC
      "+.stun.*",
      "+.stun.*.*",
      "+.stun.*.*.*"
    ],

    // =====================
    // Bootstrap DNS
    //
    // 用于解析 DoH 本身域名
    // =====================

    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    // =====================
    // DIRECT 流量 DNS
    //
    // 中国大陆域名优先使用
    // 国内 DNS
    // =====================

    "direct-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    // =====================
    // 主 DNS
    // =====================

    nameserver: [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    // =====================
    // 国外 DNS fallback
    // =====================

    fallback: [
      "https://1.1.1.1/dns-query",
      "https://8.8.8.8/dns-query"
    ],

    // =====================
    // DNS 污染判断
    // =====================

    "fallback-filter": {
      geoip: true,

      "geoip-code": "CN",

      geosite: [
        "gfw"
      ],

      ipcidr: [
        "0.0.0.0/32",
        "127.0.0.1/32",
        "240.0.0.0/4"
      ]
    }
  };

  // =========================
  // Proxy Groups
  // =========================

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

  // =========================
  // Rule Provider 工厂函数
  // =========================

  const classicalProvider = (
    path,
    url
  ) => ({
    type: "http",

    behavior: "classical",

    format: "text",

    interval: 86400,

    path,

    url
  });

  // =========================
  // Rule Providers
  // =========================

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

  // =========================
  // Rules
  //
  // 顺序非常重要
  // 越靠前优先级越高
  // =========================

  config.rules = [
    // 广告
    "RULE-SET,AD,REJECT",

    // 明确直连
    "RULE-SET,Direct,DIRECT",

    // 国内域名
    "RULE-SET,ChinaDomain,DIRECT",

    // =====================
    // AI
    // =====================

    "RULE-SET,AI,节点选择",

    // =====================
    // Apple
    // =====================

    "RULE-SET,Apple,节点选择",

    // =====================
    // Google / YouTube
    // =====================

    "RULE-SET,YouTube,节点选择",

    "RULE-SET,Google,节点选择",

    // =====================
    // Telegram / Twitter
    // =====================

    "RULE-SET,Telegram,节点选择",

    "RULE-SET,Twitter,节点选择",

    // =====================
    // 游戏
    // =====================

    "RULE-SET,Steam,节点选择",

    "RULE-SET,Epic,节点选择",

    // =====================
    // 流媒体
    // =====================

    "RULE-SET,Emby,节点选择",

    "RULE-SET,Spotify,节点选择",

    "RULE-SET,Bahamut,节点选择",

    "RULE-SET,Netflix,节点选择",

    "RULE-SET,Disney,节点选择",

    "RULE-SET,PrimeVideo,节点选择",

    "RULE-SET,HBO,节点选择",

    // =====================
    // 常用服务
    // =====================

    "GEOSITE,onedrive,节点选择",

    "GEOSITE,github,节点选择",

    "GEOSITE,microsoft,节点选择",

    // GFW
    "GEOSITE,gfw,节点选择",

    "RULE-SET,ProxyGFW,节点选择",

    // =====================
    // 中国 IP
    // =====================

    "RULE-SET,ChinaIP,DIRECT",

    // 私有网络
    "GEOIP,private,DIRECT",

    // 中国大陆
    "GEOIP,cn,DIRECT",

    // =====================
    // 剩余流量
    // =====================

    "MATCH,其他流量"
  ];

  return config;
}
