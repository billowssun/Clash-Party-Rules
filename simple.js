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
    type: "select"
  };

  if (nodeNames.length > 0) {
    nodeGroup.proxies = nodeNames;
  }

  if (providerNames.length > 0) {
    nodeGroup.use = providerNames;
  }

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

  config.profile = {
    "store-selected": true,
    "store-fake-ip": true
  };

  config.sniffer = {
    enable: true,
    "parse-pure-ip": true,
    "force-dns-mapping": true,
    sniff: {
      HTTP: {
        ports: [80, "8080-8880"],
        "override-destination": true
      },
      TLS: {
        ports: [443, 8443]
      },
      QUIC: {
        ports: [443, 8443]
      }
    }
  };

  config.tun = {
    enable: true,
    stack: "mixed",
    "auto-route": true,
    "auto-detect-interface": true,
    "dns-hijack": [
      "any:53",
      "tcp://any:53"
    ]
  };

  config.dns = {
    enable: true,
    listen: ":1053",
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "cache-algorithm": "arc",

    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "+.direct",
      "+.home.arpa",
      "+.msftconnecttest.com",
      "+.msftncsi.com",
      "+.push.apple.com",
      "+.stun.*",
      "+.stun.*.*",
      "+.stun.*.*.*"
    ],

    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],

    "proxy-server-nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    nameserver: [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query"
    ],

    fallback: [
      "https://1.1.1.1/dns-query",
      "https://8.8.8.8/dns-query"
    ],

    "fallback-filter": {
      geoip: true,
      "geoip-code": "CN",
      geosite: ["gfw"],
      ipcidr: [
        "0.0.0.0/32",
        "127.0.0.1/32",
        "240.0.0.0/4"
      ]
    }
  };

nodeGroup.icon =
  "https://github.com/shindgewongxj/WHATSINStash/raw/main/icon/applesafari.png";

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

  ```
config.rules = [
  "RULE-SET,AD,REJECT",

  // 明确需要直连
  "RULE-SET,Direct,DIRECT",
  "RULE-SET,ChinaDomain,DIRECT",

  // 明确需要代理
  "RULE-SET,AI,节点选择",
  "RULE-SET,YouTube,节点选择",
  "RULE-SET,Google,节点选择",
  "RULE-SET,Telegram,节点选择",
  "RULE-SET,Twitter,节点选择",
  "RULE-SET,Emby,节点选择",
  "RULE-SET,Spotify,节点选择",
  "RULE-SET,Bahamut,节点选择",
  "RULE-SET,Netflix,节点选择",
  "RULE-SET,Disney,节点选择",
  "RULE-SET,PrimeVideo,节点选择",
  "RULE-SET,HBO,节点选择",

  "GEOSITE,onedrive,节点选择",
  "GEOSITE,github,节点选择",
  "GEOSITE,gfw,节点选择",

  // 第三方维护的代理域名集合
  "RULE-SET,ProxyGFW,节点选择",

  // 国内 IP 直连
  "RULE-SET,ChinaIP,DIRECT,no-resolve",
  "GEOIP,private,DIRECT,no-resolve",
  "GEOIP,cn,DIRECT,no-resolve",

  // 所有仍未识别的流量默认直连
  "MATCH,其他流量"
];
```
