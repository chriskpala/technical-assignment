import React, { useEffect, useMemo, useState } from "react";
import {
  MeshBasicMaterial,
  BufferAttribute,
  Box3,
  Color,
  Shape,
  ShaderMaterial,
  BufferGeometry,
  ShapeGeometry,
  CatmullRomCurve3,
  Vector3,
  Vector2
} from "three";
import { useThree } from "@react-three/fiber";

type ComponentProps = {
  initialPoints: number[];
};

type useChartMaterialProps = {
  lineColor: number;
  gradientStartColor: string;
  gradientEndColor: string;
};

type useChartAxisProps = {
  boundaryBox: Box3;
  chartAxisLinesCount: number;
};

type AdjustCameraParams = {
  camera: any;
  boundaryBox: any;
};

const chartFillMaterialParams = (startColor: string, endColor: string) => ({
  transparent: true,
  uniforms: {
    color1: {
      value: new Color(startColor),
    },
    color2: {
      value: new Color(endColor),
    },
  },
  vertexShader: `varying vec2 vUv;

  void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`,
  fragmentShader: `uniform vec3 color1;
  uniform vec3 color2;

  varying vec2 vUv;
  
  void main() {
  float alpha = smoothstep(0.0, 2.0, vUv.y * 0.001 + 0.6 );
  gl_FragColor = vec4(mix(color1, color2, vUv.y * 0.001 + 10.0), alpha);
  }
`,
  wireframe: false,
});

const getCurvedPoints = (points: number[]) => {
  let curvePoints = [];
  for (let i = 0; i < points.length; i++) {
    let x = i;
    let y = points[i];
    let z = 0;
    curvePoints.push(new Vector3(x, y, z));
  }

  let curve = new CatmullRomCurve3(curvePoints);
  return curve.getPoints(100);
};

const useChartGeometry = (
  points: Vector3[]
): {
  lineGeometry: BufferGeometry;
  fillGeometry: ShapeGeometry;
  linePoints: Vector3[];
  fillPoints: Vector3[];
} => {
  const [lineGeometry, setLineGeometry] = useState<BufferGeometry | null>(null);
  const [fillGeometry, setFillGeometry] = useState<ShapeGeometry | null>(null);
  const [linePoints, setLinePoints] = useState<Vector3[]>([]);
  const [fillPoints, setFillPoints] = useState<Vector3[]>([]);
  // let lineGeometry: BufferGeometry = new BufferGeometry(),
  // fillGeometry = null;
  useEffect(() => {
    let lPoints: any[] | ((prevState: Vector3[]) => Vector3[]) = [];
    let fPoints: React.SetStateAction<Vector3[]> | Vector2[] = [];
    let shape = new Shape();

    let minX = Number.MAX_VALUE,
      maxX = Number.MIN_VALUE,
      minY = Number.MAX_VALUE,
      maxY = Number.MIN_VALUE;

    for (let i = 0; i < points.length; i++) {
      let x = points[i].x;
      let y = points[i].y;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
      minX = Math.min(x, minX);
      maxX = Math.max(x, maxX);
      minY = Math.min(y, minY);
      maxY = Math.max(y, maxY);
      console.log(minX, maxX, minY, maxY, x, y);
      if (i === points.length - 1) {
        lPoints = shape.getPoints();

        shape.lineTo(x, minY - (maxY - minY));
        shape.lineTo(minX, minY - (maxY - minY));
        shape.lineTo(minX, y);
        setFillGeometry(shape.makeGeometry());
        fPoints = shape.getPoints();
      }
    }
    const singleArrayPoints = new Float32Array(
      lPoints.reduce((cap: Vector3[], x: Vector3) => {
        if (!cap) {
          return [x.x, x.y];
        } else {
          return [...cap, x.x, x.y];
        }
      })
    );

    let lGeometry = new BufferGeometry();
    lGeometry.setAttribute(
      "position",
      new BufferAttribute(singleArrayPoints, 2)
    );
    setLineGeometry(lGeometry);
    setLinePoints(lPoints);
    setFillPoints(fPoints);
  }, [points]);

  return {
    lineGeometry,
    fillGeometry,
    linePoints,
    fillPoints,
  };
};

const useChartMaterial = ({
  lineColor,
  gradientStartColor,
  gradientEndColor,
}: useChartMaterialProps) => {
  const lineMaterial = useMemo<MeshBasicMaterial>(
    () => new MeshBasicMaterial({ color: lineColor }),
    [lineColor]
  );
  const fillMaterial = useMemo<ShaderMaterial>(
    () =>
      new ShaderMaterial(
        chartFillMaterialParams(gradientStartColor, gradientEndColor)
      ),
    [gradientStartColor, gradientEndColor]
  );
  return {
    lineMaterial,
    fillMaterial,
  };
};

const adjustCamera = ({ camera, boundaryBox }: AdjustCameraParams) => {
  camera.left = boundaryBox.min.x;
  camera.right = boundaryBox.max.x;
  camera.top = boundaryBox.max.y + (boundaryBox.max.y - boundaryBox.min.y);
  camera.bottom = boundaryBox.min.y;
  camera.updateProjectionMatrix();
};

const useChartAxis = ({
  boundaryBox,
  chartAxisLinesCount,
}: useChartAxisProps): {
  axisLineArray: BufferGeometry[];
  axisLineMaterial: MeshBasicMaterial;
} => {
  const [axisLineArray, setAxisLineArray] = useState<BufferGeometry[]>([]);
  const [axisLineMaterial, setAxisLineMaterial] = useState<MeshBasicMaterial>(
    new MeshBasicMaterial({ color: 0xffffff })
  );
  useEffect(() => {
    let chartLineAxisStep =
      boundaryBox.max.y / 2 +
      (boundaryBox.max.y - boundaryBox.min.y) / chartAxisLinesCount;
    let axisLines = [];
    for (let i = 0; i < chartAxisLinesCount; i++) {
      let y = boundaryBox.min.y + i * chartLineAxisStep;
      let axisGeometry = new BufferGeometry();
      axisGeometry.setAttribute(
        "position",
        new BufferAttribute(
          new Float32Array([
            boundaryBox.min.x,
            y,
            0,
            boundaryBox.max.x,
            y,
            0,
          ]),
          3
        )
      );
      axisLines.push(axisGeometry);
    }
    setAxisLineArray(axisLines);
  }, [boundaryBox, chartAxisLinesCount]);
  return {
    axisLineArray,
    axisLineMaterial,
  };
};

export default function AppChart({ initialPoints }: ComponentProps) {
  const { camera } = useThree();
  const chartAxisLinesCount = 7;

  const points = useMemo(() => {
    console.warn("useMemo rerender");
    return getCurvedPoints(initialPoints);
  }, [initialPoints]);

  const { lineGeometry, fillGeometry, linePoints, fillPoints } =
    useChartGeometry(points);

  const { lineMaterial, fillMaterial } = useChartMaterial({
    gradientStartColor: `hsla(336, 100%, 61%, 1)`,
    gradientEndColor: `hsla(221, 22%, 31%, 0)`,
    lineColor: 0x3d4860,
  });

  const boundaryBox = useMemo(
    () => new Box3().setFromPoints(fillPoints),
    [fillPoints]
  );
  adjustCamera({ camera, boundaryBox });

  const { axisLineArray, axisLineMaterial } = useChartAxis({
    boundaryBox,
    chartAxisLinesCount,
  });

  if (!lineMaterial || !fillMaterial || !lineGeometry || !fillGeometry)
    return null;

  return (
    <group>
      <mesh geometry={fillGeometry} material={fillMaterial} />
      <line geometry={lineGeometry} material={lineMaterial} />
      {axisLineArray.map((x, i) => (
        <line key={i} material={axisLineMaterial} geometry={x} />
      ))}
    </group>
  );
}
