import * as hexa from '../modules/hex-lib.js';
export class jdcComplexeDatabase {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcComplexeDatabase';
        this.data = params.data ? params.data : false;
        this.pc = params.pc ? params.pc : false;
        this.pLibX = params.pLibX ? params.pLibX : 'lib';
        this.pValX = params.pValX ? params.pValX : 'value';
        this.pLibY = params.pLibY ? params.pLibY : 'lib';
        this.pValY = params.pValY ? params.pValY : 'value';
        this.cont = params.cont ? params.cont : d3.select('body');
        this.svg = params.svg ? params.svg : false;
        this.color = params.color ? params.color : d3.interpolateViridis;
        this.colors = {};
        this.legendes={};
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
        const height = params.height ? params.height : 600;

        let svg, dataMissing;

        this.init = function () {
            console.log(me.data);            
            setData();
            setGraph();
        }

        function setData(){
            dataMissing = [];
            me.data.sort((a, b) => a[me.pValX] - b[me.pValX]);
            me.data.forEach((d,i) => {
                if(i<10000){
                    /*
                    if(i>1){
                        //ajoute les données manquantes
                        let prevX = me.data[i-1][me.pValX], 
                            prevY = me.data[i-1][me.pValX],
                            step = d[me.pValX]-prevX;
                        for (let index = 0; index < step; index++) {
                            let md = [];
                            md[me.pValX]=prevX+index+1;
                            md[me.pValY]=prevY;
                            dataMissing.push(md);
                        }
                    }
                    */
                    if(d[me.pValX]>0)dataMissing.push(d);    
                }
            })
        }

        function setGraph(){
                                                          
            // Create the SVG container.
            svg = me.svg ? me.svg : me.cont.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("x", svgX)
                .attr("y", svgY)
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .style("font", "10px sans-serif");                
            // Declare the chart dimensions and margins.
            const marginTop = 20;
            const marginRight = 30;
            const marginBottom = 30;
            const marginLeft = 40;
                  
            // Declare the x (horizontal position) scale.
            //const x = d3.scaleUtc(d3.extent(me.data, d => d[me.pValX]), [marginLeft, width - marginRight]);
            //const x =d3.scaleLinear(d3.extent(dataMissing, d => d[me.pValX]), [marginLeft, width - marginRight]);
            const x = d3.scaleLog([1, d3.max(dataMissing, d => d[me.pValX])], [marginLeft, width - marginRight]).base(2);
            // Declare the y (vertical position) scale.
            //const y = d3.scaleLinear([0, d3.max(dataMissing, d => d[me.pValY])], [height - marginBottom, marginTop]);
            const y = d3.scaleLog([1, d3.max(dataMissing, d => d[me.pValY])], [height - marginBottom, marginTop]).base(2);
            const symboleSize = 3, strokeOpacity = 0.3;   

            //ajoute la définition des lignes
            let def = svg.append('defs'),
            markerStyle="stroke-width:0pt;";
            def.append('marker')
                .attr('id', 'SquareS')
                .attr('viewBox', [0, 0, 20, 20])
                .attr('refX', 10)
                .attr('refY', 10)
                .attr('markerWidth', 2)
                .attr('markerHeight', 2)
                .append('rect')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('style',markerStyle);
            def.append('marker')
                .attr('id', 'DotS')
                .attr('viewBox', [0, 0, 20, 20])
                .attr('refX', 10)
                .attr('refY', 10)
                .attr('markerWidth', 2)
                .attr('markerHeight', 2)
                .append('circle')
                .attr('cx', 10)
                .attr('cy', 10)
                .attr('r', 10);
            def.append('marker')
                .attr('id', 'ArrowSend')
                .attr('viewBox', [0, 0, 20, 20])
                .attr('refX', 10)
                .attr('refY', 10)
                .attr('markerWidth', 3)
                .attr('markerHeight', 3)
                .attr('orient', 'auto-start-reverse')
                .append('path')
                .attr('d', d3.line()( [[0, 0], [0, 20], [20, 10]]))
                .attr('style',markerStyle);

            //ajoute la complexité des physiques
            svg.append("g")
                .attr("class", "cpxPhysique")
                .attr("stroke", "white")
                .attr("stroke-opacity", strokeOpacity)
                .attr("opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Physique"))
              .join("rect")
                .attr("x", d => x(d[me.pValX])-symboleSize)
                .attr("y", d => y(d[me.pValY])-symboleSize)
                .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]))
                .attr("width", symboleSize*3)                
                .attr("height", symboleSize*3);                

            //ajoute la complexité des actants
            let r = symboleSize*2, 
            pointsExa = new hexa.Layout(hexa.Layout.flat,new hexa.Point(r, r), new hexa.Point(0, 0))
                .polygonCorners(new hexa.Hex(0,0,0))
                .map(p=>`${p.x},${p.y}`).join(" ");
            svg.append("g")
                    .attr("class", "cpxActant")
                    .attr("stroke", "white")
                    .attr("stroke-opacity", strokeOpacity)
                    .attr("opacity", 0.4)
                .selectAll()
                .data(dataMissing.filter(d=>d.dim=="Actant"))
                .join('polygon')
                    .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`)
                    .attr('points',pointsExa)
                    .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]));

            //ajoute la complexité des concepts
            svg.append("g")
                .attr("class", "cpxConcept")
                .attr("stroke", "white")
                .attr("stroke-opacity", strokeOpacity)
                .attr("opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Concept"))
              .join("circle")
                .attr("cx", d => x(d[me.pValX]))
                .attr("cy", d => y(d[me.pValY]))
                .attr("fill", d => {
                    let c = me.pc.colors[d.dim];
                    return c(d[me.pValX]);
                })
                .attr("r", symboleSize*2.5);                

            //ajoute la complexité des rapports
            let pointsLine = [[0,-symboleSize*4],[0,0],[0,symboleSize*2]],
            cpxRapports = svg.append("g")
                .attr("class", "cpxRapport")
                .style("stroke-width", symboleSize)
                .style("fill", "none")
                .attr("stroke-opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Rapport"))
              .join("g")
              .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`)
                ;
            cpxRapports.append("path")
                .attr("d",d3.line()(pointsLine))
                .attr("stroke", d => me.pc.colors[d.dim](d[me.pValX]));
            for (let i = 0; i < pointsLine.length; i++) {
                cpxRapports.append("circle")
                    .attr("cx", pointsLine[i][0])
                    .attr("cy", pointsLine[i][1])
                    .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]))
                    .attr("r", 1);                
            }                
            //ajoute la complexité des existances
            let gExis = svg.append("g")
                .attr("class", "cpxExistence")
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Existence"))
              .join("g")
                .attr("opacity", 0.4)
                .attr("stroke", "white")
                .attr("stroke-opacity", strokeOpacity)
                .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`)
            gExis.append("rect")
                .attr("x", -symboleSize*1.5)
                .attr("y", -symboleSize*4)
                .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]))
                .attr("width", symboleSize*3)                
                .attr("height", symboleSize*3);  
            gExis.append("circle")
                .attr("cx", 0)
                .attr("cy", symboleSize*2)
                .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]))
                .attr("r", symboleSize*2.5);
            gExis.append('polygon')
                .attr('points',pointsExa)
                .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]));                              
            gExis.append("path")
                .attr("transform",d=> `translate(0,${symboleSize})`)
                .attr("d",d3.line()(pointsLine))
                .style("fill", "none")
                .attr("stroke-opacity", 0.4);                 
            for (let i = 0; i < pointsLine.length; i++) {
                gExis.append("circle")
                    .attr("cx", pointsLine[i][0])
                    .attr("cy", pointsLine[i][1]+symboleSize)
                    .attr("fill", d => me.pc.colors[d.dim](d[me.pValX]))
                    .attr("r", 1);                
            }                
    
            // Add the x-axis.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0))
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", marginBottom)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(me.pLibX));
                
            // Add the y-axis, remove the domain line, add grid lines and a label.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 40))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", 10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(me.pLibY));
                  
            //création des légendes de couleurs
            //
            cacheDim("Physique");
            cacheDim("Actant");
            cacheDim("Concept");
            cacheDim("Rapport");
            //
        }
        
        function cacheDim(dim){
            d3.select('.cpx'+dim).attr('visibility','hidden');
        }

        this.init();    
    }
}