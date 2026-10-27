const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const axios = require("axios");

function createService(status, data) {
    const notifications = [];
    // Exercise the service's actual Axios status validation without a live write.
    const client = axios.create({
        adapter: async (config) => {
            const response = { status, statusText: String(status), data, config, headers: {} };
            if (!config.validateStatus || config.validateStatus(status)) return response;
            throw new axios.AxiosError("Request failed", undefined, config, undefined, response);
        },
    });
    const source = fs
        .readFileSync(path.join(__dirname, "../service/comment.js"), "utf8")
        .replace(/^import .*;\n/gm, "")
        .replace(/export /g, "");
    const context = vm.createContext({
        JX3BOX: { __Links: { account: { login: "/login", email_verify: "/verify" } } },
        Notification: {
            warning: (value) => notifications.push({ ...value, type: "warning" }),
            error: (value) => notifications.push({ ...value, type: "error" }),
        },
        $next: () => client,
        window: { location: { href: "/article" } },
    });
    vm.runInContext(source + "\nglobalThis.submit = POST; globalThis.get = GET;", context);
    return { submit: context.submit, get: context.get, notifications };
}

for (const endpoint of ["/comment", "/comment/1/reply"]) {
    for (const status of [200, 201, 202, 204]) {
        test(`${endpoint} accepts HTTP ${status}`, async () => {
            const data = status === 204 ? "" : { id: 123 };
            const { submit, notifications } = createService(status, data);
            assert.deepEqual(await submit(endpoint, null, { content: "test" }), data);
            assert.equal(notifications.length, 0);
        });
    }
    for (const status of [400, 401, 403, 406, 423, 500]) {
        test(`${endpoint} rejects HTTP ${status}`, async () => {
            const { submit } = createService(status, { msg: "failed" });
            await assert.rejects(submit(endpoint, null, { content: "test" }), (err) => err.response.status === status);
        });
    }
}

// Load the real Options API methods, replacing only external imports.
function loadMethods(file, overrides = {}) {
    const babel = require("@babel/core");
    const bindings = {};
    const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8").match(/<script>([\s\S]*?)<\/script>/)[1];
    const result = babel.transformSync(source, {
        configFile: false,
        babelrc: false,
        plugins: [
            ({ types: t }) => ({
                visitor: {
                    ImportDeclaration(node) {
                        for (const specifier of node.node.specifiers) bindings[specifier.local.name] = {};
                        node.remove();
                    },
                    ExportDefaultDeclaration(node) {
                        node.replaceWith(
                            t.expressionStatement(
                                t.assignmentExpression(
                                    "=",
                                    t.memberExpression(t.identifier("globalThis"), t.identifier("component")),
                                    node.node.declaration
                                )
                            )
                        );
                    },
                },
            }),
        ],
    });
    const context = vm.createContext({ ...bindings, ...overrides });
    vm.runInContext(result.code, context);
    return context.component.methods;
}

for (const data of [{ code: 0 }, { code: "0" }, { code: 200 }, { id: 123 }, null, ""]) {
    test(`successful response body ${JSON.stringify(data)} is passed through`, async () => {
        const { submit, notifications } = createService(200, data);
        assert.deepEqual(await submit("/comment", null, {}), data);
        assert.equal(notifications.length, 0);
    });
}

for (const [file, method, refresh] of [
    ["src/single/Comment.vue", "userSubmitInputForm", "reloadCommentList"],
    ["src/comment/CommentWithReply.vue", "addNewReply", "loadReplyList"],
]) {
    for (const succeeds of [true, false]) {
        test(`${file}: ${succeeds ? "success clears draft and refreshes" : "failure preserves draft"}`, async () => {
            const notifications = [];
            let cleared = 0;
            let refreshed = 0;
            const methods = loadMethods(file, {
                POST: () => (succeeds ? Promise.resolve({ code: 200 }) : Promise.reject(new Error("failed"))),
            });
            const instance = {
                baseAPI: "/api",
                baseApi: "/api",
                item: { id: 1 },
                pager: { index: 1 },
                $notify: (value) => notifications.push(value),
                $jx3boxT: (key, fallback) => fallback,
                [refresh]: () => {
                    refreshed++;
                },
            };
            methods[method].call(instance, { content: "draft" }, () => {
                cleared++;
            });
            await new Promise((resolve) => setImmediate(resolve));
            assert.equal(cleared, Number(succeeds));
            assert.equal(refreshed, Number(succeeds));
            assert.equal(notifications.length, Number(succeeds));
            if (succeeds) assert.equal(notifications[0].type, "success");
        });
    }
}

for (const file of ["CommentInputForm", "CommentContent", "ReplyForReply"]) {
    test(`${file}: upload completion waits for submit success and preserves edited draft`, () => {
        const methods = loadMethods(`src/comment/${file}.vue`);
        let clear;
        const instance = {
            ...methods,
            newComment: { content: "draft" },
            content: "draft",
            $emit: (event, payload, callback) => {
                clear = callback;
            },
        };
        methods.attachmentUploadFinish.call(instance, ["https://example.com/image.png"]);
        const read = () => (file === "ReplyForReply" ? instance.content : instance.newComment.content);
        assert.equal(read(), "draft");
        if (file === "ReplyForReply") instance.content = "new draft";
        else instance.newComment.content = "new draft";
        assert.equal(clear(), false);
        assert.equal(read(), "new draft");
        methods.attachmentUploadFinish.call(instance, []);
        assert.equal(clear(), true);
        assert.equal(read(), "");
    });
}

test("nested reply forwards success callback through ReplyItem and ReplyList", () => {
    const itemMethods = loadMethods("src/comment/ReplyItem.vue");
    const listMethods = loadMethods("src/comment/ReplyList.vue");
    let onSuccess;
    const instance = {
        reply: { id: 2, userId: 3 },
        showReplyForReplyFrom: true,
        $emit: (event, data, callback) =>
            listMethods.addReply.call(
                {
                    $emit: (name, payload, forwarded) => {
                        assert.equal(payload.replyForUID, 3);
                        assert.equal(payload.replyForCommentId, 2);
                        onSuccess = forwarded;
                    },
                },
                data,
                callback
            ),
    };
    itemMethods.doReply.call(instance, {}, () => false);
    assert.equal(instance.showReplyForReplyFrom, true);
    onSuccess();
    assert.equal(instance.showReplyForReplyFrom, true);
    itemMethods.doReply.call(instance, {}, () => true);
    onSuccess();
    assert.equal(instance.showReplyForReplyFrom, false);
});

for (const [file, method, uploadError] of [
    ["CommentInputForm", "onSubmit", "attachmentUploadError"],
    ["CommentContent", "submit", "attachmentUplodError"],
    ["ReplyForReply", "submitReply", "attachmentUploadError"],
]) {
    test(`${file}: blocks duplicate submissions until settled and unlocks on upload failure`, () => {
        const methods = loadMethods(`src/comment/${file}.vue`);
        let submits = 0;
        let settle;
        const instance = {
            ...methods,
            $refs: {},
            disableSubmitBtn: false,
            newComment: { content: "draft" },
            content: "draft",
            $emit: (name, data, clear, onSettled) => {
                submits++;
                settle = onSettled;
            },
        };
        instance[method]();
        assert.equal(instance.disableSubmitBtn, true);
        instance[method]();
        assert.equal(submits, 1);
        settle();
        assert.equal(instance.disableSubmitBtn, false);
        instance[method]();
        assert.equal(submits, 2);
        instance[uploadError]();
        assert.equal(instance.disableSubmitBtn, false);
    });
}

test("quick reply shares the submission lock and releases it on settlement", () => {
    const methods = loadMethods("src/comment/CommentInputForm.vue");
    let submits = 0;
    let settle;
    const instance = {
        ...methods,
        disableSubmitBtn: false,
        $emit: (event, data, clear, callback) => {
            submits++;
            settle = callback;
            assert.equal(clear, undefined);
        },
    };
    instance.onQuickReply("hello");
    instance.onQuickReply("hello");
    instance.onSubmit();
    assert.equal(submits, 1);
    settle();
    assert.equal(instance.disableSubmitBtn, false);
});

for (const [file, method, refresh] of [
    ["src/single/Comment.vue", "userSubmitInputForm", "reloadCommentList"],
    ["src/comment/CommentWithReply.vue", "addNewReply", "loadReplyList"],
]) {
    for (const succeeds of [true, false]) {
        test(`${file}: submission settlement always unlocks, success=${succeeds}`, async () => {
            let resolve;
            let reject;
            let settled = 0;
            const pending = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            const methods = loadMethods(file, { POST: () => pending });
            const instance = {
                baseAPI: "/api",
                baseApi: "/api",
                item: { id: 1 },
                pager: { index: 1 },
                $notify() {},
                $jx3boxT: (key, text) => text,
                [refresh]: () => Promise.resolve(),
            };
            const request = methods[method].call(instance, {}, undefined, () => {
                settled++;
            });
            assert.equal(settled, 0);
            if (succeeds) resolve({});
            else reject(new Error("network failed"));
            await request;
            assert.equal(settled, 1);
        });
    }
    test(`${file}: POST succeeds and GET fails with a contextual warning only`, async () => {
        const service = createService(500, { msg: "server error" });
        const notifications = [];
        let cleared = 0;
        let settled = 0;
        const methods = loadMethods(file, { POST: () => Promise.resolve({}), GET: service.get });
        const instance = {
            ...methods,
            baseAPI: "/api",
            baseApi: "/api",
            item: { id: 1 },
            pager: { index: 1 },
            $notify: (value) => notifications.push(value),
            $jx3boxT: (key, text) => text,
        };
        await instance[method](
            {},
            () => {
                cleared++;
            },
            () => {
                settled++;
            }
        );
        assert.equal(cleared, 1);
        assert.equal(settled, 1);
        assert.equal(notifications.length, 1);
        assert.equal(notifications[0].type, "success");
        assert.equal(service.notifications.length, 1);
        assert.equal(service.notifications[0].type, "warning");
        assert.match(service.notifications[0].message, /已提交.*列表刷新失败.*无需重复提交/);
        assert.equal(instance.loading, file.includes("single") ? false : undefined);
    });
}

test("nested reply forwards settlement even when submission fails", () => {
    const item = loadMethods("src/comment/ReplyItem.vue");
    const list = loadMethods("src/comment/ReplyList.vue");
    let settled = 0;
    const instance = {
        reply: { id: 2, userId: 3 },
        showReplyForReplyFrom: true,
        $emit: (event, data, clear, onSettled) =>
            list.addReply.call(
                {
                    $emit: (name, payload, onSuccess, callback) => callback(),
                },
                data,
                clear,
                onSettled
            ),
    };
    item.doReply.call(
        instance,
        {},
        () => {
            throw new Error("must not clear");
        },
        () => {
            settled++;
        }
    );
    assert.equal(settled, 1);
    assert.equal(instance.showReplyForReplyFrom, true);
});
