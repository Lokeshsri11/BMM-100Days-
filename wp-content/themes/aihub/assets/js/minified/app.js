const ElementsCollection = Backbone.Collection.extend({
    model: LiquidWidgetBaseModel
});
class LiquidApp {
    isStarted = !1;
    topWrapClassname = "lqd-wrap";
    topWrapSelector = `#${this.topWrapClassname}`;
    containersClassname = "e-con";
    containersBoxedClassname = "e-con-boxed";
    widgetsClassname = "elementor-widget";
    containersSelector = `.${this.containersClassname}`;
    containersBoxedSelector = `.${this.containersBoxedClassname}`;
    widgetsSelector = `.${this.widgetsClassname}`;
    globalBehaviors = [];
    layoutRegions = {};
    elementsCollection = new ElementsCollection;
    behaviorsInitializeQueue = [];
    windowResizeUpdateQueue = [];
    _windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
    _prevWindowSize = this._windowSize;
    globalOptions = {
        localScroll: {
            offset: 0,
            duration: 1
        }
    };
    activeBreakpoint = "";
    uninitializedBehaviors = [];
    deferredBehaviorsQueue = new Map;
    constructor({
        layoutRegions: i,
        containersSelector: t,
        widgetsSelector: e,
        globalOptions: o,
        globalBehaviors: n
    }) {
        _.extend(this, Backbone.Events), _.extend(window.liquid, Backbone.Events), fastdom = fastdom.extend(fastdomPromised), i && (this.layoutRegions = i), t && (this.containersSelector = t), e && (this.widgetsSelector = e), o && (this.globalOptions = { ...this.globalOptions,
            ...o
        }), n && (this.globalBehaviors = [...this.globalBehaviors, ...n]), this.model = new Backbone.Model({
            loadedBehaviors: []
        }), this.view = new Backbone.View({
            el: "#lqd-wrap"
        }), this.view.model = this.model, this.model.view = this.view, this.beforeWindowResize = _.debounce(this.beforeWindowResize.bind(this), 185.69), this.afterWindowResize = _.debounce(this.afterWindowResize.bind(this), 585.69, !1)
    }
    get prevWindowSize() {
        return this._prevWindowSize
    }
    set prevWindowSize({
        width: i,
        height: t
    }) {
        this._prevWindowSize = {
            width: i,
            height: t
        }
    }
    get windowSize() {
        return this._windowSize
    }
    set windowSize({
        width: i,
        height: t
    }) {
        this._windowSize = {
            width: i,
            height: t
        }
    }
    start(i = {
        isEditor: !1
    }) {
        this.trigger("app:before:start", this), this.elementsCollection.comparator = (t, e) => {
            this.elementsCollectionSortedCIDs || (this.elementsCollectionSortedCIDs = [...document.querySelectorAll("[data-lqd-model-cid]")].map(l => l.getAttribute("data-lqd-model-cid")));
            const o = t.cid,
                n = e.cid;
            let s = 0;
            return this.elementsCollectionSortedCIDs.indexOf(o) > this.elementsCollectionSortedCIDs.indexOf(n) ? s = 1 : this.elementsCollectionSortedCIDs.indexOf(o) < this.elementsCollectionSortedCIDs.indexOf(n) && (s = -1), s
        }, this.elementsCollection.on("sort", () => {
            this.elementsCollectionSortedCIDs = null
        }), this.topWrap = document.querySelector(this.topWrapSelector), this.setActiveBreakpoint(), Object.entries(this.layoutRegions).forEach(([t, e]) => {
            const o = typeof e.el == "string" ? document.getElementById(e.el) : e.el,
                n = typeof e.contentWrap == "string" ? document.getElementById(e.contentWrap) : e.contentWrap;
            this.layoutRegions[t].el = o, this.layoutRegions[t].contentWrap = n
        }), this.buildElementsCollection(), this.addLayoutRegions(), this.model.set({
            childrenCollection: this.elementsCollection
        }), _.defer(() => {
            i.isEditor || (this.addBehaviors(), this.initializeBehaviors()), this.trigger("app:start", this)
        }), _.defer(() => {
            this.bindWindowResize()
        }), _.defer(() => {
            i.isEditor || (this.isStarted = !0)
        })
    }
    childrenComparator(i, t) {
        const e = this.elementsCollection.map(l => l.cid),
            o = i.cid,
            n = t.cid;
        let s = 0;
        return e.indexOf(o) > e.indexOf(n) ? s = 1 : e.indexOf(o) < e.indexOf(n) && (s = -1), s
    }
    addLayoutRegions() {
        Object.entries(this.layoutRegions).forEach(([i, {
            el: t,
            contentWrap: e
        }]) => {
            const o = this.elementsCollection.where(r => r.get("layoutRegion") === i),
                n = Backbone.Collection.extend({
                    model: LiquidWidgetBaseModel
                }),
                s = new n(o),
                l = new LiquidBaseModel({
                    childrenCollection: s
                }),
                a = new LiquidBaseView({
                    model: l,
                    contentWrap: e,
                    el: t
                });
            s.comparator = this.childrenComparator.bind(this), l.view = a, this.layoutRegions[i] = this.layoutRegions[i] || {}, this.layoutRegions[i].model = l
        })
    }
    buildElementsCollection() {
        [...document.querySelectorAll(`${this.containersSelector}, ${this.widgetsSelector}`)].forEach(t => this.buildElementModelAndView(t))
    }
    buildElementModelAndView(i, {
        region: t,
        sort: e = !1
    } = {}) {
        if (i.hasAttribute("data-lqd-model-cid")) return;
        const o = i.classList.contains(this.containersClassname),
            n = t || this.getElRegion(i),
            s = [],
            l = {},
            a = i.hasAttribute("data-lqd-has-inner-animatables"),
            r = new LiquidWidgetBaseModel({
                isContainer: o,
                layoutRegion: n,
                animatableElements: a ? i.querySelectorAll("[data-lqd-inner-animatable-el]") : [i],
                dataId: i.getAttribute("data-id")
            }),
            c = new LiquidBaseView({
                model: r,
                el: i
            });
        r.view = c, i.setAttribute("data-lqd-model-cid", r.cid), i.setAttribute("data-lqd-view-cid", c.cid), this.elementsCollection.add(r, {
            sort: e
        });
        const d = this.layoutRegions[n] ? .model ? .get("childrenCollection");
        d && d.add(r, {
            sort: e
        });
        let u = i.parentElement ? .closest(`${this.containersSelector}, ${this.widgetsSelector}`);
        for (; u;) s.push(u), u = u ? .parentElement ? .closest(`${this.containersSelector}, ${this.widgetsSelector}`);
        const m = this.getModelsOfElements(s, {
            layoutRegion: n,
            sort: e
        });
        if (m.length) {
            const h = Backbone.Collection.extend({
                model: LiquidWidgetBaseModel
            });
            l.parentsCollection = new h(m), l.topParentContainer = m.at(-1)
        }
        const w = [...i.querySelectorAll(`${this.containersSelector}, ${this.widgetsSelector}`)];
        if (w.length) {
            const h = this.getModelsOfElements(w, {
                    layoutRegion: n,
                    sort: e
                }),
                f = Backbone.Collection.extend({
                    model: LiquidWidgetBaseModel
                });
            l.childrenCollection = new f(h), l.isBoxed = i.classList.contains(this.containersBoxedClassname), l.childrenCollection.comparator = this.childrenComparator.bind(this), l.topParentContainer || (l.isTopLevelContainer = !0)
        }
        return r.set(l), l.parentsCollection && l.parentsCollection.forEach(h => {
            const f = h.get("childrenCollection");
            f && f.add(r, {
                sort: e
            })
        }), r
    }
    getElRegion(i) {
        const t = _.omit(this.layoutRegions, "liquidPageContent");
        let e = "liquidPageContent";
        return Object.entries(t).forEach(([o, {
            contentWrap: n
        }]) => {
            if (n && n.contains(i)) return e = o
        }), e
    }
    getModelsOfElements(i = [], {
        layoutRegion: t,
        sort: e = !1
    } = {}) {
        let o = [];
        return i ? .length && (o = i.map(n => this.elementsCollection.findWhere(s => s.cid === n.getAttribute("data-lqd-model-cid")) || this.buildElementModelAndView(n, {
            layoutRegion: t,
            sort: e
        })).filter(n => n && n.view)), o
    }
    addToElementsCollection(i, {
        layoutRegion: t = "liquidPageContent"
    } = {}) {
        this.buildElementModelAndView(i, {
            layoutRegion: t,
            sort: !0
        })
    }
    removeFromElementsCollection(i) {
        if (!i) return;
        const t = i.getAttribute("data-lqd-model-cid"),
            e = this.elementsCollection.get(t);
        if (!e) return;
        this.elementsCollection.remove(e);
        const o = e.get("layoutRegion");
        this.elementsCollection.find(n => {
            const s = n.get("parentsCollection"),
                l = n.get("childrenCollection");
            s ? .forEach(a => a ? .get("childrenCollection") ? .remove(e)), l ? .remove(e)
        }), this.layoutRegions[o].model.get("childrenCollection").remove(e), e.view.destroy()
    }
    addBehaviors() {
        const i = [],
            t = {};
        this.model.on("change:loadedBehaviors", (e, o) => {
            if (!this.uninitializedBehaviors.length) return;
            const s = o.at(-1).name,
                l = this.uninitializedBehaviors.filter(({
                    behavior: a
                }) => a.behaviorName === s);
            l.forEach(({
                model: a,
                behavior: r
            }) => this.addElementBehaviors({
                model: a,
                behaviorsArray: [r]
            })), this.uninitializedBehaviors = _.difference(this.uninitializedBehaviors, l)
        }), [...this.elementsCollection.models].reverse().forEach(e => {
            const o = e.get("dataId"),
                n = e.view.el,
                s = window.liquid.behaviors ? .filter(l => {
                    if (l.dataId && o) return l.dataId === o;
                    if (l.el) return l.el === n
                }) ? .flatMap(l => l.behaviors);
            s ? .length && i.push({
                model: e,
                behaviorsArray: s
            })
        }), Object.entries(this.layoutRegions).forEach(([e, {
            behaviors: o,
            model: n
        }]) => {
            o && i.push({
                model: n,
                behaviorsArray: [...o, ...window.liquid ? .behaviors ? .filter(s => s.layoutRegion && s.layoutRegion === e) ? .flatMap(s => s.behaviors) || []]
            })
        }), this.globalBehaviors.length && i.push({
            model: this.model,
            behaviorsArray: this.globalBehaviors
        }), this.constructBehaviors(i), window.liquid.behaviors = []
    }
    addElementBehaviors({
        el: i,
        model: t,
        behaviorsArray: e,
        layoutRegion: o
    }) {
        if (!i && !t && o || !e) return;
        const n = o ? this.layoutRegions[o] ? .model : this.elementsCollection,
            s = t || n ? .find(l => l.view.el === i);
        s && (this.constructBehaviors([{
            model: s,
            behaviorsArray: e
        }]), this.initializeBehaviors())
    }
    constructBehaviors(i) {
        [...i].sort((e, o) => e.model.get("isContainer") - o.model.get("isContainer")).forEach(({
            model: e,
            behaviorsArray: o
        }) => {
            o.forEach(n => {
                let {
                    behaviorClass: s,
                    behaviorName: l
                } = n;
                if (l && !s && (s = this.model.get("loadedBehaviors").find(d => d.name === l)), !s || typeof s == "string") return this.uninitializedBehaviors.push({
                    model: e,
                    behavior: n
                });
                const a = s.initializeConditions;
                if (a ? .length && !a.every(d => d)) return;
                const r = new s(e.view, n ? .options || {}),
                    c = e.get("behaviors") || [];
                if (e.set({
                        behaviors: [...c, r]
                    }), r.willEmitInitializeTriggerEvents.length) return this.deferredBehaviorsQueue.set(e.cid, [...this.deferredBehaviorsQueue.get(e.cid) || [], r]);
                this.behaviorsInitializeQueue.push(r)
            })
        })
    }
    initializeBehaviors() {
        if (this.behaviorsInitializeQueue.forEach(i => {
                i.initializeTriggers.size <= 0 && i.initialize(), this.behaviorsInitializeQueue = this.behaviorsInitializeQueue.filter((t, e) => e > 0)
            }), !(this.deferredBehaviorsQueue.size <= 0))
            for (const [i, t] of this.deferredBehaviorsQueue) t.forEach(e => e.initialize()), this.deferredBehaviorsQueue.delete(i)
    }
    destroyElementBehaviors({
        el: i,
        model: t
    } = {}) {
        if (!(!i && !t)) {
            if (!t) {
                const e = i.getAttribute("data-lqd-model-cid");
                t = this.elementsCollection.find(o => o.cid === e)
            }
            t && t.get("behaviors") ? .forEach(e => {
                e.destroy()
            })
        }
    }
    setActiveBreakpoint() {
        const i = liquid ? .breakpoints;
        if (!i) return;
        const t = [{
            mm: window.matchMedia("(min-width: 1201px)"),
            breakpointKey: "desktop"
        }];
        Object.entries(i).forEach(([e, {
            direction: o,
            is_enabled: n,
            value: s
        }]) => {
            n && t.push({
                mm: window.matchMedia(`(${o}-width: ${s}px)`),
                breakpointKey: e
            })
        }), this.activeBreakpoint = t.filter(({
            mm: e
        }) => e.matches) ? .at(-1) ? .breakpointKey || "desktop"
    }
    bindWindowResize() {
        window.addEventListener("resize", () => {
            this.beforeWindowResize(), this.afterWindowResize()
        })
    }
    beforeWindowResize() {
        this.prevWindowSize = this.windowSize, this.trigger("before:windowResize", {
            prevSize: this.prevWindowSize,
            currentSize: this.windowSize
        })
    }
    afterWindowResize() {
        this.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        }, this.setActiveBreakpoint(), this.trigger("after:windowResize", {
            prevSize: this.prevWindowSize,
            currentSize: this.windowSize
        })
    }
    destroy() {
        this.isStarted = !1, this.off(), this.stopListening(), this.layoutRegions = {}, this.elementsCollection = new ElementsCollection
    }
}