import { Viewer, Entity, ModelGraphics } from "resium";
import {
  Cartesian3,
  Transforms,
  HeadingPitchRoll,
  createWorldTerrainAsync,
} from "cesium";
import { useEffect, useState } from "react";

const dronePositions = [
  { lat: 51.1283, lon: 71.4305, alt: 200 },
  // Baiterek 3d view
];

export default function ViewerMap() {
  const [terrainProvider, setTerrainProvider] = useState<any>(null);
  const [positionIndex, setPositionIndex] = useState(0);
  const [position, setPosition] = useState(
    Cartesian3.fromDegrees(
      dronePositions[0].lon,
      dronePositions[0].lat,
      dronePositions[0].alt
    )
  );

  useEffect(() => {
    // Load terrain asynchronously
    createWorldTerrainAsync().then(setTerrainProvider);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionIndex((prev) => {
        const next = (prev + 1) % dronePositions.length;
        const pos = dronePositions[next];
        setPosition(Cartesian3.fromDegrees(pos.lon, pos.lat, pos.alt));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Viewer full terrainProvider={terrainProvider}>
      <Entity
        position={position}
        orientation={Transforms.headingPitchRollQuaternion(
          position,
          new HeadingPitchRoll(0, 0, 0)
        )}
        name="Drone"
      >
        <ModelGraphics
          uri="/models/drone.glb" // make sure this path is correct
          scale={1}
          minimumPixelSize={64}
        />
      </Entity>
    </Viewer>
  );
}
