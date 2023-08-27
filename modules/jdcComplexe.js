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

            //ajoute les graphs par dimension            
            let gh = height/4,
            //ajoute l'intériorité
            interior = container.append('circle')
                .attr("r", gh*1.3)
                .attr("cx", width/2)
                .attr("cy", gh*2.7)
                .attr("stroke", "white")
                .attr("fill", 'none'),        
            cp = new jdcComplexePhysiques({'data':me.data.Physique,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':width,'height':gh}),
            ca = new jdcComplexeActants({'data':me.data.Actant,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':gh,'height':gh,
                'x':(width/2)-(gh/2),'y':gh+(gh/3)}),
            cc = new jdcComplexeConcepts({'data':me.data.Concept,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':gh,'height':gh,
                'x':(width/2)-(gh/2),'y':gh*2.7}),
            cr = new jdcComplexeRapports({'data':me.data.Rapport,'svg':container,
                'nivMin':me.data.totals.nivMin, 'nivMax':me.data.totals.nivMax,
                'width':width,'height':height, 'hexaBase':ca.hexaBase});

        }

        this.init();    
    }
}