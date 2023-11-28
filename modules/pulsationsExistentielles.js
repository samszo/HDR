import anime from './anime.es.js';        
import {amazelogo} from './amazelogo.js';        

export class pulsationsExistentielles {
    constructor(params={}) {
        var me = this;
        this.urlSvg=params.urlSvg ? params.urlSvg :"assets/img/pulsexistence.svg";
        this.cont=params.cont ? params.cont : d3.select("body");
        this.height=params.height ? params.height : 600;
        this.width=params.width ? params.width : 800;
        this.lstScenarios=params.lstScenarios ? params.lstScenarios : false;
        this.slctScenario=params.slctScenario ? params.slctScenario : false;        
        this.btnStart=params.btnStart ? params.btnStart : false;
        this.btnStop=params.btnStop ? params.btnStop : false;
        this.hideLoader=params.hideLoader ? params.hideLoader : false;
        this.showLoader=params.showLoader ? params.showLoader : false;
        this.list=params.list ? params.list : [
                {'nom':'Montre le modèle','playScenario':'montreModele'},
                {'nom':'Présentation du modèle','fct':presenteModele},
                {'nom':'Flux Alea','fct':montreFluxAlea},
                {'nom':'Se tromper','playScenario':'seTromper'}
            ];
        this.svg = false;
        this.timelines = []; 
        let pa = d3.select('#progressAnimation'),
        bbScene, maxloop = 4, numloop = 0, flux = [], 
        dur = 100, durMin = 500, durMax = 30000,
        layers = [
            {'id':'gActant', 'ordre':1},
            {'id':'gPhysicalites', 'ordre':2},
            {'id':'gInteriorite', 'ordre':3},
            {'id':'gCribles', 'ordre':4, 'fct':showMazeCrible},   
            {'id':'gDiscerner', 'ordre':5},   
            {'id':'gRaisonner', 'ordre':6},   
            {'id':'gAgir', 'ordre':7},                                                
        ],
        //définition des positions
        m=6,
        pActant = {
            'nw':[83,115],
            'ne':[123,115],
            'e':[144,150],
            'se':[124,185],
            'sw':[84,185],
            'w':[63,151]
        },
        bbCribleD,bbCribleG,bbRaisonner,bbDicerner,bbAgir,extPathPoints;



        this.init = function () {
            console.log('init scenario');

            //chargement des scenarios
            me.lstScenarios.selectAll('li').data(me.list).enter().append('li')
                .append('a').attr('class',"dropdown-item").text(d=>d.nom)
                .on('click',(e,d)=>{
                    if(me.btnStart)me.btnStart.attr('class','btn btn-outline-danger');
                    if(me.btnStop)me.btnStop.attr('class','btn btn-outline-success');
                    if(me.slctScenario)me.slctScenario.text(d.nom);            
                    //commence le scénario
                    me.playScenario(null, d);        
                })
            //chargement du modèle à animer
            d3.svg(me.urlSvg).then(xml=>{
                me.hideLoader();
                me.cont.node().appendChild(xml.documentElement);
                me.svg = d3.select("#svg1");
                bbScene = me.svg.select('#scene_1').node().getBBox();
                //affiche le graphique dans toute la div
                me.svg.attr("preserveAspectRatio","xMidYMid meet")		
                    .attr('width',me.width).attr('height',me.height)
                    .attr('viewBox',bbScene.x+" "+bbScene.y+" "+bbScene.width+" "+bbScene.height);            
                //récupère les dimension des layers
                layers.forEach(l=>{
                    if(l.idSize)
                        l.bb=d3.select("#"+l.id).node().getBoundingClientRect();
                    else
                        l.bb=d3.select("#"+l.id).node().getBBox();
                });
                bbCribleD = d3.select("#rect3").node().getBBox();
                bbCribleG = d3.select("#rect2").node().getBBox();
                bbRaisonner = d3.select("#text7").node().getBBox();
                bbDicerner = d3.select("#path32").node().getBBox();
                bbAgir = d3.select("#path34").node().getBBox();
                extPathPoints = [
                    {'x':{'min':bbScene.x-m,'max':bbScene.x+bbScene.width+m},'y':{'min':bbScene.y-m,'max':bbScene.y-m}},
                    {'x':{'min':bbCribleD.x+m,'max':bbCribleD.x+bbCribleD.width-m},'y':{'min':+bbCribleD.y+m,'max':bbCribleD.y+bbCribleD.height-m}},
                    {'x':{'min':pActant.nw[0]+m,'max':pActant.ne[0]-m},'y':{'min':pActant.nw[1]+m,'max':pActant.ne[1]-m}},
                    {'x':{'min':pActant.e[0]+m,'max':pActant.se[0]-m},'y':{'min':pActant.e[1]+m,'max':pActant.se[1]-m}},
                    {'x':{'min':bbCribleD.x+m,'max':bbDicerner.x-m},'y':{'min':bbDicerner.y,'max':bbDicerner.y+bbDicerner.height}},
                    {'x':{'min':pActant.w[0],'max':pActant.e[0]},'y':'4-1'},
                    {'forme':'spirale','minT':1,'maxT':10,'minR':0.2,'maxR':4},
                    {'x':'x-0-5','y':'y-0-5'},
                    {'x':{'min':bbAgir.x-m,'max':pActant.sw[0]+m},'y':{'min':bbAgir.y,'max':bbAgir.y+bbAgir.height}},
                    {'x':{'min':pActant.sw[0],'max':pActant.w[0]},'y':{'min':pActant.sw[1],'max':pActant.w[1]}},
                    {'x':{'min':pActant.nw[0]+m,'max':pActant.ne[0]-m},'y':{'min':pActant.nw[1],'max':pActant.ne[1]}},
                    {'x':{'min':bbCribleG.x+m,'max':bbCribleG.x+bbCribleG.width-m},'y':{'min':+bbCribleG.y+5,'max':bbCribleG.y+bbCribleG.height-5}},
                    {'x':{'min':bbScene.x-m,'max':bbScene.x+bbScene.width+m},'y':{'min':bbScene.y-m,'max':bbScene.y-m}}
                ];
                me.playScenario('cacheModele');
            });
            //gestion des événement de l'IHM
            if(me.btnStop){
                me.btnStop.on('click',function(){
                    me.btnStart.attr('class','btn btn-outline-success');
                    me.btnStop.attr('class','btn btn-outline-danger');
                    me.timelines.forEach(tm=>tm.pause());
                })        
            }
            if(me.btnStart){
                me.btnStart.on('click',function(){
                    me.btnStart.attr('class','btn btn-outline-danger');
                    me.btnStop.attr('class','btn btn-outline-success');            
                    me.timelines.forEach(tm=>tm.play());
                })    
            }
        }
        this.playScenario=function(nom, s){
            if(s && s.fct)s.fct();
            else {
                if(s && s.playScenario && !nom)nom=s.playScenario;
                switch (nom) {
                    case 'cacheModele':
                        layers.forEach(l=>{
                            me.svg.select("#"+l.id).style("opacity", 0);
                        })
                        break;        
                    case 'montreModele':
                        layers.forEach(l=>{
                            me.svg.select("#"+l.id).style("opacity", 1);
                            if(l.fct)l.fct(l);
                        })
                        break;        
                    case 'cache':
                        me.svg.selectAll(".cache").style("opacity", 0);
                        break;        
                    default:
                        break;
                }
            }
        }        
        function setProgress(v){
            pa.style('width',parseInt(v)+'%').text(parseInt(v)+'%');
        }
        function animationAllEnd(){
            me.btnStart.attr('class','btn btn-outline-success');
            me.btnStop.attr('class','btn btn-outline-success');
        }

        function showMazeCrible(l){
            me.svg.select('#rectCribles').attr("opacity",0);
            let aml = new amazelogo({
                'idCont': me.svg.attr('id'),
                'cont': me.svg,
                'colorMur': 'black',
                'colorPoint': 'green',
                'width':l.bb.width,
                'height':l.bb.height,
                'posis':l.bb,
                'inSVG':true
            }), maze = aml.getMaze(32,6);
            console.log(maze);
        }

        function presenteModele(){
            me.playScenario('cacheModele');
            layers.sort((a, b) => a.ordre - b.ordre);
            let dur=3000, delay=0;
            setProgress(0);
            me.timelines=[];
            let tm = anime.timeline({
                easing: 'easeInOutSine',
                duration: dur,
                update: function(anim) {
                    setProgress(tm.progress);
                },
                complete: function(anim) {
                    console.log('ALL completed');
                    animationAllEnd();
                  }
                });
            layers.forEach((l,i)=>{
                tm.add({
                    targets: '#'+l.id,
                    opacity: 1,
                })
            })
            me.timelines.push(tm);

        }
        function montreFluxAlea(){
            me.playScenario('montreModele');
            me.timelines = [];
            //ajoute les path de flux aléatoires            
            let fluxPath = d3.select("#svg1").append('g').attr('id','fluxPathAlea'),
                nb = d3.randomInt(1, 10)();
            for (let index = 0; index < nb; index++) {
                let c = d3.interpolateInferno(Math.random()),
                    paths = fluxPath.selectAll('.fluxPath')
                        .data(getAleaPath(extPathPoints)).enter()
                        .append('path')  
                        .attr('d', d=>d.d)
                        .attr('id', (d,i)=>{
                            d.id = 'fluxPath_'+index+'_'+i;
                            return d.id;
                            })
                        .attr('class',d=>'fluxPath'+d.type)
                        .attr('fill','none')
                        .attr('stroke', c)
                        .attr('stroke-opacity',0.3)
                        .attr('stroke-width', 2)
                        .attr('transform',d=>{
                            return d.type=='spirale'?`translate(${d.prev[0]},${d.prev[1]})`:''
                        });                       
                showFlux(paths);
            }
        }
        
        function showFlux(paths){

            let offset=0, tm = anime.timeline({
                easing: 'easeInOutSine',
                direction: 'normal',
                loop: false,
                update: function(anim) {
                    setProgress(tm.progress);
                },
                complete: function(anim) {
                    console.log('ALL completed');
                    animationAllEnd();
                }
                });

            paths.each(d=>{
                tm.add({
                        targets: '#'+d.id,
                        duration: d.dur,
                        strokeDashoffset: [anime.setDashoffset, 0],
                    },offset ? '-='+offset : null)                        
                    .add({
                        targets: '#'+d.id,
                        delay: d.delayPersist,
                        duration: d.durPersist,
                        opacity:0,
                    });
                offset = d.delayPersist+d.durPersist;                        
            })
            me.timelines.push(tm);
                        
        }
        function getAleaPath(points){
            let paths=[], arrP = [], ap = [], prev, dur=[], spiT, spiR;
            points.forEach((p,i)=>{
                if(p.forme){
                    switch (p.forme) {
                        case 'spirale':
                            //récupére la position précédente                    
                            prev = ap[i-1];
                            //enregistre le chemin précédent
                            dur.push(d3.randomInt(durMin, durMax)());
                            paths.push({'type':'curve','delay':0, delayPersist: 0
                                , 'dur':dur[dur.length-1],durPersist: d3.randomInt(durMin, durMax)()
                                ,'d':d3.line().curve(d3.curveBasis)(ap)});
                            arrP.push(ap);
                            //calcule une spirale aléatoire
                            spiT = d3.randomInt(p.minT, p.maxT)()*6;
                            spiR = Math.random(p.minR, p.maxR);
                            ap = Array.from({ length: spiT }, (_, i) => [
                                (Math.PI / 3) * i, // angle (in radians)
                                spiR * i // radius
                              ]);
                            //retourne au centre
                            ap.push([0,0]);
                            //enregistre le chemin pour la spirale
                            dur.push(d3.randomInt(durMin, durMax)());
                            paths.push({'type':'spirale','delay':dur[dur.length-2], delayPersist: d3.randomInt(durMin, durMax)()
                                , 'dur':dur[dur.length-1], durPersist: d3.randomInt(durMin, durMax)()
                                ,'d':d3.lineRadial().curve(d3.curveBasis)(ap),'prev':prev});
                            arrP.push(ap);
                            ap=[];
                        break;
                    }
                }else{
                    let rx=p.x.min ? false : p.x.split('-'), 
                        ry=p.y.min ? false : p.y.split('-'),             
                    x = p.x.min ? d3.randomInt(p.x.min, p.x.max)() 
                        : rx.length == 3 ? arrP[rx[1]][rx[2]][0] : ap[rx[0]][0],
                    y = p.y.min ? d3.randomInt(p.y.min, p.y.max)() 
                        : ry.length == 3 ? arrP[ry[1]][ry[2]][1] : ap[ry[0]][1];
                    ap.push([x,y]);
                }
            });
            dur.push(d3.randomInt(durMin, durMax)());
            paths.push({'type':'curve','delay': dur.length == 1 ? 0 : dur.reduce((s, a) => s + a, 0)
                , 'dur':dur[dur.length-1],durPersist: d3.randomInt(durMin, durMax)(), delayPersist: d3.randomInt(durMin, durMax)()
                ,'d':d3.line().curve(d3.curveBasis)(ap)});
            return paths;
        }        

        this.init();
    }
}
