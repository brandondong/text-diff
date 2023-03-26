import './style.css';
import diffStyles from './diff2html.min.css?inline';
import diffCustomStyles from './diff2html-custom.css?inline';

import { createPatch } from 'diff';
import { parse, html } from 'diff2html';

const diffShadowHost = document.getElementById("diff-shadow-host")!;

const compareForm = document.getElementById("compare-form")!;
const leftInput = document.getElementById("left-input") as HTMLTextAreaElement;
const rightInput = document.getElementById("right-input") as HTMLTextAreaElement;

compareForm.addEventListener("submit", e => {
    e.preventDefault();

    const leftText = leftInput.value;
    const rightText = rightInput.value;

    const diff = createPatch("file_name", leftText, rightText);
    const [diffJson] = parse(diff);
    let shadowDom = initializeShadowDom(diffShadowHost, [diffStyles, diffCustomStyles]);
    const diffHtml = html([diffJson], { outputFormat: "side-by-side", diffStyle: "char" });
    shadowDom.innerHTML = diffHtml;
});

function initializeShadowDom(host: HTMLElement, styles: string[]) {
    if (host.shadowRoot) {
        return host.shadowRoot;
    }
    const shadowDom = host.attachShadow({ mode: "open" });
    const sheets = styles.map(style => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(style);
        return sheet;
    })
    shadowDom.adoptedStyleSheets = sheets;
    return shadowDom;
}
