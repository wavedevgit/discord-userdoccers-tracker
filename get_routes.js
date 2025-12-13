import fs from "fs/promises"

// split spaces but dont touch inside "", basically a smol tokenizer
const split = (string) => {
    let str = string.split("")
    let output = []
    let current = ""
    let notInQuotationMarks = true
    while (str.length > 0) {
        const i = str.shift()
        if (i === '"' && notInQuotationMarks) {
            notInQuotationMarks = false
            continue
        }

        if (i === '"' && !notInQuotationMarks) {
            notInQuotationMarks = true
            continue
        }

        if (i === " " && notInQuotationMarks) {
            output.push(current)
            current = ""
        }
        current += i
    }
    output.push(current)
    return output
}

const parseProps = (props) => {
    const result = {}
    for (let prop of split(props)) {
        if (!prop.includes("=")) { result[prop.trim()] = true; continue }
        const [name, value] = prop.split("=")
        result[name.trim()] = value.startsWith('"') || value.startsWith("'") ? JSON.parse(value) : value
    }
    result.urls = result.url.split(" OR ")
    return result
}

const content = await fs.readFile("./data/merged.mdx", "utf-8")

const routeHeaderBlocks = [...content.matchAll(/<RouteHeader(?<props>[\s\S]*?)>(?<title>[\s\S]*?)<\/RouteHeader>/gm)].map(e => e?.groups).map(e => ({ props: parseProps(e.props.trim()), title: e.title.trim() }))
const result = routeHeaderBlocks.map(e => ({
    title: e.title,
    ...e.props,
    urlEmpty: e.props.urls.map(e => e.replaceAll(/\{[\w.]+\}/g, ":param"))
}))
await fs.writeFile("./data/routes.json", JSON.stringify(result, null, 4), "utf-8")