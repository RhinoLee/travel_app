<script setup>
import { onMounted, reactive, watch } from "vue";
import { useTravelStore } from "@/stores/travel/travel"
import robotImage from "@/assets/images/png/robot.png"

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
  directions: {
    type: Object,
  }
})

const emit = defineEmits([
  "closePanel"
])

const map = reactive({ data: null })
const taiwanCenter = { lat: 23.97565, lng: 120.9738819 }
const mapDefaultZoom = 8

const markerGroup = { // 分類 marker 圖層
  schedule: [],
  search: []
}
// 導航路線
const pathList = []

// 偵測目前選擇的計畫，計畫變更地圖需重新插點
watch(
  () => props.scheduleList,
  (newVal) => {
    removeAllMarkers()
    renderScheduleLocation()
    travelStore.getDirections()
  }
)

// 偵測目前搜尋的地點
watch(
  () => props.locationSearchList,
  (newVal) => {
    removeAllMarkers("search")
    emit("closePanel")
    renderSearchLocation()
  }
)

// 偵測 user 點擊左側行程 -> 找出對應點位
watch(
  () => props.placeDetail,
  (newVal) => {
    if (!newVal) {
      clearMarkersAnitmation()
      return
    }
    scheduleMarkerTirigger(newVal.place_id)
  }
)

// 偵測路線變化
watch(
  () => props.directions,
  (newObj) => {
    removeRoutesPolyLine()
    if (!newObj) return
    addRoutesPolyLine(newObj.routesPolyline, newObj.routesBounds)
  },
  { deep: true }
)

function initMap() {
  map.data = new google.maps.Map(document.getElementById("map"), {
    center: taiwanCenter,
    zoom: mapDefaultZoom,
  });
}

function setZoom(zoom, postion = null, bounds = null) {
  if (bounds) return map.data.fitBounds(bounds);
  map.data.setZoom(zoom);
  if (postion) return map.data.panTo(postion);
}

// Marker Animation
function clearMarkersAnitmation(group = null) {
  if (group) {
    Object.keys(markerGroup).forEach(key => {
      markerGroup[group].forEach(marker => {
        marker.setAnimation(null);
      })
    })
    return
  }

  if (!group) {
    Object.keys(markerGroup).forEach(key => {
      markerGroup[key].forEach(marker => {
        marker.setAnimation(null);
      })
    })
  }
}

function scheduleMarkerTirigger(place_id) {
  const marker = markerGroup.schedule.filter(marker => marker.placeId === place_id)[0]
  clearMarkersAnitmation("schedule")
  if (!marker) return
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setZoom(13, marker.position)
}

// 設定點位
function setMarker({ location, placeId, icon, title, label, group, animation }) {
  // create marker
  const marker = new google.maps.Marker({
    position: location,
    placeId,
    icon,
    label,
    title,
    animation
  });
  marker.placeId = placeId
  // add click event for get location detail
  marker.addListener("click", async (e) => {
    clearMarkersAnitmation()
    // toggleBounce(marker)
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setZoom(13, marker.position)
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
// 移除點位
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
    console.log("item", item);
    item.scheduleList.forEach((schedule, idx) => {
      setMarker({
        location: { lat: schedule.lat, lng: schedule.lng },
        placeId: schedule.place_id,
        // icon: "",
        // title: `${idx}`,
        label: `${idx + 1}`,
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
      // title: "2",
      group: "search",
      animation: google.maps.Animation.DROP,
    })

  })

  setMarkerToMap(map.data, "search")
  setZoom(mapDefaultZoom, taiwanCenter)
}

// 設定導航路線
function addRoutesPolyLine(routesPolyline, routesBounds) {
  const encodeCoordinates = google.maps.geometry.encoding.decodePath(routesPolyline);
  const path = new google.maps.Polyline({
    path: encodeCoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  pathList.push(path)
  const swLatLng = new google.maps.LatLng(routesBounds.southwest.lat, routesBounds.southwest.lng)
  const neLatLng = new google.maps.LatLng(routesBounds.northeast.lat, routesBounds.northeast.lng)
  const LatLngBoundsCenter = new google.maps.LatLngBounds()
  LatLngBoundsCenter.extend(swLatLng)
  LatLngBoundsCenter.extend(neLatLng)
  setZoom(14, null, LatLngBoundsCenter)
  path.setMap(map.data);
}

// 移除所有路線
function removeRoutesPolyLine() {
  if (pathList.length <= 0) return

  pathList.forEach(path => {
    path.setMap(null)
  })
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