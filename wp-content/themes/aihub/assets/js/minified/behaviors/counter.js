class LiquidCounterBehavior extends LiquidBehavior {
    static name = "liquidCounter";
    options() {
        return {
            countFrom: 0,
            countTo: 1069,
            countStep: 1,
            duration: 1.5,
            delay: 0,
            useLocaleString: !0
        }
    }
    get ui() {
        return {
            counterEl: "[data-lqd-counter-el]"
        }
    }
    initialize() {
        this.IO = new IntersectionObserver(([t], e) => {
            t.isIntersecting && (e.disconnect(), this.animate())
        }), this.IO.observe(this.view.el)
    }
    animate() {
        const t = this.getOption("countFrom"),
            e = this.getOption("countTo"),
            i = {
                value: t
            },
            n = this.getUI("counterEl")[0];
        if (this.counterAnimation ? .kill(), isNaN(e)) return n.innerHTML = this.getString(e);
        this.counterAnimation = gsap.to(i, {
            value: e,
            duration: this.getOption("duration"),
            ease: "power2.out",
            delay: this.getOption("delay"),
            snap: {
                value: this.getOption("countStep")
            },
            onUpdate: () => {
                n.innerHTML = this.getString(i.value)
            }
        })
    }
    getString(t) {
        return !this.getOption("useLocaleString") || isNaN(t) ? t : Number(t).toLocaleString()
    }
    destroy() {
        this.IO ? .disconnect(), this.counterAnimation ? .kill(), super.destroy()
    }
}
window.liquid ? .app ? .model ? .set("loadedBehaviors", [...window.liquid.app.model.get("loadedBehaviors"), LiquidCounterBehavior]);