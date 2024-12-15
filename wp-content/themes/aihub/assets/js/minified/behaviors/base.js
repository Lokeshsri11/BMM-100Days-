class LiquidBehavior {
    static name = "liquidBase";
    static initialModelProps = {};
    static initializeConditions = [];
    static willEmitInitializeTriggerEvents = [];
    static appEvents = {};
    static regionsEvents = {};
    static modelEvents = {};
    static viewEvents = {};
    static viewModelEvents = {};
    static parentsCollectionEvents = {};
    static topParentContainerEvents = {};
    static topParentChildrenCollectionEvents = {};
    static childrenCollectionEvents = {};
    static domEvents = {};
    static windowEvents = {};
    breakpointsOrder = ["all", ...Object.keys(window.liquid.breakpoints).filter(t => window.liquid.breakpoints[t].is_enabled)];
    constructor(t, e) {
        _.extend(this, Backbone.Events), this.model = new Backbone.Model(this.initialModelProps), this.view = t, this._ui = {}, this._allEvents = {
            domEvents: [],
            windowEvents: []
        }, this._options = { ...this.options(),
            ...e
        }, this.initializeTriggers = new Set, this.isDestroyed = !1, this.liquidApp = window.liquid.app, this.preInitialize()
    }
    preInitialize() {
        this.addUi(), this.addAllEvents()
    }
    initialize() {}
    options() {
        return {}
    }
    get name() {
        return this.constructor.name
    }
    get initialModelProps() {
        return this.constructor.initialModelProps
    }
    get willEmitInitializeTriggerEvents() {
        return this.constructor.willEmitInitializeTriggerEvents
    }
    get ui() {
        return {}
    }
    get appEvents() {
        return this.constructor.appEvents
    }
    get regionsEvents() {
        return this.constructor.regionsEvents
    }
    get modelEvents() {
        return this.constructor.modelEvents
    }
    get viewEvents() {
        return this.constructor.viewEvents
    }
    get viewModelEvents() {
        return this.constructor.viewModelEvents
    }
    get parentsCollectionEvents() {
        return this.constructor.parentsCollectionEvents
    }
    get topParentContainerEvents() {
        return this.constructor.topParentContainerEvents
    }
    get topParentChildrenCollectionEvents() {
        return this.constructor.topParentChildrenCollectionEvents
    }
    get childrenCollectionEvents() {
        return this.constructor.childrenCollectionEvents
    }
    get domEvents() {
        return this.constructor.domEvents
    }
    get windowEvents() {
        return this.constructor.windowEvents
    }
    get throttledFunctions() {
        return {}
    }
    get debouncedFunctions() {
        return {}
    }
    get bindToThis() {
        return []
    }
    get initializeConditions() {
        return this.constructor.initializeConditions
    }
    addUi() {
        Object.entries({ ...this.ui,
            ...this.getOption("ui") || {}
        }).forEach(([t, e]) => {
            this._ui[t] = [...this.view.el.querySelectorAll(e)]
        })
    }
    addAllEvents() {
        this.bindAllEvents(), this.listenToAppEvents(), this.listenToRegionsEvents(), this.buildThrottledAndDebouncedFunctions(this.throttledFunctions, "throttle"), this.buildThrottledAndDebouncedFunctions(this.debouncedFunctions, "debounce"), this.listenToModelsAndViewEvents("parentsCollectionEvents", this.view.model.get("parentsCollection")), this.listenToModelsAndViewEvents("topParentContainerEvents", this.view.model.get("topParentContainer") || this.view.model), this.listenToModelsAndViewEvents("topParentChildrenCollectionEvents", this.view.model.get("topParentContainer") ? .get("childrenCollection") || this.view.model.get("childrenCollection")), this.listenToModelsAndViewEvents("modelEvents", this.model), this.listenToModelsAndViewEvents("viewEvents", this.view), this.listenToModelsAndViewEvents("viewModelEvents", this.view.model), this.listenToModelsAndViewEvents("childrenCollectionEvents", this.view.model.get("childrenCollection")), this.addDomEvents(), this.addWindowEvents()
    }
    bindAllEvents() {
        this.bindToThis ? .length && _.bindAll(this, ...this.bindToThis)
    }
    getChangeProp(t = "openedItems") {
        const e = this.getOption("changePropPrefix");
        return e ? `${t}@${e}` : t
    }
    listenToModelsAndViewEvents(t, e) {
        if (!e) return;
        const i = this[t];
        if (!i) return;
        const n = Object.entries(i),
            o = this.view.model.get("childrenCollection");
        n.length && n.forEach(([s, l]) => {
            const h = [];
            Array.isArray(l) ? l.forEach(r => {
                if (typeof r == "string") h.push(this.buildFunction(r, s));
                else if (typeof r == "object") {
                    const d = Object.keys(r)[0],
                        c = Object.values(r)[0];
                    h.push(() => this.listenTo(e, d, this.buildFunction(c, s)))
                }
            }) : h.push(this.buildFunction(l, s)), h.filter(r => r).forEach(r => {
                if (!e ? .models) {
                    const d = new Backbone.Collection;
                    if (l.listenToChildrenToo) {
                        if (o) {
                            const c = o.where(u => u.get("behaviors") ? .find(a => a.willEmitInitializeTriggerEvents.includes(s)));
                            c.length && d.add(c)
                        }
                        if (e ? .get("behaviors") ? .find(c => c.willEmitInitializeTriggerEvents.includes(s)) && d.add(e), d.length) return r = _.after(d.length, r), this.listenTo(d, s, r);
                        if (!this.view.model.get("behaviors") ? .find(c => c.willEmitInitializeTriggerEvents.includes(s))) return r()
                    }
                }
                this.listenTo(e, s, r)
            })
        })
    }
    listenToAppEvents() {
        this.liquidApp && Object.entries(this.appEvents).forEach(([t, e]) => {
            const i = this.buildFunction(e, t);
            i && this.listenTo(this.liquidApp, t, i)
        })
    }
    listenToRegionsEvents() {
        this.liquidApp && Object.entries(this.regionsEvents).forEach(([t, e]) => {
            const i = this.liquidApp.layoutRegions[t] ? .model;
            i && e.forEach(n => {
                const o = Object.keys(n)[0],
                    s = this.buildFunction(Object.values(n)[0], o);
                s && this.listenTo(i, o, s)
            })
        })
    }
    addDomEvents() {
        this.domEvents && Object.entries(this.domEvents).forEach(([t, e]) => {
            const i = t.split(" "),
                n = i[0],
                o = i[1],
                s = this.buildFunction(e, n);
            if (!s) return;
            let l;
            if (o)
                if (o.startsWith("@")) l = this.getUI(o.replace("@", ""));
                else if (o.includes("<")) {
                const h = o.replace("<", "");
                h === "document" ? l = [document] : l = document.querySelectorAll(h)
            } else l = this.view.el.querySelectorAll(o);
            else l = [this.view.el];
            l.forEach(h => h.addEventListener(n, s)), this._allEvents.domEvents.push({
                els: l,
                eventType: n,
                fn: s
            })
        })
    }
    addWindowEvents() {
        this.windowEvents && Object.entries(this.windowEvents).forEach(([t, e]) => {
            const i = this.buildFunction(e, t);
            i && (window.addEventListener(t, i), this._allEvents.windowEvents.push({
                event: t,
                fn: i
            }))
        })
    }
    buildFunction(t, e) {
        const i = t.func || t;
        if (!this[i]) return console.warn("Could not find the handler", this, i);
        if (t.ifHasOption && !this.getOption(t.ifHasOption)) return !1;
        let n = this[i].bind(this);
        return t.once && (n = _.once(n)), t.throttle ? n = _.throttle(n, t.throttle.wait, { ...t.throttle.options
        }) : t.debounce && (n = _.debounce(n, t.debounce.wait, t.debounce ? .options ? .immediate)), i === "initialize" && this.initializeTriggers.add(e), n
    }
    buildThrottledAndDebouncedFunctions(t, e) {
        Object.entries(t).forEach(([i, n]) => {
            if (!this[i]) return console.warn("Could not find the handler", this, i);
            this[i] = _[e](this[i].bind(this), n.wait, e === "throttle" ? { ..._.omit(n, "wait")
            } : n.immediate)
        })
    }
    getUI(t) {
        let e = this._ui[t] || [];
        const i = t.split(/:|\[/);
        if (i.length < 2) return e;
        const n = i[0],
            o = t.replace(n, "");
        return e = this._ui[n].filter(s => s.matches(o)), e
    }
    getOption(t) {
        return this._options[t]
    }
    setOption(t, e, i = !0) {
        if (this._options[t] && i) return this._options[t] = _.extend(this._options[t], e);
        this._options[t] = e
    }
    destroy() {
        this.handleDestroy(), this.isInitialized = !1
    }
    handleDestroy() {
        this.offAllEvents();
        const t = this.view.model.get("behaviors").filter(e => e.model.cid !== this.model.cid);
        this.view.model.set({
            behaviors: t
        }), this.isDestroyed = !0
    }
    offAllEvents() {
        this.offDomEvents(), this.offWindowEvents(), this.model.off(), this.off(), this.stopListening()
    }
    offDomEvents() {
        this._allEvents.domEvents.forEach(({
            els: t,
            eventType: e,
            fn: i
        }) => t.forEach(n => n.removeEventListener(e, i, !1)))
    }
    offWindowEvents() {
        this._allEvents.windowEvents.forEach(({
            event: t,
            fn: e
        }) => window.removeEventListener(t, e, !1))
    }
}