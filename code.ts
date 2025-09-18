let active: boolean = false;
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
        const child = $target.children[0];
        const data = {
            row: 0,
            col: 0,
        };

        if ($target.layoutMode === "NONE") {
            data.col = child.x;
            data.row = child.y;
        } else {
            data.col = $target.itemSpacing;
            data.row = $target.counterAxisSpacing ?? 0;
        }

        figma.showUI(__uiFiles__.main, { width: 420, height: 354 });
        figma.ui.postMessage(data);
    } else {
        figma.showUI(__uiFiles__.notice, { width: 462, height: 160 });
    }
});

figma.currentPage.on("nodechange", () => {
    sortChildObject();
});

figma.ui.onmessage = (msg) => {
    if (msg.type === "apply") {
        rowGap = msg.data.row;
        columnGap = msg.data.col;
        limit = msg.data.limit;
        sortChildObject();
    }
};

// 자식 요소 복제
function sortChildObject() {
    if (active === true) {
        const child = $target.children[0];
        const width = $target.width;
        const height = $target.height;
        const childWidth = child.width;
        const childHeight = child.height;

        if ($target.layoutMode === "NONE") {
            $target.paddingLeft = child.x;
            $target.paddingRight = child.x;
            $target.paddingTop = child.y;
            $target.paddingBottom = child.y;
        }

        $target.layoutMode = "HORIZONTAL";
        $target.layoutWrap = "WRAP";
        $target.itemSpacing = columnGap;
        $target.counterAxisSpacing = rowGap;

        const x = Math.floor((width - $target.paddingLeft * 2 + columnGap) / (childWidth + columnGap));
        const y = Math.floor((height - $target.paddingTop * 2 + rowGap) / (childHeight + rowGap));

        // 이전 값과 다를경우
        for (let i = 0; i < x * y; i += 1) {
            if (limit !== 0 && limit < i) {
                break;
            }

            if ($target.children[i] === undefined) {
                const copyObject = child.clone();

                $target.appendChild(copyObject);
            }
        }

        $target.children.forEach((item, i) => {
            if (i !== 0) {
                if (i >= x * y) {
                    item.remove();
                }

                if (limit !== 0 && limit < i) {
                    item.remove();
                }
            }
        });
    }
}
