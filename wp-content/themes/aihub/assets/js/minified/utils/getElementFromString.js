function getElementFromString(e, m) {
    let t;
    return e === "html" ? t = document.documentElement : e === "body" ? t = document.body : e.startsWith("<") ? t = document.querySelector(e.replace("<", "").trim()) : e && m && (t = m.querySelector(e)), t
}