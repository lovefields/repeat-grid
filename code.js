"use strict";

let canUse = false;
let active = false;

figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });

figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    active = false;

    if (selection.length == 1) {
        const node = selection[0];

        if (node.type == "FRAME") {
            if (node.children.length == 1) {
                canUse = true;
                figma.showUI(__uiFiles__.main, { width: 300, height: 110 });
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
        if (xNumber > 1 || yNumber > 1) {
            for (let i = 0; i < xNumber; i += 1) {
                for (let j = 0; j < yNumber; j += 1) {
                    if (!node.children[idx]) {
                        let clone = childNode.clone();
                        node.insertChild(idx, clone);
                    }

                    if (idx !== 0) {
                        node.children[idx].setPluginData("i", String(i));
                        node.children[idx].setPluginData("j", String(j));
                    }

                    idx += 1;
                }
            }
        }

        node.children.forEach((child, idx) => {
            if (idx > 0) {
                let i = parseInt(child.getPluginData("i"));
                let j = parseInt(child.getPluginData("j"));

                child.x = (childX + childWidth) * i + childX;
                child.y = (childY + childHeight) * j + childY;

                if (child.x + child.width > nodeWidth || child.y + child.height > nodeHeight) {
                    child.remove();
                }
            }
        });
    }
}, 500);

figma.ui.onmessage = (msg) => {
    if (msg.type === "active") {
        active = msg.active;
    }
};
