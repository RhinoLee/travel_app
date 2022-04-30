<script setup>
import { onMounted, reactive, watch } from "vue";
import { useTravelStore } from "@/stores/travel/travel"

const travelStore = useTravelStore()

const props = defineProps({
  scheduleList: {
    type: Object,
    default: () => ({})
  },
  locationSearchList: {
    type: Array,
    default: () => ([])
  },
  placeDetail: {
    type: Object,
    default: () => ({})
  },
})

const map = reactive({ data: null })
const mapDefaultCenter = { lat: 23.97565, lng: 120.9738819 }
const mapDefaultZoom = 8
const markerGroup = {
  schedule: [],
  search: []
}

// 偵測目前選擇的計畫，計畫變更地圖需重新插點
watch(
  () => props.scheduleList,
  (newVal) => {
    removeAllMarkers()
    renderScheduleLocation()
  }
)

// 偵測目前搜尋的地點
watch(
  () => props.locationSearchList,
  (newVal) => {
    removeAllMarkers("search")
    renderSearchLocation()
  }
)

// 偵測 user 點擊左側行程 -> 找出對應點位
watch(
  () => props.placeDetail,
  (newVal) => {
    if (!newVal) {
      clearMarkersAnitmation()
      setZoom(mapDefaultZoom, mapDefaultCenter)
      return
    }
    markerTirigger(newVal.place_id)
  }
)

function initMap() {
  map.data = new google.maps.Map(document.getElementById("map"), {
    center: mapDefaultCenter,
    zoom: mapDefaultZoom,
  });
}

function setZoom(zoom, postion) {
  map.data.setZoom(zoom);
  map.data.panTo(postion);
}

// Marker Animation
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function clearMarkersAnitmation() {
  Object.keys(markerGroup).forEach(key => {
    markerGroup[key].forEach(marker => {
      marker.setAnimation(null);
    })
  })
}

function markerTirigger(place_id) {
  markerGroup.schedule.forEach(marker => {
    if (marker.placeId === place_id) {
      clearMarkersAnitmation()
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setZoom(12, marker.position)
    }
  })
}

// 設定點位
function setMarker({ location, placeId, icon, title, group, animation }) {
  // create marker
  const marker = new google.maps.Marker({
    position: location,
    placeId,
    icon,
    title,
    animation
  });
  marker.placeId = placeId
  // add click event for get location detail
  marker.addListener("click", async (e) => {
    clearMarkersAnitmation()
    toggleBounce(marker)
    setZoom(12, marker.position)
    const res = await travelStore.getLocationInfo(marker.placeId)
  })

  markerGroup[group].push(marker)
}

// 點位設定到地圖上
function setMarkerToMap(map, group) {

  if (group) {
    markerGroup[group].forEach(marker => {
      marker.setMap(map);
    })

    return
  }

  // group 未指定，處理全部 Markers
  Object.keys(markerGroup).forEach(key => {
    markerGroup[key].forEach(marker => {
      marker.setMap(map);
    })
  })
}
// 移除所有點位
function removeAllMarkers(group) {
  setMarkerToMap(null, group)
  if (group) return markerGroup[group] = []

  // group 未指定，處理全部 Markers
  Object.keys(markerGroup).forEach(key => {
    markerGroup[key] = []
  })
}

// 把目前計畫中的點設定到地圖上
function renderScheduleLocation() {
  props.scheduleList.forEach(item => {
    item.scheduleList.forEach(schedule => {
      setMarker({
        location: { lat: schedule.lat, lng: schedule.lng },
        placeId: schedule.place_id,
        icon: ``,
        title: "1",
        group: "schedule",
        animation: google.maps.Animation.DROP,
      })
    })
  })

  setMarkerToMap(map.data, "schedule")
}

// 把搜尋結果設定到地圖上
function renderSearchLocation() {
  props.locationSearchList.forEach(item => {
    setMarker({
      location: item.geometry.location,
      placeId: item.place_id,
      icon: `http://www.google.com/mapfiles/marker.png`,
      title: "2",
      group: "search",
      animation: google.maps.Animation.DROP,
    })

  })

  setMarkerToMap(map.data, "search")
  setZoom(mapDefaultZoom, mapDefaultCenter)
}

onMounted(() => {
  initMap()
  renderScheduleLocation()
})

</script>
<template>
  <div class="w-full h-full">
    <div class="w-full h-full" id="map"></div>
  </div>
</template>