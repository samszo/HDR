export class jdcComplexeConcepts {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcCxCpt';
        this.data = params.data ? params.data : false;
        this.cont = params.cont ? params.cont : d3.select('body');
        this.svg = params.svg ? params.svg : false;
        this.nivMin = params.nivMin ? params.nivMin : false;
        this.nivMax = params.nivMax ? params.nivMax : false;
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
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
                .domain([
                    me.nivMin ? me.nivMin : 0,
                    me.nivMax ? me.nivMax : me.data.totals.nivMax])
                .interpolator(d3['interpolatePlasma']);

            let root = d3.pack()
                .size([width, height])
                .padding(3)
                (me.data.root);
                                                          
            // Create the SVG container.
            svg = me.svg ? me.svg : me.cont.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("x", svgX)
                .attr("y", svgY)
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .style("font", "10px sans-serif");                

            //simple circle packing
            let g = svg.append('g').attr('id',me.id).attr('class','jdcConceptG');
            if(me.svg)g.attr("transform", `translate(${svgX},${svgY})`);

            g.style("font", "10px sans-serif")
                .attr("text-anchor", "middle");              
        
            const node = g
                .selectAll('g.jdcConcept')
                .data(root)
                .enter()
                .append("g")
                .attr('class','jdcConcept')
                .attr("id", d => "g_"+me.id+d.data.n)
                .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
                ;//.on('click',clickDim);
                            
                        
            node.append("circle")
                .attr("r", (d,i) => i==0 ? d.r+32 : d.r)
                .attr("id", d => 'conceptC_'+me.id+'_'+d.data.n)    
                .attr("fill-opacity", 0.8)
                .attr("stroke", "white")
                .attr("fill", d => {
                    d.color = color(d.data.n);
                    return d.color;
                });
                        
            node.append("clipPath")
                .attr("id", d => d.clipUid = "clip"+me.id+'_'+d.data.n)
                .append("use")
                .attr("xlink:href", d => '#conceptC_'+me.id+'_'+d.data.n);
                            
            node.append("text")
                .attr("clip-path", d => d.clipUid)
                .attr("transform", d => d.children ? `translate(0,${d.r+10})` : '')
                .selectAll("tspan")
                .data((d,i) => i==0 ? ['n : '+d.data.n+', nb :'+d.data.nb+', c :'+d.data.c] : ['n : '+d.data.n,'nb :'+d.data.nb,'c :'+d.data.c])
                .join("tspan")
                .attr("fill", 'white')
                .attr("stroke", 'none')
                .attr("fill-opacity", 1)
                .attr("x", 0)
                .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
                .text(d => d);
        
            node.append("title")
                .text(d => ` niveau : ${d.data.n}\n nombre : ${d.data.nb}\n complexité : ${d.data.c}\n`);
            
        
        }        

        function openDetail(e,d){
            let url = d.data["@id"].replace('api/items','admin/item');
            window.open(url, "_blank");
        }
        
        this.init();    
    }
}