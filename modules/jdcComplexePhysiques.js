//many thanks to https://observablehq.com/@d3/treemap/2
export class jdcComplexePhysiques {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcCxPh';
        this.data = params.data ? params.data : false;
        this.idRoot = params.idRoot ? params.idRoot : false;
        this.cont = params.cont ? params.cont : d3.select('body');
        this.aUrl = params.aUrl ? params.aUrl : false;
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 1024;
        const height = params.height ? params.height : 600;

        let root, svg, group;

        this.init = function () {

            console.log(me.data);            
            setData();
            setGraph();
        }

        function setData(){
          let dt = [{'n':0,'c':me.data.totals.c, 'nb':me.data.totals.nb}].concat(me.data.details);
          me.data.root = d3.stratify()
          .id(d=>d.n)
          .parentId(d=>d.n == 0 ? "" : 0)
          (dt)
          .sum(d => d.c)
          .sort((a, b) => a.n - b.n);
          console.log(me.data.root);
        }

        function setGraph(){

            // Specify the color scale.
            const color = d3.scaleSequential()
                .domain([0,me.data.totals.nivMax])
                .interpolator(d3['interpolatePlasma']);

            // Compute the layout.
            const root = d3.treemap()
                .tile(d3.treemapSquarify)
                .size([width, height])
                .padding(1)
                .round(true)
            (me.data.root);
        
            // Create the SVG container.
            svg = me.cont.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .style("font", "10px sans-serif");
      
            // Add a cell for each leaf of the hierarchy.
            const leaf = svg.selectAll("g")
                .data(root)
                .join("g")
                .attr("transform", d => `translate(${(width-d.x1)},${d.y0})`);

            // Append a tooltip.
            const format = d3.format(",d");
            leaf.append("title")
                .text(d => ` niveau : ${d.data.n}\n nombre : ${d.data.nb}\n complexité : ${d.data.c}\n`);

            // Append a color rectangle. 
            leaf.append("rect")
                .attr("id", d => (d.leafUid = "Rect"+me.id+d.data.n))
                .attr("fill", d => color(d.data.n))
                .attr("fill-opacity", 0.8)
                .attr("stroke", "white")
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0);

            // Append a clipPath to ensure text does not overflow.
            leaf.append("clipPath")
                .attr("id", d => (d.clipUid = "Clip"+me.id+d.data.n))
                .append("use")
                .attr("xlink:href", d => '#'+d.leafUid);

            // Append multiline text. The last line shows the value and has a specific formatting.
            leaf.append("text")
                .attr("clip-path", d => d.clipUid)
                .selectAll("tspan")
                .data(d => ['niveau : '+d.data.n,'nombre :'+d.data.nb,'complexité :'+d.data.c])
                .join("tspan")
                .attr("x", 3)
                .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                .attr("fill", 'white')
                .attr("stroke", 'none')
                .attr("fill-opacity", 1)
                .text(d => d);

                 
        }

        this.init();    
    }
}