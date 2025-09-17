let url = "http://ipinfo.io/json";
let countryMap = {
  "HK": "香港",
  "US": "美国",
  "JP": "日本",
  "TW": "台湾",
  "DE": "德国",
  "FR": "法国",
  "GB": "英国",
  "TH": "泰国",
  "VN": "越南",
  "SG": "新加坡",
  "KR": "韩国",
  "IT": "意大利",
  "ES": "西班牙",
  "RU": "俄罗斯",
  "IN": "印度",
  "BR": "巴西",
  "CA": "加拿大",
  "AU": "澳大利亚",
  "MX": "墨西哥",
  "MY": "马来西亚",
  "PH": "菲律宾",
  "ID": "印尼",
  "TR": "土耳其",
  "SA": "沙特阿拉伯",
  "AE": "阿联酋",
  "CH": "瑞士",
  "SE": "瑞典",
  "NO": "挪威",
  "FI": "芬兰",
  "NL": "荷兰",
  "BE": "比利时",
  "PL": "波兰",
  "AR": "阿根廷",
  "CL": "智利",
  "ZA": "南非",
  "EG": "埃及",
  "NZ": "新西兰",
  "DK": "丹麦",
  "AT": "奥地利",
  "IE": "爱尔兰",
  "PT": "葡萄牙",
  "GR": "希腊",
  "HU": "匈牙利",
  "CZ": "捷克",
  "RO": "罗马尼亚",
  "UA": "乌克兰",
  "IL": "以色列",
  "IR": "伊朗",
  "PK": "巴基斯坦",
  "BD": "孟加拉国",
  "NG": "尼日利亚",
  "KE": "肯尼亚",
  "CO": "哥伦比亚",
  "PE": "秘鲁",
  "CU": "古巴"
};

function countryCodeToEmoji(code) {
  if (!code || code.length !== 2) return code;
  const A = 0x1F1E6;
  return String.fromCodePoint(
    A + code.charCodeAt(0) - 65,
    A + code.charCodeAt(1) - 65
  );
}

$httpClient.get(url, function (error, response, data) {
  let obj = JSON.parse(data);
  let ip = obj.ip || "";
  let countryCode = obj.country || "";
  let countryEmoji = countryCodeToEmoji(countryCode);
  let loc = (obj.loc || "").replace(",", "-");
  let org = (obj.org || "").replace(/^AS\d+\s*/, "");

  let output = {
    title: "节点信息",
    icon: "location.north.circle.fill",
    "icon-color": "#0090FF",
    content: `位置：${countryMap[countryCode] || ""}-${countryCode}${countryEmoji}\n所属：IP${ip}\n服务：${org}\n坐标：${loc}`
  };
  $done(output);
});
