// import { useEffect, useRef, useState } from "react";
// import * as ml5 from "ml5";
// import p5 from "p5";
// import StepCard from "./StepCard";
// import treePoseSteps from "../../data/treePoseSteps";
// import treePoseReference from "../../data/treePoseReference";

// // Accuracy Calculation with logs and scale factor
// const calculateAccuracy = (userKeypoints, referenceKeypoints) => {
//   if (
//     !userKeypoints ||
//     !referenceKeypoints ||
//     userKeypoints.length !== referenceKeypoints.length
//   ) {
//     console.warn("❌ Keypoint mismatch or invalid data.");
//     return 0;
//   }

//   let totalDistance = 0;
//   for (let i = 0; i < userKeypoints.length; i++) {
//     const dx = userKeypoints[i] - referenceKeypoints[i];
//     totalDistance += dx * dx;
//   }

//   const mse = totalDistance / userKeypoints.length;
//   const scaleFactor = 0.2; // Adjust sensitivity as needed
//   const accuracy = Math.max(0, 100 - Math.sqrt(mse) * scaleFactor);


//   return Math.round(accuracy);
// };

// const ACCURACY_THRESHOLD = 50; // Minimum accuracy to mark step done

// const StepGuide = () => {
//   const canvasRef = useRef(null);
//   const poseRef = useRef(null);
//   const [poseIndex, setPoseIndex] = useState(0);
//   const [doneSteps, setDoneSteps] = useState([]);
//   const [accuracy, setAccuracy] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [showCanvas, setShowCanvas] = useState(false);

//   const startSession = () => {
//     setStarted(true);
//     setShowCanvas(true);
//   };

//   useEffect(() => {
//     if (!started) return;

//     let video, poseNet, brain, myp5;

//     const sketch = (p) => {
//       p.setup = () => {
//         const canvas = p.createCanvas(640, 480);
//         if (canvasRef.current) canvas.parent(canvasRef.current);

//         video = p.createCapture(p.VIDEO);
//         video.size(640, 480);
//         video.hide();

//         poseNet = ml5.poseNet(video, () => console.log("📸 PoseNet ready"));
//         poseNet.on("pose", (poses) => {
//           if (poses.length > 0) {
//             poseRef.current = poses[0].pose;
//           } else {
//             poseRef.current = null;
//           }
//         });

//         brain = ml5.neuralNetwork({
//           inputs: 34,
//           outputs: 4,
//           task: "classification",
//           debug: true,
//         });

//         brain.load(
//           {
//             model: "/model-tree/model.json",
//             metadata: "/model-tree/model_meta.json",
//             weights: "/model-tree/model.weights.bin",
//           },
//           () => {
//             console.log("🧠 Model loaded");
//             classifyPose();
//           }
//         );
//       };

//       p.draw = () => {
//         p.push();
//         p.translate(video.width, 0);
//         p.scale(-1, 1);
//         p.image(video, 0, 0);

//         const poseInstance = poseRef.current;
//         if (poseInstance) {
//           // Draw skeleton lines
//           const skeleton = poseInstance.skeleton || [];
//           skeleton.forEach(([a, b]) => {
//             p.stroke(0,255, 0);
//             p.strokeWeight(2);
//             p.line(a.position.x, a.position.y, b.position.x, b.position.y);
//           });

//           // Draw keypoint dots
//           poseInstance.keypoints.forEach((keypoint) => {
//             p.fill(0,255, 0);
//             p.noStroke();
//             p.ellipse(keypoint.position.x, keypoint.position.y, 16, 16);
//           });
//         }

//         p.pop();
//       };
//     };

//     const classifyPose = () => {
//       const poseInstance = poseRef.current;
//       if (poseInstance) {
//         const inputs = poseInstance.keypoints.flatMap((k) => [
//           Math.round(k.position.x),
//           Math.round(k.position.y),
//         ]);
//         const reference = treePoseReference[poseIndex]?.keypoints;

//         if (reference && reference.length === inputs.length) {
//           const acc = calculateAccuracy(inputs, reference);
//           setAccuracy(acc);

//           if (acc >= ACCURACY_THRESHOLD && !doneSteps.includes(poseIndex)) {
//             console.log(`✅ Step ${poseIndex + 1} done with accuracy ${acc}%`);
//             setDoneSteps((prev) => [...prev, poseIndex]);
//             setPoseIndex((prev) =>
//               Math.min(prev + 1, treePoseSteps.length - 1)
//             );
//           }
//         } else {
//           console.warn("⚠️ Reference keypoints invalid for step", poseIndex);
//         }

//         brain.classify(inputs, (err, results) => {
//           if (err) {
//             console.error("❌ Classification error:", err);
//             return setTimeout(classifyPose, 200);
//           }

//           // We still keep classification to keep AI running, but
//           // step done is handled by accuracy threshold above

//           classifyPose(); // keep looping
//         });
//       } else {
//         setTimeout(classifyPose, 200);
//       }
//     };

//     myp5 = new p5(sketch);

//     return () => {
//       if (video) video.remove();
//       if (myp5) myp5.remove();
//     };
//   }, [started, poseIndex, doneSteps]);

//   return (
//     <div className="p-6">
//       {!started ? (
//         <div className="text-center">
//           <button
//             onClick={startSession}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 text-lg"
//           >
//             Start Step-by-Step Guide
//           </button>
//         </div>
//       ) : (
//         <div className="grid max-sm:grid-cols-1 md:grid-cols-2 gap-6">
//           {showCanvas && (
//             <div>
//               <div
//                 ref={canvasRef}
//                 className="rounded-xl overflow-hidden shadow-md"
//               />
//               <div className="text-lg font-semibold text-blue-600 mt-4 text-center">
//                 Accuracy: {accuracy}%
//                 {accuracy >= ACCURACY_THRESHOLD ? (
//                   <p className="text-green-600">
//                     ✅ Good enough! Proceed to next step.
//                   </p>
//                 ) : (
//                   <p className="text-red-500">
//                     🔄 Adjust your pose for better accuracy
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//           <div className="space-y-4 grid md:grid-cols-2 gap-4">
//             {treePoseSteps.map((step, index) => (
//               <StepCard
//                 key={index}
//                 step={step}
//                 isCurrent={index === poseIndex}
//                 isDone={doneSteps.includes(index)}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StepGuide;



import { useEffect, useRef, useState } from "react";
import * as ml5 from "ml5";
import p5 from "p5";
import StepCard from "./StepCard";
import treePoseSteps from "../../data/treePoseSteps";
import treePoseReference from "../../data/treePoseReference";

// Accuracy Calculation
const calculateAccuracy = (userKeypoints, referenceKeypoints) => {
  if (
    !userKeypoints ||
    !referenceKeypoints ||
    userKeypoints.length !== referenceKeypoints.length
  ) {
    console.warn("❌ Keypoint mismatch or invalid data.");
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < userKeypoints.length; i++) {
    const dx = userKeypoints[i] - referenceKeypoints[i];
    totalDistance += dx * dx;
  }

  const mse = totalDistance / userKeypoints.length;
  const scaleFactor = 0.2;
  const accuracy = Math.max(0, 100 - Math.sqrt(mse) * scaleFactor);
  return Math.round(accuracy);
};

const ACCURACY_THRESHOLD = 40;

const StepGuide = () => {
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const [poseIndex, setPoseIndex] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [feedback, setFeedback] = useState("");

  const startSession = () => {
    setStarted(true);
    setShowCanvas(true);
  };

  useEffect(() => {
    if (!started) return;

    let video, poseNet, brain, myp5;

    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(640, 480);
        if (canvasRef.current) canvas.parent(canvasRef.current);

        video = p.createCapture(p.VIDEO);
        video.size(640, 480);
        video.hide();

        poseNet = ml5.poseNet(video, () => console.log("📸 PoseNet ready"));
        poseNet.on("pose", (poses) => {
          if (poses.length > 0) {
            poseRef.current = poses[0].pose;
          } else {
            poseRef.current = null;
          }
        });

        brain = ml5.neuralNetwork({
          inputs: 34,
          outputs: 4,
          task: "classification",
          debug: false,
        });

        brain.load(
          {
            model: "/model-tree/model.json",
            metadata: "/model-tree/model_meta.json",
            weights: "/model-tree/model.weights.bin",
          },
          () => {
            console.log("🧠 Model loaded");
            classifyPose();
          }
        );
      };

      p.draw = () => {
        p.push();
        p.translate(video.width, 0);
        p.scale(-1, 1);
        p.image(video, 0, 0);

        const poseInstance = poseRef.current;
        if (poseInstance) {
          const skeleton = poseInstance.skeleton || [];
          skeleton.forEach(([a, b]) => {
            p.stroke(0, 255, 0);
            p.strokeWeight(2);
            p.line(a.position.x, a.position.y, b.position.x, b.position.y);
          });

          poseInstance.keypoints.forEach((keypoint) => {
            p.fill(0, 255, 0);
            p.noStroke();
            p.ellipse(keypoint.position.x, keypoint.position.y, 12, 12);
          });
        }

        p.pop();
      };
    };

    const classifyPose = () => {
      const poseInstance = poseRef.current;

      if (poseInstance) {
        const inputs = poseInstance.keypoints.flatMap((k) => [
          Math.round(k.position.x),
          Math.round(k.position.y),
        ]);
        const reference = treePoseReference[poseIndex]?.keypoints;

        if (reference && reference.length === inputs.length) {
          const acc = calculateAccuracy(inputs, reference);
          setAccuracy(acc);

          if (acc >= ACCURACY_THRESHOLD) {
            setFeedback("✅ Good posture! Move to the next step.");
            if (!doneSteps.includes(poseIndex)) {
              setDoneSteps((prev) => [...prev, poseIndex]);
              setPoseIndex((prev) =>
                Math.min(prev + 1, treePoseSteps.length - 1)
              );
            }
          } else {
            setFeedback("🔄 Try adjusting your pose.");
          }
        } else {
          setFeedback("⚠️ Invalid reference keypoints.");
        }

        // Keep classifying
        brain.classify(inputs, (err) => {
          if (err) {
            console.error("❌ Classification error:", err);
            return setTimeout(classifyPose, 200);
          }
          setTimeout(classifyPose, 500);
        });
      } else {
        setTimeout(classifyPose, 200);
      }
    };

    myp5 = new p5(sketch);

    return () => {
      if (video) video.remove();
      if (myp5) myp5.remove();
    };
  }, [started, poseIndex, doneSteps]);

  return (
    <div className="p-6">
      {!started ? (
        <div className="text-center">
          <button
            onClick={startSession}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 text-lg"
          >
            Start Step-by-Step Guide
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-sm:grid-cols-1">
          {showCanvas && (
            <div>
              <div
                ref={canvasRef}
                className="rounded-xl overflow-hidden shadow-md"
              />
              <div className="text-lg font-semibold text-center mt-4">
                Accuracy:{" "}
                <span className="text-blue-600">{accuracy}%</span>
                <div
                  className={`mt-2 ${
                    accuracy >= ACCURACY_THRESHOLD
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {feedback}
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {treePoseSteps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                isCurrent={index === poseIndex}
                isDone={doneSteps.includes(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepGuide;
