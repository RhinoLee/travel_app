<script setup>
import { onMounted, reactive, watch } from "vue";
import { useTravelStore } from "@/stores/travel/travel"
const travelStore = useTravelStore()

const props = defineProps({
  planList: {
    type: Object
  }
})

const map = reactive({ data: null })
let markers = []


// 偵測目前選擇的計畫，計畫變更地圖需重新插點
watch(
  () => props.planList,
  (newVal) => {
    removeAllMarkers()
    renderPlanLocation()
  }
)

function initMap() {
  map.data = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 23.97565, lng: 120.9738819 },
    zoom: 8,
  });
}

// 設定點位
function setMarker({ location, placeId }) {
  // create marker
  const marker = new google.maps.Marker({
    position: location,
    placeId,
  });
  marker.placeId = placeId
  // add click event for get location detail
  marker.addListener("click", async (e) => {
    const res = await travelStore.getLocationInfo(marker.placeId)
  })

  markers.push(marker)
}
// 點位設定到地圖上
function setMarkerToMap(map) {
  console.log("setMarker", markers, map);
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
// 移除所有點位
function removeAllMarkers() {
  setMarkerToMap(null)
  markers = []
}
// 把目前計畫中的點設定到地圖上
function renderPlanLocation() {
  props.planList.forEach(item => {
    item.plans.forEach(plan => {
      setMarker({
        location: plan.location,
        placeId: plan.placeId
      })
    })
  })

  setMarkerToMap(map.data)
}

onMounted(() => {
  initMap()
  renderPlanLocation()
})

</script>
<template>
  <div class="w-full h-full">
    <div class="w-full h-full" id="map"></div>
  </div>
</template>