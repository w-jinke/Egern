const args = {};
if ($argument) {
    $argument.split("&").forEach(p => {
        const index = p.indexOf("=");
        const key = p.substring(0, index);
        const value = p.substring(index + 1);
        args[key] = decodeURIComponent(value);
    });
}

(async () => {
    if (!args.url) {
        $done({ title: "订阅流量", content: "未提供 URL" });
        return;
    }

    const urls = args.url.split("|").map(u => u.trim()).filter(u => u);
    const titles = args.title ? args.title.split("|").map(t => t.trim()) : [];

    async function fetchUsage(url, index) {
        return new Promise(resolve => {
            $httpClient.get(
                {
                    url,
                    headers: { "User-Agent": "Loon/898 CFNetwork/3860.100.1 Darwin/25.0.0" }
                },
                (err, resp) => {
                    if (err || !resp || resp.status !== 200) {
                        if (titles[index]) {
                            resolve(`机场：${titles[index]}\n请求失败 ${resp ? resp.status : "错误"}`);
                        } else {
                            resolve(`请求失败 ${resp ? resp.status : "错误"}`);
                        }
                        return;
                    }

                    const data = {};
                    const headerKey = Object.keys(resp.headers).find(k => k.toLowerCase() === "subscription-userinfo");
                    if (headerKey && resp.headers[headerKey]) {
                        resp.headers[headerKey].split(";").forEach(p => {
                            const [k, v] = p.trim().split("=");
                            if (k && v) data[k] = parseInt(v);
                        });
                    }

                    const used = (data.upload || 0) + (data.download || 0);
                    const total = data.total || 0;
                    const percent = total > 0 ? Math.round((used / total) * 100) : 0;

                    const lines = [];
                    if (titles[index]) lines.push(`机场：${titles[index]}`);
                    lines.push(
                        `已用：${percent}%`,
                        `流量：${(used / 1024 / 1024 / 1024).toFixed(2)}GB - ${(total / 1024 / 1024 / 1024).toFixed(2)}GB`
                    );

                    if (data.expire) {
                        const d = new Date(data.expire * 1000);
                        lines.push(`到期：${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}号`);
                    }

                    resolve(lines.join("\n"));
                }
            );
        });
    }

    const results = await Promise.all(urls.map((u, i) => fetchUsage(u, i)));

    $done({
        title: "订阅流量",
        content: results.join("\n\n"),
        icon: "antenna.radiowaves.left.and.right.circle.fill",
        "icon-color": "#00E28F"
    });
})();
