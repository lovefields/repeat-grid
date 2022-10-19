"use strict";
let canUse = false;
let active = false;
let preXNumber = 0;
let preYNumber = 0;
let rowGap = 0;
let columnGap = 0;
figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
figma.on("selectionchange", () => {
    const selection = figma.currentPage.selection;
    active = false;
    if (selection.length === 1) {
        const node = selection[0];
        if (node.type === "FRAME") {
            if (node.children.length == 1) {
                canUse = true;
                figma.showUI(__uiFiles__.main, { width: 300, height: 210 });
            }
            else {
                canUse = false;
                figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
            }
        }
        else {
            canUse = false;
            figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
        }
    }
    else {
        canUse = false;
        figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });
    }
});
function isFrameNode(argument) {
    return argument.type === "FRAME";
}
function creatAndSortLogic(xNumber, yNumber, curruntNode, childNode, childWidth, childHeight) {
    let count = xNumber * yNumber;
    let row = 0;
    let col = 0;
    let i = 0;
    let childData = [];
    for (let i = curruntNode.children.length; i < count; i += 1) {
        let clone = childNode.clone();
        curruntNode.insertChild(i, clone);
    }
    curruntNode.findChildren((child) => {
        col = i % xNumber;
        if (i !== 0 && col == 0) {
            row += 1;
        }
        let x = (columnGap + childWidth) * col + columnGap;
        let y = (rowGap + childHeight) * row + rowGap;
        child.x = x;
        child.y = y;
        childData.push({
            x: x,
            y: y,
        });
        if (i > count) {
            child.remove();
        }
        i += 1;
        return true;
    });
    curruntNode.setPluginData("childData", JSON.stringify(childData));
}
function reSortLogic() {
    const curruntNode = figma.currentPage.selection[0];
    if (isFrameNode(curruntNode)) {
        let pluginData = curruntNode.getPluginData("childData");
        if (pluginData !== "") {
            let data = JSON.parse(pluginData);
            let i = 0;
            curruntNode.findChildren((child) => {
                child.x = data[i].x;
                child.y = data[i].y;
                i += 1;
                return true;
            });
        }
    }
}
setInterval(() => {
    if (canUse && active) {
        const curruntNode = figma.currentPage.selection[0];
        if (isFrameNode(curruntNode)) {
            const childNode = curruntNode.children[0];
            let curruntNodeWidth = curruntNode.width;
            let curruntNodeHeight = curruntNode.height;
            let childWidth = childNode.width;
            let childHeight = childNode.height;
            let xNumber = Math.floor(curruntNodeWidth / (childWidth + columnGap));
            let yNumber = Math.floor(curruntNodeHeight / (childHeight + rowGap));
            if (xNumber !== preXNumber || yNumber !== preYNumber) {
                creatAndSortLogic(xNumber, yNumber, curruntNode, childNode, childWidth, childHeight);
                preXNumber = xNumber;
                preYNumber = yNumber;
            }
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
        case "reSort":
            reSortLogic();
            break;
    }
};
