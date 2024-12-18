class LiquidSplitTextBehavior extends LiquidBehavior {
    static name = "liquidSplitText";
    static appEvents = {
        "after:windowResize": {
            func: "afterWindowResize",
            ifHasOption: "splitDoneFromBackend"
        }
    };
    options() {
        return {
            splitDoneFromBackend: !1,
            tag: "span",
            splitType: "words",
            classnamePrefix: "lqd-split-text-",
            elements: [{
                els: "[data-lqd-split-text-el]"
            }]
        }
    }
    async initialize() {
        this.isDestroyed || (this.getOption("splitDoneFromBackend") || (this.widthBeforeResize = await fastdom.measure(() => this.view.el.offsetWidth)), this.isDestroyed) || (this.elements = this.getElements(), this.beginSplit())
    }
    getElements() {
        const t = this.getOption("elements"),
            e = this.getOption("splitType");
        return t.map(({
            els: i,
            splitType: s
        }) => ({
            els: this.view.el.querySelectorAll(i),
            splitType: s || e
        }))
    }
    beginSplit() {
        const t = this.getOption("splitDoneFromBackend");
        this.elements.forEach(e => t ? this.split(e) : _.defer(this.split.bind(this, e)))
    }
    split({
        els: t,
        splitType: e
    }) {
        const i = this.getOption("classnamePrefix");
        if (!t.length || this.getOption("splitDoneFromBackend")) return this.splitText = {
            lines: this.view.el.querySelectorAll(`.${i}lines`),
            words: this.view.el.querySelectorAll(`.${i}words`),
            chars: this.view.el.querySelectorAll(`.${i}chars`),
            revert: _.noop
        }, this.onSplitDone(e);
        const s = this.getOption("tag");
        this.splitText = new SplitText(t, {
            type: e,
            position: e === "chars" ? "absolute" : "relative",
            tag: s,
            linesClass: `${i}lines`,
            wordsClass: `${i}words`,
            charsClass: `${i}chars`
        }), this.onSplitDone(e)
    }
    onSplitDone(t) {
        this.setSplitUnitsAttrs(t), this.setAnimatableElements(t), this.view.model.set({
            splitText: "done"
        })
    }
    setSplitUnitsAttrs(t) {
        const e = t === "chars,words" ? "words" : t,
            i = this.splitText[e];
        i.forEach((s, l) => {
            s.style.setProperty("--split-text-index", l), s.style.setProperty("--split-text-last-index", i.length - 1 - l)
        })
    }
    setAnimatableElements(t) {
        const e = t === "chars,words" ? "chars" : t,
            i = this.splitText[e];
        this.view.model.set({
            animatableElements: [...i]
        })
    }
    revertSplitText() {
        this.splitText ? .revert()
    }
    reInit() {
        this.revertSplitText(), this.beginSplit()
    }
    async afterWindowResize(t) {
        const e = await fastdom.measure(() => this.view.el.offsetWidth);
        this.isDestroyed || (t.prevSize.width !== t.currentSize.width && this.widthBeforeResize !== e && this.reInit(), this.widthBeforeResize = e)
    }
    update(t) {
        super.update(t), this.reInit()
    }
    destroy() {
        this.revertSplitText(), super.destroy()
    }
}
window.liquid ? .app ? .model ? .set("loadedBehaviors", [...window.liquid.app.model.get("loadedBehaviors"), LiquidSplitTextBehavior]);