// import { useRef, useEffect, useState } from "react";
// import * as ml5 from "ml5";
// import p5 from "p5";
// import { NavLink, useLocation } from "react-router-dom";
// import { refreshPage } from "./../../utils/helper.js";
// import backIcon from "./../../assets/icons/back.png";

// const PoseCam = ({ pose }) => {
//   const { id, english_name, image, instructions } = pose;
//   const canvasRef = useRef(null);
//   const location = useLocation();
//   const [poseLabel, setPoseLabel] = useState("Detecting Pose...");
//   const p5InstanceRef = useRef(null);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     let brain;
//     let currentPose;
//     let currentSkeleton;

//     const sketch = (p) => {
//       p.setup = () => {
//         const containerWidth = canvasRef.current
//           ? canvasRef.current.offsetWidth
//           : 640;
//         const canvasHeight = (containerWidth * 480) / 640;

//         const canvas = p.createCanvas(containerWidth, canvasHeight);
//         if (canvasRef.current) {
//           canvas.parent(canvasRef.current);
//         }

//         // Create video and resize to match canvas size
//         const video = p.createCapture(p.VIDEO);
//         video.size(containerWidth, canvasHeight);
//         video.hide();
//         videoRef.current = video;

//         const poseNet = ml5.poseNet(video, () => {
//           console.log("PoseNet ready");
//         });

//         poseNet.on("pose", (poses) => {
//           if (poses.length > 0) {
//             currentPose = poses[0].pose;
//             currentSkeleton = poses[0].skeleton;
//           }
//         });

//         brain = ml5.neuralNetwork({
//           inputs: 34,
//           outputs: 7,
//           task: "classification",
//           debug: true,
//         });

//         const modelInfo = {
//           model: `/model-${id}/model.json`,
//           metadata: `/model-${id}/model_meta.json`,
//           weights: `/model-${id}/model.weights.bin`,
//         };

//         fetch(modelInfo.model)
//           .then((res) => {
//             if (!res.ok) throw new Error(`Status: ${res.status}`);
//             return res.json();
//           })
//           .then(() => {
//             brain.load(modelInfo, () => {
//               console.log("Pose classification ready!");
//               classifyPose();
//             });
//           })
//           .catch((err) => console.error("Model load error:", err));
//       };

//       p.draw = () => {
//         if (!videoRef.current) return;
//         p.push();
//         p.translate(videoRef.current.width, 0);
//         p.scale(-1, 1);
//         p.image(videoRef.current, 0, 0, videoRef.current.width, videoRef.current.height);

//         if (currentPose) {
//           currentSkeleton.forEach(([a, b]) => {
//             p.strokeWeight(2);
//             p.stroke(0);
//             p.line(a.position.x, a.position.y, b.position.x, b.position.y);
//           });
//           currentPose.keypoints.forEach(({ position: { x, y } }) => {
//             p.fill(0);
//             p.stroke(255);
//             p.ellipse(x, y, 16, 16);
//           });
//         }
//         p.pop();
//       };

//       // Classification loop
//       const classifyPose = () => {
//         if (currentPose) {
//           const inputs = currentPose.keypoints.flatMap(({ position: { x, y } }) => [x, y]);
//           brain.classify(inputs, (error, results) => {
//             if (results && results[0].confidence > 0.9) {
//               const label = results[0].label;
//               setPoseLabel(label);
//               document.body.classList.toggle("great-form", label === "Great Form!");
//             }
//             setTimeout(classifyPose, 100);
//           });
//         } else {
//           setTimeout(classifyPose, 100);
//         }
//       };

//       // Expose classifyPose so it can be called after model loads
//       p.classifyPose = classifyPose;
//     };

//     const myp5 = new p5(sketch);
//     p5InstanceRef.current = myp5;

//     // Resize handler
//     const handleResize = () => {
//       if (!canvasRef.current || !myp5) return;
//       const containerWidth = canvasRef.current.offsetWidth;
//       const canvasHeight = (containerWidth * 480) / 640;

//       myp5.resizeCanvas(containerWidth, canvasHeight);

//       if (videoRef.current) {
//         videoRef.current.size(containerWidth, canvasHeight);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     // Initial resize after p5 canvas created
//     setTimeout(handleResize, 100);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       if (videoRef.current) videoRef.current.remove();
//       if (p5InstanceRef.current) p5InstanceRef.current.remove();
//       document.body.classList.remove("great-form");
//     };
//   }, [id]);

//   const isPracticePath = /^\/practice\//.test(location.pathname);

//   return (
//     <div className="w-full min-h-80 bg-gray-100">
//       <div className="flex items-center justify-between px-4 py-4 bg-white shadow-md">
//         {isPracticePath && (
//           <NavLink
//             to="/poses"
//             className="flex items-center space-x-2"
//             onClick={refreshPage}
//           >
//             <img src={backIcon} alt="Back" className="w-6 h-6" />
//             <span className="text-lg font-semibold">Back</span>
//           </NavLink>
//         )}
//         <h1 className="text-xl font-bold text-center w-full">{english_name}</h1>
//       </div>

//       <div className="flex flex-col lg:flex-row p-4 gap-6">
//         {/* Camera & Feedback */}
//         <div className="flex-1 flex flex-col items-center gap-4">
//           <div
//             ref={canvasRef}
//             className="w-full max-w-full sm:max-w-[640px] mx-auto"
//             style={{ width: "100%", maxWidth: "640px" }}
//           ></div>

//           <div
//             className={`text-lg font-semibold px-4 py-2 rounded shadow border ${
//               poseLabel === "Great Form!"
//                 ? "bg-green-100 text-green-700 border-green-400"
//                 : "bg-yellow-100 text-yellow-700 border-yellow-400"
//             }`}
//           >
//             {poseLabel === "Great Form!" ? "✅" : "💡"} {poseLabel}
//           </div>
//         </div>

//         {/* Image & Instructions */}
//         <div className="flex-1 flex flex-col items-center lg:items-start">
//           <img
//             src={image}
//             alt={`${english_name} pose`}
//             className="rounded-xl shadow-lg w-full max-w-md"
//           />
//           <div className="mt-6 w-full max-w-md">
//             <h4 className="text-lg font-semibold mb-2">Step by Step</h4>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               {instructions.map((step, index) => (
//                 <li key={index} className="text-base">
//                   {step}
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PoseCam;


// import { useRef, useEffect, useState } from "react";
// import * as ml5 from "ml5";
// import p5 from "p5";
// import { NavLink, useLocation } from "react-router-dom";
// import { refreshPage } from "./../../utils/helper.js";
// import backIcon from "./../../assets/icons/back.png";

// const PoseCam = ({ pose }) => {
//   const { id, english_name, image, instructions } = pose;
//   const canvasRef = useRef(null);
//   const location = useLocation();
//   const [poseLabel, setPoseLabel] = useState("Detecting Pose...");
//   const [accuracy, setAccuracy] = useState(0);
//   const confidenceHistoryRef = useRef([]);
//   const p5InstanceRef = useRef(null);
//   const videoRef = useRef(null);
//   const brainRef = useRef(null);
//   const currentPoseRef = useRef(null);
//   const currentSkeletonRef = useRef(null);
//   const classifyTimeoutRef = useRef(null);
//   const isComponentMounted = useRef(true);

//   useEffect(() => {
//     isComponentMounted.current = true;

//     const sketch = (p) => {
//       p.setup = () => {
//         const containerWidth = canvasRef.current ? canvasRef.current.offsetWidth : 640;
//         const canvasHeight = (containerWidth * 480) / 640;

//         const canvas = p.createCanvas(containerWidth, canvasHeight);
//         if (canvasRef.current) {
//           canvas.parent(canvasRef.current);
//         }

//         const video = p.createCapture(p.VIDEO);
//         video.size(containerWidth, canvasHeight);
//         video.hide();
//         videoRef.current = video;

//         const poseNet = ml5.poseNet(video, () => {
//           console.log("PoseNet ready");
//         });

//         poseNet.on("pose", (poses) => {
//           if (poses.length > 0) {
//             currentPoseRef.current = poses[0].pose;
//             currentSkeletonRef.current = poses[0].skeleton;
//           } else {
//             currentPoseRef.current = null;
//             currentSkeletonRef.current = null;
//           }
//         });

//         brainRef.current = ml5.neuralNetwork({
//           inputs: 34,
//           outputs: 7,
//           task: "classification",
//           debug: true,
//         });

//         const modelInfo = {
//           model: `/model-${id}/model.json`,
//           metadata: `/model-${id}/model_meta.json`,
//           weights: `/model-${id}/model.weights.bin`,
//         };

//         brainRef.current.load(modelInfo, () => {
//           console.log("Pose classification ready!");
//           classifyPose();
//         });
//       };

//       p.draw = () => {
//         if (!videoRef.current) return;
//         p.push();
//         p.translate(videoRef.current.width, 0);
//         p.scale(-1, 1);
//         p.image(videoRef.current, 0, 0, videoRef.current.width, videoRef.current.height);

//         if (currentPoseRef.current && currentSkeletonRef.current) {
//           currentSkeletonRef.current.forEach(([a, b]) => {
//             p.strokeWeight(2);
//             p.stroke(0);
//             p.line(a.position.x, a.position.y, b.position.x, b.position.y);
//           });
//           currentPoseRef.current.keypoints.forEach(({ position: { x, y } }) => {
//             p.fill(0);
//             p.stroke(255);
//             p.ellipse(x, y, 16, 16);
//           });
//         }
//         p.pop();
//       };
//     };

//     // Classification function separated
//     const classifyPose = () => {
//       if (!isComponentMounted.current) return; // stop if unmounted

//       const brain = brainRef.current;
//       const currentPose = currentPoseRef.current;

//       if (brain && currentPose) {
//         const inputs = currentPose.keypoints.flatMap(({ position: { x, y } }) => [x, y]);
//         brain.classify(inputs, (error, results) => {
//           if (error) {
//             console.error(error);
//             scheduleNext();
//             return;
//           }

//           if (results && results.length > 0) {
//             const topResult = results[0];
//             const label = topResult.label;
//             const confidence = topResult.confidence;

//             setPoseLabel(label);
//             document.body.classList.toggle("great-form", label === "Great Form!");

//             if (label === "Great Form!" && confidence > 0.9) {
//               confidenceHistoryRef.current.push(confidence);
//               if (confidenceHistoryRef.current.length > 30) confidenceHistoryRef.current.shift();

//               const avgConfidence =
//                 confidenceHistoryRef.current.reduce((acc, val) => acc + val, 0) /
//                 confidenceHistoryRef.current.length;

//               setAccuracy(avgConfidence * 100);
//             } else {
//               confidenceHistoryRef.current = [];
//               setAccuracy(0);
//             }
//           } else {
//             setPoseLabel("Detecting Pose...");
//             confidenceHistoryRef.current = [];
//             setAccuracy(0);
//             document.body.classList.remove("great-form");
//           }
//           scheduleNext();
//         });
//       } else {
//         setPoseLabel("Detecting Pose...");
//         confidenceHistoryRef.current = [];
//         setAccuracy(0);
//         document.body.classList.remove("great-form");
//         scheduleNext();
//       }
//     };

//     // Schedule next classification run
//     const scheduleNext = () => {
//       classifyTimeoutRef.current = setTimeout(classifyPose, 100);
//     };

//     // Initialize p5
//     p5InstanceRef.current = new p5(sketch);

//     // Handle resizing
//     const handleResize = () => {
//       if (!canvasRef.current || !p5InstanceRef.current) return;

//       const containerWidth = canvasRef.current.offsetWidth;
//       const canvasHeight = (containerWidth * 480) / 640;

//       p5InstanceRef.current.resizeCanvas(containerWidth, canvasHeight);
//       if (videoRef.current) {
//         videoRef.current.size(containerWidth, canvasHeight);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     setTimeout(handleResize, 100);

//     return () => {
//       // Cleanup
//       isComponentMounted.current = false;

//       window.removeEventListener("resize", handleResize);

//       if (classifyTimeoutRef.current) {
//         clearTimeout(classifyTimeoutRef.current);
//       }
//       if (videoRef.current) {
//         videoRef.current.remove();
//       }
//       if (p5InstanceRef.current) {
//         p5InstanceRef.current.remove();
//       }
//       confidenceHistoryRef.current = [];
//       setAccuracy(0);
//       setPoseLabel("Detecting Pose...");
//       document.body.classList.remove("great-form");
//     };
//   }, [id]);

//   const isPracticePath = /^\/practice\//.test(location.pathname);

//   return (
//     <div className="w-full min-h-80 bg-gray-100">
//       <div className="flex items-center justify-between px-4 py-4 bg-white shadow-md">
//         {isPracticePath && (
//           <NavLink to="/poses" className="flex items-center space-x-2" onClick={refreshPage}>
//             <img src={backIcon} alt="Back" className="w-6 h-6" />
//             <span className="text-lg font-semibold">Back</span>
//           </NavLink>
//         )}
//         <h1 className="text-xl font-bold text-center w-full">{english_name}</h1>
//       </div>

//       <div className="flex flex-col lg:flex-row p-4 gap-6">
//         {/* Camera & Feedback */}
//         <div className="flex-1 flex flex-col items-center gap-4">
//           <div ref={canvasRef} className="w-full max-w-full sm:max-w-[640px] mx-auto"></div>

//           <div
//             className={`text-lg font-semibold px-4 py-2 rounded shadow border ${
//               poseLabel === "Great Form!"
//                 ? "bg-green-100 text-green-700 border-green-400"
//                 : "bg-yellow-100 text-yellow-700 border-yellow-400"
//             }`}
//           >
//             {poseLabel === "Great Form!" ? "✅" : "💡"} {poseLabel}
//           </div>

//           {/* Accuracy Progress Bar */}
//           <div className="w-full max-w-md px-2">
//             <label className="block text-sm font-medium text-gray-600 mb-1">Accuracy</label>
//             <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
//               <div
//                 className="h-full bg-green-500 transition-all duration-300 ease-in-out"
//                 style={{ width: `${accuracy}%` }}
//               ></div>
//             </div>
//             <p className="text-sm mt-1 text-gray-700">{accuracy.toFixed(1)}%</p>
//           </div>
//         </div>

//         {/* Image & Instructions */}
//         <div className="flex-1 flex flex-col items-center lg:items-start">
//           <img
//             src={image}
//             alt={`${english_name} pose`}
//             className="rounded-xl shadow-lg w-full max-w-md"
//           />
//           <div className="mt-6 w-full max-w-md">
//             <h4 className="text-lg font-semibold mb-2">Step by Step</h4>
//             <ol className="list-decimal list-inside space-y-2 text-gray-700">
//               {instructions.map((step, index) => (
//                 <li key={index} className="text-base">
//                   {step}
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PoseCam;








// import { useRef, useEffect, useState } from "react";
// import * as ml5 from "ml5";
// import p5 from "p5";
// import axios from "axios";
// import "./PoseCam.scss";
// import { NavLink } from "react-router-dom";
// import { refreshPage } from "./../../utils/helper.js";
// import backIcon from "./../../assets/icons/back.png";

// const PoseCam = ({ pose }) => {
//   const { id, english_name, image, instructions } = pose;
//   const canvasRef = useRef(null);

//   const [poseLabel, setPoseLabel] = useState("Detecting Pose...");
//   const [poseAccuracy, setPoseAccuracy] = useState(null);
//   const [aiFeedback, setAiFeedback] = useState("");
//   const [poseBenefits, setPoseBenefits] = useState("");

//   useEffect(() => {
//     let video, poseNet, pose, skeleton, brain;
//     let state = "waiting";

//     const sketch = (p) => {
//       p.setup = () => {
//         const canvas = p.createCanvas(640, 480);
//         if (canvasRef.current) {
//           canvas.parent(canvasRef.current);
//         }
//         video = p.createCapture(p.VIDEO);
//         video.hide();
//         poseNet = ml5.poseNet(video, modelLoaded);
//         poseNet.on("pose", gotPoses);

//         const options = {
//           inputs: 34,
//           outputs: 7,
//           task: "classification",
//           debug: true,
//         };
//         brain = ml5.neuralNetwork(options);

//         const modelInfo = {
//           model: `/model-${id}/model.json`,
//           metadata: `/model-${id}/model_meta.json`,
//           weights: `/model-${id}/model.weights.bin`,
//         };

//         fetch(modelInfo.model)
//           .then((res) => {
//             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//             return res.json();
//           })
//           .then((data) => {
//             console.log("Model JSON:", data);
//             brain.load(modelInfo, brainLoaded);
//           })
//           .catch((err) => console.error("Error loading model:", err));
//       };

//       p.draw = () => {
//         p.push();
//         p.translate(video.width, 0);
//         p.scale(-1, 1);
//         p.image(video, 0, 0, video.width, video.height);
//         if (pose) {
//           for (let i = 0; i < skeleton.length; i++) {
//             let a = skeleton[i][0];
//             let b = skeleton[i][1];
//             p.strokeWeight(2);
//             p.stroke(0);
//             p.line(a.position.x, a.position.y, b.position.x, b.position.y);
//           }
//           for (let i = 0; i < pose.keypoints.length; i++) {
//             let { x, y } = pose.keypoints[i].position;
//             p.fill(0);
//             p.stroke(255);
//             p.ellipse(x, y, 16, 16);
//           }
//         }
//         p.pop();
//       };
//     };

//     const myp5 = new p5(sketch);

//     function modelLoaded() {
//       console.log("PoseNet ready");
//     }

//     function brainLoaded() {
//       console.log("Pose classification ready!");
//       classifyPose();
//     }

//     function classifyPose() {
//       if (pose) {
//         let inputs = [];
//         for (let i = 0; i < pose.keypoints.length; i++) {
//           let { x, y } = pose.keypoints[i].position;
//           inputs.push(x, y);
//         }
//         brain.classify(inputs, gotResult);
//       } else {
//         setTimeout(classifyPose, 100);
//       }
//     }

//     function gotResult(error, results) {
//       if (results && results[0].confidence > 0.7) {
//         const label = results[0].label;
//         const confidence = results[0].confidence;

//         setPoseLabel(label);
//         setPoseAccuracy(Math.round(confidence * 100));

//         if (label === "Great Form!") {
//           document.body.classList.add("great-form");
//         } else {
//           document.body.classList.remove("great-form");
//         }
//       }
//       classifyPose();
//     }

//     function gotPoses(poses) {
//       if (poses.length > 0) {
//         pose = poses[0].pose;
//         skeleton = poses[0].skeleton;
//       }
//     }

//     return () => {
//       if (video) video.remove();
//       myp5.remove();
//     };
//   }, [id]);

//   // ✅ Call OpenRouter AI when pose changes
//   useEffect(() => {
//     if (!poseLabel || poseLabel === "Detecting Pose...") return;

//     const fetchFeedback = async () => {
//       const OPENROUTER_API_KEY="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";
//       const prompt = `
// You are an expert yoga coach AI. Based on the pose label "${poseLabel}", provide:
// - a short correction suggestion if it's not 'Great Form!'
// - a one-line benefit of the pose
// - a motivation tip.

// Format:
// Correction: ...
// Benefits: ...
// Tip: ...
// `;

//       try {
//         console.log("Sending to OpenRouter:", prompt);
//         const response = await axios.post(
//           'https://openrouter.ai/api/v1/chat/completions',
//           {
//             model: "openai/gpt-3.5-turbo",
//             messages: [
//               { role: "system", content: "You are a helpful yoga coach." },
//               { role: "user", content: prompt },
//             ],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const content = response.data.choices[0].message.content;
//         const [_, correctionLine, benefitLine, tipLine] = content.split("\n");
//         setAiFeedback(correctionLine?.replace("Correction:", "").trim());
//         setPoseBenefits(benefitLine?.replace("Benefits:", "").trim());
//       } catch (err) {
//         console.error("AI feedback error:", err);
//       }
//     };

//     fetchFeedback();
//   }, [poseLabel]);

//   const isPracticePath = /^\/practice\//.test(location.pathname);

//   return (
//     <>
//       <div className="cam__header--practice" onClick={refreshPage}>
//         {isPracticePath && (
//           <NavLink to="/poses" className="cam__icon-link" onClick={refreshPage}>
//             <img className="cam__button--back" src={backIcon} alt="back icon" />
//           </NavLink>
//         )}
//         <h1>{english_name}</h1>
//       </div>

//       <div className="cam-container">
//         <div className="cam__content--left">
//           <div ref={canvasRef}></div>

//           <div
//             className={`cam__feedback ${poseLabel === "Great Form!" ? "cam__feedback--success" : ""
//               }`}
//           >
//             {poseLabel === "Great Form!" ? "✅" : "💡"} {poseLabel}
//           </div>

//           {poseAccuracy !== null && (
//             <div className="cam__accuracy">
//               Accuracy: <strong>{poseAccuracy}%</strong>
//               <div className="cam__progress-bar">
//                 <div
//                   className="cam__progress-fill"
//                   style={{ width: `${poseAccuracy}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           {aiFeedback && (
//             <div className="cam__ai-feedback">
//               <h4>Correction:</h4>
//               <p>{aiFeedback}</p>
//               <h4>Benefits:</h4>
//               <p>{poseBenefits}</p>
//             </div>
//           )}
//         </div>

//         <div className="cam__content--right">
//           <img className="cam__img" src={`${image}`} alt={`${english_name} pose`} />
//           <ol className="cam__instructions">
//             <h4>Step by Step</h4>
//             {instructions.map((step, i) => (
//               <li className="cam__instructions-step" key={i}>{step}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PoseCam;




// import { useRef, useEffect, useState } from "react";
// import * as ml5 from "ml5";
// import p5 from "p5";
// import axios from "axios";
// import "./PoseCam.scss";
// import { NavLink } from "react-router-dom";
// import { refreshPage } from "./../../utils/helper.js";
// import backIcon from "./../../assets/icons/back.png";

// const PoseCam = ({ pose }) => {
//   const { id, english_name, image, instructions } = pose;
//   const canvasRef = useRef(null);

//   const [poseLabel, setPoseLabel] = useState("Detecting Pose...");
//   const [poseAccuracy, setPoseAccuracy] = useState(null);
//   const [aiFeedback, setAiFeedback] = useState("");
//   const [poseBenefits, setPoseBenefits] = useState("");
//   const [motivationTip, setMotivationTip] = useState("");

//   useEffect(() => {
//     let video, poseNet, pose, skeleton, brain;

//     const sketch = (p) => {
//       p.setup = () => {
//         const canvas = p.createCanvas(640, 480);
//         if (canvasRef.current) {
//           canvas.parent(canvasRef.current);
//         }
//         video = p.createCapture(p.VIDEO);
//         video.hide();
//         poseNet = ml5.poseNet(video, modelLoaded);
//         poseNet.on("pose", gotPoses);

//         const options = {
//           inputs: 34,
//           outputs: 7,
//           task: "classification",
//           debug: true,
//         };
//         brain = ml5.neuralNetwork(options);

//         const modelInfo = {
//           model: `/model-${id}/model.json`,
//           metadata: `/model-${id}/model_meta.json`,
//           weights: `/model-${id}/model.weights.bin`,
//         };

//         fetch(modelInfo.model)
//           .then((res) => {
//             if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//             return res.json();
//           })
//           .then((data) => {
//             console.log("Model JSON:", data);
//             brain.load(modelInfo, brainLoaded);
//           })
//           .catch((err) => console.error("Error loading model:", err));
//       };

//       p.draw = () => {
//         p.push();
//         p.translate(video.width, 0);
//         p.scale(-1, 1);
//         p.image(video, 0, 0, video.width, video.height);
//         if (pose) {
//           for (let i = 0; i < skeleton.length; i++) {
//             let a = skeleton[i][0];
//             let b = skeleton[i][1];
//             p.strokeWeight(2);
//             p.stroke(0);
//             p.line(a.position.x, a.position.y, b.position.x, b.position.y);
//           }
//           for (let i = 0; i < pose.keypoints.length; i++) {
//             let { x, y } = pose.keypoints[i].position;
//             p.fill(0);
//             p.stroke(255);
//             p.ellipse(x, y, 16, 16);
//           }
//         }
//         p.pop();
//       };
//     };

//     const myp5 = new p5(sketch);

//     function modelLoaded() {
//       console.log("PoseNet ready");
//     }

//     function brainLoaded() {
//       console.log("Pose classification ready!");
//       classifyPose();
//     }

//     function classifyPose() {
//       if (pose) {
//         let inputs = [];
//         for (let i = 0; i < pose.keypoints.length; i++) {
//           let { x, y } = pose.keypoints[i].position;
//           inputs.push(x, y);
//         }
//         brain.classify(inputs, gotResult);
//       } else {
//         setTimeout(classifyPose, 100);
//       }
//     }

//     function gotResult(error, results) {
//       if (results && results[0].confidence > 0.7) {
//         const label = results[0].label;
//         const confidence = results[0].confidence;

//         setPoseLabel(label);
//         setPoseAccuracy(Math.round(confidence * 100));

//         if (label === "Great Form!") {
//           document.body.classList.add("great-form");
//         } else {
//           document.body.classList.remove("great-form");
//         }
//       }
//       classifyPose();
//     }

//     function gotPoses(poses) {
//       if (poses.length > 0) {
//         pose = poses[0].pose;
//         skeleton = poses[0].skeleton;
//       }
//     }

//     return () => {
//       if (video) video.remove();
//       myp5.remove();
//     };
//   }, [id]);

//   // ✅ AI Feedback from OpenRouter
//   useEffect(() => {
//     if (!poseLabel || poseLabel === "Detecting Pose...") return;

//     const fetchFeedback = async () => {
//       const OPENROUTER_API_KEY = "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";
//       const prompt = `
// You are an expert yoga coach AI. Based on the pose label "${poseLabel}", provide:
// - a short correction suggestion if it's not 'Great Form!'
// - a one-line benefit of the pose
// - a motivation tip.

// Format:
// Correction: ...
// Benefits: ...
// Tip: ...
// `;

//       try {
//         const response = await axios.post(
//           'https://openrouter.ai/api/v1/chat/completions',
//           {
//             model: "openai/gpt-3.5-turbo",
//             messages: [
//               { role: "system", content: "You are a helpful yoga coach." },
//               { role: "user", content: prompt },
//             ],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${OPENROUTER_API_KEY}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const content = response.data.choices[0].message.content;
//         console.log("AI Response:", content);

//         const lines = content.split("\n").map(line => line.trim());
//         const correctionLine = lines.find(line => line.startsWith("Correction:"));
//         const benefitLine = lines.find(line => line.startsWith("Benefits:"));
//         const tipLine = lines.find(line => line.startsWith("Tip:"));

//         setAiFeedback(correctionLine?.replace("Correction:", "").trim() || "");
//         setPoseBenefits(benefitLine?.replace("Benefits:", "").trim() || "");
//         setMotivationTip(tipLine?.replace("Tip:", "").trim() || "");
//       } catch (err) {
//         console.error("AI feedback error:", err);
//       }
//     };

//     fetchFeedback();
//   }, [poseLabel]);

//   const isPracticePath = /^\/practice\//.test(location.pathname);

//   return (
//     <>
//       <div className="cam__header--practice" onClick={refreshPage}>
//         {isPracticePath && (
//           <NavLink to="/poses" className="cam__icon-link" onClick={refreshPage}>
//             <img className="cam__button--back" src={backIcon} alt="back icon" />
//           </NavLink>
//         )}
//         <h1>{english_name}</h1>
//       </div>

//       <div className="cam-container">
//         <div className="cam__content--left">
//           <div ref={canvasRef}></div>

//           <div
//             className={`cam__feedback ${poseLabel === "Great Form!" ? "cam__feedback--success" : ""}`}
//           >
//             {poseLabel === "Great Form!" ? "✅" : "💡"} {poseLabel}
//           </div>

//           {poseAccuracy !== null && (
//             <div className="cam__accuracy">
//               Accuracy: <strong>{poseAccuracy}%</strong>
//               <div className="cam__progress-bar">
//                 <div
//                   className="cam__progress-fill"
//                   style={{ width: `${poseAccuracy}%` }}
//                 ></div>
//               </div>
//             </div>
//           )}

//           {aiFeedback && (
//             <div className="cam__ai-feedback">
//               <h4>Correction:</h4>
//               <p>{aiFeedback}</p>
//               <h4>Benefits:</h4>
//               <p>{poseBenefits}</p>
//               {motivationTip && (
//                 <>
//                   <h4>Tip:</h4>
//                   <p>{motivationTip}</p>
//                 </>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="cam__content--right">
//           <img className="cam__img" src={`${image}`} alt={`${english_name} pose`} />
//           <ol className="cam__instructions">
//             <h4>Step by Step</h4>
//             {instructions.map((step, i) => (
//               <li className="cam__instructions-step" key={i}>{step}</li>
//             ))}
//           </ol>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PoseCam;



import { useRef, useEffect, useState } from "react";
import * as ml5 from "ml5";
import p5 from "p5";
import axios from "axios";
import "./Posecam.scss";
import { NavLink, useLocation } from "react-router-dom";
import { refreshPage } from "./../../utils/helper.js";
import backIcon from "./../../assets/icons/back.png";

const PoseCam = ({ pose }) => {
  const { id, english_name, image, instructions } = pose;
  const canvasRef = useRef(null);
  
  const location = useLocation();

  const [poseLabel, setPoseLabel] = useState("Detecting Pose...");
  const [poseAccuracy, setPoseAccuracy] = useState(null);
  const [aiFeedback, setAiFeedback] = useState("");
  const [poseBenefits, setPoseBenefits] = useState("");
  const [motivationTip, setMotivationTip] = useState("");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true); // ✅ toggle for voice

  // ✅ Speak utility using Web Speech API
  const speak = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel(); // stop previous speech
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let video, poseNet, poseInstance, skeleton, brain;

    const sketch = (p) => {
      p.setup = () => {
        const canvas = p.createCanvas(640, 480);
        if (canvasRef.current) {
          canvas.parent(canvasRef.current);
        }
        video = p.createCapture(p.VIDEO);
        video.hide();
        poseNet = ml5.poseNet(video, modelLoaded);
        poseNet.on("pose", gotPoses);

        const options = {
          inputs: 34,
          outputs: 7,
          task: "classification",
          debug: true,
        };
        brain = ml5.neuralNetwork(options);

        const modelInfo = {
          model: `/model-${id}/model.json`,
          metadata: `/model-${id}/model_meta.json`,
          weights: `/model-${id}/model.weights.bin`,
        };

        fetch(modelInfo.model)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then(() => {
            brain.load(modelInfo, brainLoaded);
          })
          .catch((err) => console.error("Error loading model:", err));
      };

      p.draw = () => {
        p.push();
        p.translate(video.width, 0);
        p.scale(-1, 1);
        p.image(video, 0, 0, video.width, video.height);

        if (poseInstance) {
          for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            p.strokeWeight(2);
            p.stroke(0);
            p.line(a.position.x, a.position.y, b.position.x, b.position.y);
          }
          for (let i = 0; i < poseInstance.keypoints.length; i++) {
            let { x, y } = poseInstance.keypoints[i].position;
            p.fill(0);
            p.stroke(255);
            p.ellipse(x, y, 16, 16);
          }
        }

        p.pop();
      };
    };

    const myp5 = new p5(sketch);

    function modelLoaded() {
      console.log("PoseNet ready");
    }

    function brainLoaded() {
      console.log("Pose classification ready!");
      classifyPose();
    }

    function classifyPose() {
      if (poseInstance) {
        let inputs = [];
        for (let i = 0; i < poseInstance.keypoints.length; i++) {
          let { x, y } = poseInstance.keypoints[i].position;
          inputs.push(x, y);
        }
        brain.classify(inputs, gotResult);
      } else {
        setTimeout(classifyPose, 100);
      }
    }

    function gotResult(error, results) {
      if (results && results[0].confidence > 0.7) {
        const label = results[0].label;
        const confidence = results[0].confidence;

        setPoseLabel(label);
        setPoseAccuracy(Math.round(confidence * 100));

        if (label === "Great Form!") {
          document.body.classList.add("great-form");
        } else {
          document.body.classList.remove("great-form");
        }
      }
      classifyPose();
    }

    function gotPoses(poses) {
      if (poses.length > 0) {
        poseInstance = poses[0].pose;
        skeleton = poses[0].skeleton;
      }
    }

    return () => {
      if (video) video.remove();
      myp5.remove();
    };
  }, [id]);

  // ✅ Get feedback and speak it
  useEffect(() => {
    if (!poseLabel || poseLabel === "Detecting Pose...") return;

    const fetchFeedback = async () => {
      const OPENROUTER_API_KEY = "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";

      const prompt = `
You are an expert yoga coach AI. Based on the pose label "${poseLabel}", provide:
- a short correction suggestion if it's not 'Great Form!'
- a one-line benefit of the pose
- a motivation tip.

Format:
Correction: ...
Benefits:...
Tip: ...
`;

      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "openai/gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful yoga coach." },
              { role: "user", content: prompt },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const content = response.data.choices[0].message.content;
        const lines = content.split("\n").map((line) => line.trim());
        const correctionLine = lines.find((line) => line.startsWith("Correction:"));
      

        setAiFeedback(correctionLine?.replace("Correction:", "").trim() || "");
      

        // ✅ Speak the feedback
        speak(
          `${correctionLine?.replace("Correction:", "") || ""}. 
           
           `
        );
      } catch (err) {
        console.error("AI feedback error:", err);
      }
    };

    fetchFeedback();
  }, [poseLabel]);

  const isPracticePath = /^\/practice\//.test(location.pathname);

  return (
    <>
      <div className="cam__header--practice" onClick={refreshPage}>
        {isPracticePath && (
          <NavLink to="/poses" className="cam__icon-link" onClick={refreshPage}>
            <img className="cam__button--back" src={backIcon} alt="back icon" />
          </NavLink>
        )}
        <h1>{english_name}</h1>
      </div>

      <div className="cam-container">
        <div className="cam__content--left">
          <div ref={canvasRef}></div>

          {/* ✅ Toggle Voice Feedback */}
          <button
            className="cam__toggle-voice"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          >
            {isVoiceEnabled ? "🔊 Voice On" : "🔇 Voice Off"}
          </button>

          <div
            className={`cam__feedback ${poseLabel === "Great Form!" ? "cam__feedback--success" : ""}`}
          >
            {poseLabel === "Great Form!" ? "✅" : "💡"} {poseLabel}
          </div>

          {poseAccuracy !== null && (
            <div className="cam__accuracy">
              Accuracy: <strong>{poseAccuracy}%</strong>
              <div className="cam__progress-bar">
                <div
                  className="cam__progress-fill"
                  style={{ width: `${poseAccuracy}%` }}
                ></div>
              </div>
            </div>
          )}

          {aiFeedback && (
            <div className="cam__ai-feedback">
              <h4>Correction:</h4>
              <p>{aiFeedback}</p>
              <h4>Benefits:</h4>
              <p>{poseBenefits}</p>
              <h4>Motivation:</h4>
              <p>{motivationTip}</p>
            </div>
          )}
        </div>

        <div className="cam__content--right">
          <img className="cam__img" src={image} alt={`${english_name} pose`} />
          <ol className="cam__instructions">
            <h4>Step by Step</h4>
            {instructions.map((step, i) => (
              <li className="cam__instructions-step" key={i}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default PoseCam;