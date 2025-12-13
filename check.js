import fs from "fs/promises"

// official discord routes on client
const parse = (routes) => {
    let result = {}
    for (let [key, value] of Object.entries(routes)) {
        result[key] = value.url
    }
    return Object.entries(result)
}
// TODO: get a better source (this repo has missing routes)
let routes = await (await fetch("https://raw.githubusercontent.com/xhyrom/discord-datamining/refs/heads/master/data/client/routes.json")).json()
routes = parse(routes)

// userdoccers
const result = JSON.parse(await fs.readFile("./data/routes.json", "utf-8")).map(e => e.urlEmpty)
const has = (url) => result.some(i => i.includes(url))
let logs = { missing: [], covered: [] }
for (let route of routes) {
    const hit = has(route[1])
    console.log(hit ? "✅ Covered " + route.join(":") : "❌ MISSING " + route.join(":"))
    logs[hit ? "covered" : "missing"].push(route)
}

const mdify = (logs) => {
    const [covered, missing] = [logs.covered.length, logs.missing.length]
    const table = `| Covered | ${covered} |\n|---------|------------|\n| Missing | ${missing} |`
    let res = "# Results\n\n" + table + "\n## Missing routes\ntotal: " + missing + "\n"
    for (let item of logs.missing) {
        res += `- [ ] **${item[0]}**: \`${item[1]}\`\n`
    }
    res += "\n## Covered routes\ntotal: " + covered + "\n"
    for (let item of logs.covered) {
        res += `- [x] **${item[0]}**: \`${item[1]}\`\n`
    }
    return res
}

console.log("missing", logs.missing.length)

console.log("hit", logs.covered.length)
await fs.writeFile("./logs.json", JSON.stringify(logs, null, 4), "utf-8")
await fs.writeFile("./logs.md", mdify(logs), "utf-8")
