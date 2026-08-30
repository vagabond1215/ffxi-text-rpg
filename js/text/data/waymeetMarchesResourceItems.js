import { ITEM_KINDS, normalizeItem } from './itemSchema.js';

export const WAYMEET_MARCHES_RESOURCE_ITEM_CATALOG_VERSION = 1;

const DEFINITIONS = Object.freeze({
    'item-waymeet-moor-char': resource({ id:'item-waymeet-moor-char', name:'South March Moor Char', tags:['fish','food','freshwater','protein','waymeet-marches'], valueGil:17, sourceId:'source-waymeet-moor-char-burn', placeId:'waymeet-south-marches', action:'fish', provenanceType:'fishing', consumption:{ mode:'processRequired', hazard:'pathogenRisk', preparation:['clean','cook-or-smoke'], notes:'Fresh burn-caught char is cleaned and cooked or properly smoked before eating; raw fish is known to bring sickness.' }, sinks:['processInput','craftIngredient','trade'] }),
    'item-waymeet-heather-tips': resource({ id:'item-waymeet-heather-tips', name:'Windscar Heather Tips', tags:['flora','heather','aromatic','dye','waymeet-marches'], valueGil:9, sourceId:'source-waymeet-heather-bank', placeId:'windscar-saddle', action:'forage', provenanceType:'flora', sinks:['processInput','craftIngredient','trade'] }),
    'item-waymeet-bog-myrtle': resource({ id:'item-waymeet-bog-myrtle', name:'South March Bog Myrtle', tags:['flora','aromatic','preservation','herb','waymeet-marches'], valueGil:12, sourceId:'source-waymeet-bog-myrtle-hollow', placeId:'waymeet-south-marches', action:'forage', provenanceType:'flora', sinks:['processInput','craftIngredient','trade'] }),
    'item-waymeet-sedge-reed': resource({ id:'item-waymeet-sedge-reed', name:'Plateau Sedge Reed', tags:['flora','fiber','matting','roadwork','waymeet-marches'], valueGil:8, sourceId:'source-waymeet-sedge-bed', placeId:'waymeet-south-marches', action:'gather', provenanceType:'flora', sinks:['processInput','craftIngredient','construction','repair','trade'] }),
    'item-waymeet-peat-turf': resource({ id:'item-waymeet-peat-turf', name:'South March Peat Turf', tags:['organic','fuel','peat','roadwork','waymeet-marches'], valueGil:7, sourceId:'source-waymeet-peat-cut', placeId:'waymeet-south-marches', action:'gather', provenanceType:'flora', sinks:['processInput','fuel','trade'] }),
    'item-waymeet-whortleberry': resource({ id:'item-waymeet-whortleberry', name:'Windscar Whortleberry', tags:['flora','berry','food','fruit','waymeet-marches'], valueGil:10, sourceId:'source-waymeet-whortleberry-slope', placeId:'windscar-saddle', action:'forage', provenanceType:'flora', consumption:{ mode:'direct', hazard:'none', preparation:[], notes:'Ripe clean berries are eaten fresh in small handfuls or dried for road food.' }, sinks:['consume','processInput','craftIngredient','trade'] }),
    'item-waymeet-roadstone': resource({ id:'item-waymeet-roadstone', name:'Windscar Roadstone', tags:['mineral','stone','roadwork','construction','waymeet-marches'], valueGil:13, sourceId:'source-waymeet-roadstone-shelf', placeId:'windscar-saddle', action:'mine', provenanceType:'mineral', sinks:['processInput','construction','repair','trade'] }),
});
export function getWaymeetMarchesResourceItem(id){const e=DEFINITIONS[String(id??'').trim()]??null;return e?normalizeItem(e):null;}
export function listWaymeetMarchesResourceItems(){return Object.values(DEFINITIONS).map(e=>normalizeItem(e));}
function resource({id,name,tags,valueGil,sourceId,placeId,action,provenanceType,consumption=null,sinks}){return Object.freeze({
 id,name,kind:ITEM_KINDS.MATERIAL,quantity:1,maxStack:99,valueGil,tags:Object.freeze([...tags]),consumption,
 provenance:Object.freeze([Object.freeze({type:provenanceType,sourceId,placeId,action,data:Object.freeze({catalogVersion:WAYMEET_MARCHES_RESOURCE_ITEM_CATALOG_VERSION})})]),
 sinks:Object.freeze(sinks.map(type=>Object.freeze({type,data:Object.freeze({})}))),
 metadata:Object.freeze({confidence:'intentionalSimplification',source:'Hearth & Horizon Waymeet Marches',notes:'Canonical plateau-approach resource with exact authored source and connected downstream use.'}),
});}
