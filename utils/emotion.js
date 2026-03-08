import JX3_EMOTION from "@jx3box/jx3box-emotion";
function escapeHtml(str) {
    return str.replace(/[<>"']/g, function (match) {
        switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case '"':
                return "&quot;";
            case "'":
                return "&#39;";
        }
    });
}
async function formatContent(val) {
    const ins = new JX3_EMOTION(escapeHtml(val));
    return await ins._renderHTML();
}

export { formatContent };
