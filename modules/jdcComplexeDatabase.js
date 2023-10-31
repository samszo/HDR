import * as hexa from '../modules/hex-lib.js';
export class jdcComplexeDatabase {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcComplexeDatabase';
        this.data = params.data ? params.data : false;
        this.tots = params.tots ? params.tots : {"cpx":"unknow"};
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
        this.urlDetails = params.urlDetails ? params.urlDetails : '../omk/s/cartoaffect/page/ajax?json=1&helper=JDCsql&action=complexityDetails';
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
        const height = params.height ? params.height : 600;
        const marginTop = 140;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 60;
                  
        let x, y, symboleSize = 3, strokeOpacity = 0.3, numberFormat = d3.format("~s")
            , pointsLine = [[0,-symboleSize*4],[0,-symboleSize],[0,symboleSize*2]]
            , pointsExa = new hexa.Layout(hexa.Layout.flat,new hexa.Point(symboleSize*2, symboleSize*2), new hexa.Point(0, 0))
                .polygonCorners(new hexa.Hex(0,0,0))
                .map(p=>`${p.x},${p.y}`).join(" ")
            , svg, dataMissing
            , dims = [{'id':"Existence",'select':true}, 
                    {'id':"Physique",'select':false}, 
                    {'id':"Actant",'select':false}, 
                    {'id':"Concept",'select':false}, 
                    {'id':"Rapport",'select':false}]
            , rscT = [];

        this.init = function () {
            console.log(me.data);            
            setData();
            setGraph();
        }

        function setData(){
            dataMissing = [];
            me.data.sort((a, b) => a[me.pValX] - b[me.pValX]);
            me.data.forEach((d,i) => {
                if(i<100000){
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
                    d.rt = d.rt.split(',');
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
                  
            // Declare the x (horizontal position) scale.
            //const x = d3.scaleUtc(d3.extent(me.data, d => d[me.pValX]), [marginLeft, width - marginRight]);
            //const x =d3.scaleLinear(d3.extent(dataMissing, d => d[me.pValX]), [marginLeft, width - marginRight]);
            x = d3.scaleLog([1, d3.max(dataMissing, d => d[me.pValX])], [marginLeft, width - marginRight]).base(2);
            // Declare the y (vertical position) scale.
            //const y = d3.scaleLinear([0, d3.max(dataMissing, d => d[me.pValY])], [height - marginBottom, marginTop]);
            y = d3.scaleLog([1, d3.max(dataMissing, d => d[me.pValY])], [height - marginBottom, marginTop]).base(2);
            
            //ajoute la complexité des physiques
            let gPhysique = svg.append("g")
                .attr("class", "cpxPhysique")
                .attr("stroke", "white")
                .attr("stroke-opacity", strokeOpacity)
                .attr("opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Physique"))
              .join("g")
              .attr("transform",d=> `translate(${x(d[me.pValX])-symboleSize},${y(d[me.pValY])-symboleSize})`);
            addSymbolPhysique(gPhysique);

            //ajoute la complexité des actants
            let gActant = svg.append("g")
                    .attr("class", "cpxActant")
                    .attr("stroke", "white")
                    .attr("stroke-opacity", strokeOpacity)
                    .attr("opacity", 0.4)
                .selectAll()
                .data(dataMissing.filter(d=>d.dim=="Actant"))
                .join('g')
                    .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`);
            addSymbolActant(gActant);

            //ajoute la complexité des concepts
            let gconcept = svg.append("g")
                .attr("class", "cpxConcept")
                .attr("stroke", "white")
                .attr("stroke-opacity", strokeOpacity)
                .attr("opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Concept"))
              .join("g")
                  .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`);
            addSymbolConcept(gconcept);

            //ajoute la complexité des rapports
            let gRapports = svg.append("g")
                .attr("class", "cpxRapport")
                .style("stroke-width", symboleSize)
                .style("fill", "none")
                .attr("stroke-opacity", 0.4)
              .selectAll()
              .data(dataMissing.filter(d=>d.dim=="Rapport"))
              .join("g")
              .attr("transform",d=> `translate(${x(d[me.pValX])},${y(d[me.pValY])})`);
            addSymbolRapport(gRapports);

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
                .attr('style','cursor:zoom-in')
                .on('click',showDetails);
            addSymbolExistence(gExis);

            // Add the x-axis.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).ticks(width / 100).tickSizeOuter(0).tickFormat(numberFormat))
                .call(g => g.append("text")
                    .attr("x", width - marginRight)
                    .attr("y", marginBottom)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end")
                    .text(me.pLibX));
                
            // Add the y-axis, remove the domain line, add grid lines and a label.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y).ticks(height / 40).tickFormat(numberFormat))
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - marginLeft - marginRight)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", -marginLeft)
                    .attr("y", marginTop-10)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start")
                    .text(me.pLibY));
                  
            //ajoute le titre
            svg.append("text")
                .attr("font-size","2em")
                .attr("fill","currentColor")
                .attr("transform",d=>`translate(${marginLeft},20)`)
                .text('Complexity of database : '+numberFormat(me.tots.cpx));

            //création des légendes de dimensions
            let heightLeg=32, scBandLegende = d3.scaleBand()
                .domain(dims.map(d=>d.id))
                .range([marginLeft, width-marginRight])
                .paddingInner(0.2) // edit the inner padding value in [0,1]
                //.paddingOuter(0.5) // edit the outer padding value in [0,1]
                .align(0.5) // edit the align: 0 is aligned left, 0.5 centered, 1 aligned right.
                , 
            legende = svg.append("g")
                .attr("class", "cpxLegende")
                .selectAll()
                .data(dims)
                .join("g")
                  .attr('id',d=>'leg'+d.id)
                  .attr("stroke", "white")
                  .attr("stroke-opacity", strokeOpacity)  
                  .attr("transform",d=>`translate(${scBandLegende(d.id)},40)`)
                  .on('click',showCacheSymbol)
                  .style("cursor","pointer");
            legende.append("rect")
                  .attr('id',d=>'legFond'+d.id)        
                  .attr("x",0)
                  .attr("y",6)
                  .attr("width",scBandLegende.bandwidth())
                  .attr('height',heightLeg)
                  .attr("fill",d=>d.select ? "green" : "#00ffff00")
                  .attr("opacity", 0.2);
            legende.append("text")
                .attr("text-anchor","middle")
                .attr("font-size","1em")
                .attr("x",scBandLegende.bandwidth()/2)
                .attr("fill","currentColor")
                .text(d=>d.id);
            addSymbolExistence(d3.select('#legExistence'),`translate(${scBandLegende.bandwidth()/2},24)`);
            addSymbolPhysique(d3.select('#legPhysique'),`translate(${(scBandLegende.bandwidth()/2)-(symboleSize*3/2)},${(heightLeg/2)-(symboleSize*3/2)})`);
            addSymbolActant(d3.select('#legActant'),`translate(${scBandLegende.bandwidth()/2},24)`);            
            addSymbolConcept(d3.select('#legConcept'),`translate(${scBandLegende.bandwidth()/2},24)`);            
            addSymbolRapport(d3.select('#legRapport'),`translate(${scBandLegende.bandwidth()/2},24)`);            
            //
            showCacheSymbol(false, false);
            //

            //création des légendes de ressource type
            rscT = [];
            dataMissing.forEach(d=>{
                d.rt.forEach(rt=>{
                    if(rscT.filter(r=>r.lib==rt).length==0){
                        rscT.push({'id':rt.replace(/\\/g,''),'lib':rt,'select':true});
                    }
                });
            });
            let scBandLegendeRscT = d3.scaleBand()
                .domain(rscT)
                .range([marginLeft, width-marginRight])
                .paddingInner(0.2) // edit the inner padding value in [0,1]
                //.paddingOuter(0.5) // edit the outer padding value in [0,1]
                .align(0.5) // edit the align: 0 is aligned left, 0.5 centered, 1 aligned right.
                , 
            legendeRscT = svg.append("g")
                .attr("class", "cpxLegendeRscT")
                .selectAll()
                .data(rscT)
                .join("g")
                  .attr('id',d=>'leg'+d.id)
                  .attr("stroke", "white")
                  .attr("stroke-opacity", strokeOpacity)  
                  .attr("transform",d=>`translate(${scBandLegendeRscT(d)},80)`)
                  .on('click',showCacheRscT)
                  .style("cursor","pointer");
            legendeRscT.append("rect")
                  .attr('id',d=>'legFond'+d.id)        
                  .attr("x",0)
                  .attr("y",6)
                  .attr("width",scBandLegendeRscT.bandwidth())
                  .attr('height',heightLeg)
                  .attr("fill","green")
                  .attr("opacity", 0.2);
            legendeRscT.append("text")
                .attr("text-anchor","middle")
                .attr("font-size","1em")
                .attr("x",scBandLegendeRscT.bandwidth()/2)
                .attr('y',heightLeg-6)
                .attr("fill","currentColor")
                .text(d=>d.lib);

        }

        function showDetails(e,d){
            console.log(d);
            d3.json(me.urlDetails+'&dim='+d.dim+'&cpx='+d.cpx).then(data=>{
                console.log(data);
            })
        }

        function showCacheRscT(e,t){
            let sltType = [], s = d3.select('#legFond'+t.id);
            if(s.attr('fill')=="green"){
                s.attr('fill',"#00ffff00");//met une couleur transparente pour que le clic fonctionne
                t.select=false;                        
            }else{
                s.attr('fill',"green");                    
                t.select=true;                        
            }
            let q = rscT.filter(t=>t.select).join(' .');
            d3.select('.'+q).attr('visibility','visible');
        }
        function showCacheSymbol(e,d){
            if(e){
                let s = d3.select('#legFond'+d.id);
                if(s.attr('fill')=="green"){
                    d.select=false;
                    s.attr('fill',"#00ffff00");//met une couleur transparente pour que le clic fonctionne                    
                }else{                
                    d.select=true;
                    s.attr('fill',"green");                    
                }    
            }
            dims.forEach(d=>{
                if(d.select)d3.select('.cpx'+d.id).attr('visibility','visible');
                else d3.select('.cpx'+d.id).attr('visibility',d=>'hidden');
            }) 
        }

        function addSymbolRapport(g,t){
            let s = t ? g.append('g').attr('transform',t):g;
            s.attr('class',d => d.rt ?  'symbolRapport '+d.rt.map(t=>t.replace(/\\/g,'')).join(' ') : '')
                .attr('style','cursor:zoom-in')
                .on('click',showDetails);

            s.append("path")
                .attr("d",d3.line()(pointsLine))
                .attr("stroke", d => getColor(d,"currentColor"));
            for (let i = 0; i < pointsLine.length; i++) {
                s.append("circle")
                    .attr("cx", pointsLine[i][0])
                    .attr("cy", pointsLine[i][1])
                    .attr("fill", d => getColor(d))
                    .attr("r", 1);                
            }                
        }

        function addSymbolConcept(g,t){
            let s = t ? g.append('g').attr('transform',t):g;
            s.attr('class',d => d.rt ? 'symbolConcept '+d.rt.map(t=>t.replace(/\\/g,'')).join(' ') : '');
            s.append('circle')
              .attr("cx", 0)
                .attr("cy",0)
                .attr("fill", d => getColor(d))
                .attr("r", symboleSize*2.5);                
        }

        function addSymbolActant(g,t){
            let s = t ? g.append('g').attr('transform',t):g;
            s.attr('class',d => d.rt ? 'symbolActant '+d.rt.map(t=>t.replace(/\\/g,'')).join(' ') : '');
            s.append('polygon')
                .attr('points',pointsExa)
                .attr("fill", d => getColor(d));
        }

        function addSymbolPhysique(g,t){
            let s = t ? g.append('g').attr('transform',t):g;
            s.attr('class',d => d.rt ? 'symbolPhysique '+d.rt.map(t=>t.replace(/\\/g,'')).join(' ') : '');
            s.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("fill", d => getColor(d))
                .attr("width", symboleSize*3)                
                .attr("height", symboleSize*3);                

        }

        function addSymbolExistence(g,t){
            let s = t ? g.append('g').attr('transform',t):g;
            s.attr('class',d => d.rt ? 'symbolExitence '+d.rt.map(t=>t.replace(/\\/g,'')).join(' ') : '');
            s.append("rect")
                .attr("x", -symboleSize*1.5)
                .attr("y", -symboleSize*6)
                .attr("fill", d => getColor(d))
                .attr("width", symboleSize*3)                
                .attr("height", symboleSize*3);  
            s.append("circle")
                .attr("cx", 0)
                .attr("cy", symboleSize*2)
                .attr("fill", d => getColor(d))
                .attr("r", symboleSize*2.5);
            s.append('polygon')
                .attr('points',pointsExa)
                .attr("fill", d =>getColor(d));                              
            s.append("path")
                .attr("transform",d=> `translate(0,${symboleSize})`)
                .attr("d",d3.line()(pointsLine))
                .style("fill", "none")
                .attr("stroke-opacity", 0.4);                 
            for (let i = 0; i < pointsLine.length; i++) {
                s.append("circle")
                    .attr("cx", pointsLine[i][0])
                    .attr("cy", pointsLine[i][1]+symboleSize)
                    .attr("fill", d =>getColor(d))
                    .attr("r", 1);                
            }                

        }
        function getColor(d,c="none"){
            return d.dim ? me.pc.colors[d.dim](d[me.pValX]):c;
        }

        this.init();    
    }
}