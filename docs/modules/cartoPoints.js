export let hexaMove = {
    'n-resize':[{'d':'ne','p':3},{'d':'nw','p':3}],                
    'e-resize':[{'d':'ne','p':0},{'d':'se','p':0}],
    's-resize':[{'d':'se','p':3},{'d':'sw','p':3}],
    'w-resize':[{'d':'nw','p':0},{'d':'sw','p':0}],
    'ne-resize':[{'d':'ne','p':0},{'d':'se','p':0}],
    'nw-resize':[{'d':'nw','p':0},{'d':'sw','p':0}],
    'se-resize':[{'d':'se','p':1},{'d':'se','p':2}],
    'sw-resize':[{'d':'sw','p':1},{'d':'sw','p':2}]
    },
    hexaLiaison = {
        'seV':{'d':'se','p':[
            {'bp':'se','v':0},
            {'bp':'se','v':1},
            {'bp':'se','v':2},
            {'ph':2,'bx':'-','by':'+'}                        
        ]},
        'seO':{'d':'se','p':[
            {'bp':'se','v':3},
            {'bp':'se','v':2},
            {'bp':'se','v':1},
            {'ph':3,'bx':'-','by':'-'}                        
        ]},
        'seH':{'d':'se','p':[
            {'bp':'se','v':3},
            {'bp':'se','v':2},
            {'ph':2,'bx':'+','by':'-'},                        
            {'ph':2,'bx':'+','by':'-'}                        
        ]},
        'swV':{'d':'sw','p':[
            {'bp':'sw','v':0},
            {'bp':'sw','v':1},
            {'bp':'sw','v':2},
            {'ph':1,'bx':'+','by':'+'}                        
        ]},
        'swH':{'d':'sw','p':[
            {'bp':'sw','v':3},
            {'bp':'sw','v':3},
            {'ph':1,'bx':'-','by':'-'},                        
            {'ph':1,'bx':'-','by':'-'}                        
        ]},
        'neV':{'d':'ne','p':[
            {'bp':'ne','v':0},
            {'bp':'ne','v':1},
            {'bp':'ne','v':2},
            {'ph':4,'bx':'-','by':'+'}                        
        ]},
        'neH':{'d':'ne','p':[
            {'bp':'ne','v':3},
            {'bp':'ne','v':2},
            {'ph':4,'bx':'+','by':'+'},                        
            {'ph':4,'bx':'+','by':'+'}                        
        ]},
        'nwV':{'d':'nw','p':[
            {'bp':'nw','v':0},
            {'bp':'nw','v':1},
            {'bp':'nw','v':2},
            {'ph':5,'bx':'+','by':'+'}                        
        ]},
        'nwH':{'d':'nw','p':[
            {'ph':5,'bx':'-','by':'+'},                        
            {'ph':5,'bx':'-','by':'+'},                        
            {'bp':'nw','v':2},
            {'bp':'nw','v':3},
        ]}
        },    
    hexaFusion = {
    'n':[
        {'nh':'n','cp':['getPointsLiaison_seV','getPointsLiaison_swV'],'dp':[]},
        {'cp':['getPointsLiaison_neV','getPointsLiaison_nwV'],'dp':[]}
    ],
    'ne':[
        {'nh':'ne','cp':['getPointsLiaison_swH'],'dp':[]},
        {'cp':['getPointsLiaison_neH','getPointsLiaison_seO'],'dp':[]}
    ],
    'nw':[
        {'nh':'nw','cp':['getPointsLiaison_seO'],'dp':[]},
        {'cp':['getPointsLiaison_nwH'],'dp':[]}                        
    ],
    's':[
        {'nh':'s','cp':['getPointsLiaison_nwV','getPointsLiaison_neV'],'dp':[]},
        {'cp':['getPointsLiaison_seV','getPointsLiaison_swV'],'dp':[]}                        
    ],
    'se':[
        {'nh':'se','cp':['getPointsLiaison_nwH'],'dp':[]},
        {'cp':['getPointsLiaison_seH'],'dp':[]}                        
    ],
    'sw':[
        {'nh':'sw','cp':['getPointsLiaison_neH','getPointsLiaison_seH'],'dp':[]},
        {'cp':['getPointsLiaison_swH'],'dp':[]}                        
    ],
    'n,ne':[
        {'nh':'n','cp':['getPointsLiaison_swV'],'dp':[]},
        {'nh':'ne','cp':['getPointsLiaison_nwH'],'dp':[]},
        {'cp':['getPointsLiaison_nwV'],'dp':['ne']}                        
    ],            
    'n,nw':[
        {'nh':'n','cp':['getPointsLiaison_seV'],'dp':['sw']},
        {'nh':'nw','cp':['getPointsLiaison_neH'],'dp':[]},
        {'cp':['getPointsLiaison_neV'],'dp':['nw']}                        
    ],            
    'ne,se':[
        {'nh':'ne','cp':[
            {'d':'nw','p':[
                {'bp':'nw','v':3},
                {'bp':'nw','v':2},
                {'bp':'nw','v':1},
                {'ph':0,'bx':'+','by':'+'}                        
            ]},
            {'d':'se','p':[
                {'bp':'se','v':0},
                {'bp':'se','v':1},
                {'bp':'se','v':2},
                {'ph':2,'bx':'-','by':'-'}                        
            ]}
            ],'dp':['sw']},
        {'nh':'se','cp':[
            {'d':'sw','p':[
                {'bp':'sw','v':3},
                {'bp':'sw','v':2},
                {'bp':'sw','v':1},
                {'ph':0,'bx':'+','by':'-'}                        
            ]},
            {'d':'ne','p':[
                {'bp':'ne','v':0},
                {'bp':'ne','v':1},
                {'bp':'ne','v':2},
                {'ph':4,'bx':'-','by':'-'}                        
            ]}
            ],'dp':['nw']},
        {'cp':[
            {'d':'ne','p':[
                {'bp':'nw','v':3},
                {'bp':'nw','v':2},
                {'ph':4,'bx':'+','by':'+'},                        
                {'ph':4,'bx':'+','by':'+'}                        
            ]},
            {'d':'se','p':[
                {'bp':'se','v':3},
                {'bp':'se','v':2},
                {'ph':2,'bx':'+','by':'-'},                        
                {'ph':2,'bx':'+','by':'-'}                        
            ]}
            ],'dp':[]}                        
    ],
    'sw,nw':[
        {'nh':'sw','cp':['getPointsLiaison_neH'],'dp':[]},
        {'nh':'nw','cp':['getPointsLiaison_seO'],'dp':[]},
        {'cp':['getPointsLiaison_nwH','getPointsLiaison_swH'],'dp':[]}                        
    ],            
    'ne,sw':[
        {'cp':['getPointsFusion_sw_sw_ne','getPointsLiaison_swH'],'dp':[]}
    ],
    'n,s':[
        {'cp':['getPointsLiaison_seV','getPointsLiaison_swV','getPointsLiaison_nwV','getPointsLiaison_neV'],'dp':[]}
    ],
    'se,nw':[
        {'cp':['getPointsLiaison_nwH','getPointsLiaison_swH','getPointsLiaison_seO'],'dp':[]}
    ],
    'ne,nw':[
        {'cp':['getPointsFusion_se_se_nw','getPointsFusion_se_se_sw','getPointsFusion_sw_sw_ne','getPointsFusion_sw_sw_se'],'dp':[]}
    ],
    's,sw':[
        {'nh':'sw','cp':['getPointsLiaison_seH'],'dp':[]},
        {'cp':['getPointsLiaison_seV'],'dp':['sw']}
    ],
    'se,s':[
        {'nh':'s','cp':['getPointsLiaison_nwV'],'dp':['ne']},
        {'cp':['getPointsLiaison_swV'],'dp':['se']}
    ],
    'se,sw':[
        {'cp':['getPointsLiaison_seO','getPointsLiaison_neV','getPointsLiaison_swH','getPointsLiaison_nwH'],'dp':[]}
    ],
    'se,s,nw':[
        {'cp':['getPointsFusion_n_n_se'],'dp':['se']}
    ],
    's,nw':[
        {'cp':['getPointsFusion_se_se_nw','getPointsFusion_n_n_sw','getPointsFusion_n_n_se'],'dp':[]}
    ],        
    'n,ne,s':[
        {'cp':['getPointsFusion_se_se_nw','getPointsFusion_n_n_sw','getPointsFusion_n_n_se'],'dp':[]}
    ],
    'se,s,sw':[
        {'nh':'s','cp':[],'dp':['ne']},
        {'cp':[],'dp':['sw','se']}
    ],
    'n,sw,nw':[
        {'nh':'n','cp':['getPointsLiaison_seV'],'dp':['sw']},
        {'nh':'sw','cp':[],'dp':['nw']},
        {'nh':'nw','cp':['getPointsLiaison_neH'],'dp':['se']},
        {'cp':['getPointsLiaison_swH','getPointsLiaison_neV'],'dp':['nw']}
    ],                        
    'n,ne,nw':[
        {'nh':'n','cp':[],'dp':['se']},
        {'cp':[],'dp':['nw','ne']}
    ],                        
    'sw,sw,ne':[
        {'nh':'sw','cp':['getPointsLiaison_neH'],'dp':['se']},
        {'nh':'s','cp':['getPointsLiaison_neV'],'dp':[]},
        {'cp':['getPointsLiaison_seV'],'dp':['sw']}
    ],
    'n,ne,se,s,sw':[
        {'nh':'ne','cp':['getPointsLiaison_nwH'],'dp':[]},
        {'cp':['getPointsLiaison_nwV'],'dp':['ne','se','sw']}
    ],
    'n,se,s':[
        {'cp':['getPointsLiaison_nwV','getPointsLiaison_swV','getPointsLiaison_neV'],'dp':['se']}
    ],
    'n,ne,s,nw':[
        {'cp':['getPointsLiaison_swV','getPointsLiaison_seV'],'dp':['nw','ne']}
    ],                        
};
export function getPointsFusion(k,nh,d){
    let dp = hexaFusion[k].filter(f=>f.nh==nh)[0].cp.filter(cp=>cp.d==d)[0];
    if(!dp)console.log('points introuvable : '+k+','+nh+','+d);
    return dp;
}
export function getPointsLiaison(d){
    let dp = hexaLiaison[d];
    if(!dp)console.log('points de liaison introuvable : '+d);
    return dp;
}