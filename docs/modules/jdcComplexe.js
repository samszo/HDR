import {jdcComplexePhysiques} from '../modules/jdcComplexePhysiques.js';
import {jdcComplexeConcepts} from '../modules/jdcComplexeConcepts.js';
import {jdcComplexeActants} from '../modules/jdcComplexeActants.js';
import {jdcComplexeRapports} from '../modules/jdcComplexeRapports.js';
export class jdcComplexe {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : 'jdcCx';
        this.data = params.data ? params.data : false;
        this.cont = params.cont ? params.cont : d3.select('body');
        // Specify the chart’s dimensions.
        const width = params.width ? params.width : 1024;
        const height = params.height ? params.height : 600;
        // Specify the chart’s colors.
        const colors = params.colors ? params.colors : false;
       // Specify the legen
       const legend = params.legend ? params.legend : false;

        let svg, svgBBox, container;

        this.init = function () {
            console.log(me.data);            
            setGraphs();
        }

        function setGraphs(){

            // Create the SVG global container.
            svg = me.cont.append("svg")
                .attr('id','svgGlobal'+me.id)
                .attr("width", width+'px').attr("height", height+'px');
            svgBBox = svg.node().getBoundingClientRect();
            //création du conteneur pour le graph
            container = svg.append("g");                
            svg.call(
                d3.zoom()
                    .scaleExtent([.1, 4])
                    .on('zoom', (event) => {
                        container.attr('transform', event.transform);
                        })                        
            );
            //ajoute les positions dans les légendes
            if(legend){
               legend.addPosiInLegend('Existence',me.data.totals.c);                
               legend.addPosiInLegend('Physique',me.data.Physique.totals.c);                
               legend.addPosiInLegend('Actant',me.data.Actant.totals.c);                
               legend.addPosiInLegend('Concept',me.data.Concept.totals.c);                
               legend.addPosiInLegend('Rapport',me.data.Rapport.totals.c);                
            }
                        

            //ajoute les graphs par dimension            
            let gh = height/4,
            color = d3.scaleLinear()
                .domain([0,me.data.totals.nivMax])
                .range(["#00045f", "#040ef1"]),
            //ajoute l'intériorité
            interior = container.append('circle')
                .attr("r", gh*1.3)
                .attr("cx", width/2)
                .attr("cy", gh*2.7)
                .attr("stroke", colors.Existence(me.data.totals.c))
                .attr("stroke-width", 10)
                .attr("fill", 'none'),
            //construction des dimensions        
            cp = new jdcComplexePhysiques({'data':me.data.Physique,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':width,'height':gh,'color':colors.Physique ? colors.Physique : color}),
            ca = new jdcComplexeActants({'data':me.data.Actant,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':gh,'height':gh,'color':colors.Actant ? colors.Actant : color,
                'x':(width/2)-(gh/2),'y':gh+(gh/3)}),
            cc = new jdcComplexeConcepts({'data':me.data.Concept,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':gh,'height':gh,'color':colors.Concept ? colors.Concept : color,
                'x':(width/2)-(gh/2),'y':gh*2.7}),
            cr = new jdcComplexeRapports({'data':me.data.Rapport,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'color':colors.Rapport ? colors.Rapport : color,
                'width':width,'height':height, 'hexas':ca.hexas});

        }

        this.init();    
    }
}