let canUse: Boolean = false;
let active: Boolean = false;
let preXNumber = 0;
let preYNumber = 0;
let rowGap = 0;
let columnGap = 0;

figma.showUI(__uiFiles__.notice, { width: 300, height: 260 });

figma.on("selectionchange", () => {
    const selection: Readonly<SceneNode[]> = figma.currentPage.selection;

    active = false;

    if (selection.length === 1) {
        const node = selection[0];

        if (node.type === "FRAME") {
            if (node.children.length == 1) {
                canUse = true;
                figma.showUI(__uiFiles__.main, { width: 300, height: 170 });
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

function isFrameNode(argument: any): argument is FrameNode {
    return argument.type === "FRAME";
}

function creatAndSortLogic() {
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
            let count = xNumber * yNumber;
            let row = 0;
            let col = 0;

            for (let i = curruntNode.children.length; i < count; i += 1) {
                let clone = childNode.clone();
                curruntNode.insertChild(i, clone);
            }

            curruntNode.children.forEach((child, i) => {
                col = i % xNumber;

                if (i !== 0 && col == 0) {
                    row += 1;
                }

                child.x = (columnGap + childWidth) * col + columnGap;
                child.y = (rowGap + childHeight) * row + rowGap;

                if (i > count) {
                    child.remove();
                }
            });

            preXNumber = xNumber;
            preYNumber = yNumber;
        }
    }
}

setInterval(() => {
    if (canUse && active) {
        creatAndSortLogic();
    }
}, 250);

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
            creatAndSortLogic();
            break;
    }
};
