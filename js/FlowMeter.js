const args = {};
$argument.split("&").forEach(p => {
    const index = p.indexOf("=");
    const key = p.substring(0, index);
    const value = p.substring(index + 1);
    args[key] = decodeURIComponent(value);
});

(async () => {
    if (!args.url) {
        $done({ title: "订阅流量", content: "未提供订阅 URL" });
        return;
    }

    const content = await new Promise(resolve => {
        $httpClient.get(
            { url: args.url, headers: { "User-Agent": "Quantumult%20X/1.5.2" } },
            (err, resp) => {
                if (err || !resp || resp.status !== 200) {
                    resolve(`请求失败状态码：${resp ? resp.status : "错误"}`);
                    return;
                }

                // 解析流量信息
                const data = {};
                const headerKey = Object.keys(resp.headers).find(
                    k => k.toLowerCase() === "subscription-userinfo"
                );
                if (headerKey && resp.headers[headerKey]) {
                    resp.headers[headerKey].split(";").forEach(p => {
                        const [k, v] = p.trim().split("=");
                        if (k && v) data[k] = parseInt(v);
                    });
                }

                const used = (data.upload || 0) + (data.download || 0);
                const total = data.total || 0;
                const percent = total > 0 ? Math.round((used / total) * 100) : 0;

                // 流量信息
                const lines = [
                    `已用：${percent}%`,
                    `流量：${(used / 1024 / 1024 / 1024).toFixed(2)} GB-${(total / 1024 / 1024 / 1024).toFixed(2)} GB`
                ];

                // 到期信息
                if (data.expire) {
                    const d = new Date(data.expire * 1000);
                    lines.push(`到期：${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}号`);
                }

                // 重置天数
                if (args.resetDay) {
                    const resetDay = parseInt(args.resetDay);
                    const today = new Date();
                    const nowDay = today.getDate();
                    const nowMonth = today.getMonth();
                    const nowYear = today.getFullYear();
                    const resetDate =
                        nowDay < resetDay
                            ? new Date(nowYear, nowMonth, resetDay)
                            : new Date(nowYear, nowMonth + 1, resetDay);
                    const diff = Math.ceil((resetDate - today) / (1000 * 60 * 60 * 24));
                    lines.push(`重置：${diff}天`);
                }

                resolve(lines.join("\n"));
            }
        );
    });

    $done({
        title: "订阅流量",
        content: content,
        icon: "antenna.radiowaves.left.and.right.circle.fill",
        "icon-color": "#00E28F"
    });
})();
