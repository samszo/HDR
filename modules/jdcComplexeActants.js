import * as hexa from '../modules/hex-lib.js';

export class jdcComplexeActants {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcCxAct';
        this.data = params.data ? params.data : false;
        this.idRoot = params.idRoot ? params.idRoot : false;
        this.cont = params.cont ? params.cont : d3.select('body');
        this.aUrl = params.aUrl ? params.aUrl : false;
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
        const height = params.height ? params.height : 600;
        const margeHexa = 100;

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

            let root = d3.pack()
                .size([width, height])
                .padding(3)
                (me.data.root);
                                                          
            // Create the SVG container.
            svg = me.cont.append("svg")
                .attr("viewBox", [0, 0, (width+margeHexa*2), (height+margeHexa)])
                .attr("x", svgX)
                .attr("y", svgY)
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .style("font", "10px sans-serif");                

            //simple circle packing
            let g = svg.append('g').attr('id',me.id).attr('class','jdcConceptG');

            g.style("font", "10px sans-serif")
                .attr("text-anchor", "middle")
                .attr("transform", `translate(${margeHexa},${0})`);
                ;              
        
            const node = g
                .selectAll('g.jdcConcept')
                .data(root)
                .enter()
                .append("g")
                .attr('class','jdcConcept')
                .attr('id',d=>'jdcDim_'+me.id+'_'+d.n)
                .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
                ;//.on('click',clickDim);
            
            /*
            node.append("circle")
                .attr("r", d => d.r)
                .attr("id", d => 'conceptC_'+me.id+'_'+d.data.n)    
                .attr("fill-opacity", 0.8)
                .attr("stroke", "white")
                .attr("fill", d => {
                    d.color = color(d.data.n);
                    return d.color;
                });
            */
            node.append('polygon').attr('points',d=>{
                let r = d.depth==0 ? d.r+margeHexa : d.r, layout = new hexa.Layout(hexa.Layout.flat
                    , new hexa.Point(r, r)
                    , new hexa.Point(0, 0));
                return layout
                    .polygonCorners(new hexa.Hex(0,0,0))
                    .map(p=>`${p.x},${p.y}`)
                    .join(" ");        
            }).attr('fill',d=>color(d.data.n)).attr('stroke','white')                

                        
            node.append("clipPath")
                .attr("id", d => d.clipUid = "clip"+me.id+'_'+d.data.n)
                .append("use")
                .attr("xlink:href", d => '#conceptC_'+me.id+'_'+d.data.n);
                            
            node.append("text")
                .attr("clip-path", d => d.clipUid)
                .attr("transform", d => d.children ? `translate(0,${d.r-10})` : '')
                .selectAll("tspan")
                .data(d => ['niveau : '+d.data.n,'nombre :'+d.data.nb,'complexité :'+d.data.c])
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