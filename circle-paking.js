const labels = {
    'survey': 'Survey',
    'q9_yes': 'Heard About Artificial Meat',
    'q9_no': 'Haven\'t heard about Artificial Meat',
    'q10_advertisement': 'Heard From Advertisement',
    'q10_school': 'Heard From School',
    'q10_social media': 'Heard From Social Media',
    'q10_family and friends': 'Heard From Family and Friends',
    'q10_tv': 'Heard From TV',
    'q10_radio': 'Heard From Radio',
    'q10_work': 'Heard From Work',
    'q10_flyers': 'Heard From Flyers',
    'q10_other': 'Heard From Other Source',
    'q12_yes': 'Have Tried Artificial Meat',
    'q12_no': 'Haven\'t tried Artificial Meat',
    'q16_yes':'Want to try again',
    'q16_no':'Not Again',
    'q16_no say':'NA',
    'q16_maybe':'Maybe try again',
};

function grouper(data, pkey) {
    let obj = [];
    const nest = d3.nest()
        .key(d => d[pkey])
        .rollup( v => {
            return {
                count: v.lenth,
                children: v
            }
        })
        .entries(data);
    nest.forEach( n => {
        obj.push({
            name: `${pkey.toLowerCase()}_${n.key.toLowerCase()}`,
            children: n.value.children,
            count: n.value.count
        });
    })
    return obj;
}

function initD3(data) {
    let root = grouper(data, 'Q9');
    root.forEach( n => {
        n.children = grouper(n.children, 'Q10')
        n.children.forEach( m => {
            m.children = grouper(m.children, 'Q12');
            m.children.forEach(p => {
                p.children = grouper(p.children, 'Q16')
                p.children.forEach( q => {
                    q.value = q.children.length;
                    delete q.children;
                })
            })
        })
    });
    createTreeMap(root);
    return d3render(root)
}


let width, height;
width = height = 500;

color = d3.scaleLinear()
        .domain([0, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl)

const nocolor = d3.scaleSequential([8, 0], d3.interpolateMagma);

const pack = data => d3.pack()
    .size([width, height])
    .padding(3)
(d3.hierarchy(data)
        .sum(d => {
            // console.log(d.value)
            return d.value;
        })
        .sort((a,b) => b.value - a.value))   

function d3render (data) {     
    // Read data
    data = {name: 'survey', children: data};
    const root = pack(data);
    let focus = root;
    let view;
    // console.log(root);
    // console.log(root.descendants().slice(1));
    const svg = d3.select('#circle_packing').append('svg')
                .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
                .style("display", "block")
                .style("margin", "0 -14px")
                .style("background", "rgb(221, 236, 236)")
                // .style("background", color(0))
                .style("cursor", "pointer")
                .on("click", () => zoom(root));
    
    const node = svg.append("g")
                .selectAll("circle")
                .data(root.descendants().slice(1))
                .join("circle")
                .attr("fill", d => {
                    const ancestors = d.ancestors();
                    const q9 = ancestors.find(n => n.data.name === 'q9_yes');
                    const ncolor = q9 ? color : nocolor;
                    return d.children ? ncolor(d.depth) : "white";
                })
                .attr("pointer-events", d => !d.children ? "none" : null)
                .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
                .on("mouseout", function() { d3.select(this).attr("stroke", null); })
                .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));

    const label = svg.append("g")
        .style("font", "5px sans-serif")
        .style("font-weight", "900")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => labels[d.data.name] + ` // Count ${d.value}`);
    // console.log(root)
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v) {
        const k = width / v[2];

        view = v;

        label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", d => d.r * k);
    }

    function zoom(d) {
        const focus0 = focus;

        focus = d;

        const transition = svg.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
            });

        label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
            .style("fill-opacity", d => d.parent === focus ? 1 : 0)
            .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
    return node;
    // return svg.node();
    // d3.select('body').join(svg);
    // document.body.append(svg)
}