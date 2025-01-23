import { useLayoutEffect, useRef } from 'react';
import OpacityAnimation from './OpacityAnimation';

// eslint-disable-next-line react/prop-types
export default function DefaultHereMap({ height, width }) {
  const mapRef = useRef(null);

  useLayoutEffect(() => {
    if (!mapRef.current) return undefined;
    const { H } = window;
    const platform = new H.service.Platform({
      apikey: 'j_2nd1oo9KEEZjtXMr00yXv-lGuogKpehnyWQfs-zJM',
    });
    const defaultLayers = platform.createDefaultLayers();
    // Create an instance of the map
    const mapInstance = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: -15.805276795937022, lng: -47.896739224992736 },
        zoom: 3,
        pixelRatio: window.devicePixelRatio || 1,
      },
    );

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
    H.ui.UI.createDefault(mapInstance, defaultLayers);

    return () => {
      mapInstance.dispose();
    };
  }, [mapRef]);

  return (
    <OpacityAnimation delay={0.5}>
      <div ref={mapRef} style={{ height, width }} />
    </OpacityAnimation>
  );
}
