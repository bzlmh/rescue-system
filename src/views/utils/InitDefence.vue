<template>
  <div style="margin-top:-30px;margin-left: -25px;">
    <!-- <BreadList :list="['首页']" /> -->
    <a-card style="height: 100%;">
      <baidu-map class="map" :center="{lng: 114.313572, lat: 34.818505}" :zoom="22" :min-zoom="5" :scroll-wheel-zoom="true" :max-zoom="25">
<!--        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :max-zoom="25"></bm-navigation>-->
        <bm-polygon :path="polygonPath" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath"/>
        <bm-polygon :path="polygonPath2" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" :editing="true" @lineupdate="updatePolygonPath2"/>
      </baidu-map>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      polygonPath: [
        {lng: 114.31359, lat: 34.819609},
        {lng: 114.313635, lat: 34.817127},
        {lng: 114.313568, lat: 34.818757}
      ],
      polygonPath2: [
        {lng: 114.31359, lat: 34.819609},
        {lng: 114.313635, lat: 34.817127},
        {lng: 114.313568, lat: 34.818757}
      ]
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    updatePolygonPath (e) {
      this.polygonPath = e.target.getPath()
      console.log(this.polygonPath)
    },
    updatePolygonPath2 (e) {
      this.polygonPath2 = e.target.getPath()
      console.log(this.polygonPath2)
    },
    addPolygonPoint () {
      this.polygonPath.push({lng: 116.404, lat: 39.915})
      console.log(this.polygonPath)
    }
  }
}
</script>

<style>
.map {
  width: 100%;
  height: 86vh;
  overflow: hidden;
}
</style>

