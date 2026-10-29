'use client'

import 'leaflet/dist/leaflet.css'

import { Button, useField } from '@payloadcms/ui'
import type { Map as LeafletMap, Marker } from 'leaflet'
import type { UIFieldClientComponent } from 'payload'
import { useCallback, useEffect, useRef, useState } from 'react'

// Если точка ещё не выбрана — показываем центр Москвы
const FALLBACK = { lat: 55.751244, lng: 37.618423, zoom: 10 }

const round = (n: number) => Math.round(n * 1e6) / 1e6

// Выбор точки цеха на карте: клик или перетаскивание маркера, плюс поиск по адресу.
// Пишет значения в соседние поля группы: lat, lng, zoom.
export const LocationPicker: UIFieldClientComponent = ({ path }) => {
  const base = (path ?? 'location.picker').split('.').slice(0, -1).join('.')
  const lat = useField<number | null>({ path: `${base}.lat` })
  const lng = useField<number | null>({ path: `${base}.lng` })
  const zoom = useField<number | null>({ path: `${base}.zoom` })
  const address = useField<string | null>({ path: 'address' })

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Колбэки useField меняются между рендерами — держим актуальные в ref для обработчиков Leaflet
  const setters = useRef({ lat: lat.setValue, lng: lng.setValue, zoom: zoom.setValue })
  useEffect(() => {
    setters.current = { lat: lat.setValue, lng: lng.setValue, zoom: zoom.setValue }
  }, [lat.setValue, lng.setValue, zoom.setValue])

  const placeMarker = useCallback((point: { lat: number; lng: number }) => {
    setters.current.lat(round(point.lat))
    setters.current.lng(round(point.lng))
  }, [])

  // Создаём карту один раз
  useEffect(() => {
    let cancelled = false
    void import('leaflet').then(({ default: L }) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const hasPoint = typeof lat.value === 'number' && typeof lng.value === 'number'
      const center: [number, number] = hasPoint ? [lat.value!, lng.value!] : [FALLBACK.lat, FALLBACK.lng]
      const map = L.map(containerRef.current).setView(center, hasPoint ? (zoom.value ?? 16) : FALLBACK.zoom)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; участники OpenStreetMap',
      }).addTo(map)

      const marker = L.marker(center, {
        draggable: true,
        icon: L.divIcon({
          className: '',
          html: '<div class="sofario-pin"></div>',
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        }),
      })
      if (hasPoint) marker.addTo(map)
      marker.on('dragend', () => placeMarker(marker.getLatLng()))
      map.on('click', (e) => {
        marker.setLatLng(e.latlng).addTo(map)
        placeMarker(e.latlng)
      })
      map.on('zoomend', () => setters.current.zoom(map.getZoom()))

      mapRef.current = map
      markerRef.current = marker
    })
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- карта создаётся один раз, дальше синхронизируется эффектом ниже
  }, [placeMarker])

  // Координаты введены вручную — двигаем маркер
  useEffect(() => {
    const map = mapRef.current
    const marker = markerRef.current
    if (!map || !marker || typeof lat.value !== 'number' || typeof lng.value !== 'number') return
    const current = marker.getLatLng()
    if (current.lat === lat.value && current.lng === lng.value && map.hasLayer(marker)) return
    marker.setLatLng([lat.value, lng.value]).addTo(map)
    map.panTo([lat.value, lng.value])
  }, [lat.value, lng.value])

  const findByAddress = async () => {
    const query = address.value?.trim()
    if (!query) {
      setError('Сначала заполните «Адрес цеха» на вкладке «Контакты»')
      return
    }
    setSearching(true)
    setError(null)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=ru&q=${encodeURIComponent(query)}`
      const [hit] = (await (await fetch(url)).json()) as { lat: string; lon: string }[]
      if (!hit) {
        setError('Адрес не найден — поставьте точку на карте вручную')
        return
      }
      const point = { lat: Number(hit.lat), lng: Number(hit.lon) }
      placeMarker(point)
      setters.current.zoom(17)
      mapRef.current?.setView([point.lat, point.lng], 17)
    } catch {
      setError('Сервис поиска недоступен — поставьте точку на карте вручную')
    } finally {
      setSearching(false)
    }
  }

  const clear = () => {
    setters.current.lat(null)
    setters.current.lng(null)
    markerRef.current?.remove()
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <style>{`
        .sofario-pin {
          width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
          background: #6B4F3A; border: 3px solid #F5EFE6; transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,.35);
        }
      `}</style>
      <p style={{ marginBottom: 8, fontWeight: 600 }}>Точка цеха на карте</p>
      <p style={{ marginBottom: 12, color: 'var(--theme-elevation-500)' }}>
        Кликните по карте или перетащите маркер. Можно найти точку по адресу с вкладки «Контакты»
        {address.value ? `: ${address.value}` : ''}.
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Button buttonStyle="secondary" size="small" margin={false} disabled={searching} onClick={findByAddress}>
          {searching ? 'Ищем…' : 'Найти по адресу'}
        </Button>
        <Button buttonStyle="subtle" size="small" margin={false} onClick={clear}>
          Убрать точку
        </Button>
      </div>
      {error && <p style={{ color: 'var(--theme-error-500)', marginBottom: 12 }}>{error}</p>}
      <div
        ref={containerRef}
        style={{ height: 380, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--theme-elevation-150)' }}
      />
    </div>
  )
}
