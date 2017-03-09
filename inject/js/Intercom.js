 
    /*! intercom.js | https://github.com/diy/intercom.js | Apache License (v2) */
    var Intercom = function() {
        var g = function() {};
        g.createInterface = function(b) {
            return {
                on: function(a, c) {
                    "undefined" === typeof this[b] && (this[b] = {});
                    this[b].hasOwnProperty(a) || (this[b][a] = []);
                    this[b][a].push(c)
                },
                off: function(a, c) {
                    "undefined" !== typeof this[b] && this[b].hasOwnProperty(a) && i.removeItem(c, this[b][a])
                },
                trigger: function(a) {
                    if ("undefined" !== typeof this[b] && this[b].hasOwnProperty(a))
                        for (var c = Array.prototype.slice.call(arguments, 1), e = 0; e < this[b][a].length; e++) this[b][a][e].apply(this[b][a][e], c)
                }
            }
        };
        var m = g.createInterface("_handlers");
        g.prototype._on = m.on;
        g.prototype._off = m.off;
        g.prototype._trigger = m.trigger;
        var n = g.createInterface("handlers");
        g.prototype.on = function() {
            n.on.apply(this, arguments);
            Array.prototype.unshift.call(arguments, "on");
            this._trigger.apply(this, arguments)
        };
        g.prototype.off = n.off;
        g.prototype.trigger = n.trigger;
        var f = window.localStorage;
        "undefined" === typeof f && (f = {
            getItem: function() {},
            setItem: function() {},
            removeItem: function() {}
        });
        var i = {},
            h = function() {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            };
        i.guid = function() {
            return h() + h() + "-" + h() + "-" + h() + "-" + h() + "-" + h() + h() + h()
        };
        i.throttle = function(b, a) {
            var c = 0;
            return function() {
                var e = (new Date).getTime();
                e - c > b && (c = e, a.apply(this, arguments))
            }
        };
        i.extend = function(b, a) {
            if ("undefined" === typeof b || !b) b = {};
            if ("object" === typeof a)
                for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
            return b
        };
        i.removeItem = function(b, a) {
            for (var c = a.length - 1; 0 <= c; c--) a[c] === b && a.splice(c, 1);
            return a
        };
        var d = function() {
            var b = this,
                a = (new Date).getTime();
            this.origin = i.guid();
            this.lastMessage = a;
            this.bindings = [];
            this.receivedIDs = {};
            this.previousValues = {};
            a = function() {
                b._onStorageEvent.apply(b, arguments)
            };
            window.attachEvent ? document.attachEvent("onstorage", a) : window.addEventListener("storage", a, !1)
        };
        d.prototype._transaction = function(b) {
            var a = this,
                c = !1,
                e = !1,
                p = null,
                d = function() {
                    if (!c) {
                        var g = (new Date).getTime(),
                            s = parseInt(f.getItem(l) || 0);
                        s && 1E3 > g - s ? (e || (a._on("storage", d), e = !0), p = window.setTimeout(d, 20)) : (c = !0, f.setItem(l, g), b(), e && a._off("storage", d), p &&
                            window.clearTimeout(p), f.removeItem(l))
                    }
                };
            d()
        };
        d.prototype._cleanup_emit = i.throttle(100, function() {
            this._transaction(function() {
                for (var b = (new Date).getTime() - t, a = 0, c = JSON.parse(f.getItem(j) || "[]"), e = c.length - 1; 0 <= e; e--) c[e].timestamp < b && (c.splice(
                    e, 1), a++);
                0 < a && f.setItem(j, JSON.stringify(c))
            })
        });
        d.prototype._cleanup_once = i.throttle(100, function() {
            var b = this;
            this._transaction(function() {
                var a, c = JSON.parse(f.getItem(k) || "{}");
                (new Date).getTime();
                var e = 0;
                for (a in c) b._once_expired(a, c) && (delete c[a], e++);
                0 < e && f.setItem(k, JSON.stringify(c))
            })
        });
        d.prototype._once_expired = function(b, a) {
            if (!a || !a.hasOwnProperty(b) || "object" !== typeof a[b]) return !0;
            var c = a[b].ttl || u,
                e = (new Date).getTime();
            return a[b].timestamp < e - c
        };
        d.prototype._localStorageChanged = function(b, a) {
            if (b && b.key) return b.key === a;
            var c = f.getItem(a);
            if (c === this.previousValues[a]) return !1;
            this.previousValues[a] = c;
            return !0
        };
        d.prototype._onStorageEvent = function(b) {
            var b = b || window.event,
                a = this;
            this._localStorageChanged(b, j) && this._transaction(function() {
                for (var b = (new Date).getTime(), e = f.getItem(j), e = JSON.parse(e || "[]"), d = 0; d < e.length; d++)
                    if (e[d].origin !== a.origin && !(e[d].timestamp < a.lastMessage)) {
                        if (e[d].id) {
                            if (a.receivedIDs.hasOwnProperty(e[d].id)) continue;
                            a.receivedIDs[e[d].id] = !0
                        }
                        a.trigger(e[d].name, e[d].payload)
                    }
                a.lastMessage = b
            });
            this._trigger("storage", b)
        };
        d.prototype._emit = function(b, a, c) {
            if ((c = "string" === typeof c || "number" === typeof c ? String(c) : null) && c.length) {
                if (this.receivedIDs.hasOwnProperty(c)) return;
                this.receivedIDs[c] = !0
            }
            var e = {
                    id: c,
                    name: b,
                    origin: this.origin,
                    timestamp: (new Date).getTime(),
                    payload: a
                },
                d = this;
            this._transaction(function() {
                var c = f.getItem(j) || "[]",
                    c = [c.substring(0, c.length - 1), "[]" === c ? "" : ",", JSON.stringify(e), "]"].join("");
                f.setItem(j, c);
                d.trigger(b, a);
                window.setTimeout(function() {
                    d._cleanup_emit()
                }, 50)
            })
        };
        d.prototype.bind = function(b, a) {
            for (var c = 0; c < d.bindings.length; c++) {
                var e = d.bindings[c].factory(b, a || null, this);
                e && this.bindings.push(e)
            }
        };
        d.prototype.emit = function(b, a) {
            this._emit.apply(this, arguments);
            this._trigger("emit", b, a)
        };
        d.prototype.once = function(b, a, c) {
            if (d.supported) {
                var e = this;
                this._transaction(function() {
                    var d = JSON.parse(f.getItem(k) || "{}");
                    e._once_expired(b, d) && (d[b] = {}, d[b].timestamp = (new Date).getTime(), "number" === typeof c && (d[b].ttl = 1E3 * c), f.setItem(k, JSON.stringify(
                        d)), a(), window.setTimeout(function() {
                        e._cleanup_once()
                    }, 50))
                })
            }
        };
        i.extend(d.prototype, g.prototype);
        d.bindings = [];
        d.supported = "undefined" !== typeof f;
        var j = "intercom",
            k = "intercom_once",
            l = "intercom_lock",
            t = 5E4,
            u = 36E5;
        d.destroy = function() {
            f.removeItem(l);
            f.removeItem(j);
            f.removeItem(k)
        };
        var q = null;
        d.getInstance = function() {
            q || (q = new d);
            return q
        };
        var r = function(b, a, c) {
            a = i.extend({
                id: null,
                send: !0,
                receive: !0
            }, a);
            if (a.receive) {
                var d = [],
                    f = function(f) {
                        -1 === d.indexOf(f) && (d.push(f), b.on(f, function(b) {
                            var d = "function" === typeof a.id ? a.id(f, b) : null,
                                e = "function" === typeof a.receive ? a.receive(f, b) : !0;
                            (e || "boolean" !== typeof e) && c._emit(f, b, d)
                        }))
                    },
                    g;
                for (g in c.handlers)
                    for (var h = 0; h < c.handlers[g].length; h++) f(g, c.handlers[g][h]);
                c._on("on", f)
            }
            a.send && c._on("emit", function(c, d) {
                var e = "function" === typeof a.send ? a.send(c, d) : !0;
                (e || "boolean" !== typeof e) && b.emit(c, d)
            })
        };
        r.factory = function(b, a, c) {
            return "undefined" === typeof b.socket ? !1 : new r(b, a, c)
        };
        d.bindings.push(r);
        return d
    }();

 
