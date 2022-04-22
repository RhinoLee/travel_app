<script setup>
import { onMounted, reactive, watch } from "vue";
import { useTravelStore } from "@/stores/travel/travel"
const travelStore = useTravelStore()

const props = defineProps({
  planOfTravel: {
    type: Object
  }
})

const map = reactive({ data: null })


// 偵測目前選擇的計畫，計畫變更地圖需重新插點
watch(
  () => props.planOfTravel,
  (newVal) => {
    console.log("new value of props.planOfTravel", newVal);
  }
)

function initMap() {
  map.data = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 23.97565, lng: 120.9738819 },
    zoom: 8,
  });
}

function addMarker({ location, placeId }) {
  // create marker
  const marker = new google.maps.Marker({
    position: location,
    placeId,
    map: map.data,
  });
  marker.placeId = placeId
  // add click event for get location detail
  marker.addListener("click", async (e) => {
    console.log("marker click", e);
    console.log("marker", marker);
    const res = await travelStore.getLocationInfo(marker.placeId)
  })
}

onMounted(() => {
  initMap()

  props.planOfTravel.forEach(item => {
    item.plans.forEach(plan => {
      addMarker({
        location: plan.location,
        placeId: plan.placeId
      })
    })
  })
})

</script>
<template>
  <div class="w-full h-full">
    <div class="w-full h-full" id="map"></div>
  </div>
</template>