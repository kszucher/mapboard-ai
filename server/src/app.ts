import { MapBoard } from './mapboard';

async function main() {
  const mapBoard = new MapBoard({});

  await mapBoard.run();
}

main();
