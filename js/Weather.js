let rawArg = $argument || "";
let city = rawArg.includes("=") ? rawArg.split("=")[1].trim() : rawArg.trim();
if (!city) city = "北京";

let url = "https://api.weatherapi.com/v1/forecast.json?key=2918b0641b104648aa184030251509&q=" + encodeURIComponent(city) + "&days=1";

$httpClient.get(url, function(error, response, body) {
    let output = {
        title: "今日天气",
        icon: "icloud.circle.fill",
        "icon-color": "#34E4DA"
    };

    if (error || response.status !== 200) {
        output.title = "请求错误";
        output.content = response.status;
        $done(output);
        return;
    }

    let obj = JSON.parse(body);
    let cityName = obj.location.name;
    let day = obj.forecast.forecastday[0].day;
    let maxtemp = day.maxtemp_c;
    let mintemp = day.mintemp_c;
    let feelslike = day.avgtemp_c;
    let code = day.condition.code;

    let codeMap = {
        1000:["晴","☀️"],
        1003:["局部多云","⛅"],
        1006:["多云","☁️"],
        1009:["阴天","☁️"],
        1030:["薄雾","🌫️"],
        1063:["局部阵雨","🌧️"],
        1066:["小雪","❄️"],
        1069:["小雨夹雪","🌨️"],
        1072:["小冻毛毛雨","🌨️"],
        1087:["雷暴","🌩️"],
        1114:["暴雪","❄️"],
        1117:["大雪","❄️"],
        1135:["雾","🌫️"],
        1147:["雾","🌫️"],
        1150:["小毛毛雨","🌧️"],
        1153:["小毛毛雨","🌧️"],
        1168:["冻毛毛雨","🌨️"],
        1171:["冻毛毛雨","🌨️"],
        1180:["小阵雨","🌧️"],
        1183:["小阵雨","🌧️"],
        1186:["中阵雨","🌧️"],
        1189:["中阵雨","🌧️"],
        1192:["大阵雨","⛈️"],
        1195:["大阵雨","⛈️"],
        1198:["小冻雨","🌨️"],
        1201:["中到大冻雨","🌨️"],
        1204:["小雨夹雪","🌨️"],
        1207:["中到大雨雪混合","🌨️"],
        1210:["小雪","❄️"],
        1213:["小雪","❄️"],
        1216:["中雪","❄️"],
        1219:["中雪","❄️"],
        1222:["大雪","❄️"],
        1225:["大雪","❄️"],
        1237:["冰粒","🌨️"],
        1240:["小阵雨","🌧️"],
        1243:["中阵雨","🌧️"],
        1246:["大阵雨","⛈️"],
        1249:["小冻雨","🌨️"],
        1252:["中到大冻雨","🌨️"],
        1255:["小雪","❄️"],
        1258:["大雪","❄️"],
        1261:["冰粒","🌨️"],
        1264:["冰粒","🌨️"],
        1273:["雷阵雨","🌩️"],
        1276:["雷暴","🌩️"],
        1279:["雷阵雪","🌩️❄️"],
        1282:["雷暴大雪","🌩️❄️"]
    };

    let weatherInfo = codeMap[code];
    let weatherCN = weatherInfo[0];
    let weatherEmoji = weatherInfo[1];

    output.content = `${cityName}：${feelslike}℃\n天气：${weatherCN}${weatherEmoji}\n温度：${mintemp}℃～${maxtemp}℃`;
    
    $done(output);
});
