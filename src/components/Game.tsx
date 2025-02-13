import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import { GAME, PADDLE_MAP } from "../config";
import { generateBall } from "../config/ball";
import { generatePins } from "../config/pins";
import { TBall } from "../types/ball";
import { TFloor } from "../types/floor";
import { TPin } from "../types/pin";
import { generateUniqueId } from "../utils";
import Ball from "./Ball";
import Floor from "./Floor";
import Pin from "./Pin";
import { Score } from "./Score";

const Engine = Matter.Engine,
  Runner = Matter.Runner,
  World = Matter.World,
  Render = Matter.Render,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Events = Matter.Events;
function spawnBall(ball: TBall) {
  const body = Bodies.circle(
    ball.position.x + ball.size / 2,
    ball.position.y + ball.size / 2,
    ball.size / 2,
    {
      friction: 0.05,
      restitution: 0.6,
      id: ball.id,
    }
  );
  return {
    ...ball,
    body,
  };
}

function spawnPegs() {
  // Generate pegs dynamically
  const pins = generatePins();
  const pegs: Matter.Body[] = [];

  pins.forEach((pin) => {
    pegs.push(
      Bodies.circle(
        pin.position.x + pin.size / 2,
        pin.position.y + pin.size / 2,
        pin.size / 2,
        {
          isStatic: true,
          restitution: 0.6,
          friction: 0.05,
          id: pin.id,
        }
      )
    );
  });
  return {
    pegs,
    pins,
  };
}

function createBoundaries() {
  const thickness = 18;
  const angle = Math.PI / 6;
  const wallHeight = GAME.SCREEN_HEIGHT - 10;

  const leftWall = Bodies.rectangle(120, 380, thickness, wallHeight, {
    isStatic: true,
    angle: angle - 0.06,
  });

  // Right angled wall
  const rightWall = Bodies.rectangle(580, 380, thickness, wallHeight, {
    isStatic: true,
    angle: -angle + 0.06,
  });

  // Ground (bottom boundary)
  const ground = Bodies.rectangle(
    GAME.SCREEN_WIDTH / 2,
    GAME.SCREEN_HEIGHT - thickness / 2,
    GAME.SCREEN_WIDTH,
    thickness,
    { isStatic: true }
  );
  return [leftWall, rightWall, ground];
}

function createFloors() {
  const {
    FLOOR_WIDTH,
    FLOOR_HEIGHT,
    PIN_VERTICAL_GAP,
    PINS_LEVEL_COUNT,
    PIN_START_Y,
    FLOOR_VERTICAL_GAP,
  } = GAME;

  const LAST_PIN_ROW_Y = PIN_START_Y + PIN_VERTICAL_GAP * PINS_LEVEL_COUNT;
  const FLOOR_Y = LAST_PIN_ROW_Y + PIN_VERTICAL_GAP + 70;

  const floors: TFloor[] = PADDLE_MAP.map((flo, i) => {
    const id = generateUniqueId();
    const x = i * (FLOOR_WIDTH + GAME.FLOOR_HORIZONTAL_GAP) + FLOOR_WIDTH + 10;
    const y = FLOOR_Y + FLOOR_VERTICAL_GAP;
    const width = FLOOR_WIDTH;
    const height = FLOOR_HEIGHT;
    return {
      body: Bodies.rectangle(x, y, width, height, { isStatic: true, id }),
      id,
      position: {
        x,
        y,
      },
      width,
      height,
      color: flo.color,
      rate: flo.rate,
      label: flo.label,
      isHit: false,
    };
  });
  return floors;
}
export default function Game() {
  const sceneRef = useRef(null);
  const lastSpawnTime = useRef(0);
  const ballSpawnCounter = useRef(0);
  const spawnDelay = useRef(1000);

  const [balls, setBalls] = useState<TBall[]>([]);
  const ballsRef = useRef<TBall[]>([]);
  const [pins, setPins] = useState<TPin[]>([]);
  const pinsRef = useRef<TPin[]>([]);
  const [floors, setFloors] = useState<TFloor[]>([]);
  const floorsRef = useRef<TFloor[]>([]);
  const [scores, setScores] = useState<TFloor[]>([]);

  useEffect(() => {
    const runner = Runner.create();
    const engine = Engine.create();
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current!,
      engine,
      options: {
        width: GAME.SCREEN_WIDTH,
        height: GAME.SCREEN_HEIGHT,
        showPerformance: false,
      },
    });

    const initializeObjects = () => {
      const { pins: pinsSpawn } = spawnPegs();
      setPins(pinsSpawn);
      pinsRef.current = pinsSpawn;

      const floorsSpawn = createFloors();
      floorsRef.current = floorsSpawn;
      setFloors(floorsSpawn);

      const floorsBodies = floorsSpawn.map((flo) => flo.body);
      World.add(world, [
        ...createBoundaries(),
        ...spawnPegs().pegs,
        ...floorsBodies,
      ]);
    };

    
    const handleCollisions = (event: Matter.IEventCollision<Matter.Engine>) => {
      const collidedBodyIds = new Set(
        event.pairs.flatMap(({ bodyA, bodyB }) => [bodyA.id, bodyB.id])
      );

      // Update pins state
      pinsRef.current = pinsRef.current.map((pin) => ({
        ...pin,
        isHit: collidedBodyIds.has(pin.id),
      }));
      setPins([...pinsRef.current]); // Trigger re-render

      // Handle ball-floor collisions
      event.pairs.forEach(({ bodyA, bodyB }) => {
        const ball = ballsRef.current.find(
          (b) => b.id === bodyA.id || b.id === bodyB.id
        );
        const floor = floorsRef.current.find(
          (f) => f.id === bodyA.id || f.id === bodyB.id
        );

        if (ball && floor) {
          floorsRef.current = floorsRef.current.map((floor) => ({
            ...floor,
            isHit: collidedBodyIds.has(floor.id),
          }));
          setFloors([...floorsRef.current]);

          Composite.remove(engine.world, ball.body as Matter.Body);
          ballsRef.current = ballsRef.current.filter((b) => b.id !== ball.id);
          setBalls([...ballsRef.current]);

          setScores((prev) => [
            { ...floor, id: generateUniqueId() + Math.random() },
            ...prev,
          ]);
        }
      });
    };

    const spawnBalls = (event: Matter.IEventTimestamped<Matter.Engine>) => {
      if (ballSpawnCounter.current >= GAME.NUMBER_OF_BALLS) return;

      const now = event.timestamp;
      if (now - lastSpawnTime.current >= spawnDelay.current) {
        const newBall = spawnBall(generateBall());
        Composite.add(engine.world, newBall.body);

        ballsRef.current = [...ballsRef.current, newBall];
        setBalls([...ballsRef.current]);

        ballSpawnCounter.current += 1;
        lastSpawnTime.current = now;

        // Gradually speed up ball spawning
        spawnDelay.current = Math.max(spawnDelay.current * 0.967, 50);
      }
    };

    initializeObjects();
    Runner.run(runner, engine);
    Render.run(render);

    Events.on(engine, "collisionStart", handleCollisions);
    Events.on(engine, "beforeUpdate", spawnBalls);

    return () => {
      Events.off(engine, "collisionStart", handleCollisions);
      Events.off(engine, "beforeUpdate", spawnBalls);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
    };
  }, []);
  const resetPinState = (pinId: number) => {
    pinsRef.current = pinsRef.current.map((p) =>
      p.id === pinId ? { ...p, isHit: false } : p
    );
    setPins([...pinsRef.current]);
  };

  return (
    <>
      {/* <div ref={sceneRef}></div> */}
      <div className="game-container">
        {balls.map((ball) => {
          return <Ball {...ball} key={ball.id} />;
        })}
        {pins.map((pin) => {
          const { id, ...props } = pin;
          return (
            <Pin key={id} {...props} resetState={() => resetPinState(id)} />
          );
        })}
        {floors.map((floor) => {
          const { id, ...props } = floor;
          return <Floor {...props} key={id} />;
        })}
        <Score scores={scores} />
      </div>
    </>
  );
}
