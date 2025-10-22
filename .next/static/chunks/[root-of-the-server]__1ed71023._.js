(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/components/Home/BannerSlider.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Carousel)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jquery$2f$dist$2f$jquery$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jquery/dist/jquery.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function Carousel({ sliderData }) {
    _s();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isRTL = locale === "ar";
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    const logoSrc = locale === 'ar' ? '/assets/images/xtwitter.png' : '/assets/images/xtwitter.png';
    function shareNCSI(index) {
        setSelectedSlideIndex(index);
        setShowModal(true);
    }
    const baseUrl = sliderData.baseUrl;
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedSlideIndex, setSelectedSlideIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const selectedImagePath = selectedSlideIndex !== null ? isRTL ? sliderData.items[selectedSlideIndex]?.slider_image_ar : sliderData.items[selectedSlideIndex]?.slider_image : "";
    const selectedImageUrl = `${baseUrl}/${selectedImagePath}`;
    const encodedImageUrl = encodeURIComponent(selectedImageUrl);
    //     useEffect(() => {
    //     // Import the plugin script after jQuery is available
    //     import('../../public/assets/bootstrapcarouselswipe/bootstrap-carousel-swipe.js').then(() => {
    //       $('.carousel').carousel();
    //     });
    //   }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "2a432291e4ab0038",
                children: ".carousel-control.jsx-2a432291e4ab0038{justify-content:center!important;align-items:center!important;display:flex!important}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "data-interval": "false",
                id: "slider1-9",
                className: "jsx-2a432291e4ab0038" + " " + "carousel slide cid-ruuXFG6DcH container-slide",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-2a432291e4ab0038" + " " + "full-screen",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-pause": "true",
                        "data-keyboard": "false",
                        "data-ride": "carousel",
                        "data-interval": "6000",
                        className: "jsx-2a432291e4ab0038" + " " + "mbr-slider slide carousel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "jsx-2a432291e4ab0038" + " " + "carousel-indicators",
                                children: sliderData.items?.map((_, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        "data-app-prevent-settings": "",
                                        "data-target": "#slider1-9",
                                        "data-slide-to": idx,
                                        className: "jsx-2a432291e4ab0038" + " " + ((idx === 0 ? "active" : "") || "")
                                    }, idx, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                role: "listbox",
                                className: "jsx-2a432291e4ab0038" + " " + "carousel-inner",
                                children: sliderData.items?.map((item, idx)=>{
                                    const imageUrl = isRTL ? `${baseUrl}/${item.slider_image_ar}` : `${baseUrl}/${item.slider_image}`;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-2a432291e4ab0038" + " " + `carousel-item slider-fullscreen-image ${idx === 0 ? "active" : ""}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-2a432291e4ab0038" + " " + "container container-slide",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-2a432291e4ab0038" + " " + "image_wrapper",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: imageUrl,
                                                        alt: item.alt_text,
                                                        className: "jsx-2a432291e4ab0038"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                                        lineNumber: 85,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        id: idx === 0 ? "socialShare" : undefined,
                                                        onClick: ()=>shareNCSI(idx),
                                                        className: "jsx-2a432291e4ab0038" + " " + "carousel-share customeIconHome-share color-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                                        lineNumber: 86,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-2a432291e4ab0038" + " " + "carousel-caption justify-content-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-2a432291e4ab0038" + " " + "col-10 align-center"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                                            lineNumber: 92,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                                        lineNumber: 91,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 84,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 83,
                                            columnNumber: 21
                                        }, this)
                                    }, item.id, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 78,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                "data-app-prevent-settings": "",
                                "data-wow-delay": "0.2s",
                                "data-wow-duration": "0.5s",
                                role: "button",
                                "data-slide": "prev",
                                href: "#slider1-9",
                                className: "jsx-2a432291e4ab0038" + " " + "carousel-control carousel-control-prev wow fadeInLeft ",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-2a432291e4ab0038" + " " + "customeIconHome-arrow-cheveron-left mbr-iconfont slider-arrow-left color-theme"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-2a432291e4ab0038" + " " + "sr-only",
                                        children: "Previous"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                "data-app-prevent-settings": "",
                                "data-wow-delay": "0.4s",
                                "data-wow-duration": "0.5s",
                                role: "button",
                                "data-slide": "next",
                                href: "#slider1-9",
                                className: "jsx-2a432291e4ab0038" + " " + "carousel-control carousel-control-next slider-prev-icon wow fadeInLeft",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-2a432291e4ab0038" + " " + "customeIconHome-arow-cheveron-right mbr-iconfont color-theme slider-arrow-right"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-2a432291e4ab0038" + " " + "sr-only",
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Home/BannerSlider.jsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/BannerSlider.jsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/BannerSlider.jsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            showModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                tabIndex: "-1",
                role: "dialog",
                id: "shareModal",
                style: {
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 100
                },
                onClick: ()=>setShowModal(false),
                className: "jsx-2a432291e4ab0038" + " " + "modal fade show",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    role: "document",
                    onClick: (e)=>e.stopPropagation(),
                    className: "jsx-2a432291e4ab0038" + " " + "modal-dialog",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-2a432291e4ab0038" + " " + "modal-content share-modal Mobileapp_popup",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": "Close",
                                onClick: ()=>setShowModal(false),
                                style: {
                                    top: '-12px',
                                    right: '-12px'
                                },
                                className: "jsx-2a432291e4ab0038" + " " + "close",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": "true",
                                        className: "jsx-2a432291e4ab0038",
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 183,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-2a432291e4ab0038" + " " + "sr-only",
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                        lineNumber: 184,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 176,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "10px 5px"
                                },
                                id: "shareSocialHead",
                                className: "jsx-2a432291e4ab0038" + " " + "text-center text-bold text-16 text-[#6d6e71]",
                                children: t("share_to_social_media")
                            }, void 0, false, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "shareImage",
                                className: "jsx-2a432291e4ab0038" + " " + "text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: `${baseUrl}/${isRTL ? sliderData.items[selectedSlideIndex]?.slider_image_ar : sliderData.items[selectedSlideIndex]?.slider_image}`,
                                    alt: "Slide preview",
                                    style: {
                                        maxWidth: "100%",
                                        height: "auto"
                                    },
                                    className: "jsx-2a432291e4ab0038"
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                    lineNumber: 196,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "shareButtons",
                                className: "jsx-2a432291e4ab0038" + " " + "jssocials text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-2a432291e4ab0038" + " " + "jssocials-shares d-flex justify-content-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-2a432291e4ab0038" + " " + "jssocials-share jssocials-share-email",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `mailto:?subject=Slide Share&body=${encodedImageUrl}`,
                                                target: "_self",
                                                className: "jsx-2a432291e4ab0038" + " " + "jssocials-share-link",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "jsx-2a432291e4ab0038" + " " + "fa fa-at jssocials-share-logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                                    lineNumber: 216,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 211,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 210,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: "42px",
                                                height: "41px",
                                                marginTop: "5px",
                                                padding: "5px",
                                                paddingRight: "9px"
                                            },
                                            className: "jsx-2a432291e4ab0038" + " " + " jssocials-share-twitter",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://twitter.com/share?url=${encodedImageUrl}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "jsx-2a432291e4ab0038" + " " + "jssocials-share-link",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-2a432291e4ab0038" + " " + "",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: logoSrc,
                                                        className: "jsx-2a432291e4ab0038"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/BannerSlider.jsx",
                                                        lineNumber: 229,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                                    lineNumber: 228,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 221,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 220,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-2a432291e4ab0038" + " " + "jssocials-share jssocials-share-facebook",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://facebook.com/sharer/sharer.php?u=${encodedImageUrl}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "jsx-2a432291e4ab0038" + " " + "jssocials-share-link",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "jsx-2a432291e4ab0038" + " " + "fab fa-facebook-f jssocials-share-logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                                    lineNumber: 244,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 238,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 237,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-2a432291e4ab0038" + " " + "jssocials-share jssocials-share-linkedin",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedImageUrl}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "jsx-2a432291e4ab0038" + " " + "jssocials-share-link",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "jsx-2a432291e4ab0038" + " " + "fab fa-linkedin-in jssocials-share-logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                                    lineNumber: 255,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 249,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 248,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-2a432291e4ab0038" + " " + "jssocials-share jssocials-share-whatsapp",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://wa.me/?text=${encodedImageUrl}`,
                                                target: "_blank",
                                                className: "jsx-2a432291e4ab0038" + " " + "jssocials-share-link",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "jsx-2a432291e4ab0038" + " " + "fab fa-whatsapp jssocials-share-logo"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                                    lineNumber: 265,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                                lineNumber: 260,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/BannerSlider.jsx",
                                            lineNumber: 259,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Home/BannerSlider.jsx",
                                    lineNumber: 207,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/BannerSlider.jsx",
                                lineNumber: 206,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Home/BannerSlider.jsx",
                        lineNumber: 175,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/BannerSlider.jsx",
                    lineNumber: 170,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/BannerSlider.jsx",
                lineNumber: 158,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(Carousel, "HZPNs9reHApCI61mk26+gYX4pCM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Carousel;
var _c;
__turbopack_context__.k.register(_c, "Carousel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/MenuList.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
// import './MenuList.css'; 
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const MenuList = ()=>{
    _s();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const menuItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuList.useMemo[menuItems]": ()=>[
                {
                    labelKey: 'e_census_portal',
                    href: 'https://portal.ecensus.gov.om'
                },
                {
                    labelKey: 'data_portal',
                    href: 'https://data.gov.om'
                },
                {
                    labelKey: 'sdg',
                    href: 'https://sdg.ncsi.gov.om/'
                },
                {
                    labelKey: 'national_statistics',
                    href: '#'
                },
                {
                    labelKey: 'oman_nsdi',
                    href: 'https://nsdig2gapps.ncsi.gov.om/nsdiportal/'
                },
                {
                    labelKey: 'women_in_oman',
                    href: locale === 'ar' ? '/ar/women-in-oman' : '/women-in-oman'
                },
                {
                    labelKey: 'manafeth_international_trade',
                    href: 'https://manafeth.ncsi.gov.om'
                },
                {
                    labelKey: 'big_data_pilot_project',
                    href: 'https://mpd.ncsi.gov.om'
                }
            ]
    }["MenuList.useMemo[menuItems]"], [
        locale
    ]);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])('common');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "row home-menu text-bold",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "population-clock-header bg-theme color-white text-bold",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-2 text-center wow fadeInLeft",
                                "data-wow-delay": "0.2s",
                                "data-wow-duration": "0.5s",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "customeIconHome-menu section-head-icon vertical-middle main-menu-icon"
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/MenuList.jsx",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/MenuList.jsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this),
                            locale !== "ar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col wow fadeInLeft",
                                style: {
                                    "marginLeft": "-15px"
                                },
                                "data-wow-delay": "0.3s",
                                "data-wow-duration": "0.5s",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "section-head vertical-middle",
                                    children: t('main_menu')
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/MenuList.jsx",
                                    lineNumber: 39,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/MenuList.jsx",
                                lineNumber: 35,
                                columnNumber: 33
                            }, this),
                            locale == "ar" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col wow fadeInLeft",
                                style: {
                                    "marginRight": "-28px"
                                },
                                "data-wow-delay": "0.3s",
                                "data-wow-duration": "0.5s",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "section-head vertical-middle",
                                    children: t('main_menu')
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/MenuList.jsx",
                                    lineNumber: 45,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/MenuList.jsx",
                                lineNumber: 41,
                                columnNumber: 32
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Home/MenuList.jsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/MenuList.jsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                menuItems?.map((item, index)=>{
                    const delay = 0.35 + index * 0.05;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row menu-item",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-2 text-center text-20 align-self-center wow fadeInLeft rotate-icon",
                                "data-wow-delay": `${delay.toFixed(2)}s`,
                                "data-wow-duration": "0.5s",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "customeIconHome-arrow-circle color-theme "
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/MenuList.jsx",
                                    lineNumber: 59,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/MenuList.jsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col align-self-center wow fadeInLeft",
                                "data-wow-delay": `${(delay + 0.05).toFixed(2)}s`,
                                "data-wow-duration": "0.5s",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    target: item.href.startsWith('http') ? '_blank' : undefined,
                                    rel: item.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                                    href: item.href,
                                    children: t(item.labelKey)
                                }, index, false, {
                                    fileName: "[project]/components/Home/MenuList.jsx",
                                    lineNumber: 66,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/MenuList.jsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/components/Home/MenuList.jsx",
                        lineNumber: 53,
                        columnNumber: 13
                    }, this);
                })
            ]
        }, void 0, true, {
            fileName: "[project]/components/Home/MenuList.jsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Home/MenuList.jsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
};
_s(MenuList, "G3T2YltiA2GXgRNJVc8w1mkYtRQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = MenuList;
const __TURBOPACK__default__export__ = MenuList;
var _c;
__turbopack_context__.k.register(_c, "MenuList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/PublicationSlider.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/navigation.mjs [client] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const PublicationSlider = ({ publicationData = [] })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const baseUrlCover = publicationData.baseUrlCover;
    const baseUrlPdf = publicationData.baseUrlPdf;
    const publicationUrl = locale === 'ar' ? '/ar/publications' : '/publications';
    const isRTL = locale === "ar";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "publisher-slide-main",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-bold text-25 wow fadeInLeft  ",
                "data-wow-delay": "0.4s",
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'top'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                    href: publicationUrl,
                    className: " pt-3 pb-5",
                    style: {
                        color: "#6d6c71"
                    },
                    children: t("publications")
                }, void 0, false, {
                    fileName: "[project]/components/Home/PublicationSlider.jsx",
                    lineNumber: 27,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/PublicationSlider.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "swiper-two-wrapper pt-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["Swiper"], {
                    dir: isRTL ? 'rtl' : 'ltr',
                    modules: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"]
                    ],
                    navigation: {
                        nextEl: isRTL ? ".pub-btn-next" : ".pub-btn-prev",
                        prevEl: isRTL ? ".pub-btn-prev" : ".pub-btn-next"
                    },
                    loop: false,
                    direction: "horizontal",
                    slidesPerView: 1,
                    breakpoints: {
                        640: {
                            slidesPerView: 1
                        },
                        768: {
                            slidesPerView: 1
                        },
                        1024: {
                            slidesPerView: 1
                        }
                    },
                    className: "swiper-two",
                    children: [
                        publicationData?.items?.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                                style: {
                                    padding: '10px'
                                },
                                children: [
                                    router.locale == "ar" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `${baseUrlPdf}/${item.pdf_file_ar ? item.pdf_file_ar : item.pdf_file}`,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                            width: "75%",
                                            margin: "0 auto"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: `${baseUrlCover}/${item.cover_image}`,
                                            alt: "publication"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/PublicationSlider.jsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/PublicationSlider.jsx",
                                        lineNumber: 51,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `${baseUrlPdf}/${item.pdf_file ? item.pdf_file : item.pdf_file_ar}`,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '100%',
                                            width: "75%",
                                            margin: "0 auto"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: `${baseUrlCover}/${item.cover_image}`,
                                            alt: "publication"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/PublicationSlider.jsx",
                                            lineNumber: 80,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/PublicationSlider.jsx",
                                        lineNumber: 67,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "slider-caption mt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: router.locale === "ar" ? item.title_ar : item.title_en
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/PublicationSlider.jsx",
                                                lineNumber: 84,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/Home/PublicationSlider.jsx",
                                                lineNumber: 87,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: new Date(item.created_at).toLocaleDateString(router.locale, {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/PublicationSlider.jsx",
                                                lineNumber: 88,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Home/PublicationSlider.jsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/components/Home/PublicationSlider.jsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pub-btn-prev customeIconHome-arrow-circle wow fadeInLeft",
                            "data-wow-delay": "0.5s",
                            "data-wow-duration": "0.5s"
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PublicationSlider.jsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pub-btn-next customeIconHome-arrow-left wow fadeInLeft",
                            "data-wow-delay": "0.5s",
                            "data-wow-duration": "0.5s"
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PublicationSlider.jsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)
                    ]
                }, isRTL, true, {
                    fileName: "[project]/components/Home/PublicationSlider.jsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/PublicationSlider.jsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Home/PublicationSlider.jsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
};
_s(PublicationSlider, "J16e9EJjZ2QNFAdLgG+v6LlrF3g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PublicationSlider;
const __TURBOPACK__default__export__ = PublicationSlider;
var _c;
__turbopack_context__.k.register(_c, "PublicationSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/CalenderIndicator.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const CalendarIndicator = ({ highlightDate, indicatorData, indicatorTitle, nextReleaseDate, nextReleaseDateList = [], setClickedReleaseDate, setNextReleaseDate })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const calendarContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const calendarRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    // Local state for main date, default to today
    const [mainDate, setMainDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "CalendarIndicator.useState": ()=>{
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        }
    }["CalendarIndicator.useState"]);
    // Track if user has clicked a date
    const [isDateClicked, setIsDateClicked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Track if an indicator is being hovered
    const [isIndicatorHovered, setIsIndicatorHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Track if we're in initial state (no indicator hovered, no user click)
    const [isInitialState, setIsInitialState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Track if the clicked date is a highlighted date
    const [isClickedHighlightedDate, setIsClickedHighlightedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Track which indicator the clicked date corresponds to
    const [clickedIndicatorTitle, setClickedIndicatorTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Track user's last clicked date to prevent override
    const [userClickedDate, setUserClickedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Use ref to track if change is from user click (prevents useEffect override)
    const isFromUserClickRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastNextReleaseDateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(nextReleaseDate);
    // Sync local mainDate with nextReleaseDate from parent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarIndicator.useEffect": ()=>{
            // If the change is from user click, don't override
            if (isFromUserClickRef.current) {
                // console.log('Preventing override due to user click');
                return;
            }
            // Only update if nextReleaseDate actually changed (not from internal state)
            if (nextReleaseDate !== lastNextReleaseDateRef.current) {
                lastNextReleaseDateRef.current = nextReleaseDate;
                if (nextReleaseDate && typeof nextReleaseDate === 'string' && nextReleaseDate.length > 0) {
                    // console.log('Updating from indicator hover');
                    setMainDate(nextReleaseDate);
                    // If nextReleaseDate comes from parent (indicator hover), show indicator title and next release
                    setIsIndicatorHovered(true);
                    setIsDateClicked(true);
                    setIsInitialState(false);
                    setIsClickedHighlightedDate(false);
                    setClickedIndicatorTitle(null);
                    setUserClickedDate(null); // Clear user clicked date to allow hover logic
                } else {
                    // If no nextReleaseDate, we're back to initial state
                    setIsIndicatorHovered(false);
                    setIsDateClicked(false);
                    setIsInitialState(true);
                    setIsClickedHighlightedDate(false);
                    setClickedIndicatorTitle(null);
                    setUserClickedDate(null); // Clear user clicked date
                }
            }
        }
    }["CalendarIndicator.useEffect"], [
        nextReleaseDate
    ]);
    // Reset the user click flag after a delay
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarIndicator.useEffect": ()=>{
            if (isFromUserClickRef.current) {
                const timer = setTimeout({
                    "CalendarIndicator.useEffect.timer": ()=>{
                        // console.log('Resetting user click flag');
                        isFromUserClickRef.current = false;
                    }
                }["CalendarIndicator.useEffect.timer"], 300); // Increased timeout to avoid race conditions
                return ({
                    "CalendarIndicator.useEffect": ()=>clearTimeout(timer)
                })["CalendarIndicator.useEffect"];
            }
        }
    }["CalendarIndicator.useEffect"], [
        isFromUserClickRef.current
    ]);
    // Additional effect to reset flag when nextReleaseDate changes (for hover)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarIndicator.useEffect": ()=>{
            if (nextReleaseDate && nextReleaseDate !== lastNextReleaseDateRef.current) {
                // If nextReleaseDate changes and it's not from user click, reset the flag
                if (!isFromUserClickRef.current) {
                    console.log('Resetting flag due to external nextReleaseDate change');
                    isFromUserClickRef.current = false;
                }
            }
        }
    }["CalendarIndicator.useEffect"], [
        nextReleaseDate
    ]);
    const parseDateDMY = (dateStr)=>{
        if (!dateStr || typeof dateStr !== "string") return new Date();
        const [day, month, year] = dateStr.split("/").map(Number);
        // Check for invalid date components
        if (isNaN(day) || isNaN(month) || isNaN(year)) return new Date();
        return new Date(year, month - 1, day);
    };
    function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
        if (releaseType === "Monthly") {
            const indicatorDate = new Date(indicatorDateStr);
            if (isNaN(indicatorDate)) return null;
            // Add 1 month
            let year = indicatorDate.getFullYear();
            let month = indicatorDate.getMonth() + 1;
            if (month > 11) {
                month = 0;
                year += 1;
            }
            // Construct and return the new date
            const nextReleaseDate = new Date(year, month, nextReleaseDay);
            return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
        } else if (releaseType === "Quarterly") {
            const indicatorDate = new Date(indicatorDateStr);
            if (isNaN(indicatorDate)) return null;
            let indicatorYear = indicatorDate.getFullYear();
            let indicatorMonth = indicatorDate.getMonth(); // 0-based
            let releaseMonth = monthOfQuarter - 1; // convert to 0-based month
            // If indicator month is after or equal to the release month, use next year
            let releaseYear = indicatorMonth >= releaseMonth ? indicatorYear + 1 : indicatorYear;
            const nextReleaseDate = new Date(releaseYear, releaseMonth, nextReleaseDay);
            return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
        }
        return null; // Fallback
    }
    // Use mainDate for display
    const dateObj = mainDate ? parseDateDMY(mainDate) : new Date();
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth();
    const monthName = dateObj.toLocaleString(router?.locale || "en", {
        month: "long"
    });
    // Helper to normalize any date (string or Date object) to yyyy-mm-dd (0-padded)
    const normalizeDate = (date)=>{
        if (!date) return '';
        let d;
        if (typeof date === 'string' && date.includes('/')) {
            d = parseDateDMY(date);
        } else {
            d = new Date(date);
        }
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0'); // +1 because getMonth() is 0-based
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    // const nextRelease = nextReleaseDate
    //   ? new Date(nextReleaseDate).toLocaleDateString(router.locale, {
    //       day: '2-digit',
    //       month: 'long',
    //       year: 'numeric',
    //     })
    //   : '';
    const monthNamesAr = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"
    ];
    const title = router.locale === "ar" ? indicatorTitle?.ar : indicatorTitle?.en;
    // Compute all next release dates for indicators
    const allNextReleaseDates = Array.isArray(indicatorData?.items) ? indicatorData.items.flatMap((item)=>{
        if (item.release_type === "Monthly") {
            const indicatorDate = new Date(item.indicator_date);
            if (isNaN(indicatorDate)) return [];
            // Get the day number safely
            let day;
            if (item.indicator_next_release_date) {
                if (typeof item.indicator_next_release_date === "number") {
                    day = item.indicator_next_release_date;
                } else if (typeof item.indicator_next_release_date === "string") {
                    const asNumber = Number(item.indicator_next_release_date);
                    if (!isNaN(asNumber)) {
                        day = asNumber;
                    } else {
                        const parsedDate = new Date(item.indicator_next_release_date);
                        day = isNaN(parsedDate) ? indicatorDate.getDate() : parsedDate.getDate();
                    }
                } else {
                    day = indicatorDate.getDate();
                }
            } else {
                day = indicatorDate.getDate();
            }
            const dates = [];
            for(let i = 0; i < 12; i++){
                let year = indicatorDate.getFullYear();
                let month = indicatorDate.getMonth() + i;
                year += Math.floor(month / 12);
                month = month % 12;
                const nextDate = new Date(year, month, day);
                // Only future dates (including today)
                const now = new Date();
                now.setHours(0, 0, 0, 0);
                if (nextDate >= now) {
                    dates.push(nextDate.toLocaleDateString("en-GB"));
                }
            }
            return dates;
        } else {
            // Quarterly or others: single date as before
            const nextDate = getNextReleaseDate(item.indicator_date, item?.indicator_next_release_date, item?.release_type, item?.month_of_quarter);
            return nextDate ? [
                nextDate
            ] : [];
        }
    }) : [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CalendarIndicator.useEffect": ()=>{
            const loadScript = {
                "CalendarIndicator.useEffect.loadScript": (src)=>new Promise({
                        "CalendarIndicator.useEffect.loadScript": (resolve)=>{
                            const script = document.createElement("script");
                            script.src = src;
                            script.onload = resolve;
                            document.head.appendChild(script);
                        }
                    }["CalendarIndicator.useEffect.loadScript"])
            }["CalendarIndicator.useEffect.loadScript"];
            const loadJQueryUI = {
                "CalendarIndicator.useEffect.loadJQueryUI": async ()=>{
                    if (!window.jQuery) {
                        await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
                    }
                    if (!window.$.datepicker) {
                        await loadScript("https://code.jquery.com/ui/1.13.2/jquery-ui.min.js");
                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = "https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css";
                        document.head.appendChild(link);
                    }
                    const highlightedDates = allNextReleaseDates.map({
                        "CalendarIndicator.useEffect.loadJQueryUI.highlightedDates": (d)=>normalizeDate(d)
                    }["CalendarIndicator.useEffect.loadJQueryUI.highlightedDates"]);
                    const mainDateNorm = normalizeDate(mainDate);
                    // Destroy and reinitialize the datepicker
                    window.$(calendarRef.current).datepicker("destroy");
                    // Always use parseDateDMY for defaultDate
                    const dateObj = parseDateDMY(mainDate);
                    window.$(calendarRef.current).datepicker({
                        inline: true,
                        firstDay: 0,
                        showOtherMonths: true,
                        dayNamesMin: router.locale === "ar" ? [
                            "ح",
                            "ن",
                            "ث",
                            "ر",
                            "خ",
                            "ج",
                            "س"
                        ] // Arabic: Sunday to Saturday
                         : [
                            "S",
                            "M",
                            "T",
                            "W",
                            "T",
                            "F",
                            "S"
                        ],
                        monthNames: router.locale === "ar" ? monthNamesAr : undefined,
                        defaultDate: dateObj,
                        beforeShowDay: {
                            "CalendarIndicator.useEffect.loadJQueryUI": (date)=>{
                                const normalized = normalizeDate(date);
                                const isMainDate = normalized === mainDateNorm;
                                const isHighlighted = highlightedDates.includes(normalized);
                                if (isMainDate) {
                                    return [
                                        true,
                                        "highlighted-date"
                                    ];
                                } else if (isHighlighted) {
                                    return [
                                        true,
                                        "highlighted-text-date"
                                    ];
                                } else {
                                    return [
                                        true,
                                        ""
                                    ];
                                }
                            }
                        }["CalendarIndicator.useEffect.loadJQueryUI"],
                        onSelect: {
                            "CalendarIndicator.useEffect.loadJQueryUI": function(dateText, inst) {
                                // console.log('Date clicked:', dateText);
                                // dateText is in mm/dd/yy format, convert to dd/mm/yyyy
                                const [month, day, year] = dateText.split('/');
                                const fullYear = year.length === 2 ? '20' + year : year;
                                const formattedDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${fullYear}`;
                                // console.log('Formatted date:', formattedDate);
                                // Check if clicked date matches any indicator's next release date
                                const clickedDateNormalized = normalizeDate(formattedDate);
                                // console.log('Clicked date normalized:', clickedDateNormalized);
                                // console.log('All next release dates:', allNextReleaseDates);
                                // console.log('All next release dates normalized:', allNextReleaseDates.map(d => normalizeDate(d)));
                                // Find matching indicator by comparing normalized dates
                                let matchingIndicator = null;
                                for(let i = 0; i < indicatorData?.items?.length; i++){
                                    const item = indicatorData.items[i];
                                    const indicatorNextRelease = allNextReleaseDates[i];
                                    const indicatorNextReleaseNormalized = normalizeDate(indicatorNextRelease);
                                    // console.log(`Comparing: ${clickedDateNormalized} with ${indicatorNextReleaseNormalized}`);
                                    if (indicatorNextRelease && indicatorNextReleaseNormalized === clickedDateNormalized) {
                                        matchingIndicator = item;
                                        break;
                                    }
                                }
                                // console.log('Matching indicator:', matchingIndicator);
                                // console.log('Setting isFromUserClickRef.current to true');
                                // Set flag first to prevent useEffect from running
                                isFromUserClickRef.current = true;
                                setMainDate(formattedDate);
                                setUserClickedDate(formattedDate); // Set user clicked date to prevent override
                                setIsDateClicked(true);
                                setIsIndicatorHovered(false); // User clicked, not hovering
                                setIsInitialState(false);
                                setIsClickedHighlightedDate(!!matchingIndicator);
                                setClickedIndicatorTitle(matchingIndicator ? {
                                    en: matchingIndicator.indicator_title_en,
                                    ar: matchingIndicator.indicator_title_ar
                                } : null);
                                setClickedReleaseDate && setClickedReleaseDate(formattedDate);
                            // Don't call setNextReleaseDate here to avoid overriding state
                            }
                        }["CalendarIndicator.useEffect.loadJQueryUI"],
                        onChangeMonthYear: {
                            "CalendarIndicator.useEffect.loadJQueryUI": function(year, month, inst) {
                                setTimeout({
                                    "CalendarIndicator.useEffect.loadJQueryUI": ()=>{
                                        window.$(calendarRef.current).datepicker('refresh');
                                    }
                                }["CalendarIndicator.useEffect.loadJQueryUI"], 0);
                            }
                        }["CalendarIndicator.useEffect.loadJQueryUI"]
                    });
                    // Add mouseleave handler to reset user click flag
                    window.$(calendarRef.current).off('mouseleave').on('mouseleave', {
                        "CalendarIndicator.useEffect.loadJQueryUI": ()=>{
                            isFromUserClickRef.current = false;
                        }
                    }["CalendarIndicator.useEffect.loadJQueryUI"]);
                }
            }["CalendarIndicator.useEffect.loadJQueryUI"];
            loadJQueryUI();
        }
    }["CalendarIndicator.useEffect"], [
        mainDate,
        router.locale,
        JSON.stringify(allNextReleaseDates)
    ]);
    // Title logic: show "date" initially, indicator title after user clicks or hovers indicator
    const displayTitle = isIndicatorHovered || isClickedHighlightedDate ? router.locale === "ar" ? clickedIndicatorTitle?.ar || indicatorTitle?.ar : clickedIndicatorTitle?.en || indicatorTitle?.en : router.locale == "ar" ? "تاريخ" : "date";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        .ui-datepicker-header {
          background-color: #2196f3;
          color: white;
          text-align: center;
          padding: 10px;
          height: 40px;
          border-radius: 8px 8px 0px 0px;
          height: 100%;
        }
        .ui-datepicker-prev span,
        .ui-datepicker-next span {
          display: none;
        }
        .ui-datepicker-prev:after {
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          content: "\\f0d9";
          font-size: 20px;
          float: left;
          margin-left: 10px;
          cursor: pointer;
          color: #a1a1a1;
          margin-top: 6px;
        }
        .ui-datepicker-next:after {
          font-family: "Font Awesome 5 Free";
          font-weight: 900;
          content: "\\f0da";
          float: right;
          font-size: 20px;
          margin-right: 10px;
          cursor: pointer;
          color: #a1a1a1;
          margin-top: 6px;
        }
        .ui-datepicker-calendar th {
          padding: 10px;
          color: #000000;
        }
        .ui-datepicker-calendar {
          text-align: center;
          margin: 0 auto;
          padding: 8px;
        }
        .ui-datepicker-title {
          padding: 10px;
        }
        .ui-datepicker-calendar td {
          padding: 4px 2px !important;
        }
        .ui-datepicker-calendar .ui-state-default {
          text-decoration: none;
          color: black;
        }
        .ui-datepicker-calendar .ui-state-active {
          color: #ff8f2e;
        }
        .cust-cal-top {
          background-color: #00ab9b;
          color: white;
          padding: 10px 15px;
          font-size: 20px;
        }
        .cust-cal-top span {
          font-size: 22px;
          font-weight: 600;
        }
        .cust-cal-bottom {
          display: flex;
        }
        .cust-cal-orange {
          background-color: #ff8f2e;
          /* padding:10px; */
        }
        .ui-datepicker-calendar .ui-state-default {
          border: none !important;
        }
        .ui-datepicker .ui-widget-header {
          border: none !important;
          border-bottom: 1px solid #b9b9b9 !important;
        }
        .ui-datepicker {
          border: none !important;
          margin-top: 0px !important;
        }
        .ui-datepicker,
        .ui-datepicker .ui-widget-content,
        .ui-datepicker .ui-widget-header,
        .ui-datepicker .ui-state-default,
        .ui-datepicker .ui-state-hover {
          background: #f2f2f2 url(images/ui-bg_flat_75_ffffff_40x100.png) 50% 50%
            repeat-x !important;
        }
        .cust-cal-orange h3 {
          color: white;
          font-size: 70px;
          margin: 0px;
          text-align: center;
          line-height: 1.1;
          font-weight: 600;
          margin-top: 10px;
        }
        .cust-cal-orange span {
          color: white;
          text-align: center;
          display: block;
          font-weight: 600;
          line-height: 12px;
          margin-bottom: 12px;
          font-size: 20px;
        }
        .cust-cal-orange h4 {
          color: white;
          text-align: center;
          font-size: 34px;
          margin: 0px;
          line-height: 1;
          margin-bottom: 4px;
        }
        .cust-cal-orange .chl-div {
          display: block;
          margin: 0px auto;
          border: none;
          padding: 6px 2px;
          background-color: white;
          width: 90px;
          font-size: 14px;
          text-align: center;
        }
        .bk-wyt-arw {
          background-color: white;
          margin: 10px;
          text-align: center;
          line-height: 1.3;
          padding: 6px;
          font-size: 14px;
          margin-bottom: 0px;
          position: relative;
          width: 98px !important;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bk-wyt-arw::after {
          content: "";
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
        }
        .cust-cal-wrap {
          background-color: white;
          /* width: 360px; */
        }
        .ui-datepicker .ui-datepicker-title {
          font-size: 14px !important;
          line-height: 1em;
          text-align: center;
          color: black;
          font-weight: bold;
        }
        span.ui-datepicker-month {
          text-transform: uppercase;
          color: gray;
        }
        span.ui-datepicker-year {
          color: gray;
        }
        .hasDatepicker {
          width: 100%;
        }
        .ui-datepicker {
          width: auto !important;
          padding: 0px !important;
        }
        .ui-datepicker td span,
        .ui-datepicker td a {
          text-align: center;
        }
        .ui-widget-header .ui-icon {
          display: none !important;
        }
        .ui-datepicker .ui-datepicker-prev,
        .ui-datepicker .ui-datepicker-next {
          outline: none !important;
          border: none !important;
        }
        .ui-datepicker table {
          margin: 0 0 0.8em;
        }
        .highlighted-date .ui-state-default {
          background-color: #ff8f2e !important;
          color: white !important;
          font-weight: bold !important;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center !important;
          margin: 0px auto;
          line-height: 27px;
        }
        .highlighted-text-date .ui-state-default {
          color: #ff8f2e !important;
          font-weight: bold !important;
        }

      `
            }, void 0, false, {
                fileName: "[project]/components/Home/CalenderIndicator.jsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "custom-calendar-wrapper",
                ref: calendarContainerRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "cust-cal-wrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cust-cal-top",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fas fa-calendar-alt"
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                    lineNumber: 606,
                                    columnNumber: 13
                                }, this),
                                " ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "calander-text",
                                    children: t("calander_of_the_key")
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                    lineNumber: 607,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                            lineNumber: 605,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "cust-cal-bottom",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "calendar",
                                    className: "",
                                    ref: calendarRef
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                    lineNumber: 610,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "cust-cal-orange",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bk-wyt-arw",
                                            children: displayTitle
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                            lineNumber: 612,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: t(`${day}`)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                            lineNumber: 613,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t(monthName)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                            lineNumber: 614,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: year
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                            lineNumber: 615,
                                            columnNumber: 15
                                        }, this),
                                        (isIndicatorHovered || isClickedHighlightedDate) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "chl-div",
                                            children: t("next_release")
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                            lineNumber: 617,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Home/CalenderIndicator.jsx",
                                    lineNumber: 611,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Home/CalenderIndicator.jsx",
                            lineNumber: 609,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Home/CalenderIndicator.jsx",
                    lineNumber: 604,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/CalenderIndicator.jsx",
                lineNumber: 603,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(CalendarIndicator, "bkNX43h6fM+nC8KgQWCKUZIFUVU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = CalendarIndicator;
const __TURBOPACK__default__export__ = CalendarIndicator;
var _c;
__turbopack_context__.k.register(_c, "CalendarIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/IndicatorSlider .jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$bundle$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-bundle.mjs [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$shared$2f$swiper$2d$core$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__S__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/shared/swiper-core.mjs [client] (ecmascript) <export S as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
const IndicatorSlider = ({ indicatorData, onIndicatorHover, onNextReleaseDatesReady, clickedReleaseDate })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isRTL = router.locale === "ar";
    const formatDateToMonthYear = (dateString)=>{
        if (!dateString) return "";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(router.locale, {
            year: "numeric",
            month: "long"
        }).format(date);
    };
    const formatDateDDMMYYYY = (dateInput)=>{
        const date = new Date(dateInput);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    // function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
    //   if (releaseType === "Monthly") {
    //     const indicatorDate = new Date(indicatorDateStr);
    //     if (isNaN(indicatorDate)) return null;
    //     // Add 1 month
    //     let year = indicatorDate.getFullYear();
    //     let month = indicatorDate.getMonth() + 1; // 0-based to 1-based
    //     if (month > 11) {
    //       month = 0;
    //       year += 1;
    //     }
    //     // Construct and return the new date
    //     const nextReleaseDate = new Date(year, month, nextReleaseDay);
    //     return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
    //   } else if (releaseType === "Quarterly") {
    //     const indicatorDate = new Date(indicatorDateStr);
    //     if (isNaN(indicatorDate)) return null;
    //     let indicatorYear = indicatorDate.getFullYear();
    //     let indicatorMonth = indicatorDate.getMonth(); // 0-based
    //     let releaseMonth = monthOfQuarter - 1; // convert to 0-based month
    //     // If indicator month is after or equal to the release month, use next year
    //     let releaseYear = indicatorMonth >= releaseMonth ? indicatorYear + 1 : indicatorYear;
    //     const nextReleaseDate = new Date(releaseYear, releaseMonth, nextReleaseDay);
    //     return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
    //   }
    //   return null; // Fallback
    // }
    // console.log(nextReleaseDate, "--indicatorData");
    function getNextReleaseDate(indicatorDateStr, nextReleaseDay, releaseType, monthOfQuarter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time
        if (releaseType === "Monthly") {
            const indicatorDate = new Date(indicatorDateStr);
            if (isNaN(indicatorDate)) return null;
            let year = today.getFullYear();
            let month = today.getMonth();
            // Build release date for current month
            let tentativeDate = new Date(year, month, nextReleaseDay);
            // If today is after the tentative release date, move to next month
            if (today > tentativeDate) {
                month += 1;
                if (month > 11) {
                    month = 0;
                    year += 1;
                }
                tentativeDate = new Date(year, month, nextReleaseDay);
            }
            return tentativeDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
        }
        // For Quarterly
        if (releaseType === "Quarterly") {
            const indicatorDate = new Date(indicatorDateStr);
            if (isNaN(indicatorDate)) return null;
            let indicatorYear = indicatorDate.getFullYear();
            let indicatorMonth = indicatorDate.getMonth(); // 0-based
            let releaseMonth = monthOfQuarter - 1; // convert to 0-based month
            // If indicator month is after or equal to the release month, use next year
            let releaseYear = indicatorMonth >= releaseMonth ? indicatorYear + 1 : indicatorYear;
            const nextReleaseDate = new Date(releaseYear, releaseMonth, nextReleaseDay);
            return nextReleaseDate.toLocaleDateString("en-GB"); // dd/mm/yyyy
        }
        return null;
    }
    const indicatorList = indicatorData.items;
    const baseUrl = indicatorData.baseUrl;
    const indicators = indicatorList?.map((item)=>({
            value: item.indicator_value,
            percent: isRTL ? item.indicator_value_unit_ar : item.indicator_value_unit_en,
            description: isRTL ? item.indicator_title_ar : item.indicator_title_en,
            date: isRTL ? item?.indicator_sub_title_ar : item?.indicator_sub_title_en,
            indicator_date: item.indicator_date,
            indicator_next_release_date: item.indicator_next_release_date,
            file: item.file,
            release_type: item?.release_type,
            month_of_quarter: item?.month_of_quarter,
            bgClass: "bg-white"
        }));
    // console.log(indicators, "-----------indicators");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorSlider.useEffect": ()=>{
            if (indicatorList.length > 0) {
                const firstItem = indicatorList[0];
                onIndicatorHover?.(firstItem.indicator_date, firstItem.indicator_title_en, firstItem.indicator_title_ar, firstItem.indicator_next_release_date);
            }
            const allNextReleaseDates = indicatorList?.map({
                "IndicatorSlider.useEffect": (item)=>item.indicator_next_release_date
            }["IndicatorSlider.useEffect"]).filter({
                "IndicatorSlider.useEffect": (date)=>date
            }["IndicatorSlider.useEffect"]); // remove null/undefined
            onNextReleaseDatesReady?.(allNextReleaseDates);
        }
    }["IndicatorSlider.useEffect"], []);
    const swiperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorSlider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            const isRTL = router.locale === "ar";
            document.documentElement.dir = isRTL ? "rtl" : "ltr";
            swiperRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$shared$2f$swiper$2d$core$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__S__as__default$3e$__["default"](".indicator-swiper-container", {
                loop: false,
                direction: "horizontal",
                rtl: isRTL,
                slidesPerView: 3,
                spaceBetween: 16,
                navigation: {
                    nextEl: isRTL ? ".indicator-button-prev" : ".indicator-button-next",
                    prevEl: isRTL ? ".indicator-button-next" : ".indicator-button-prev"
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1
                    },
                    600: {
                        slidesPerView: 3
                    },
                    768: {
                        slidesPerView: 3
                    },
                    1024: {
                        slidesPerView: 3
                    }
                }
            });
            return ({
                "IndicatorSlider.useEffect": ()=>{
                    swiperRef.current?.destroy?.(true, true);
                }
            })["IndicatorSlider.useEffect"];
        }
    }["IndicatorSlider.useEffect"], [
        router.locale
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IndicatorSlider.useEffect": ()=>{
            if (!swiperRef.current || !clickedReleaseDate) return;
            const targetIndex = indicators.findIndex({
                "IndicatorSlider.useEffect.targetIndex": (item)=>formatDateDDMMYYYY(item.indicator_next_release_date) === formatDateDDMMYYYY(clickedReleaseDate)
            }["IndicatorSlider.useEffect.targetIndex"]);
            if (targetIndex !== -1) {
                swiperRef.current.slideTo(targetIndex);
                const targetItem = indicatorList[targetIndex];
                onIndicatorHover?.(targetItem.indicator_date, targetItem.indicator_title_en, targetItem.indicator_title_ar, targetItem.indicator_next_release_date);
            } else {
                // Explicitly scroll to first or disable scroll
                swiperRef.current.slideTo(0);
                // Trigger empty indicator hover data (to update title/UI)
                onIndicatorHover?.("", "", "", clickedReleaseDate);
            }
        }
    }["IndicatorSlider.useEffect"], [
        clickedReleaseDate,
        indicatorList
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("center", {
        className: "indicator-container",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "slider-indicator-col text-center relative",
            style: {
                padding: "0px 0px"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "swiper indicator-swiper-container",
                    style: {
                        marginTop: "0px",
                        marginBottom: "0px"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "swiper-wrapper",
                        children: indicators?.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "swiper-slide",
                                children: item.file ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `${baseUrl}/${item.file}`,
                                    target: "_blank",
                                    onMouseEnter: ()=>{
                                        onIndicatorHover(item.indicator_date, indicatorList[index]?.indicator_title_en, indicatorList[index]?.indicator_title_ar, getNextReleaseDate(item.indicator_date, item?.indicator_next_release_date, item?.release_type, item?.month_of_quarter));
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `indicator-sub ${formatDateDDMMYYYY(item.indicator_next_release_date) === formatDateDDMMYYYY(clickedReleaseDate) ? "ind-highlight-text" : ""}`,
                                        style: {
                                            paddingBottom: "13px",
                                            backgroundColor: formatDateDDMMYYYY(item.indicator_next_release_date) === formatDateDDMMYYYY(clickedReleaseDate) ? "#fd7e1d" : "white"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "assets/images/download-icon_.png",
                                                alt: ""
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                lineNumber: 255,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-bold font-Janna-LTBold indicator-value",
                                                children: item.value
                                            }, void 0, false, {
                                                fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                lineNumber: 256,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "indicators-desc",
                                                style: {
                                                    height: "80px",
                                                    fontSize: "15px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-bold SubTitleIndi",
                                                        children: item.percent
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                        lineNumber: 263,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: item.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                        lineNumber: 266,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                        lineNumber: 267,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: item.date
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                        lineNumber: 268,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                lineNumber: 259,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                        lineNumber: 238,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                    lineNumber: 229,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `indicator-sub ${formatDateDDMMYYYY(item.indicator_next_release_date) === formatDateDDMMYYYY(clickedReleaseDate) ? "ind-highlight-text" : ""}`,
                                    style: {
                                        paddingBottom: "13px",
                                        backgroundColor: formatDateDDMMYYYY(item.indicator_next_release_date) === formatDateDDMMYYYY(clickedReleaseDate) ? "#fd7e1d" : "white"
                                    },
                                    onMouseEnter: ()=>{
                                        onIndicatorHover(item.indicator_date, indicatorList[index]?.indicator_title_en, indicatorList[index]?.indicator_title_ar, getNextReleaseDate(item.indicator_date, item?.indicator_next_release_date, item?.release_type, item?.month_of_quarter));
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "assets/images/download-icon_.png",
                                            alt: ""
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                            lineNumber: 297,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-bold font-Janna-LTBold indicator-value",
                                            children: item.value
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                            lineNumber: 298,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "indicators-desc",
                                            style: {
                                                height: "80px",
                                                fontSize: "15px"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-bold SubTitleIndi",
                                                    children: item.percent
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                    lineNumber: 305,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item.description
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                    lineNumber: 308,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                    lineNumber: 309,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item?.date
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                                    lineNumber: 310,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                            lineNumber: 301,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                    lineNumber: 273,
                                    columnNumber: 19
                                }, this)
                            }, index, false, {
                                fileName: "[project]/components/Home/IndicatorSlider .jsx",
                                lineNumber: 223,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                        lineNumber: 221,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                    lineNumber: 217,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "indicator-button-next wow fadeInLeft",
                    type: "button",
                    "aria-label": "Next slide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 40 40",
                        width: "40",
                        height: "40",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M15.5 0.932L11.2 5.312 25.7 19.912 11.2 34.412 15.5 38.812 30.1 24.212 34.5 19.912 30.1 15.512 15.5 0.932Z"
                        }, void 0, false, {
                            fileName: "[project]/components/Home/IndicatorSlider .jsx",
                            lineNumber: 333,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                        lineNumber: 327,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                    lineNumber: 322,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "indicator-button-prev  wow fadeInLeft",
                    type: "button",
                    "aria-label": "Previous slide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 40 40",
                        width: "40",
                        height: "40",
                        style: {
                            transform: "rotate(180deg)"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            d: "M15.5 0.932L11.2 5.312 25.7 19.912 11.2 34.412 15.5 38.812 30.1 24.212 34.5 19.912 30.1 15.512 15.5 0.932Z"
                        }, void 0, false, {
                            fileName: "[project]/components/Home/IndicatorSlider .jsx",
                            lineNumber: 349,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Home/IndicatorSlider .jsx",
                        lineNumber: 342,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/IndicatorSlider .jsx",
                    lineNumber: 337,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Home/IndicatorSlider .jsx",
            lineNumber: 213,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Home/IndicatorSlider .jsx",
        lineNumber: 212,
        columnNumber: 5
    }, this);
};
_s(IndicatorSlider, "Sm6qTPrqGUa1ycn42Zc6b3qHd4M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = IndicatorSlider;
const __TURBOPACK__default__export__ = IndicatorSlider;
var _c;
__turbopack_context__.k.register(_c, "IndicatorSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/EventAccordion.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const EventAccordion = ({ eventData = [] })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const eventsUrl = locale === "ar" ? "/ar/events" : "/events";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isRTL = router.locale === "ar";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "accordion flex lg:flex-row w-full max-w-7xl mx-auto gap-0 p-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "events-accord flex flex-col gap-[4px] flex-[3]",
                children: eventData?.items?.map((event, index)=>{
                    const eventDate = new Date(event.from_date);
                    const day = eventDate.getDate();
                    const month = eventDate.toLocaleString("default", {
                        month: "long"
                    }); // "June", etc.
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/event-details/${event.id}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "title h-[68px] flex justify-center cursor-pointer hover:bg-gray-100",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "accinnerDateInner text-center",
                                                style: {
                                                    minWidth: "70px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                        className: "text-2xl font-bold ",
                                                        children: String(day).padStart(2, "0")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                                        lineNumber: 31,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "sub-text text-sm ",
                                                        children: t(month)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                                        lineNumber: 34,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                                lineNumber: 30,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "event-acc-text text-md font-semibold text-gray-900",
                                                        children: isRTL ? event.title_ar : event.title_en
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                                        lineNumber: 37,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "event-acc-text text-gray-500 text-center",
                                                        children: [
                                                            t(month),
                                                            " ",
                                                            eventDate.getFullYear()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                                        lineNumber: 40,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                                lineNumber: 36,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                        lineNumber: 29,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "customeIconHome-arrow-left color-theme text-[28px]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Home/EventAccordion.jsx",
                                            lineNumber: 46,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/EventAccordion.jsx",
                                        lineNumber: 45,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                lineNumber: 28,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Home/EventAccordion.jsx",
                            lineNumber: 27,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Home/EventAccordion.jsx",
                        lineNumber: 26,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/Home/EventAccordion.jsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bookletWrapWrap",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: eventsUrl,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bookletWrap",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[18px] font-semibold block",
                                children: t("events")
                            }, void 0, false, {
                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                lineNumber: 59,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-[18px] font-bold m-0",
                                children: t("and")
                            }, void 0, false, {
                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[18px] font-semibold block",
                                children: t("occasions")
                            }, void 0, false, {
                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "assets/images/spiral.png",
                                alt: "spiral binding",
                                className: "spiralbind"
                            }, void 0, false, {
                                fileName: "[project]/components/Home/EventAccordion.jsx",
                                lineNumber: 66,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Home/EventAccordion.jsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/EventAccordion.jsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Home/EventAccordion.jsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Home/EventAccordion.jsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
};
_s(EventAccordion, "BVuvwvbqmLXC2060PQwtXL8mfd8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EventAccordion;
const __TURBOPACK__default__export__ = EventAccordion;
var _c;
__turbopack_context__.k.register(_c, "EventAccordion");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/common/OdoMeter.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const OdoMeter = ({ value = '0' })=>{
    _s();
    const odometerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [hasMounted, setHasMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasInitialized, setHasInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OdoMeter.useEffect": ()=>{
            setHasMounted(true);
        }
    }["OdoMeter.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OdoMeter.useEffect": ()=>{
            const loadOdometer = {
                "OdoMeter.useEffect.loadOdometer": async ()=>{
                    if (!hasMounted) return;
                    if (!window.Odometer) {
                        await __turbopack_context__.r("[project]/public/assets/scripts/odometer/odometer.js [client] (ecmascript, async loader)")(__turbopack_context__.i);
                    }
                    const numericValue = parseInt(value.replace(/,/g, ''), 10);
                    if (!hasInitialized) {
                        new window.Odometer({
                            el: odometerRef.current,
                            value: numericValue,
                            format: '(,ddd)',
                            theme: 'car',
                            duration: 2000
                        });
                        setHasInitialized(true);
                    } else {
                        odometerRef.current.innerHTML = numericValue;
                    }
                }
            }["OdoMeter.useEffect.loadOdometer"];
            loadOdometer();
        }
    }["OdoMeter.useEffect"], [
        hasMounted,
        value,
        hasInitialized
    ]);
    if (!hasMounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: odometerRef,
        className: "odometer odometer-theme-car",
        id: "odometerCustom",
        children: "0"
    }, void 0, false, {
        fileName: "[project]/components/common/OdoMeter.jsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
};
_s(OdoMeter, "m2NhWQ9myVsTdVnQx4JZoBjSbd8=");
_c = OdoMeter;
const __TURBOPACK__default__export__ = OdoMeter;
var _c;
__turbopack_context__.k.register(_c, "OdoMeter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/common/DonutChart.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$highcharts$2f$highcharts$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/highcharts/highcharts.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$highcharts$2d$react$2d$official$2f$dist$2f$highcharts$2d$react$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/highcharts-react-official/dist/highcharts-react.min.js [client] (ecmascript)");
'use client';
;
;
;
;
const DonutChart = ({ data })=>{
    const options = {
        chart: {
            type: 'pie',
            height: 200,
            spacing: [
                0,
                0,
                0,
                0
            ]
        },
        title: {
            text: ''
        },
        tooltip: {
            useHTML: true,
            backgroundColor: 'transparent',
            borderWidth: 0,
            shadow: false,
            formatter: function() {
                return `
      <div style="
        border: 1.5px solid ${this.point.color};
        border-radius: 3px;
        padding: 8px 12px;
        background-color: rgba(255, 255, 255, 0.85);
        color: #000;
        font-size: 12px;
        box-shadow:1px 1px 4px #00000070;
      ">
        <strong style="color: #000; font-weight: bold;">
          ${this.point.name}
        </strong>: ${this.point.y.toFixed(2)}%
      </div>
    `;
            }
        },
        plotOptions: {
            pie: {
                innerSize: '50%',
                size: '80%',
                startAngle: 180,
                endAngle: 540,
                dataLabels: {
                    enabled: false,
                    connectorWidth: 0,
                    distance: 0,
                    format: '{point.name}: {point.y}%',
                    style: {
                        color: '#ffffff',
                        textOutline: 'none',
                        fontWeight: 'bold'
                    }
                }
            }
        },
        series: [
            {
                data: data.map((item)=>({
                        name: item.name,
                        y: item.y,
                        color: item.color
                    }))
            }
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "row donut-chart",
                style: {
                    display: 'flex',
                    justifyContent: 'center'
                },
                "data-highcharts-chart": "0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "col",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "container",
                        className: "donut-chart-continer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$highcharts$2d$react$2d$official$2f$dist$2f$highcharts$2d$react$2e$min$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            highcharts: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$highcharts$2f$highcharts$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"],
                            options: options
                        }, void 0, false, {
                            fileName: "[project]/components/common/DonutChart.jsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/common/DonutChart.jsx",
                        lineNumber: 77,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/common/DonutChart.jsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/common/DonutChart.jsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "row donut-chart-legents text-center",
                children: data.map(({ name, y, color, count }, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-number text-55 wow fadeInRight",
                                style: {
                                    color,
                                    visibility: 'visible',
                                    animationDuration: '0.5s',
                                    animationDelay: `${0.2 + index * 0.2}s`,
                                    animationName: 'fadeInRight'
                                },
                                children: [
                                    y.toFixed(2),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-20 wow fadeInRight",
                                style: {
                                    visibility: 'visible',
                                    animationDuration: '0.5s',
                                    animationDelay: `${0.4 + index * 0.2}s`,
                                    animationName: 'fadeInRight'
                                },
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-number text-35 wow fadeInRight",
                                style: {
                                    color,
                                    visibility: 'visible',
                                    animationDuration: '0.5s',
                                    animationDelay: `${0.6 + index * 0.2}s`,
                                    animationName: 'fadeInRight'
                                },
                                children: count
                            }, void 0, false, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/components/common/DonutChart.jsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/components/common/DonutChart.jsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/common/DonutChart.jsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_c = DonutChart;
const __TURBOPACK__default__export__ = DonutChart;
var _c;
__turbopack_context__.k.register(_c, "DonutChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/Home/PopulationClock.jsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$OdoMeter$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/OdoMeter.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$DonutChart$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/common/DonutChart.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const PopulationClock = ({ populationData })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    const [noData, setNoData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { locale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const populationUrl = locale === "ar" ? "/ar/populationClock" : "/populationClock";
    const populationList = (populationData || []).sort((a, b)=>new Date(b.date) - new Date(a.date));
    // const populationList = populationData || [];
    // console.log(populationList, "pop list----------")
    const getValidPopulation = (date)=>{
        const formatted = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
        return populationList.find((p)=>p.date.startsWith(formatted));
    };
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "PopulationClock.useState": ()=>{
            const latest = populationList?.[0]; // First item is latest after descending sort
            return latest ? new Date(latest.date) : new Date();
        }
    }["PopulationClock.useState"]);
    const [filteredPopulation, setFilteredPopulation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "PopulationClock.useState": ()=>getValidPopulation(selectedDate)
    }["PopulationClock.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PopulationClock.useEffect": ()=>{
            const found = getValidPopulation(selectedDate);
            if (found) {
                setFilteredPopulation(found);
                setNoData(false);
            } else {
                console.log("No data found for", selectedDate.toISOString());
                // setFilteredPopulation(null);
                setNoData(true);
            }
        }
    }["PopulationClock.useEffect"], [
        selectedDate
    ]);
    // useEffect(() => {
    //   console.log(filteredPopulation, "----🟢filtered population")
    //   const found = getValidPopulation(selectedDate);
    //   if (found) {
    //     setFilteredPopulation(found);
    //   } else {
    //     console.log("No data found for", selectedDate.toISOString());
    //   }
    // }, [selectedDate]);
    // if (!filteredPopulation) {
    //   return <div>{t("no_population_data")}</div>;
    // }
    const omanis = Number(filteredPopulation?.omanis);
    const expatriates = Number(filteredPopulation?.expatriates);
    const total = omanis + expatriates;
    const data = [
        {
            name: t("omanis"),
            y: Number((omanis / total * 100).toFixed(1)),
            color: "#0F3173",
            count: omanis.toLocaleString("en-US")
        },
        {
            name: t("expatriates"),
            y: Number((expatriates / total * 100).toFixed(1)),
            color: "#f67f21",
            count: expatriates.toLocaleString("en-US")
        }
    ];
    const weekdayName = selectedDate.toLocaleDateString("en-GB", {
        weekday: "short"
    });
    const dayNumber = selectedDate.getDate();
    const monthName = selectedDate.toLocaleDateString("en-GB", {
        month: "short"
    });
    const monthNumber = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const changeDate = (unit, amount)=>{
        // console.log('change date')
        const newDate = new Date(selectedDate);
        if (unit === "day") {
            newDate.setDate(newDate.getDate() + amount);
        } else if (unit === "month") {
            newDate.setMonth(newDate.getMonth() + amount);
        } else if (unit === "year") {
            newDate.setFullYear(newDate.getFullYear() + amount);
        }
        setSelectedDate(newDate);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "row population-clock-main-row",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "population-clock-header bg-theme color-white text-bold",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row align-items-center ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-2 ",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "customeIconHome-clock section-head-icon"
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-10 px-0",
                                style: {
                                    marginLeft: "-17px",
                                    marginRight: "-18px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: populationUrl,
                                    className: "clock-head text-decoration-none ",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        id: "hdPopulationClock",
                                        className: "section-head",
                                        children: t("population_clock")
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/PopulationClock.jsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Home/PopulationClock.jsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/Home/PopulationClock.jsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "population-clock-content bg-white",
                    style: {
                        height: "568px",
                        padding: "15px 0px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$OdoMeter$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            value: total.toLocaleString()
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PopulationClock.jsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "row text-center padding-15",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "hdTotalPopulation",
                                className: "col text-25 text-bold",
                                style: {
                                    zIndex: '2'
                                },
                                children: t("total_population")
                            }, void 0, false, {
                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PopulationClock.jsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$common$2f$DonutChart$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            data: data
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PopulationClock.jsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `deemed ${noData ? "visible" : ""}`,
                            children: t('no_data_found')
                        }, void 0, false, {
                            fileName: "[project]/components/Home/PopulationClock.jsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "PopulationBL",
                            id: "PopulationBL",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "Dpop",
                                    children: selectedDate.toLocaleDateString("en-GB")
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "DpopT",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "date-select",
                                        style: {
                                            width: "100%"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "popup flex justify-around",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 flex flex-col gap-1 day border-none",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("day", 1);
                                                            },
                                                            className: "btn-arrow btn-up",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-up"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 159,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 151,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text",
                                                                    children: t(weekdayName)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                    lineNumber: 162,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "num",
                                                                    children: dayNumber
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                    lineNumber: 163,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 161,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("day", -1);
                                                            },
                                                            className: "btn-arrow btn-down",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-down"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 173,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 165,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 flex flex-col gap-1 month",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("month", 1);
                                                            },
                                                            className: "btn-arrow btn-up",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-up"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 187,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 179,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text",
                                                                    children: t(monthName)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                    lineNumber: 190,
                                                                    columnNumber: 23
                                                                }, this),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "num",
                                                                    children: monthNumber
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                    lineNumber: 191,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 189,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("month", -1);
                                                            },
                                                            className: "btn-arrow btn-down",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-down"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 201,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 193,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                    lineNumber: 178,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 flex flex-col gap-1 year",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("year", 1);
                                                            },
                                                            className: "btn-arrow btn-up",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-up"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 215,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 207,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "num",
                                                            children: year
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 217,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "",
                                                            onClick: (e)=>{
                                                                e.preventDefault();
                                                                changeDate("year", -1);
                                                            },
                                                            className: "btn-arrow btn-down",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fas fa-caret-down"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Home/PopulationClock.jsx",
                                                                lineNumber: 226,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                                            lineNumber: 218,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                                    lineNumber: 206,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Home/PopulationClock.jsx",
                                            lineNumber: 148,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Home/PopulationClock.jsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Home/PopulationClock.jsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Home/PopulationClock.jsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Home/PopulationClock.jsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Home/PopulationClock.jsx",
            lineNumber: 106,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Home/PopulationClock.jsx",
        lineNumber: 105,
        columnNumber: 5
    }, this);
};
_s(PopulationClock, "IMTRlOE3CZam+ehSNfu7+j5Irqs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = PopulationClock;
const __TURBOPACK__default__export__ = PopulationClock;
var _c;
__turbopack_context__.k.register(_c, "PopulationClock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/utils/axiosInstance.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "https://ncsiapi.smsoman.com/")
});
// Automatically add the token to every request
api.interceptors.request.use((config)=>{
    // const token = process.env.NEXT_PUBLIC_API_TOKEN;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
}, (error)=>Promise.reject(error));
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/services/indexServices.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "getHomePageData": (()=>getHomePageData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$axiosInstance$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/axiosInstance.js [client] (ecmascript)");
;
const getHomePageData = async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$axiosInstance$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get('/V1/homepage');
    return response.data.data;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/index.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "__N_SSP": (()=>__N_SSP),
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
// import { Geist, Geist_Mono } from "next/font/google";
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$BannerSlider$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/BannerSlider.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$MenuList$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/MenuList.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$PublicationSlider$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/PublicationSlider.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$CalenderIndicator$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/CalenderIndicator.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$IndicatorSlider__$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/IndicatorSlider .jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$EventAccordion$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/EventAccordion.jsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$PopulationClock$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Home/PopulationClock.jsx [client] (ecmascript)");
// import { getEventList, getPopulationList, getSliderList, getIndicatorList, getPublicationList } from "@/services/indexServices";
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$indexServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/indexServices.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
var __N_SSP = true;
function Home({ populationData, sliderData, eventData, indicatorData, publicationData }) {
    _s();
    const [highlightDate, setHighlightDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [indicatorTitle, setIndicatorTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        en: '',
        ar: ''
    });
    const [nextReleaseDate, setNextReleaseDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [nextReleaseDateList, setNextReleaseDateList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [clickedReleaseDate, setClickedReleaseDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])("common");
    //  console.log(indicatorData)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                        children: "Home - NCSI PORTAL"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        id: "ctl00_ctl00_SEO_description",
                        name: "description",
                        content: t('meta_des_publications')
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        id: "ctl00_ctl00_SEO_keyWords",
                        name: "keywords",
                        content: "NCSI,NCSI Oman,Oman Statistics,Oman Indicators الإحصاء , المركز الوطنى للإحصاء والمعلومات , عمان, مؤشرات,Heba Elaraby,Adel Elaraby ,Omar Yusuf,Mahmoud AbdelSabour,Mahmoud Roushdy,Amr Eladly,Eachawy,Maab Ashraf,Yasmeen AbdelSattar,National,Centre,for,Statistics,and,Information,-,"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        type: "application/ld+json",
                        dangerouslySetInnerHTML: {
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Organization",
                                "name": "NCSI",
                                "alternateName": "NCSI",
                                "url": "http://13.233.166.184:3002/",
                                "logo": "http://13.233.166.184:3002/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=640&q=75",
                                "sameAs": [
                                    "https://www.facebook.com/OmanNCSI?ref=hl",
                                    "https://www.instagram.com/NCSIOman/",
                                    "https://twitter.com/NCSIOman"
                                ]
                            })
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "banner-row-main",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "row banner-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-sm-12 col-sm-12 col-md-12 col-lg-4 population-clock",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$PopulationClock$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                populationData: populationData
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-sm-12 col-sm-12 col-md-12 col-lg-8 home-banner-slider-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$BannerSlider$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    sliderData: sliderData
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$IndicatorSlider__$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    indicatorData: indicatorData,
                                    onIndicatorHover: (date, title_en, title_ar, nextReleaseDate)=>{
                                        setHighlightDate(date);
                                        setIndicatorTitle({
                                            en: title_en,
                                            ar: title_ar
                                        });
                                        setNextReleaseDate(nextReleaseDate);
                                    },
                                    onNextReleaseDatesReady: (dates)=>{
                                        setNextReleaseDateList(dates);
                                    },
                                    clickedReleaseDate: clickedReleaseDate
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 51,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                class: "row home-body",
                style: {
                    paddingTop: '0px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        class: "col-sm-12 col-md-6 col-lg-4 home-body-col wow fadeInUp",
                        "data-wow-delay": "0.2s",
                        "data-wow-duration": "0.5s",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$MenuList$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        class: "col-sm-12 col-md-6 col-lg-4 publisher-slide text-center wow fadeInUp",
                        "data-wow-delay": "0.2s",
                        "data-wow-duration": "0.5s",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$PublicationSlider$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            publicationData: publicationData
                        }, void 0, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        class: "col-sm-12 col-md-12 col-lg-4 home-event-calendar home-body-col wow fadeInUp",
                        "data-wow-delay": "0.2s",
                        "data-wow-duration": "0.5s",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-12",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$CalenderIndicator$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        indicatorData: indicatorData,
                                        highlightDate: highlightDate,
                                        indicatorTitle: indicatorTitle,
                                        nextReleaseDate: nextReleaseDate,
                                        nextReleaseDateList: nextReleaseDateList,
                                        onDateClick: (date)=>setClickedReleaseDate(date),
                                        setClickedReleaseDate: setClickedReleaseDate,
                                        setNextReleaseDate: setNextReleaseDate
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-12",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Home$2f$EventAccordion$2e$jsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        eventData: eventData
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Home, "IewMdyjZjEdZx3wjiB/OhgJCJ0U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/index.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/pages/index (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__1ed71023._.js.map