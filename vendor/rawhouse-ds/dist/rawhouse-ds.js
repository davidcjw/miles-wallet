import { jsx as s, jsxs as h } from "react/jsx-runtime";
import { forwardRef as x } from "react";
const $ = x(function({
  children: r,
  tone: e = "white",
  radius: t = "xl",
  sticker: l = !1,
  bordered: i = !1,
  pad: a,
  interactive: o = !1,
  as: c,
  className: d = "",
  style: m,
  ...f
}, p) {
  const b = c ?? "div", N = [
    "rh-surface",
    `rh-surface--${e}`,
    `rh-surface--r-${t}`,
    l && "rh-surface--sticker",
    i && "rh-surface--bordered",
    o && "rh-surface--interactive",
    d
  ].filter(Boolean).join(" "), g = { ...m ?? {} };
  return a != null && (g["--rh-surface-pad"] = `calc(${a} * var(--rh-module))`), /* @__PURE__ */ s(b, { ref: p, className: N, style: g, ...f, children: r });
}), y = {
  hero: "h1",
  display: "h2",
  h: "h3",
  title: "h4",
  lead: "p",
  body: "p",
  small: "span",
  label: "span"
}, u = x(function({
  children: r,
  size: e = "body",
  tone: t = "ink",
  weight: l = "bold",
  caps: i = !1,
  center: a = !1,
  as: o,
  className: c = "",
  style: d,
  ...m
}, f) {
  const p = o ?? y[e], b = [
    "rh-text",
    `rh-text--${e}`,
    `rh-text--${t}`,
    `rh-text--w-${l}`,
    i && "rh-text--caps",
    a && "rh-text--center",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ s(p, { ref: f, className: b, style: d, ...m, children: r });
});
function _({ children: n, tone: r = "coral", className: e = "" }) {
  return /* @__PURE__ */ s(u, { as: "span", size: "label", weight: "bold", caps: !0, tone: r, className: e, children: n });
}
function v({
  children: n,
  level: r = "display",
  eyebrow: e,
  eyebrowTone: t = "coral",
  center: l = !1,
  as: i,
  className: a = ""
}) {
  return /* @__PURE__ */ h(
    "div",
    {
      className: ["rh-heading", a].filter(Boolean).join(" "),
      style: {
        display: "grid",
        gap: 12,
        justifyItems: l ? "center" : "start",
        textAlign: l ? "center" : "start"
      },
      children: [
        e != null && /* @__PURE__ */ s(_, { tone: t, children: e }),
        /* @__PURE__ */ s(u, { size: r, weight: "extrabold", as: i, center: l, children: n })
      ]
    }
  );
}
function T({
  children: n,
  variant: r = "coral",
  size: e = "md",
  href: t,
  as: l,
  className: i = "",
  ...a
}) {
  const o = l ?? (t ? "a" : "button"), c = [
    "rh-button",
    `rh-button--${r}`,
    `rh-button--${e}`,
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ s(o, { className: c, ...t ? { href: t } : {}, ...a, children: n });
}
function q({
  children: n,
  variant: r = "coral",
  size: e = 44,
  href: t,
  as: l,
  className: i = "",
  ...a
}) {
  const o = l ?? (t ? "a" : "button"), c = { "--rh-icon-size": `${e}px` };
  return /* @__PURE__ */ s(
    o,
    {
      className: ["rh-iconbtn", `rh-iconbtn--${r}`, i].filter(Boolean).join(" "),
      style: c,
      ...t ? { href: t } : {},
      ...a,
      children: n
    }
  );
}
function j({ children: n, tone: r = "white", caps: e = !0, className: t = "" }) {
  return /* @__PURE__ */ s($, { tone: r, radius: "pill", className: ["rh-pill", t].filter(Boolean).join(" "), children: /* @__PURE__ */ s(u, { as: "span", size: "label", weight: "bold", caps: e, tone: "inherit", children: n }) });
}
function z({
  title: n,
  tag: r,
  src: e,
  alt: t = "",
  tone: l = "stone",
  ratio: i = 3 / 4,
  href: a,
  className: o = ""
}) {
  return /* @__PURE__ */ h(
    $,
    {
      as: a ? "a" : "article",
      href: a,
      tone: l,
      radius: "lg",
      interactive: a != null,
      className: ["rh-media", o].filter(Boolean).join(" "),
      style: { aspectRatio: String(i) },
      children: [
        e ? /* @__PURE__ */ s("img", { className: "rh-media__img", src: e, alt: t }) : null,
        /* @__PURE__ */ h("div", { className: "rh-media__overlay", children: [
          r != null && /* @__PURE__ */ s(j, { tone: "white", children: r }),
          n != null && /* @__PURE__ */ s(u, { size: "title", weight: "extrabold", tone: "inherit", className: "rh-media__title", children: n })
        ] })
      ]
    }
  );
}
function S({ items: n, badge: r = "◍", speed: e = 24, className: t = "" }) {
  const l = (a) => /* @__PURE__ */ s("span", { className: "rh-marquee__badge", "aria-hidden": "true", children: r }, a), i = (a) => n.flatMap((o, c) => [
    /* @__PURE__ */ s(u, { as: "span", size: "display", weight: "extrabold", caps: !0, className: "rh-marquee__item", children: o }, `${a}-t-${c}`),
    l(`${a}-s-${c}`)
  ]);
  return /* @__PURE__ */ s(
    "div",
    {
      className: ["rh-marquee", t].filter(Boolean).join(" "),
      style: { "--rh-marquee-speed": `${e}s` },
      children: /* @__PURE__ */ h("div", { className: "rh-marquee__track", children: [
        i(0),
        i(1)
      ] })
    }
  );
}
export {
  T as Button,
  _ as Eyebrow,
  v as Heading,
  q as IconButton,
  S as Marquee,
  z as MediaCard,
  j as Pill,
  $ as Surface,
  u as Text
};
