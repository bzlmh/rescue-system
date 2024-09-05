<template>
  <div style="margin-top: -30px; margin-left: -25px;">
    <a-card style="height: 100%;">
      <baidu-map class="map" :center="{ lat: 34.833885, lng: 114.462196 }" :zoom="14" :scroll-wheel-zoom="true" @ready="setDistanceToolInstance">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-marker v-for="(marker, index) in markers" :key="index" :position="{lng: marker.lng, lat: marker.lat}" @click="lookDetail(marker)"  >
        </bm-marker>
        <bm-marker v-for="(accmarker, index) in accmarkers" :key="index" :position="{lng: accmarker.lng, lat: accmarker.lat}" @click="lookaccDetail(accmarker)">
        </bm-marker>
        <bm-info-window  :position="{lng: infoWindowContent.lng, lat: infoWindowContent.lat}" :show="infoWindowVisible" @close="infoWindowClose">
          <div>
            <p>站点名字: {{ infoWindowContent.stationName }}</p>
            <p>组织名字: {{ infoWindowContent.orgName }}</p>
            <p>电话号: {{ infoWindowContent.phoneNumber }}</p>
          </div>
        </bm-info-window>
        <bm-info-window  :position="{lng: accinfoWindowContent.lng, lat: accinfoWindowContent.lat}" :show="accinfoWindowVisible" @close="accinfoWindowClose">
        <div>
          <p>负责救援站点名字: {{ accinfoWindowContent.stationName }}</p>
          <p>事故发生时间:{{ accinfoWindowContent.happenTime }}</p>
          <p>救援结束时间:{{ accinfoWindowContent.endTime }}</p>
          <!-- <p>事故及 {{ accinfoWindowContent.phoneNumber }}</p> -->
        </div>
      </bm-info-window>
        <bm-control @addpoint="addpoint">
          <button @click="openDistanceTool">开启测距</button>
        </bm-control>
      </baidu-map>
    </a-card>
  </div>
</template>

<script>
import DistanceTool from 'bmaplib.distancetool';
import { StaVO,AccidentVO} from "@/api/map.js";

export default {
  data() {
    return {
      infoWindowContent: {
        siteName: '',
        orgName: '',
        phoneNumber: '',
        lng: 0,
        lat: 0
      },
      infoWindowVisible: false,
      markers: [],
      accinfoWindowContent: {
        stationName: '',
        happenTime: '',
        endTime: '',
        lng: 0,
        lat: 0
      },
      accinfoWindowVisible: false,
      accmarkers: [],
      distanceTool: null,
      polylinePath: [
        { lng: 116.404, lat: 39.915 },
        { lng: 116.405, lat: 39.920 },
        { lng: 116.423493, lat: 39.907445 }
      ],
      lng: '',
      lat: '',
    };
  },
  created() {
    this.fetchMarkers();
    this.fetchaccMarkers();
  },
  mounted() {},
  beforeDestroy() {
    if (this.distanceTool) {
      this.distanceTool.close();
    }
  },
  methods: {
    async fetchaccMarkers() {
    const { data: res } = await AccidentVO();
    // console.log(res);
    // console.log(res);
    for (let i = 0; i < res.data.length; i++){
      this.accmarkers.push({ lng: res.data[i].lng, lat: res.data[i].lat ,stationName:res.data[i].stationName,happenTime:res.data[i].happenTime,endTime:res.data[i].endTime});
      //  console.log(this.markers)
    }
    console.log(this.accmarkers)
  },
    async fetchMarkers() {
    const { data: res } = await StaVO();
    // console.log(res);
    // console.log(res);
    for (let i = 0; i < res.data.length; i++){
      this.markers.push({ lng: res.data[i].lng, lat: res.data[i].lat ,stationName:res.data[i].stationName,orgName:res.data[i].orgName,tel:res.data[i].tel});
      //  console.log(this.markers)
    }
    console.log(this.markers)
  },
      // this.markers =res.data.lan;
    addpoint(e) {
      console.log(e.points);
    },
    setDistanceToolInstance({ map }) {
      this.distanceTool = new DistanceTool(map, { lineStroke: 2 });
    },
    openDistanceTool() {
      if (this.distanceTool) {
        this.distanceTool.open();
      }
    },
    lookDetail(marker) {
      this.infoWindowContent = {
        stationName: marker.stationName,
        orgName: marker.orgName,
        phoneNumber: marker.tel,
        lng: marker.lng,
        lat: marker.lat
      };
      this.infoWindowVisible = true;
    },
    lookaccDetail(accmarker) {
      this.accinfoWindowContent = {
        stationName: accmarker.stationName,
        happenTime:accmarker.happenTime,
        endTime:accmarker.endTime,
        lng: accmarker.lng,
        lat: accmarker.lat
      };
      this.accinfoWindowVisible = true;
    },
    infoWindowClose() {
      this.infoWindowVisible = false;
    },
    accinfoWindowClose() {
      this.accinfoWindowVisible = false;
    }
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 86vh;
}
</style>
