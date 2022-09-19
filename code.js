"use strict";

let canUse = false;
let active = false;
let preWidth = 0;
let preheight = 0;
let rowGap = 20;
let columnGap = 20;
let logicCount = 0;

figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });

figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    active = false;

    if (selection.length == 1) {
        const node = selection[0];

        if (node.type == "FRAME") {
            if (node.children.length == 1) {
                canUse = true;
                figma.showUI(__uiFiles__.main, { width: 300, height: 140 });
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
        let xNumber = Math.floor(nodeWidth / (childWidth + columnGap));
        let yNumber = Math.floor(nodeHeight / (childHeight + rowGap));

        if (nodeWidth !== preWidth || nodeHeight !== preheight) {
            logicCount = 0;
        }

        if (logicCount < 3) {
            let idx = 0;
            logicCount += 1;

            for (let i = 0; i < xNumber; i += 1) {
                for (let j = 0; j < yNumber; j += 1) {
                    if (!node.children[idx]) {
                        let clone = childNode.clone();
                        node.insertChild(idx, clone);
                    }

                    node.children[idx].setPluginData("i", String(i));
                    node.children[idx].setPluginData("j", String(j));

                    idx += 1;
                }
            }

            node.children.forEach((child, k) => {
                let i = parseInt(child.getPluginData("i"));
                let j = parseInt(child.getPluginData("j"));

                child.x = (columnGap + childWidth) * i + columnGap;
                child.y = (rowGap + childHeight) * j + rowGap;

                if (child.x + child.width > nodeWidth || child.y + child.height > nodeHeight || k > idx - 1) {
                    if (k > 0) {
                        child.remove();
                    }
                }
            });

            preWidth = nodeWidth;
            preheight = nodeHeight;
        }
    }
}, 500);

figma.ui.onmessage = (msg) => {
    switch (msg.type) {
        case "active":
            active = msg.active;
            break;
        case "setRowGap":
            rowGap = msg.rowGap;
            break;
        case "setColumnGap":
            columnGap = msg.columnGap;
            break;
    }
};
