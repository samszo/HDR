export class jdcComplexeRapports {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcCxRpt';
        this.data = params.data ? params.data : false;
        this.cont = params.cont ? params.cont : d3.select('body');
        this.svg = params.svg ? params.svg : false;
        this.nivMin = params.nivMin ? params.nivMin : false;
        this.nivMax = params.nivMax ? params.nivMax : false;
        this.hexas = params.hexas ? params.hexas : false;
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
        const height = params.height ? params.height : 600;

        let svg, posiG, posisDimNiv=[], posisNb=[], scaleBands=[], scaleLinear=[],
            idsDim = {'Physique':'jdcCxPh','Actant':'jdcCxAct','Concept':'jdcCxCpt'};

        this.init = function () {

            console.log(me.data);
            console.log(me.hexas);
            setGraph();
        }


        function setGraph(){

            // Specify the color scale.
            const color = d3.scaleSequential()
                .domain([
                    me.nivMin ? me.nivMin : 0,
                    me.nivMax ? me.nivMax : me.data.totals.nivMax])
                .interpolator(d3['interpolatePlasma']);
                                                          
            // Create the SVG container.
            svg = me.svg ? me.svg : me.cont.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("x", svgX)
                .attr("y", svgY)
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .style("font", "10px sans-serif");                

            //creation des path entre les niveaux des dimensions
            let g = svg.append('g').attr('id',me.id).attr('class','jdcRapportG')
                .style("font", "10px sans-serif").attr("text-anchor", "middle");
            /*    
            if(me.svg){
                g.attr("transform", `translate(${-posiG.x},${-posiG.y})`);
            }
            */
            posiG = svg.node().getBoundingClientRect();
            getScales();                        


            let def = svg.append('defs'),
            markerStyle="stroke:#000000;stroke-width:0pt;stroke-opacity:1;fill-opacity:1";
            def.append('marker')
                .attr('id', 'SquareS')
                .attr('refX', "0.0")
                .attr('refY', "0.0")
                .append('path')
                    .attr('d', "M -5.0,-5.0 L -5.0,5.0 L 5.0,5.0 L 5.0,-5.0 L -5.0,-5.0 z ")
                    .attr('style',markerStyle)
                    .attr("fill","yellow")
                    .attr("transform","scale(0.2)");
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
                .attr('r', 10)
                .style('fill', 'green');
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
                .attr('fill', 'red')                
                .attr('style',markerStyle);

            const node = g
                .selectAll('g.jdcRapport')
                .data(me.data.details)
                .enter()
                .append("g")
                .attr('class','jdcRapport')
                .attr("id", d => "g_"+me.id+"_"+d.ns+"_"+d.s+"_"+d.o+"_"+d.p)
                ;//.on('click',clickDim);
                            
                        
            node.append("path")
                //.style("stroke", d => color(d.ns))
                .style("stroke", "white")
                //.style("stroke-width", d => d.nb)
                .style("stroke-width", 3)
                .style("stroke-opacity",0.3)
                .style("fill", "none")
                .attr("d", (d,i)=>draw(d,i))
                .attr('marker-start', 'url(#DotS)')
                .attr('marker-end', 'url(#ArrowSend)')
                .attr('marker-mid', 'url(#SquareS)');
                                
            node.append("title")
                .text(d => ` niveau : ${d.ns}\n nombre : ${d.nb}\n complexité : ${d.c}\n sujet : ${d.s}\n object : ${d.o}\n prédicat : ${d.p}\n`);                
        
        }       
        
        function getDimNivPosi(id){
            if(!posisDimNiv[id]){
                let g = d3.select('#'+id);
                if(!g.size()){
                    console.log("ERROR getDimNivPosi "+id);
                }
                posisDimNiv[id]=g.node().getBoundingClientRect();
            }
            return posisDimNiv[id];
        }

        //pour calculer les positions équilibrées des rapports dans les niveaux des dimensions
        //une échelle par bande pour chaque dimension-niveau
        //le domaine de chaque échelle correspond à l'ordre dans le tableau des rapports
        function getScales(){
            let groupDimNivStart =  d3.group(me.data.details, d => d.s+'_'+d.ns),
                groupDimNivEnd =  d3.group(me.data.details, d => d.o+'_'+d.no),
                groupDimMid =  d3.group(me.data.details, d => d.s),
                gDims=[], ak, bb, keys;
            //calcule les échelles pour le départ
            groupDimNivStart.forEach((v,k,m) => {
                ak=k.split('_');
                bb = ak[0]=='Physique' ? getDimNivPosi("clip_"+idsDim[ak[0]]+ak[1]) : getDimNivPosi("g_"+idsDim[ak[0]]+ak[1]);
                keys = [];
                me.data.details.forEach((r,i)=>{
                    if(r.s==ak[0] && r.ns==ak[1])keys.push(i);
                });
                let sh = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0.2) // edit the inner padding value in [0,1]
                    .paddingOuter(0.2) // edit the outer padding value in [0,1]                
                    ;               
                let sv = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0) // edit the inner padding value in [0,1]
                    .paddingOuter(0) // edit the outer padding value in [0,1]                
                    ;               
                switch (ak[0]) {
                    case 'Physique':
                        //le long du cotè bas du rectangle
                        sh.range([bb.x-posiG.x, bb.x-posiG.x+(ak[1]==0 ? bb.width/2 : bb.width)]);
                        sv.range([bb.y+bb.height-posiG.y,bb.y+bb.height-posiG.y]);                    
                        break;            
                    case 'Actant':
                        //le long du coté nord de l'hexagone du niveau
                        sh.range([bb.x+me.hexas[ak[1]][1].x-posiG.x, bb.x+(me.hexas[ak[1]][1].x*3)-posiG.x]);
                        sv.range([bb.y-posiG.y,bb.y-posiG.y]);                    
                        break;            
                    case 'Concept':
                        /*le long du 1/2 cercle nord
                        */
                        let cx = bb.x-posiG.x+bb.width/2,
                            cy = bb.y-posiG.y+bb.height/2,
                            r = bb.height/2, 
                            pc=keys.map((nb,i)=>{
                                return getPointsOnCircle(cx,cy,r,180/keys.length*i+180);
                            });
                        sh = d3.scaleOrdinal(keys, pc.map(p=>p.x));
                        sv = d3.scaleOrdinal(keys, pc.map(p=>p.y));    
                        /*le long de l'équateur                    
                        sh.range([bb.x-posiG.x, bb.x-posiG.x+bb.width]);
                        sv.range([bb.y-posiG.y+bb.height/2, bb.y-posiG.y+bb.height/2]);
                        */
                        break;            
                }
                scaleBands['s_'+k+'_h']=sh;    
                scaleBands['s_'+k+'_v']=sv;
            });
            //calcule les échelles pour l'arrivée
            groupDimNivEnd.forEach((v,k,m) => {
                ak=k.split('_');
                bb = ak[0]=='Physique' ? getDimNivPosi("clip_"+idsDim[ak[0]]+ak[1]) : getDimNivPosi("g_"+idsDim[ak[0]]+ak[1]);
                keys = [];
                me.data.details.forEach((r,i)=>{
                    if(r.o==ak[0] && r.no==ak[1])keys.push(i);
                });
                let sh = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0.2) // edit the inner padding value in [0,1]
                    .paddingOuter(0.2) // edit the outer padding value in [0,1]                
                    ;               
                let sv = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0) // edit the inner padding value in [0,1]
                    .paddingOuter(0) // edit the outer padding value in [0,1]                
                    ;               
                switch (ak[0]) {
                    case 'Physique':
                        //le long du cotè bas du rectangle
                        sh.range([bb.x-posiG.x, bb.x-posiG.x+(ak[1]==0 ? bb.width/2 : bb.width)]);
                        sv.range([bb.y+bb.height-posiG.y,bb.y+bb.height-posiG.y]);                    
                        break;            
                    case 'Actant':
                        //le long du coté nord de l'hexagone du niveau
                        sh.range([bb.x+me.hexas[ak[1]][1].x-posiG.x, bb.x+(me.hexas[ak[1]][1].x*3)-posiG.x]);
                        sv.range([bb.y-posiG.y,bb.y-posiG.y]);                    
                        break;            
                    case 'Concept':
                        /*le long du 1/2 cercle nord
                        */
                        let cx = bb.x-posiG.x+bb.width/2,
                            cy = bb.y-posiG.y+bb.height/2,
                            r = bb.height/2, 
                            pc=keys.map((nb,i)=>{
                                return getPointsOnCircle(cx,cy,r,180/keys.length*i+180);
                            });
                        sh = d3.scaleOrdinal(keys, pc.map(p=>p.x));
                        sv = d3.scaleOrdinal(keys, pc.map(p=>p.y));    
                        break;            
                }
                scaleBands['e_'+k+'_h']=sh;    
                scaleBands['e_'+k+'_v']=sv;    
            });
            //calcule les échelles pour le milieu
            groupDimMid.forEach((v,k,m) => {
                bb = getDimNivPosi("g_"+idsDim["Actant"]+"0");
                keys = [];
                me.data.details.forEach((r,i)=>{
                    if(r.s==k)keys.push(i);
                });
                let sh = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0.2) // edit the inner padding value in [0,1]
                    .paddingOuter(0.2) // edit the outer padding value in [0,1]                
                    ;               
                let sv = d3.scaleBand()
                    .domain(keys)
                    .paddingInner(0.2) // edit the inner padding value in [0,1]
                    .paddingOuter(0.2) // edit the outer padding value in [0,1]                
                    ;               
                switch (k) {
                    case 'Physique':
                        //le long du coté Nord de l'hexagone
                        sh.range([bb.x+me.hexas[0][1].x-posiG.x, bb.x+(me.hexas[0][1].x*3)-posiG.x]);
                        sv.range([bb.y-posiG.y,bb.y-posiG.y]);                    
                        break;            
                    case 'Actant':
                        //le long du centre de l'hexagone
                        sh.range([bb.x+me.hexas[0][0].x-posiG.x, bb.x+(me.hexas[0][0].x)-posiG.x]);
                        sv.range([bb.y-posiG.y+bb.height/2,bb.y-posiG.y+bb.height/2]);                    
                        break;            
                    case 'Concept':
                        //Le long du coté sud de l'hexagone
                        sh.range([bb.x+me.hexas[0][1].x-posiG.x, bb.x+(me.hexas[0][1].x*3)-posiG.x]);
                        sv.range([bb.y+bb.height-posiG.y,bb.y+bb.height-posiG.y]);                    
                        break;            
                }
                scaleBands['m_'+k+'_h']=sh;    
                scaleBands['m_'+k+'_v']=sv;    
            });            
        }

        function getPointsOnCircle(cx, cy, r, a){
            const angleRadians = a * Math.PI / 180;
            const x = cx + r * Math.cos(angleRadians);
            const y = cy + r * Math.sin(angleRadians);
            return {'x':x, 'y':y};            
        }

        function draw(d,i) {
            /*
            const context = d3.path()
            //trace une ligne à partir du sujet
            context.moveTo(...getPosition(d.s,d.ns));
            //en passant par l'actant 0
            context.lineTo(...getPosition('Actant',0));
            //vers l'object
            context.lineTo(...getPosition(d.o,d.no)); // draw straight line to ⟨300,10⟩
            return context.toString(); // not mandatory, but will make it easier to chain operations
            */
            //return d3.line()([getPosition(d.s,d.ns,i), getPosition('Actant',0,i), getPosition(d.o,d.no,i)])           
            return d3.line()(getPositions(d,i));           
        }

        function getPositions(d,i){
            //récupère les scales
            let ssh = scaleBands['s_'+d.s+'_'+d.ns+'_h'],
                ssv = scaleBands['s_'+d.s+'_'+d.ns+'_v'],
                seh = scaleBands['e_'+d.o+'_'+d.no+'_h'], 
                sev = scaleBands['e_'+d.o+'_'+d.no+'_v'], 
                smh = scaleBands['m_'+d.s+'_h'], 
                smv = scaleBands['m_'+d.s+'_v'],
                posis = [[ssh(i),ssv(i)],[smh(i),smv(i)],[seh(i),sev(i)]];
            posis.forEach(p=>{
                p.forEach(c=>{
                    if(!c){
                        console.log("ERROR getPositions ",posis);
                    }
                })
            })
            return posis;
        }
        function getPosition(dim,niv,i){
            let g = d3.select("#g_"+idsDim[dim]+niv),
                //récupère la position de la dimension au niveau
                bb = g.size() ? g.node().getBoundingClientRect() : false,
                posi;
            if(!bb){
                console.log('ERROR getPosition : '+dim+' '+niv);
                return [0,0];
            }
            //console.log('getPosition : '+dim+' '+niv,bb);                        
            switch (dim) {
                case 'Physique':
                    posi = [bb.x+bb.width/2,bb.y+bb.height];                    
                    break;            
                case 'Actant':
                    posi = [bb.x+bb.width/2,bb.y+bb.height/2];                    
                    break;            
                case 'Concept':
                    posi = [bb.x+bb.width/2,bb.y];                    
                    break;            
            }
            return posi;
        }

        function openDetail(e,d){
            let url = d.data["@id"].replace('api/items','admin/item');
            window.open(url, "_blank");
        }
        
        this.init();    
    }
}