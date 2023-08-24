import {jdcComplexePhysiques} from '../modules/jdcComplexePhysiques.js';
import {jdcComplexeConcepts} from '../modules/jdcComplexeConcepts.js';
import {jdcComplexeActants} from '../modules/jdcComplexeActants.js';
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
            let gh = 600,
            //ajoute l'intériorité
            interior = container.append('circle')
            .attr("r", width/2)
            .attr("cx", width/2)
            .attr("cy", gh*2.5)
            .attr("stroke", "white")
            .attr("fill", 'none'),        
            cp = new jdcComplexePhysiques({'data':me.data.Physique,'cont':container,
                'width':width,'height':gh}),
            ca = new jdcComplexeActants({'data':me.data.Actant,'cont':container,
                'width':gh,'height':gh,
                'x':(width/2)-(gh/2),'y':gh+(gh/3)}),
            cc = new jdcComplexeConcepts({'data':me.data.Concept,'cont':container,
                'width':gh,'height':gh,
                'x':(width/2)-(gh/2),'y':gh*2+(gh/3)});

        }

        this.init();    
    }
}