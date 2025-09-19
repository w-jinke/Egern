let url = $request.url;
let body = $response.body;

if (/ipinfo\.io\/json/.test(url)) {
    let obj = JSON.parse(body);
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

    function countryCodeToFlag(code) {
        let result = "";
        for (let i = 0; i < code.length; i++) {
            let char = code[i];
            let codePoint = char.charCodeAt(0);
            let flagCodePoint = codePoint + 127397;
            let flagChar = String.fromCodePoint(flagCodePoint);
            result += flagChar;
        }
        return result;
    }

    let orgStr = obj.org;
    let asPattern = /^AS\d+\s*/;
    let provider = orgStr.replace(asPattern, "");
    let locStr = obj.loc;
    let locParts = locStr.split(",");
    let countryCode = obj.country;
    let flag = countryCodeToFlag(countryCode);
    let countryName = countryMap[countryCode];
    if (!countryName) {
        countryName = countryCode;
    }

    let position = countryName + "-" + countryCode + flag;

    body = JSON.stringify({
        "IP": obj.ip,
        "位置": position,
        "服务": provider
    });
}

$done({ body });
