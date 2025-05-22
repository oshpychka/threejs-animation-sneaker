import Lenis from "lenis";

const lenis = new Lenis({
    smooth: true,
    multiplier: 1.5,
    easing: (t) => t * (2 - t),
    smoothTouch: true,
    lerp: 0.1,
    duration: 1.5,
});
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)