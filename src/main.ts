import './style.css';
import { createPatch } from 'diff';
import { parse, html } from 'diff2html';

const diffShadowHost = document.getElementById("diff-shadow-host")!;
const identicalMessageBanner = document.getElementById("identical-message")!;

const compareForm = document.getElementById("compare-form")!;
const leftInput = document.getElementById("left-input") as HTMLTextAreaElement;
const rightInput = document.getElementById("right-input") as HTMLTextAreaElement;

compareForm.addEventListener("submit", e => {
    e.preventDefault();

    const leftText = leftInput.value;
    const rightText = rightInput.value;

    const diff = createPatch("file_name", leftText, rightText);
    const diffJson = parse(diff)[0];
    if (diffJson.addedLines === 0 && diffJson.deletedLines === 0) {
        // Identical content.
        if (diffShadowHost.shadowRoot) {
            diffShadowHost.shadowRoot.innerHTML = "";
        }
        identicalMessageBanner.classList.toggle("hidden", false);
    } else {
        const shadowDom = diffShadowHost.shadowRoot ?? diffShadowHost.attachShadow({ mode: "open" });
        const css = '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />';
        const diffHtml = html([diffJson], { outputFormat: "side-by-side", diffStyle: "char" });
        shadowDom.innerHTML = `<head>${css}</head>${diffHtml}`;

        identicalMessageBanner.classList.toggle("hidden", true);
    }
});
