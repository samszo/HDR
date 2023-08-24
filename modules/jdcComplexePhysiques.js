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
          me.data.rootPhysique = d3.stratify()
          .id(d=>d.n)
          .parentId(d=>d.n == 0 ? "" : 0)
          (dt)
          .sum(d => d.c)
          .sort((a, b) => a.n - b.n);
          console.log(me.data.rootPhysique);
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
            (me.data.rootPhysique);
        
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


        function render(group, root) {
            const node = group
              .selectAll(".gBlock")
              .data(root.children.concat(root))
              .join("g");
            node.attr('class',"gBlock");
            node.filter(d => d === root ? d.parent : d.children)
                .attr("cursor", d => d === root ? "zoom-out" : "zoom-in")
                .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));
        
            node.append("title")
                .text(d => `${name(d)}\n${format(d.value)}`);
        
            node.append("rect")
                .attr("id", d => (d.leafUid = "physiqueRect"+me.id+d.data['o:id']))
                .attr("fill", d => d === root ? "#fff" : d.children ? "#ccc" : "#ddd")
                .attr("stroke", "#fff");
        
            node.append("clipPath")
                .attr("id", d => (d.clipUid = "physiqueClip"+me.id+d.data['o:id']))
                .append("use")
                .attr("xlink:href", d => '#'+d.leafUid);
        
            node.append("text")
                .attr("clip-path", d => d.clipUid)
                .attr("font-weight", d => d === root ? "bold" : null)
              .selectAll("tspan")
              //.data(d => (d === root ? name(d) : d.data['o:title']).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
              .data(d => {
                let dt = (d === root ? name(d) : d.data['o:title']).split('*').concat(d.data.duree == 1 ? getDuree(0,d.value).result : d.data.duree.result);
                return dt;
              })
              .join("tspan")
                .attr("x", 20)
                //.attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                .attr("y", (d, i, nodes) => `${0.3 + 1.1 + i}em`)
                .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
                .text(d => d);        
            //ajoute un lien vers le détail de l'item
            let detail = node.append('g').attr('transform','translate(10,10)')
              .attr("cursor", "pointer")
              .on('click',openDetail);
            detail.append('circle').attr('r',6).attr('stroke','red').attr('fill','white');
            detail.append('text').attr('x',-1).attr('y',3).text('i');
            
            
            group.call(position, root);
          }
        
          function openDetail(e,d){
            let url = d.data["@id"].replace('api/items','admin/item');
            window.open(url, "_blank");
          }
          function position(group, root) {
            group.selectAll(".gBlock")
                .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
              .select("rect")
                .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
                .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
          }
        
          // When zooming in, draw the new nodes on top, and fade them in.
          function zoomin(d) {
            if(me.aUrl)me.aUrl.change('event',d.data['o:id']);
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.append("g").attr('class',"gBlock").call(render, d);
        
            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);
        
            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                  .call(position, d.parent))
                .call(t => group1.transition(t)
                  .attrTween("opacity", () => d3.interpolate(0, 1))
                  .call(position, d));
          }
        
          // When zooming out, draw the old nodes on top, and fade them out.
          function zoomout(d) {
            if(me.aUrl)me.aUrl.change('event',d.data['o:id']);
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.insert("g", "*").attr('class',"gBlock").call(render, d.parent);
        
            x.domain([d.parent.x0, d.parent.x1]);
            y.domain([d.parent.y0, d.parent.y1]);
        
            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                  .attrTween("opacity", () => d3.interpolate(1, 0))
                  .call(position, d))
                .call(t => group1.transition(t)
                  .call(position, d.parent));
          }
        
        this.init();    
    }
}