import {WIDTH, HEIGHT, MAX_POWER} from './constants';
import {calcVectorDegrees} from './util/math';

const skyColor = 'beige';
const groundColor = 'orange';
const ballColor = 'red';
const meterBoxColor = 'skyblue';
const meterFillColor = 'blue';

export default function render(ctx, state) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  ctx.save();

  ctx.fillStyle = skyColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const level = state.game.level;
  if (!level) {
    return;
  }

  //
  // Draw ground
  //

  const points = level.points;

  ctx.fillStyle = groundColor;

  ctx.beginPath();
  const firstPoint = points.get(0);
  ctx.moveTo(firstPoint.get(0), firstPoint.get(1));

  points.slice(1).forEach((point) => {
    ctx.lineTo(point.get(0), point.get(1));
  });

  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);

  ctx.fill();
  ctx.closePath();

  ctx.restore();

  //
  // Draw ball
  //
  const ball = state.game.ball;

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 2.5, 0, 2 * Math.PI);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();

  //
  // Draw aim arrow
  //
  if (state.game.allowHit) {
    const aimDirection = state.game.aimDirection;

    const offset = 10;
    const lineLength = 20;
    const startOffset = calcVectorDegrees(offset, aimDirection);
    const endOffset = calcVectorDegrees(offset + lineLength, aimDirection);

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(ball.x + startOffset.x, ball.y + startOffset.y);
    ctx.lineTo(ball.x + endOffset.x, ball.y + endOffset.y);
    ctx.stroke();
    ctx.closePath();
  }

  //
  // Draw swing meter
  //
  if (state.game.inSwing) {
    const meterWidth = 50;
    const meterHeight = 10;
    const meterX = state.game.ball.x - meterWidth / 2;
    const meterY = state.game.ball.y + 10;

    ctx.fillStyle = meterBoxColor;
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    const fillWidth = (state.game.swingPower / MAX_POWER) * meterWidth;

    ctx.fillStyle = meterFillColor;
    ctx.fillRect(meterX, meterY, fillWidth, meterHeight);
  }
}
