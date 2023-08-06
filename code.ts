let active: boolean = false;
let preCount: number = 0;
let rowGap: number = 0;
let columnGap: number = 0;
let limit: number = 0;
let $target: FrameNode;

figma.showUI(__uiFiles__.notice, { width: 462, height: 160 });

figma.on("selectionchange", () => {
    const selection: Readonly<SceneNode[]> = figma.currentPage.selection;

    if (selection.length === 1) {
        const node = selection[0];

        if (node.type === "FRAME") {
            if (node.children.length == 1) {
                $target = node;
                active = true;
            } else {
                active = false;
            }
        } else {
            active = false;
        }
    } else {
        active = false;
    }

    if (active === true) {
        figma.showUI(__uiFiles__.main, { width: 420, height: 420 });
    } else {
        figma.showUI(__uiFiles__.notice, { width: 462, height: 160 });
    }
});

figma.on("documentchange", () => {
    if (active === true) {
        const child = $target.children[0];



        console.log($target.inferredAutoLayout);
        // console.log("work?");
        // console.log($target);
        // console.log(child);
        // console.log(rowGap);
        // console.log(columnGap);
        // console.log(limit);
    }
});

figma.ui.onmessage = (msg) => {
    if (msg.type === "apply") {
        rowGap = msg.data.row;
        columnGap = msg.data.col;
        limit = msg.data.limit;
    }
};

// 자식 요소 복제
function sortChildObject() {}
