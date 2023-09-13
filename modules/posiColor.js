export class posiColor {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'posiColor';
        this.data = params.data ? params.data : false;
        this.pLib = params.pLib ? params.pLib : 'lib';
        this.pVal = params.pVal ? params.pVal : 'value';
        this.cont = params.cont ? params.cont : d3.select('body');
        this.svg = params.svg ? params.svg : false;
        this.color = params.color ? params.color : false;
        // Specify the chart’s position.
        const svgX=params.x ? params.x : 0; 
        const svgY=params.y ? params.y : 0; 
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 600;
        const height = params.height ? params.height : 600;

        let svg, scLin, scLog, scX, scBandY;

        this.init = function () {
            console.log(me.data);            
            setData();
            setGraph();
        }

        function setData(){
            //définition des échelles
            let dom = d3.extent(me.data.map(d=>d[me.pVal]));		  
            scLin = d3.scaleLinear().domain(dom).range([0, width-10]);
            scLog = d3.scaleLog().base(2).domain(dom).range([0, width-10]);
            dom = me.data.map(d=>d[me.pLib]);
            scBandY = d3.scaleBand(dom, [10, height-10]);
            scX = scLin; 
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

            //création des conteneurs graphique
            let g = svg.selectAll('g')
                .data(me.data)
                .enter()
                .append('g')
                .attr('transform', d=>'translate(0, '+scBandY(d[me.pLib])+')');
            g.append('rect')
                .attr('height', scBandY.bandwidth())
                .attr('width', d=>scX(d[me.pVal]));
            g.append('text')
                .attr('y',scBandY.bandwidth()/2)
                .attr('class', 'txtData')
                .text(d=>d[me.pLib]);
            svg.append("g")
                .call(d3.axisTop(scX).ticks(5));
          
        }
        
        this.init();    
    }
}