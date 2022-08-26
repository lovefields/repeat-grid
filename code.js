"use strict";

let canUse = false;
let active = false;
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });

figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    active = false;

    if (selection.length == 1) {
        const node = selection[0];

        if (node.type == "FRAME") {
            if (node.children.length == 1) {
                canUse = true;
                figma.showUI(__uiFiles__.main, { width: 300, height: 50 });
            } else {
                canUse = false;
                figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
            }
        } else {
            canUse = false;
            figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
        }
    } else {
        canUse = false;
        figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
    }
});

setInterval(() => {
    if (canUse && active) {
        const node = figma.currentPage.selection[0];
        let childNode = node.children[0];
        let nodeWidth = node.width;
        let nodeHeight = node.height;
        let childWidth = node.children[0].width;
        let childHeight = node.children[0].height;
        let childX = node.children[0].x;
        let childY = node.children[0].y;
        let xNumber = Math.floor(nodeWidth / (childWidth + childX));
        let yNumber = Math.floor(nodeHeight / (childHeight + childY));

        let idx = 0;
        if (xNumber > 1 && yNumber > 1) {
            for (let i = 0; i < xNumber; i += 1) {
                for (let j = 0; j < yNumber; j += 1) {
                    if (i !== 0 || j !== 0) {
                        idx += 1;

                        if (!node.children[idx]) {
                            let clone = childNode.clone();
                            node.insertChild(idx, clone);
                        }

                        node.children[idx].x = (childX + childWidth) * i + childX;
                        node.children[idx].y = (childY + childHeight) * j + childY;
                    }
                }
            }
        }

        node.findChildren((child) => {
            if (child.x + child.width > nodeWidth || child.y + child.height > nodeHeight) {
                child.remove();
            }
        });
    }
}, 500);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "active") {
        active = msg.active;
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
