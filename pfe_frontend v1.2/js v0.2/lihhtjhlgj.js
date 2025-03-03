
// function renderSprites() {








//   const spriteDetails = sprites
//     .map((sprite) => {
//       const dx = sprite.x - playerPos.x;
//       const dy = sprite.y - playerPos.y;
//       const distance = Math.sqrt(dx * dx + dy * dy);
//       const angleToSprite = Math.atan2(dy, dx);

//       let relativeAngle = angleToSprite - playerAngle;
//       while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
//       while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;

//       return {
//         sprite,
//         distance,
//         relativeAngle,
//         angleToSprite,
//       };
//     })
//     .filter((data) => {
//       return Math.abs(data.relativeAngle) < FOV * 1.5 || data.distance < 1;
//     })
//     .sort((a, b) => b.distance - a.distance);










//   spriteDetails.forEach(
//     ({ sprite, distance, relativeAngle, angleToSprite }) => {
//       const screenX = (0.5 + relativeAngle / FOV) * canvas.width;
//       const spriteHeight = ((canvas.height * 0.5) / distance) * sprite.scale;
//       const spriteWidth = spriteHeight;
//       const spriteTop = (canvas.height - spriteHeight) / 2;

//       const leftBound = Math.max(0, Math.floor(screenX - spriteWidth / 2));
//       const rightBound = Math.min(
//         canvas.width,
//         Math.ceil(screenX + spriteWidth / 2)
//       );




//       if (sprite.type === "player") {

//         const angleDiff =
//           (sprite.angle - angleToSprite + Math.PI * 2) % (Math.PI * 2);

//         const currentImage =
//           angleDiff > Math.PI / 2 && angleDiff < (Math.PI * 3) / 2
//             ? sprite.imageFront
//             : sprite.imageBack;

//         if (currentImage.complete) {
//           for (let sx = leftBound; sx < rightBound; sx++) {
//             const textureX =
//               ((sx - (screenX - spriteWidth / 2)) / spriteWidth) *
//               currentImage.width;

//             const columnDistance =
//               distance *
//               Math.cos(
//                 playerAngle + (sx / canvas.width - 0.5) * FOV - angleToSprite
//               );


//             if (columnDistance < wallDistances[sx]) {
//               ctx.drawImage(
//                 currentImage,
//                 textureX,
//                 0,
//                 1,
//                 currentImage.height,
//                 sx,
//                 spriteTop,
//                 1,
//                 spriteHeight
//               );
//             }
//           }
//         }





//       } 
// 
// 
// 
// 
// 
//          else {
//         // Key rendering code
//         for (let sx = leftBound; sx < rightBound; sx++) {
//           const textureX =
//             ((sx - (screenX - spriteWidth / 2)) / spriteWidth) *
//             sprite.image.width;
//           const columnDistance =
//             distance *
//             Math.cos(
//               playerAngle + (sx / canvas.width - 0.5) * FOV - angleToSprite
//             );

//           if (columnDistance < wallDistances[sx]) {
//             const animationTime = Date.now() * 0.005;
//             const floatAmplitude = Math.max(0.05 * (1 - distance / 5), 0);
//             const floatOffset =
//               Math.sin(animationTime + sprite.x + sprite.y) * floatAmplitude;
//             ctx.drawImage(
//               sprite.image,
//               textureX,
//               0,
//               1,
//               sprite.image.height,
//               sx,
//               spriteTop + floatOffset * canvas.height,
//               1,
//               spriteHeight
//             );
//           }
//         }





//       }
//     }
//   );


// }