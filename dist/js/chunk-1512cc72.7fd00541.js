(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1512cc72"],{6457:function(t,o,n){"use strict";n("ec6c")},c31c:function(t,o,n){"use strict";n.r(o);var a=function(){var t=this,o=t.$createElement,n=t._self._c||o;return n("div",{staticStyle:{"margin-top":"-30px","margin-left":"-25px"}},[n("a-card",{staticStyle:{height:"100%"}},[n("baidu-map",{staticClass:"map",attrs:{center:{lng:114.313572,lat:34.818505},zoom:22,"min-zoom":5,"scroll-wheel-zoom":!0,"max-zoom":25}},[n("bm-polygon",{attrs:{path:t.polygonPath,"stroke-color":"blue","stroke-opacity":.5,"stroke-weight":2,editing:!0},on:{lineupdate:t.updatePolygonPath}}),n("bm-polygon",{attrs:{path:t.polygonPath2,"stroke-color":"blue","stroke-opacity":.5,"stroke-weight":2,editing:!0},on:{lineupdate:t.updatePolygonPath2}})],1)],1)],1)},l=[],e={data:function(){return{polygonPath:[{lng:114.31359,lat:34.819609},{lng:114.313635,lat:34.817127},{lng:114.313568,lat:34.818757}],polygonPath2:[{lng:114.31359,lat:34.819609},{lng:114.313635,lat:34.817127},{lng:114.313568,lat:34.818757}]}},created:function(){},mounted:function(){},methods:{updatePolygonPath:function(t){this.polygonPath=t.target.getPath(),console.log(this.polygonPath)},updatePolygonPath2:function(t){this.polygonPath2=t.target.getPath(),console.log(this.polygonPath2)},addPolygonPoint:function(){this.polygonPath.push({lng:116.404,lat:39.915}),console.log(this.polygonPath)}}},i=e,c=(n("6457"),n("2877")),g=Object(c["a"])(i,a,l,!1,null,null,null);o["default"]=g.exports},ec6c:function(t,o,n){}}]);
//# sourceMappingURL=chunk-1512cc72.7fd00541.js.map